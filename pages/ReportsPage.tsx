import React, { useState, useEffect } from 'react';
import { ReportService } from '../services/db/report.service';
import { ReportSummary, BestSellingProduct, Transaction } from '../types';
import { TrendingUpIcon, DollarSignIcon, PackageIcon, FileTextIcon } from '../components/icons';
import { ReceiptModal } from '../components/ReceiptModal'; // Import komponen baru

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const ReportsPage: React.FC = () => {
    const [summary, setSummary] = useState<ReportSummary | null>(null);
    const [bestSellers, setBestSellers] = useState<BestSellingProduct[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [startDate, setStartDate] = useState<Date>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 6);
        d.setHours(0, 0, 0, 0);
        return d;
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        const d = new Date();
        d.setHours(23, 59, 59, 999);
        return d;
    });

    useEffect(() => {
        loadReports();
    }, [startDate, endDate]);
    
    const loadReports = async () => {
        const summaryData = await ReportService.getSummary(startDate, endDate);
        const bestSellersData = await ReportService.getBestSellingProducts(startDate, endDate, 5);
        const transactionData = await ReportService.getTransactionsByPeriod(startDate, endDate);
        setSummary(summaryData);
        setBestSellers(bestSellersData);
        setTransactions(transactionData);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
        const date = new Date(e.target.value);
        if (type === 'start') {
            date.setHours(0, 0, 0, 0);
            setStartDate(date);
        } else {
            date.setHours(23, 59, 59, 999);
            setEndDate(date);
        }
    };

    const StatCard: React.FC<{icon: React.ElementType, title: string, value: string, colorClass: string}> = ({icon: Icon, title, value, colorClass}) => (
        <div className="glassmorphism p-6 rounded-lg flex items-center">
            <div className={`p-3 rounded-full mr-4 ${colorClass}/20`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );

    return (
        <div>
            {selectedTransaction && <ReceiptModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
            <h1 className="text-2xl font-bold mb-6">Laporan Penjualan</h1>
            
            <div className="mb-6 glassmorphism p-4 rounded-lg flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex items-center">
                    <label className="text-sm font-medium mr-2">Dari</label>
                    <input type="date" value={startDate.toISOString().split('T')[0]} onChange={e => handleDateChange(e, 'start')} className="p-2 border rounded-md bg-transparent border-[var(--border-color)]"/>
                </div>
                <div className="flex items-center">
                    <label className="text-sm font-medium mr-2">Sampai</label>
                    <input type="date" value={endDate.toISOString().split('T')[0]} onChange={e => handleDateChange(e, 'end')} className="p-2 border rounded-md bg-transparent border-[var(--border-color)]"/>
                </div>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={DollarSignIcon} title="Total Pendapatan" value={formatCurrency(summary.revenue)} colorClass="text-blue-400" />
                    <StatCard icon={TrendingUpIcon} title="Total Laba" value={formatCurrency(summary.profit)} colorClass="text-green-400" />
                    <StatCard icon={FileTextIcon} title="Jumlah Transaksi" value={`${summary.transactionCount}`} colorClass="text-yellow-400" />
                    <StatCard icon={PackageIcon} title="Item Terjual" value={`${summary.itemsSoldCount}`} colorClass="text-purple-400" />
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Best Sellers */}
                <div className="lg:col-span-1 glassmorphism p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Produk Terlaris</h2>
                    <ul>
                        {bestSellers.map(item => (
                            <li key={item.productId} className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                                <span>{item.productName}</span>
                                <span className="font-semibold">{item.quantitySold} terjual</span>
                            </li>
                        ))}
                         {bestSellers.length === 0 && <p className="text-gray-500">Tidak ada data.</p>}
                    </ul>
                </div>
                
                {/* Recent Transactions */}
                <div className="lg:col-span-2 glassmorphism p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Riwayat Transaksi</h2>
                    <div className="overflow-y-auto max-h-96">
                        <table className="min-w-full responsive-table">
                            <thead className="sticky top-0 bg-[var(--color-bg-secondary)]">
                                <tr>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase">Waktu</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase">ID Transaksi</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)] md:divide-y-0">
                                {transactions.map(t => (
                                    <tr key={t.id} onClick={() => setSelectedTransaction(t)} className="hover:bg-white/5 cursor-pointer transition-colors">
                                        <td data-label="Waktu" className="py-3 px-4 whitespace-nowrap text-sm">{new Date(t.createdAt).toLocaleString('id-ID')}</td>
                                        <td data-label="ID Transaksi" className="py-3 px-4 whitespace-nowrap text-sm font-mono">{t.id}</td>
                                        <td data-label="Total" className="py-3 px-4 whitespace-nowrap text-sm">{formatCurrency(t.totalAmount)}</td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                  <tr><td colSpan={3} className="text-center py-4 text-gray-500">Tidak ada transaksi pada periode ini.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;