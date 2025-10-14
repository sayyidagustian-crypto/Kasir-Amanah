import React, { useRef, useState, useEffect } from 'react';
import { backupData, restoreData, resetAllData } from '../services/db/settings.service';
import { LogService } from '../services/db/log.service';
import AdminDashboard from '../components/AdminDashboard'; // Import the centralized component

const DataManagement: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBackup = async () => {
        if (!window.confirm("Anda akan mengunduh file backup berisi semua data aplikasi. Lanjutkan?")) return;
        
        setIsLoading(true);
        try {
            await backupData();
            await LogService.add({ type: 'admin_access', action: 'Data backup performed.' });
        } catch (err) {
            setError("Gagal membuat backup.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm("PERHATIAN: Memulihkan data akan MENGHAPUS SEMUA DATA SAAT INI dan menggantinya dengan data dari file backup. Aksi ini tidak bisa dibatalkan. Lanjutkan?")) {
            if(fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setIsLoading(true);
        setError(null);
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File tidak dapat dibaca.");
                }
                const data = JSON.parse(text);
                await restoreData(data);
                await LogService.add({ type: 'admin_access', action: 'Data restore performed.' });
                alert("Data berhasil dipulihkan. Aplikasi akan dimuat ulang.");
                window.location.reload();
            } catch (err: any) {
                setError(err.message || "Gagal memulihkan data. Pastikan file backup valid.");
                setIsLoading(false);
            }
        };
        reader.readAsText(file);
    };
    
    const handleReset = async () => {
        if (!window.confirm("PERINGATAN KERAS: Anda akan MENGHAPUS SELURUH DATA (produk, transaksi, staf) secara permanen. Aksi ini tidak dapat dibatalkan. Yakin ingin melanjutkan?")) return;

        const confirmation = window.prompt('Untuk konfirmasi, ketik "HAPUS DATA" di bawah ini:');
        if (confirmation?.toUpperCase()?.trim() !== 'HAPUS DATA') {
            alert('Konfirmasi salah. Aksi dibatalkan.');
            return;
        }
        
        setIsLoading(true);
        try {
            await resetAllData();
            await LogService.add({ type: 'admin_access', action: 'DATABASE RESET PERFORMED.' });
            alert("Semua data berhasil dihapus. Aplikasi akan dimuat ulang.");
            window.location.reload();
        } catch (err) {
            setError("Gagal mereset data.");
            setIsLoading(false);
        }
    };

    return (
        <div className="glassmorphism p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-8">Manajemen Data</h2>
            
            {error && <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>}

            <div className="space-y-6">
                <div className="p-4 bg-black/20 rounded-lg">
                    <h3 className="font-semibold text-lg">Backup Data</h3>
                    <p className="text-sm text-gray-400 mt-1 mb-4">Simpan semua data (produk, transaksi, dll) ke dalam satu file JSON sebagai cadangan.</p>
                    <button onClick={handleBackup} disabled={isLoading} className="btn-glow px-4 py-2 rounded-lg text-sm disabled:bg-gray-700/50 disabled:shadow-none disabled:transform-none">
                        {isLoading ? 'Memproses...' : 'Backup Sekarang'}
                    </button>
                </div>

                <div className="p-4 bg-black/20 rounded-lg">
                    <h3 className="font-semibold text-lg">Restore Data</h3>
                    <p className="text-sm text-gray-400 mt-1 mb-4">Pulihkan data dari file backup JSON. Ini akan menimpa semua data yang ada saat ini.</p>
                    <button onClick={handleRestoreClick} disabled={isLoading} className="bg-green-600/80 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm disabled:bg-green-900/50 transition-colors">
                        {isLoading ? 'Memproses...' : 'Pilih File & Pulihkan'}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                </div>

                <div className="p-4 border border-red-500/50 bg-red-900/20 rounded-lg">
                    <h3 className="font-semibold text-lg text-red-300">Zona Berbahaya</h3>
                    <p className="text-sm text-red-400 mt-1 mb-4">Hapus semua data aplikasi secara permanen. Aksi ini tidak dapat dibatalkan.</p>
                    <button onClick={handleReset} disabled={isLoading} className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm disabled:bg-red-900/50 transition-colors">
                        {isLoading ? 'Memproses...' : 'Reset Semua Data'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'data' | 'staff'>('data');

    const TabButton = ({ tab, label, active }: { tab: 'data' | 'staff', label: string, active: boolean }) => (
        <button
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-3 text-sm font-bold transition-all duration-300 border-b-2 ${
            active 
              ? 'border-[var(--color-accent-cyan)] text-[var(--color-accent-cyan)]' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          {label}
        </button>
      );

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-3xl font-bold mb-6">Pengaturan</h1>
            <div className="border-b border-[var(--border-color)] mb-6">
                <TabButton tab="data" label="Manajemen Data" active={activeTab === 'data'} />
                <TabButton tab="staff" label="Manajemen Staf" active={activeTab === 'staff'} />
            </div>
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'data' && <DataManagement />}
                {activeTab === 'staff' && <AdminDashboard />}
            </div>
        </div>
    );
};

export default SettingsPage;