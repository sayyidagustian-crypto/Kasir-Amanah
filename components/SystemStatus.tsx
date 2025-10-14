import React, { useState, useEffect } from 'react';
import { db } from '../services/db/db.service';
import { getSetting } from '../services/db/settings.service';
import { ClockIcon, DatabaseZapIcon, FileTextIcon, PackageIcon, UsersIcon } from './icons';

const SystemStatus: React.FC = () => {
    const [stats, setStats] = useState({
        storageUsage: '...',
        productCount: 0,
        transactionCount: 0,
        staffCount: 0,
        lastBackup: 'Belum pernah',
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                await db.ready();
                
                if (navigator.storage && navigator.storage.estimate) {
                    const estimation = await navigator.storage.estimate();
                    const usageMb = ((estimation.usage || 0) / (1024 * 1024)).toFixed(2);
                    setStats(prev => ({...prev, storageUsage: `${usageMb} MB`}));
                } else {
                     setStats(prev => ({...prev, storageUsage: 'Tidak didukung'}));
                }

                const products = await db.getAll('products');
                const transactions = await db.getAll('transactions');
                const staff = await db.getAll('users');
                const lastBackupDate = await getSetting('last_backup_date');

                setStats(prev => ({
                    ...prev,
                    productCount: products.length,
                    transactionCount: transactions.length,
                    staffCount: staff.length,
                    lastBackup: lastBackupDate ? new Date(lastBackupDate).toLocaleString('id-ID') : 'Belum pernah',
                }));

            } catch (error) {
                console.error("Failed to fetch system stats:", error);
                 setStats(prev => ({...prev, storageUsage: 'Error'}));
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);
    
    const StatusItem: React.FC<{icon: React.ElementType, label: string, value: string | number}> = ({icon: Icon, label, value}) => (
        <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-md">
            <Icon className="w-5 h-5 text-[var(--color-accent-cyan)] shrink-0" />
            <div className="flex-1 flex justify-between items-center">
                <span className="text-sm text-gray-300">{label}</span>
                <span className="text-sm font-mono font-semibold">{value}</span>
            </div>
        </div>
    );

    if (isLoading) {
        return <div className="p-4 text-center">Memuat status sistem...</div>
    }

    return (
        <div className="p-1">
             <h3 className="text-lg font-bold mb-4 flex items-center">
                <DatabaseZapIcon className="w-5 h-5 mr-3"/>
                Status Sistem
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatusItem icon={PackageIcon} label="Total Produk" value={stats.productCount} />
                <StatusItem icon={FileTextIcon} label="Total Transaksi" value={stats.transactionCount} />
                <StatusItem icon={UsersIcon} label="Total Staf" value={stats.staffCount} />
                <StatusItem icon={DatabaseZapIcon} label="Penggunaan Data" value={stats.storageUsage} />
                <div className="md:col-span-2">
                   <StatusItem icon={ClockIcon} label="Backup Terakhir" value={stats.lastBackup} />
                </div>
            </div>
        </div>
    )
};

export default SystemStatus;