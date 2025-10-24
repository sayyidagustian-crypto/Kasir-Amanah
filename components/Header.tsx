import React from 'react';
import { MenuIcon } from './icons';
import { Page } from '../types';
import Clock from './Clock';
import { useTranslation } from '../hooks/useTranslation';

interface HeaderProps {
    onToggleSidebar: () => void;
    currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, currentPage }) => {
    const { t } = useTranslation();

    const formatPageTitle = (page: Page) => {
        // Use translation key like 'header.CASHIER'
        return t(`header.${page}`);
    };

    return (
        <header className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--color-bg-primary)] shrink-0 h-20">
            <div className="flex items-center">
                <button onClick={onToggleSidebar} className="text-gray-300 hover:text-white">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold capitalize ml-4">
                    {formatPageTitle(currentPage)}
                </h1>
            </div>
            <Clock variant="compact" />
        </header>
    );
};

export default Header;

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