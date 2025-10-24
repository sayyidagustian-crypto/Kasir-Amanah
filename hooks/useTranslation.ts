import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }

    const { translations } = context;

    /**
     * Translates a key into the current language.
     * Supports nested keys like 'page.title'.
     * @param key The key to translate.
     * @returns The translated string or the key itself if not found.
     */
    const t = (key: string): string => {
        if (!translations) return key;

        return key.split('.').reduce((acc, currentKey) => {
            if (acc && typeof acc === 'object' && acc[currentKey]) {
                return acc[currentKey];
            }
            return key; // Return the full key as fallback if path is invalid
        }, translations);
    };

    return { ...context, t };
};
