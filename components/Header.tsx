import React from 'react';
import { MenuIcon } from './icons';
import { Page } from '../types';

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
        <header className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--color-bg-primary)] shrink-0">
            <h1 className="text-xl font-bold capitalize">
                {formatPageTitle(currentPage)}
            </h1>
            <button onClick={onToggleSidebar} className="text-gray-300 hover:text-white">
                <MenuIcon className="w-6 h-6" />
            </button>
        </header>
    );
};

export default Header;
