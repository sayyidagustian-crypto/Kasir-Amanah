import React from 'react';
import { Transaction } from '../types';
import { XIcon, PrinterIcon, ShareIcon } from './icons';
import { useTranslation } from '../hooks/useTranslation';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

// Internal Receipt Component (for modal and printing)
const Receipt: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const { t } = useTranslation();
    return (
        <div className="text-sm">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold">{t('receipt.title')}</h2>
                <p className="text-xs">{new Date(transaction.createdAt).toLocaleString('id-ID')}</p>
            </div>
            <div className="mb-2">
                <p>{t('receipt.receiptId')}<span className="font-mono">{transaction.id}</span></p>
                <p>{t('receipt.cashier')}{transaction.cashierName}</p>
            </div>
            <hr className="my-2 border-dashed border-gray-500" />
            <table className="w-full">
                <tbody>
                    {transaction.items.map(item => (
                        <tr key={item.productId}>
                            <td className="py-1 align-top">
                                {item.productName}
                                <br />
                                <span className="text-xs">{item.quantity} x {formatCurrency(item.price)}</span>
                            </td>
                            <td className="py-1 text-right align-top">{formatCurrency(item.quantity * item.price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr className="my-2 border-dashed border-gray-500" />
            <div className="space-y-1">
                <div className="flex justify-between"><span>{t('receipt.subtotal')}</span><span>{formatCurrency(transaction.totalAmount)}</span></div>
                <div className="flex justify-between font-bold"><span>{t('receipt.total')}</span><span>{formatCurrency(transaction.totalAmount)}</span></div>
                <div className="flex justify-between"><span>{t('receipt.payment', { method: transaction.paymentMethod })}</span><span>{formatCurrency(transaction.amountPaid)}</span></div>
                <div className="flex justify-between"><span>{t('receipt.change')}</span><span>{formatCurrency(transaction.change)}</span></div>
            </div>
            <p className="text-center mt-4 text-xs">{t('receipt.thankYou')}</p>
        </div>
    );
};


// Exported Modal Component
interface ReceiptModalProps {
    transaction: Transaction;
    onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
    const { t } = useTranslation();
    
    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        let text = `*Struk Pembelian - Kasir Amanah*\n\n`;
        text += `ID: ${transaction.id}\n`;
        text += `Tanggal: ${new Date(transaction.createdAt).toLocaleString('id-ID')}\n`;
        text += `Kasir: ${transaction.cashierName}\n`;
        text += `--------------------\n`;
        transaction.items.forEach(item => {
            text += `${item.productName}\n`;
            text += `  ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.quantity * item.price)}\n`;
        });
        text += `--------------------\n`;
        text += `Total: *${formatCurrency(transaction.totalAmount)}*\n`;
        text += `Bayar (${transaction.paymentMethod}): ${formatCurrency(transaction.amountPaid)}\n`;
        text += `Kembali: ${formatCurrency(transaction.change)}\n\n`;
        text += `Terima kasih!`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="w-full max-w-md relative">
                <div className="glassmorphism p-6 rounded-lg shadow-xl printable-area">
                    <div className="flex justify-between items-center mb-4 no-print">
                        <h3 className="text-xl font-bold">{t('receipt.modalTitle')}</h3>
                        <button onClick={onClose}><XIcon className="w-6 h-6"/></button>
                    </div>
                    <Receipt transaction={transaction} />
                </div>
                <div className="flex justify-center gap-4 mt-4 no-print">
                    <button onClick={handlePrint} className="flex items-center btn-glow px-4 py-2 rounded-lg text-sm">
                        <PrinterIcon className="w-5 h-5 mr-2" /> {t('receipt.print')}
                    </button>
                    <button onClick={handleShare} className="flex items-center bg-green-500/80 hover:bg-green-500 px-4 py-2 rounded-lg text-sm transition-colors">
                        <ShareIcon className="w-5 h-5 mr-2" /> {t('receipt.share')}
                    </button>
                </div>
            </div>
        </div>
    );
};

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