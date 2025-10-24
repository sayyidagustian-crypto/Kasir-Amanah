import React, { useState, useEffect } from 'react';
import { User, GUEST_USER_ID } from '../types';
import { StaffService } from '../services/db/staff.service';
import { StoreIcon } from './icons';
import { useSecretSequence } from '../hooks/useSecretSequence';
import AdminCodeModal from './AdminCodeModal';
import DevAccessModal from './DevAccessModal';
import DevCodePromptModal from './DevCodePromptModal';
import { useTranslation } from '../hooks/useTranslation';


interface AuthOverlayProps {
    onLogin: (user: User) => void;
    onSetupComplete: (adminUser: User) => void;
    isInitialSetup: boolean;
}

// Sub-component for Initial Admin Setup
const SetupForm: React.FC<{ 
    onSetupComplete: (adminUser: User) => void; 
    onSwitchToLogin: () => void;
    onLogin: (user: User) => void;
}> = ({ onSetupComplete, onSwitchToLogin, onLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(t('auth.setup.errorPasswordMismatch'));
            return;
        }
        if (!name || !email || !password) {
            setError(t('auth.setup.errorAllFieldsRequired'));
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const adminUser = await StaffService.add({
                name,
                email,
                password,
                role: 'admin',
            });
            onSetupComplete(adminUser);
        } catch (err: any) {
            setError(err.message || 'Gagal membuat akun admin.');
            setIsLoading(false);
        }
    };
    
    const handleGuestLogin = () => {
        const guestUser: User = {
            id: GUEST_USER_ID,
            name: t('auth.guest'),
            role: 'guest',
            createdAt: new Date().toISOString(),
        };
        onLogin(guestUser);
    };

    const inputClasses = "mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--color-accent-cyan)]";

    return (
        <div className="w-full max-w-sm p-6 space-y-3 glassmorphism rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-white">{t('auth.setup.title')}</h2>
            <p className="text-center text-sm text-gray-400">
                {t('auth.setup.desc')}
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-300">{t('auth.setup.name')}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputClasses} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">{t('auth.setup.email')}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClasses} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">{t('auth.setup.password')}</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputClasses} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">{t('auth.setup.confirmPassword')}</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className={inputClasses} />
                </div>
                {error && <p className="text-sm text-center text-red-400">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full btn-glow py-3 font-bold rounded-lg disabled:opacity-50">
                    {isLoading ? t('auth.setup.submitting') : t('auth.setup.submitButton')}
                </button>
            </form>
            <div className="mt-4 text-center text-sm space-y-2">
                <p className="text-gray-400">
                    {t('auth.setup.haveAccount')}{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-[var(--color-accent-cyan)] hover:underline">
                        {t('auth.setup.loginHere')}
                    </button>
                </p>
                <p className="text-gray-400">
                    {'atau / or / 或'}{' '}
                    <button onClick={handleGuestLogin} className="font-medium text-[var(--color-accent-cyan)] hover:underline">
                        {t('auth.setup.tryGuest')}
                    </button>
                </p>
            </div>
        </div>
    );
};


