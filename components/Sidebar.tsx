import React from 'react';
import { Page, User } from '../types';
import {
  ShoppingCart,
  DatabaseIcon,
  TrendingUpIcon,
  SettingsIcon,
  StoreIcon,
  LogOutIcon,
  XIcon,
} from './icons';
import Clock from './Clock';
import { useTranslation } from '../hooks/useTranslation';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  currentUser: User | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, currentUser, isSidebarOpen, setIsSidebarOpen }) => {
  const { t } = useTranslation();

  const navItems = [
    { page: Page.CASHIER, label: t('sidebar.cashier'), icon: ShoppingCart, roles: ['admin', 'cashier', 'guest'] },
    { page: Page.PRODUCTS, label: t('sidebar.products'), icon: DatabaseIcon, roles: ['admin', 'guest'] },
    { page: Page.REPORTS, label: t('sidebar.reports'), icon: TrendingUpIcon, roles: ['admin', 'guest'] },
    { page: Page.SETTINGS, label: t('sidebar.settings'), icon: SettingsIcon, roles: ['admin', 'guest'] },
  ];
  
  const isGuest = currentUser?.role === 'guest';

  const NavLink: React.FC<{
    page: Page;
    label: string;
    icon: React.ElementType;
  }> = ({ page, label, icon: Icon }) => {
    const isActive = currentPage === page;
    
    return (
      <button
        onClick={() => onNavigate(page)}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
          isActive
            ? 'bg-[var(--color-accent-cyan)] text-black shadow-[0_0_15px_var(--color-accent-cyan-glow)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]'
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      ></div>

      <div className={`
        flex flex-col w-64 glassmorphism shrink-0
        fixed md:static inset-y-0 left-0 z-40
        transition-transform transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="flex items-center justify-between h-20 border-b border-[var(--border-color)] px-4">
          <div className="flex items-center">
            <StoreIcon className="w-8 h-8 text-[var(--color-accent-cyan)]" />
            <span className="ml-2 text-xl font-bold">{t('sidebar.title')}</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {currentUser && navItems
            .filter(item => item.roles.includes(currentUser.role))
            .map((item) => (
             <NavLink key={item.page} page={item.page} label={item.label} icon={item.icon} />
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--border-color)]">
          <div className="hidden md:block mb-4">
            <Clock />
          </div>
          <div className='mb-4 p-3 rounded-lg bg-black bg-opacity-20'>
              <p className="text-sm font-semibold text-white">{currentUser?.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)] capitalize">
                  {isGuest ? t('sidebar.guestMode') : currentUser?.role}
              </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600/80 rounded-lg hover:bg-red-600 focus:outline-none ring-2 ring-transparent focus:ring-red-500/50 transition-all duration-300"
          >
            <LogOutIcon className="w-5 h-5 mr-2" />
            {isGuest ? t('sidebar.exitGuestMode') : t('sidebar.logout')}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

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