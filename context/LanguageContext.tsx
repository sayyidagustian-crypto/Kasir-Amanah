import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'id' | 'en' | 'zh';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    translations: Record<string, any>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('id');
    const [translations, setTranslations] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('kasir-amanah-lang') as Language;
        if (savedLanguage && ['id', 'en', 'zh'].includes(savedLanguage)) {
             setLanguageState(savedLanguage);
        } else {
             setLanguageState('id'); // Default language
        }
    }, []);

    useEffect(() => {
        const fetchTranslations = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/locales/${language}.json`);
                if (!response.ok) {
                    throw new Error(`Could not load ${language}.json`);
                }
                const data = await response.json();
                setTranslations(data);
            } catch (error) {
                console.error('Failed to fetch translations:', error);
                // Fallback to Indonesian if the selected language fails
                if (language !== 'id') {
                    setLanguageState('id');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTranslations();
    }, [language]);

    const setLanguage = (lang: Language) => {
        localStorage.setItem('kasir-amanah-lang', lang);
        setLanguageState(lang);
    };
    
    // Render a loading state or nothing until translations are ready
    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">Loading Language...</div>;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translations }}>
            {children}
        </LanguageContext.Provider>
    );
};