// Sub-component for Login
const LoginForm: React.FC<{ onLogin: (user: User) => void, onSwitchToSetup: () => void }> = ({ onLogin, onSwitchToSetup }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if(pin.length === 4) {
            handlePinLogin();
        }
    }, [pin]);


    const handlePinInput = (digit: string) => {
        setError('');
        if (pin.length < 4) {
            setPin(pin + digit);
        }
    };

    const handleBackspace = () => {
        setError('');
        setPin(pin.slice(0, -1));
    };

    const handlePinLogin = async () => {
        if (pin.length !== 4) return;
        setIsLoading(true);
        setError('');
        const user = await StaffService.loginWithPin(pin);
        if (user) {
            onLogin(user);
        } else {
            setError(t('auth.login.invalidPin'));
            setTimeout(() => setPin(''), 500);
            setIsLoading(false);
        }
    };
    
    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const admin = await StaffService.verifyAdminCredentials(email, password);
        if (admin) {
            onLogin(admin);
        } else {
            setError(t('auth.login.adminForm.invalidCredentials'));
            setIsLoading(false);
        }
    };

    const handleGuestLogin = () => {
        const guestUser: User = {
            id: GUEST_USER_ID,
            name: t('auth.guest'),
            role: 'guest',
            createdAt: new Date().toISOString(),
        };
        onLogin(guestUser);
    };

    const inputClasses = "mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--color-accent-cyan)]";
    const pinButtonClasses = "text-2xl font-bold p-4 h-16 w-16 flex items-center justify-center rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500";
    
    if (showAdminLogin) {
        return (
             <div className="w-full max-w-sm p-6 space-y-4 glassmorphism rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-white">{t('auth.login.adminForm.title')}</h2>
                <form onSubmit={handleAdminLogin} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">{t('auth.login.adminForm.email')}</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClasses} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">{t('auth.login.adminForm.password')}</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputClasses} />
                    </div>
                    {error && <p className="text-sm text-center text-red-400">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full btn-glow py-2.5 font-bold rounded-lg disabled:opacity-50">
                        {isLoading ? t('auth.login.adminForm.submitting') : t('auth.login.adminForm.submitButton')}
                    </button>
                    <button type="button" onClick={() => setShowAdminLogin(false)} className="w-full text-center text-sm text-gray-400 hover:text-white mt-2">
                        {t('auth.login.adminForm.backToPin')}
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="w-full max-w-xs text-center">
             <div className="flex flex-col items-center p-6 space-y-4 glassmorphism rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white">{t('auth.login.title')}</h2>
                <div className="flex items-center justify-center space-x-3 h-10">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className={`w-5 h-5 rounded-full transition-colors duration-200 ${pin.length > i ? 'bg-[var(--color-accent-cyan)]' : 'bg-gray-600'}`}></div>
                    ))}
                </div>
                <div className="h-5">
                    {error && <p className="text-sm text-red-400">{error}</p>}
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
                        <button key={d} onClick={() => handlePinInput(d.toString())} className={pinButtonClasses}>{d}</button>
                    ))}
                    <div/>
                    <button key={0} onClick={() => handlePinInput('0')} className={pinButtonClasses}>0</button>
                    <button onClick={handleBackspace} className={`${pinButtonClasses} text-lg`}>⌫</button>
                </div>
            </div>
            <div className="mt-4 flex flex-col space-y-2">
                <button onClick={() => setShowAdminLogin(true)} className="text-sm text-gray-400 hover:text-white">
                    {t('auth.login.adminLogin')}
                </button>
                 <button onClick={handleGuestLogin} className="text-sm text-gray-400 hover:text-white">
                    {t('auth.login.guestLogin')}
                </button>
                <button onClick={onSwitchToSetup} className="text-sm text-gray-400 hover:text-white">
                    {t('auth.login.noAccount')}{' '}
                    <span className="text-[var(--color-accent-cyan)]">{t('auth.login.createHere')}</span>
                </button>
            </div>
        </div>
    );
};


const AuthOverlay: React.FC<AuthOverlayProps> = ({ onLogin, onSetupComplete, isInitialSetup }) => {
    const [view, setView] = useState<'login' | 'setup'>(isInitialSetup ? 'setup' : 'login');
    const [isAdminCodeModalOpen, setIsAdminCodeModalOpen] = useState(false);
    const [isDevAccessModalOpen, setIsDevAccessModalOpen] = useState(false);
    const [isDevCodePromptOpen, setIsDevCodePromptOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (isInitialSetup) {
            setView('setup');
        } else {
            setView('login');
        }
    }, [isInitialSetup]);
    
     useSecretSequence('ADMIN18', () => {
        console.log("Kombinasi rahasia Admin Darurat terdeteksi!");
        setIsAdminCodeModalOpen(true);
    });
    
    useSecretSequence('SSAATT', () => {
        console.log("Kombinasi rahasia Developer Access terdeteksi!");
        setIsDevCodePromptOpen(true);
    });

    const handleDevLoginSuccess = async () => {
        const allUsers = await StaffService.getAll();
        const firstAdmin = allUsers.find(u => u.role === 'admin');
        if (firstAdmin) {
            onLogin(firstAdmin);
        } else {
            alert("Akses darurat gagal: Tidak ditemukan akun admin.");
        }
        setIsAdminCodeModalOpen(false);
    };

    const handleDevCodeSuccess = () => {
        setIsDevCodePromptOpen(false);
        setIsDevAccessModalOpen(true);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-4 text-white transition-opacity duration-300">
            <div className="flex items-center mb-6">
                 <StoreIcon className="w-10 h-10 text-[var(--color-accent-cyan)]" />
                 <span className="ml-3 text-3xl font-bold">{t('sidebar.title')}</span>
            </div>

            {view === 'setup' ? (
                <SetupForm 
                    onSetupComplete={onSetupComplete} 
                    onSwitchToLogin={() => setView('login')}
                    onLogin={onLogin} 
                />
            ) : (
                <LoginForm 
                    onLogin={onLogin} 
                    onSwitchToSetup={() => setView('setup')} 
                />
            )}

            {isAdminCodeModalOpen && (
                <AdminCodeModal 
                    onSuccess={handleDevLoginSuccess}
                    onClose={() => setIsAdminCodeModalOpen(false)}
                />
            )}
            
            {isDevCodePromptOpen && (
                <DevCodePromptModal
                    onSuccess={handleDevCodeSuccess}
                    onClose={() => setIsDevCodePromptOpen(false)}
                />
            )}

            {isDevAccessModalOpen && (
                <DevAccessModal 
                    onClose={() => setIsDevAccessModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AuthOverlay;

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