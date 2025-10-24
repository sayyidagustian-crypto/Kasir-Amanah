import React from 'react';
import { StoreIcon, DatabaseZapIcon, TrendingUpIcon, SettingsIcon, CodeXmlIcon } from '../components/icons';
import { useTranslation } from '../hooks/useTranslation';

const AboutPage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="glassmorphism p-6 rounded-lg max-w-4xl mx-auto text-gray-200">
            <div className="flex flex-col items-center text-center mb-12 space-y-4">
                <StoreIcon className="w-14 h-14 sm:w-16 sm:h-16 text-[var(--color-accent-cyan)] drop-shadow-[0_0_12px_var(--color-accent-cyan-glow)]" />
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('sidebar.title')}</h1>
                    <p className="text-base sm:text-lg text-gray-400">{t('about.subtitle')}</p>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-center mb-6 text-white">{t('about.principleTitle')}</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-4">
                        <DatabaseZapIcon className="w-12 h-12 mx-auto text-blue-400 mb-3" />
                        <h3 className="text-xl font-bold mb-2">{t('about.dataSecurityTitle')}</h3>
                        <p className="text-gray-400 text-sm">{t('about.dataSecurityDesc')}</p>
                    </div>
                    <div className="p-4">
                        <TrendingUpIcon className="w-12 h-12 mx-auto text-green-400 mb-3" />
                        <h3 className="text-xl font-bold mb-2">{t('about.transparencyTitle')}</h3>
                        <p className="text-gray-400 text-sm">{t('about.transparencyDesc')}</p>
                    </div>
                    <div className="p-4">
                        <SettingsIcon className="w-12 h-12 mx-auto text-yellow-400 mb-3" />
                        <h3 className="text-xl font-bold mb-2">{t('about.fullControlTitle')}</h3>
                        <p className="text-gray-400 text-sm">{t('about.fullControlDesc')}</p>
                    </div>
                </div>
            </div>
            
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-center mb-6 text-white">{t('about.techTitle')}</h2>
                 <div className="flex justify-center items-center gap-4 flex-wrap font-mono text-sm text-center">
                    <span className="bg-black/20 px-3 py-1 rounded-full">React</span>
                    <span className="bg-black/20 px-3 py-1 rounded-full">TypeScript</span>
                    <span className="bg-black/20 px-3 py-1 rounded-full">TailwindCSS</span>
                    <span className="bg-black/20 px-3 py-1 rounded-full">IndexedDB</span>
                    <span className="bg-black/20 px-3 py-1 rounded-full">Offline-First</span>
                 </div>
            </div>

            <div className="text-center p-6 bg-black/20 rounded-lg border border-[var(--border-color)]">
                <CodeXmlIcon className="w-8 h-8 mx-auto text-gray-500 mb-4" />
                <p className="font-mono text-gray-400 text-lg">All praise and thanks are due to Allah.</p>
                <p className="mt-4 text-gray-500 text-sm">
                    Powered by Google, Gemini, and AI Studio.
                    <br />
                    Development assisted by OpenAI technologies.
                </p>
                <div className="mt-6 border-t border-[var(--border-color)] pt-4">
                    <p className="font-semibold text-white">© 2025 SAT18 Official</p>
                    <p className="text-sm text-gray-400">For suggestions & contact: sayyidagustian@gmail.com</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;

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