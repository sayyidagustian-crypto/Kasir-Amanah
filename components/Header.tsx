import React from 'react';
import { MenuIcon } from './icons';
import { Page } from '../types';
import Clock from './Clock';

interface HeaderProps {
    onToggleSidebar: () => void;
    currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, currentPage }) => {
    // A simple function to make page titles more readable
    const formatPageTitle = (page: Page) => {
        return page.charAt(0).toUpperCase() + page.slice(1).toLowerCase();
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