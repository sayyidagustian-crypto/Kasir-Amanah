import React, { useState, useEffect } from 'react';
import { Product, User } from '../types';
import { ProductService } from '../services/db/product.service';
import { PlusCircleIcon, EditIcon, Trash2Icon, SearchIcon, XIcon } from '../components/icons';
import { sampleProducts } from '../services/mock/sample-data';
import { useTranslation } from '../hooks/useTranslation';

interface ProductsPageProps {
  currentUser: User;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ currentUser }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
    const { t } = useTranslation();

    const isReadOnly = currentUser.role === 'guest';

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        setFilteredProducts(
            products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, products]);

    const loadProducts = async () => {
        if (isReadOnly) {
            setProducts([...sampleProducts].sort((a,b) => a.name.localeCompare(b.name)));
        } else {
            const data = await ProductService.getAll();
            setProducts(data.sort((a,b) => a.name.localeCompare(b.name)));
        }
    };

    const handleOpenModal = (product: Partial<Product> | null = null) => {
        if (isReadOnly) return;
        setCurrentProduct(product || { name: '', priceBuy: 0, priceSell: 0, stock: 0, unit: 'pcs' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    const handleSaveProduct = async () => {
        if (isReadOnly || !currentProduct || !currentProduct.name) {
            alert(t('products.alerts.nameRequired'));
            return;
        }

        try {
            if (currentProduct.id) {
                await ProductService.update(currentProduct as Product);
            } else {
                await ProductService.add(currentProduct as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
            }
            handleCloseModal();
            loadProducts();
        } catch (error: any) {
            alert(t('products.alerts.saveFailed', { error: error.message }));
        }
    };

    const handleDeleteProduct = async (id: string) => {
       if (isReadOnly) return;
       if (window.confirm(t('products.alerts.deleteConfirm'))) {
            try {
                await ProductService.delete(id);
                loadProducts();
            } catch (error) {
                alert(t('products.alerts.deleteFailed'));
            }
       }
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }
    
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

    return (
      <div className="glassmorphism p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('products.title')}</h1>
            {!isReadOnly && (
              <button onClick={() => handleOpenModal()} className="flex items-center btn-glow text-white px-4 py-2 rounded-lg">
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  {t('products.addProduct')}
              </button>
            )}
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder={t('products.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cyan)]"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full responsive-table">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('products.table.name')}</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('products.table.buyPrice')}</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('products.table.sellPrice')}</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('products.table.stock')}</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('products.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] md:divide-y-0">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td data-label={t('products.table.name')} className="py-4 px-6 whitespace-nowrap">{product.name}</td>
                  <td data-label={t('products.table.buyPrice')} className="py-4 px-6 whitespace-nowrap">{formatCurrency(product.priceBuy)}</td>
                  <td data-label={t('products.table.sellPrice')} className="py-4 px-6 whitespace-nowrap">{formatCurrency(product.priceSell)}</td>
                  <td data-label={t('products.table.stock')} className="py-4 px-6 whitespace-nowrap">{product.stock} {product.unit}</td>
                  <td data-label={t('products.table.actions')} className="py-4 px-6 whitespace-nowrap">
                    {!isReadOnly && (
                      <div className="flex items-center justify-end md:justify-start">
                        <button onClick={() => handleOpenModal(product)} className="text-blue-400 hover:text-blue-300 mr-4">
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-400">
                          <Trash2Icon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && currentProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                <div className="glassmorphism p-8 rounded-lg shadow-xl w-full max-w-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{currentProduct.id ? t('products.modal.editTitle') : t('products.modal.addTitle')}</h2>
                        <button onClick={handleCloseModal}><XIcon className="w-6 h-6"/></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">{t('products.modal.name')}</label>
                            <input type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-300">{t('products.modal.buyPrice')}</label>
                              <input type="number" value={currentProduct.priceBuy} onFocus={handleFocus} onChange={e => setCurrentProduct({...currentProduct, priceBuy: Number(e.target.value)})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-300">{t('products.modal.sellPrice')}</label>
                              <input type="number" value={currentProduct.priceSell} onFocus={handleFocus} onChange={e => setCurrentProduct({...currentProduct, priceSell: Number(e.target.value)})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                          </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('products.modal.stock')}</label>
                                <input type="number" value={currentProduct.stock} onFocus={handleFocus} onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('products.modal.unit')}</label>
                                <input type="text" value={currentProduct.unit} onChange={e => setCurrentProduct({...currentProduct, unit: e.target.value})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <button onClick={handleCloseModal} className="bg-gray-700/50 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600/50">{t('products.modal.cancel')}</button>
                        <button onClick={handleSaveProduct} className="btn-glow text-white px-4 py-2 rounded-lg">{t('products.modal.save')}</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
};

export default ProductsPage;

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