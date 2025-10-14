import React, { useState } from 'react';
import { StaffService } from '../services/db/staff.service';
import { XIcon } from './icons';

interface AdminCodeModalProps {
    onSuccess: () => void;
    onClose: () => void;
}

const AdminCodeModal: React.FC<AdminCodeModalProps> = ({ onSuccess, onClose }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const isValid = await StaffService.verifyDevCode(code);
        if (isValid) {
            onSuccess();
        } else {
            setError('Kode tidak valid.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="glassmorphism p-8 rounded-lg shadow-xl w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Akses Admin Darurat</h2>
                    <button onClick={onClose}><XIcon className="w-6 h-6"/></button>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                    Masukkan kode khusus untuk mendapatkan akses admin sementara.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full p-3 bg-transparent border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cyan)]"
                        placeholder="Kode Rahasia"
                        autoFocus
                    />
                    {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    <button type="submit" disabled={isLoading || !code} className="w-full mt-4 bg-gray-800/80 text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-900/50 transition-colors">
                        {isLoading ? 'Memverifikasi...' : 'Buka'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCodeModal;

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