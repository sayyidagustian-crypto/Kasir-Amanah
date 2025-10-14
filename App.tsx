import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CashierPage from './pages/CashierPage';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AuthOverlay from './components/AuthOverlay';
import { Page, User } from './types';
import { StaffService } from './services/db/staff.service';
import { ProductService } from './services/db/product.service';
import { sampleProducts } from './services/mock/sample-data';
import { db } from './services/db/db.service';
import { LogService } from './services/db/log.service';
import { setSetting, getSetting } from './services/db/settings.service';
import { sha256Hex } from './services/utils/crypto.service';

type AuthStatus = 'initializing' | 'needs-auth' | 'logged-in';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.CASHIER);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('initializing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await db.ready();
      
      // Ensure the emergency admin code is always present, regardless of setup status.
      const adminCodeHash = await getSetting('admin_code_hash');
      if (!adminCodeHash) {
          console.warn("Emergency admin code hash not found. Setting it now.");
          const devCode = '18';
          const devCodeHash = await sha256Hex(devCode);
          await setSetting('admin_code_hash', devCodeHash);
          await LogService.add({ type: 'system', action: 'Emergency admin code has been set on initialization.' });
      }

      const users = await StaffService.getAll();
      const needsSetup = users.length === 0;
      setIsInitialSetup(needsSetup);

      const sessionUserJson = sessionStorage.getItem('currentUser');
      if (sessionUserJson) {
        try {
          const user: User = JSON.parse(sessionUserJson);
          handleLogin(user, true);
        } catch (e) {
          console.error("Failed to parse user from session storage. Clearing session.", e);
          sessionStorage.removeItem('currentUser');
          setAuthStatus('needs-auth');
        }
      } else {
        setAuthStatus('needs-auth');
      }
    };

    initializeApp();
  }, []);

  const handleLogin = (user: User, fromSession: boolean = false) => {
    setCurrentUser(user);
    setAuthStatus('logged-in');

    if (user.role !== 'guest' && !fromSession) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    if (user.role === 'admin') {
      setCurrentPage(Page.REPORTS);
    } else {
      setCurrentPage(Page.CASHIER);
    }
  };

  const handleSetupComplete = async (adminUser: User) => {
    console.log("Admin setup complete. Seeding sample products...");
    setIsInitialSetup(false); // After setup, it's no longer the initial setup

    // The emergency admin code is now set during app initialization, so this section is no longer needed here.

    await ProductService.importFromJSON(sampleProducts);
    await LogService.add({ type: 'system', action: 'Sample products loaded.' });
    handleLogin(adminUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    setCurrentPage(Page.CASHIER);
    setAuthStatus('needs-auth');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Close sidebar on navigation in mobile
  };

  const renderPage = () => {
    if (!currentUser) {
        return <div className="flex h-full w-full items-center justify-center">Memuat halaman...</div>;
    }

    switch (currentPage) {
      case Page.CASHIER:
        return <CashierPage currentUser={currentUser} />;
      case Page.PRODUCTS:
        return <ProductsPage currentUser={currentUser} />;
      case Page.REPORTS:
         return <ReportsPage currentUser={currentUser} />;
      case Page.SETTINGS:
        return <SettingsPage currentUser={currentUser} />;
      default:
        return <CashierPage currentUser={currentUser} />;
    }
  };

  const renderContent = () => {
    switch(authStatus) {
        case 'initializing':
            return <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">Memuat aplikasi...</div>;
        case 'needs-auth':
            return <AuthOverlay 
                        onLogin={handleLogin} 
                        onSetupComplete={handleSetupComplete} 
                        isInitialSetup={isInitialSetup} 
                   />;
        case 'logged-in':
            if (!currentUser) return <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">Error: Pengguna tidak ditemukan.</div>;
            return (
                <div className="flex h-screen font-sans text-white bg-gray-900/50">
                    <Sidebar
                        currentPage={currentPage}
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                        currentUser={currentUser}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                    <div className="flex-1 flex flex-col overflow-hidden">
                         <Header 
                            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                            currentPage={currentPage} 
                         />
                         <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-black bg-opacity-20">
                            {renderPage()}
                         </main>
                    </div>
                </div>
            );
        default:
             return <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">Status aplikasi tidak valid.</div>;
    }
  }

  return renderContent();
};

export default App;