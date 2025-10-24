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
     * Supports nested keys like 'page.title' and placeholder replacement.
     * @param key The key to translate.
     * @param options Optional object with values for placeholders (e.g., { name: 'John' }).
     * @returns The translated string or the key itself if not found.
     */
    // FIX: Updated function to handle a second 'options' argument for placeholder replacement.
    const t = (key: string, options?: Record<string, string | number>): string => {
        if (!translations) return key;

        const translation = key.split('.').reduce((acc, currentKey) => {
            if (acc && typeof acc === 'object' && acc[currentKey] !== undefined) {
                return acc[currentKey];
            }
            return undefined;
        }, translations as any);

        let template: string;
        if (typeof translation === 'string') {
            template = translation;
        } else {
            // Fallback to the key itself if not found or not a string
            template = key;
        }

        if (options) {
            return Object.keys(options).reduce((str, placeholder) => {
                const regex = new RegExp(`{${placeholder}}`, 'g');
                return str.replace(regex, String(options[placeholder]));
            }, template);
        }

        return template;
    };

    return { ...context, t };
};
