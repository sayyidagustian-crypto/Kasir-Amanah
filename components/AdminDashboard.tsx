import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { StaffService } from '../services/db/staff.service';
import { PlusCircleIcon, Trash2Icon, XIcon } from './icons';
import { useTranslation } from '../hooks/useTranslation';

interface AdminDashboardProps {
  isReadOnly: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isReadOnly }) => {
  const [staff, setStaff] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    role: 'cashier' as 'cashier' | 'admin',
    pin: '',
    email: '',
    password: ''
  });
  const { t } = useTranslation();

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    const allUsers = await StaffService.getAll();
    setStaff(allUsers);
  };

  const handleOpenModal = () => {
    if (isReadOnly) return;
    setNewStaffData({ name: '', role: 'cashier', pin: '', email: '', password: '' });
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleAddStaff = async () => {
    if (isReadOnly) return;
    try {
      if (newStaffData.role === 'cashier' && newStaffData.pin.length !== 4) {
        alert(t('settings.staff.alerts.pinInvalid'));
        return;
      }
      if (newStaffData.role === 'admin' && (!newStaffData.email || !newStaffData.password)) {
        alert(t('settings.staff.alerts.adminCredentialsRequired'));
        return;
      }

      await StaffService.add(newStaffData);
      loadStaff();
      handleCloseModal();
    } catch (error: any) {
      alert(t('settings.staff.alerts.addFailed', { error: error.message }));
    }
  };

  const handleDeleteStaff = async (user: User) => {
    if (isReadOnly) return;
    if (user.role === 'admin') {
      const allUsers = await StaffService.getAll();
      const adminCount = allUsers.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        alert(t('settings.staff.alerts.deleteAdminError'));
        return;
      }
    }
    if (window.confirm(t('settings.staff.alerts.deleteConfirm', { name: user.name }))) {
      await StaffService.delete(user.id);
      loadStaff();
    }
  };

  return (
    <div className="glassmorphism p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('settings.staff.title')}</h1>
        <button onClick={handleOpenModal} disabled={isReadOnly} className="flex items-center btn-glow text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none">
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          {t('settings.staff.addStaff')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
           <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('settings.staff.table.name')}</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('settings.staff.table.role')}</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('settings.staff.table.loginDetails')}</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('settings.staff.table.actions')}</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {staff.map(user => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 whitespace-nowrap">{user.name}</td>
                <td className="py-4 px-6 whitespace-nowrap capitalize">{user.role}</td>
                <td className="py-4 px-6 whitespace-nowrap font-mono text-sm">
                  {user.role === 'cashier' ? `PIN: ${user.pin}` : user.email}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <button onClick={() => handleDeleteStaff(user)} disabled={isReadOnly} className="text-red-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed">
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="glassmorphism p-8 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t('settings.staff.modal.title')}</h2>
              <button onClick={handleCloseModal}><XIcon className="w-6 h-6"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">{t('settings.staff.modal.name')}</label>
                <input type="text" value={newStaffData.name} onChange={e => setNewStaffData({...newStaffData, name: e.target.value})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">{t('settings.staff.modal.role')}</label>
                <select value={newStaffData.role} onChange={e => setNewStaffData({...newStaffData, role: e.target.value as any, pin: '', email: '', password: ''})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-[var(--color-accent-cyan)]">
                  <option value="cashier" className="bg-[var(--color-bg-primary)]">{t('settings.staff.modal.cashier')}</option>
                  <option value="admin" className="bg-[var(--color-bg-primary)]">{t('settings.staff.modal.admin')}</option>
                </select>
              </div>
              {newStaffData.role === 'cashier' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300">{t('settings.staff.modal.pin')}</label>
                  <input type="text" maxLength={4} value={newStaffData.pin} onChange={e => setNewStaffData({...newStaffData, pin: e.target.value.replace(/\D/g, '')})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">{t('settings.staff.modal.email')}</label>
                    <input type="email" value={newStaffData.email} onChange={e => setNewStaffData({...newStaffData, email: e.target.value})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-300">{t('settings.staff.modal.password')}</label>
                    <input type="password" value={newStaffData.password} onChange={e => setNewStaffData({...newStaffData, password: e.target.value})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                  </div>
                </>
              )}
            </div>
             <div className="mt-8 flex justify-end space-x-3">
                <button onClick={handleCloseModal} className="bg-gray-700/50 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600/50">{t('settings.staff.modal.cancel')}</button>
                <button onClick={handleAddStaff} className="btn-glow text-white px-4 py-2 rounded-lg">{t('settings.staff.modal.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

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