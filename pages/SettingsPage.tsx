import React, { useRef, useState } from 'react';
import { backupData, restoreData, resetAllData } from '../services/db/settings.service';
import { LogService } from '../services/db/log.service';
import AdminDashboard from '../components/AdminDashboard';
import { User } from '../types';
import AboutPage from './AboutPage';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../context/LanguageContext';

interface DataManagementProps {
    isReadOnly: boolean;
}

const DataManagement: React.FC<DataManagementProps> = ({ isReadOnly }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleBackup = async () => {
        if (isReadOnly || !window.confirm(t('settings.data.alerts.backupConfirm'))) return;
        
        setIsLoading(true);
        try {
            await backupData();
            await LogService.add({ type: 'admin_access', action: 'Data backup performed.' });
            window.location.reload();
        } catch (err) {
            setError(t('settings.data.alerts.backupFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestoreClick = () => {
        if (isReadOnly) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm(t('settings.data.alerts.restoreConfirm'))) {
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
                setError(err.message || t('settings.data.alerts.restoreFailed'));
                setIsLoading(false);
            }
        };
        reader.readAsText(file);
    };
    
    const handleReset = async () => {
        if (isReadOnly || !window.confirm(t('settings.data.alerts.resetConfirm'))) return;

        const confirmation = window.prompt(t('settings.data.alerts.resetPrompt'));
        if (confirmation?.toUpperCase()?.trim() !== 'HAPUS DATA' && confirmation?.toUpperCase()?.trim() !== 'DELETE DATA') {
            alert(t('settings.data.alerts.resetInvalidConfirmation'));
            return;
        }
        
        setIsLoading(true);
        try {
            await resetAllData();
            await LogService.add({ type: 'admin_access', action: 'DATABASE RESET PERFORMED.' });
            alert(t('settings.data.alerts.resetSuccess'));
            window.location.reload();
        } catch (err) {
            setError(t('settings.data.alerts.resetFailed'));
            setIsLoading(false);
        }
    };

    return (
        <div className="glassmorphism p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-8">{t('settings.data.title')}</h2>
            
            {error && <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>}

            <div className="space-y-6">
                <div className="p-4 bg-black/20 rounded-lg">
                    <h3 className="font-semibold text-lg">{t('settings.data.backupTitle')}</h3>
                    <p className="text-sm text-gray-400 mt-1 mb-4">{t('settings.data.backupDesc')}</p>
                    <button onClick={handleBackup} disabled={isLoading || isReadOnly} className="btn-glow px-4 py-2 rounded-lg text-sm disabled:bg-gray-700/50 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed">
                        {isLoading ? t('settings.data.processing') : t('settings.data.backupButton')}
                    </button>
                </div>

                <div className="p-4 bg-black/20 rounded-lg">
                    <h3 className="font-semibold text-lg">{t('settings.data.restoreTitle')}</h3>
                    <p className="text-sm text-gray-400 mt-1 mb-4">{t('settings.data.restoreDesc')}</p>
                    <button onClick={handleRestoreClick} disabled={isLoading || isReadOnly} className="bg-green-600/80 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm disabled:bg-green-900/50 transition-colors disabled:cursor-not-allowed">
                        {isLoading ? t('settings.data.processing') : t('settings.data.restoreButton')}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" disabled={isReadOnly} />
                </div>

                <div className="p-4 border border-red-500/50 bg-red-900/20 rounded-lg">
                    <h3 className="font-semibold text-lg text-red-300">{t('settings.data.dangerZone')}</h3>
                    <p className="text-sm text-red-400 mt-1 mb-4">{t('settings.data.resetDesc')}</p>
                    <button onClick={handleReset} disabled={isLoading || isReadOnly} className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm disabled:bg-red-900/50 transition-colors disabled:cursor-not-allowed">
                        {isLoading ? t('settings.data.processing') : t('settings.data.resetButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LanguageSettings: React.FC = () => {
    const { t, language, setLanguage } = useTranslation();
    
    const languages: { code: Language; name: string }[] = [
        { code: 'id', name: 'Indonesia' },
        { code: 'en', name: 'English' },
        { code: 'zh', name: '中文 (Simplified)' },
    ];

    return (
        <div className="glassmorphism p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">{t('settings.language.title')}</h2>
            <p className="text-sm text-gray-400 mb-6">{t('settings.language.desc')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                            language === lang.code
                                ? 'bg-[var(--color-accent-cyan)] border-[var(--color-accent-cyan)] text-black font-bold shadow-[0_0_15px_var(--color-accent-cyan-glow)]'
                                : 'bg-black/20 border-transparent hover:border-[var(--color-accent-cyan)]'
                        }`}
                    >
                        {lang.name}
                    </button>
                ))}
            </div>
        </div>
    );
};


interface SettingsPageProps {
    currentUser: User;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState<'data' | 'staff' | 'language' | 'about'>('data');
    const { t } = useTranslation();
    const isReadOnly = currentUser.role === 'guest';

    const TabButton = ({ tab, label, active }: { tab: 'data' | 'staff' | 'language' | 'about', label: string, active: boolean }) => (
        <button
          onClick={() => setActiveTab(tab)}
          className={`flex-1 text-center whitespace-nowrap px-2 sm:px-4 py-3 text-xs sm:text-sm font-bold transition-all duration-300 border-b-2 ${
            active 
              ? 'border-[var(--color-accent-cyan)] text-[var(--color-accent-cyan)]' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          {label}
        </button>
      );
    
    const ReadOnlyBanner = () => (
        <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-300 px-4 py-3 rounded-lg text-center mb-6" role="alert">
          <p>{t('settings.guestBanner')}</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-3xl font-bold mb-6">{t('settings.title')}</h1>
            {isReadOnly && <ReadOnlyBanner />}
            <div className="flex border-b border-[var(--border-color)] mb-6">
                <TabButton tab="data" label={t('settings.tabs.data')} active={activeTab === 'data'} />
                <TabButton tab="staff" label={t('settings.tabs.staff')} active={activeTab === 'staff'} />
                <TabButton tab="language" label={t('settings.tabs.language')} active={activeTab === 'language'} />
                <TabButton tab="about" label={t('settings.tabs.about')} active={activeTab === 'about'} />
            </div>
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'data' && <DataManagement isReadOnly={isReadOnly} />}
                {activeTab === 'staff' && <AdminDashboard isReadOnly={isReadOnly} />}
                {activeTab === 'language' && <LanguageSettings />}
                {activeTab === 'about' && <AboutPage />}
            </div>
        </div>
    );
};

export default SettingsPage;

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