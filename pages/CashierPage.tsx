import React, { useState, useEffect, useMemo } from 'react';
import { Product, Transaction, TransactionItem, User } from '../types';
import { ProductService } from '../services/db/product.service';
import { TransactionService } from '../services/db/transaction.service';
import { SearchIcon, Trash2Icon, XIcon, DollarSignIcon } from '../components/icons';
import { ReceiptModal } from '../components/ReceiptModal';
import { sampleProducts } from '../services/mock/sample-data';
import { useTranslation } from '../hooks/useTranslation';

interface CashierPageProps {
    currentUser: User;
}

const CashierPage: React.FC<CashierPageProps> = ({ currentUser }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<TransactionItem[]>([]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [amountPaid, setAmountPaid] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qris'>('cash');
    const [error, setError] = useState<string | null>(null);
    const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
    const { t } = useTranslation();

    const isGuestMode = currentUser.role === 'guest';

    useEffect(() => {
        loadProducts();
    }, [isGuestMode]);
    
    const loadProducts = async () => {
        if (isGuestMode) {
            setProducts(sampleProducts.filter(p => p.stock > 0));
        } else {
            const prods = await ProductService.getAll();
            setProducts(prods.filter(p => p.stock > 0));
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.productId === product.id);
        if (existingItem) {
            if(product.stock > existingItem.quantity) {
                setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            } else {
                alert(t('cashier.alerts.stockNotEnough').replace('{productName}', product.name));
            }
        } else {
             if(product.stock > 0) {
                setCart([...cart, {
                    productId: product.id,
                    productName: product.name,
                    quantity: 1,
                    price: product.priceSell,
                    costPrice: product.priceBuy
                }]);
            } else {
                 alert(t('cashier.alerts.stockEmpty').replace('{productName}', product.name));
            }
        }
    };

    const updateQuantity = (productId: string, quantity: number) => {
        const product = products.find(p => p.id === productId);
        let finalQuantity = quantity;

        if (product && quantity > product.stock) {
            alert(t('cashier.alerts.stockOnly').replace('{productName}', product.name).replace('{stock}', product.stock.toString()));
            finalQuantity = product.stock;
        }
        
        if (finalQuantity < 0) {
            finalQuantity = 0;
        }

        setCart(cart.map(item => 
            item.productId === productId 
                ? { ...item, quantity: finalQuantity } 
                : item
        ));
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.productId !== productId));
    };
    
    const clearCart = () => {
        setCart([]);
    };
    
    const totalAmount = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const totalCost = useMemo(() => {
        return cart.reduce((total, item) => total + (item.costPrice * item.quantity), 0);
    }, [cart]);

    const handlePayment = async () => {
        if (currentUser.role === 'guest') {
            alert(t('cashier.alerts.guestTransactionError'));
            return;
        }
        if (totalAmount <= 0) {
            alert(t('cashier.alerts.emptyCartError'));
            return;
        };
        
        setError(null);
        const paid = parseFloat(amountPaid) || 0;

        if (paymentMethod === 'cash' && (isNaN(paid) || paid < totalAmount)) {
            setError(t('cashier.paymentModal.insufficientPayment'));
            return;
        }

        const finalAmountPaid = paymentMethod === 'cash' ? paid : totalAmount;

        try {
            const completedTransaction = await TransactionService.add({
                items: cart,
                totalAmount,
                totalCost,
                paymentMethod,
                amountPaid: finalAmountPaid,
            }, { id: currentUser.id, name: currentUser.name });
            
            setLastTransaction(completedTransaction);
            clearCart();
            setAmountPaid('');
            setIsPaymentModalOpen(false);
            loadProducts();
        } catch (err: any) {
            setError(err.message || t('cashier.alerts.transactionFailed'));
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }
    
    return (
        <div className="flex flex-col lg:flex-row h-full gap-4">
            {/* Product List */}
            <div className="w-full lg:w-3/5 p-0 lg:p-4 flex flex-col h-full">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder={t('cashier.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cyan)] text-white"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pr-0 lg:pr-2">
                    {filteredProducts.map(product => (
                        <div key={product.id}
                             onClick={() => addToCart(product)}
                             className="glassmorphism rounded-lg p-2 flex flex-col justify-between cursor-pointer hover:border-[var(--color-accent-cyan)] transition-all duration-200 transform hover:-translate-y-1 h-24">
                            <h3 className="font-semibold text-xs text-white leading-tight">{product.name}</h3>
                            <div className="text-right">
                               <p className="text-[var(--color-accent-cyan)] font-bold text-sm">{formatCurrency(product.priceSell)}</p>
                               <p className="text-[11px] text-gray-400">{t('cashier.productCard.stock').replace('{stock}', product.stock.toString())}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart */}
            <div className="w-full lg:w-2/5 p-4 glassmorphism rounded-lg flex flex-col h-full max-h-[50vh] lg:max-h-full">
                <h2 className="text-xl font-bold mb-4 border-b border-[var(--border-color)] pb-2">{t('cashier.cartTitle')}</h2>
                <div className="flex-1 overflow-y-auto pr-2">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center mt-8">{t('cashier.cartEmpty')}</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.productId} className="flex items-center mb-3 p-2 rounded-md hover:bg-black/20">
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{item.productName}</p>
                                    <p className="text-xs text-gray-400">{formatCurrency(item.price)}</p>
                                </div>
                                <div className="flex items-center">
                                    <input type="number"
                                           value={item.quantity === 0 ? '' : item.quantity}
                                           onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                                           onFocus={(e) => e.target.select()}
                                           placeholder="0"
                                           className="w-16 text-center border rounded-md mx-2 py-1 bg-transparent border-[var(--border-color)]"
                                    />
                                </div>
                                <button onClick={() => removeFromCart(item.productId)}>
                                    <Trash2Icon className="w-5 h-5 text-red-500 hover:text-red-400"/>
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className="border-t border-[var(--border-color)] pt-4">
                    <div className="flex justify-between items-center font-bold text-lg mb-4">
                        <span>{t('cashier.total')}</span>
                        <span className="text-[var(--color-accent-cyan)]">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={clearCart} disabled={cart.length === 0} className="w-full bg-red-600/80 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-red-900/50 transition-colors">
                            {t('cashier.cancel')}
                        </button>
                        <button onClick={() => setIsPaymentModalOpen(true)} disabled={cart.length === 0} className="w-full bg-green-500/80 text-white py-3 rounded-lg hover:bg-green-500 disabled:bg-green-900/50 font-bold transition-colors">
                            {t('cashier.pay')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="glassmorphism p-6 rounded-lg shadow-xl w-full max-w-md border border-[var(--color-accent-cyan)] shadow-[0_0_20px_var(--color-accent-cyan-glow)]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{t('cashier.paymentModal.title')}</h3>
                            <button onClick={() => setIsPaymentModalOpen(false)}><XIcon className="w-6 h-6"/></button>
                        </div>
                        
                        <div className="mb-4 p-4 bg-black/20 rounded-lg text-center">
                            <p className="text-gray-400">{t('cashier.paymentModal.totalBill')}</p>
                            <p className="text-3xl font-bold text-[var(--color-accent-cyan)]">{formatCurrency(totalAmount)}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">{t('cashier.paymentModal.paymentMethod')}</label>
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-full p-2 border rounded-md bg-[var(--color-bg-secondary)] border-[var(--border-color)]">
                                <option value="cash">{t('cashier.paymentModal.cash')}</option>
                                <option value="card">{t('cashier.paymentModal.card')}</option>
                                <option value="qris">{t('cashier.paymentModal.qris')}</option>
                            </select>
                        </div>

                        {paymentMethod === 'cash' ? (
                             <div className="mb-4">
                                <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-300">{t('cashier.paymentModal.amountPaid')}</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400 sm:text-sm">Rp</span>
                                    </div>
                                    <input type="number" name="amountPaid" id="amountPaid"
                                           className="block w-full pl-8 pr-2 sm:text-sm bg-[var(--color-bg-secondary)] border-[var(--border-color)] rounded-md py-2"
                                           placeholder="0" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} autoFocus />
                                </div>
                                {parseFloat(amountPaid) >= totalAmount && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        {t('cashier.paymentModal.change', { amount: formatCurrency(Math.max(0, parseFloat(amountPaid) - totalAmount)) })}
                                    </p>
                                )}
                             </div>
                        ) : <div className='mb-4 text-center text-sm p-2 bg-black/20 rounded-md'>{t('cashier.paymentModal.passivePaymentMessage')}</div>}
                        
                        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                        
                        <button onClick={handlePayment} className="w-full btn-glow text-white py-3 rounded-lg font-bold flex items-center justify-center">
                           <DollarSignIcon className="w-5 h-5 mr-2" /> {t('cashier.paymentModal.confirmPayment')}
                        </button>
                    </div>
                </div>
            )}

            {lastTransaction && (
                <ReceiptModal transaction={lastTransaction} onClose={() => setLastTransaction(null)} />
            )}
        </div>
    )
}

export default CashierPage;

/**
 * -----------------------------------------------------------
 * All praise and thanks are due to Allah.
 *
 * Powered by Google, Gemini, and AI Studio.
 * Development assisted by OpenAI technologies.
 *
 * © 2025 SAT18 Official
 * For suggestions & contact: sayyidagustian@gmail.com
 * -----------------------------------------------------------
 */