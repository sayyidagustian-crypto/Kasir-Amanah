import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { StaffService } from '../services/db/staff.service';
import { PlusCircleIcon, Trash2Icon, XIcon } from './icons';

// This component acts as a Staff Management page for Admins.

const AdminDashboard: React.FC = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    role: 'cashier' as 'cashier' | 'admin',
    pin: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    const allUsers = await StaffService.getAll();
    setStaff(allUsers);
  };

  const handleOpenModal = () => {
    setNewStaffData({ name: '', role: 'cashier', pin: '', email: '', password: '' });
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleAddStaff = async () => {
    try {
      if (newStaffData.role === 'cashier' && newStaffData.pin.length !== 4) {
        alert("PIN kasir harus 4 digit.");
        return;
      }
      if (newStaffData.role === 'admin' && (!newStaffData.email || !newStaffData.password)) {
        alert("Email dan password admin wajib diisi.");
        return;
      }

      await StaffService.add(newStaffData);
      loadStaff();
      handleCloseModal();
    } catch (error: any) {
      alert(`Gagal menambah staf: ${error.message}`);
    }
  };

  const handleDeleteStaff = async (user: User) => {
    if (user.role === 'admin') {
      const allUsers = await StaffService.getAll();
      const adminCount = allUsers.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        alert("Tidak bisa menghapus satu-satunya admin.");
        return;
      }
    }
    if (window.confirm(`Anda yakin ingin menghapus staf: ${user.name}?`)) {
      await StaffService.delete(user.id);
      loadStaff();
    }
  };

  return (
    <div className="glassmorphism p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Staf</h1>
        <button onClick={handleOpenModal} className="flex items-center btn-glow text-white px-4 py-2 rounded-lg">
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Tambah Staf
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
           <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nama</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Detail Login</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
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
                  <button onClick={() => handleDeleteStaff(user)} className="text-red-500 hover:text-red-400">
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
              <h2 className="text-xl font-bold">Tambah Staf Baru</h2>
              <button onClick={handleCloseModal}><XIcon className="w-6 h-6"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Nama</label>
                <input type="text" value={newStaffData.name} onChange={e => setNewStaffData({...newStaffData, name: e.target.value})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Role</label>
                <select value={newStaffData.role} onChange={e => setNewStaffData({...newStaffData, role: e.target.value as any, pin: '', email: '', password: ''})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-[var(--color-accent-cyan)]">
                  <option value="cashier" className="bg-[var(--color-bg-primary)]">Kasir</option>
                  <option value="admin" className="bg-[var(--color-bg-primary)]">Admin</option>
                </select>
              </div>
              {newStaffData.role === 'cashier' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300">PIN (4 digit)</label>
                  <input type="text" maxLength={4} value={newStaffData.pin} onChange={e => setNewStaffData({...newStaffData, pin: e.target.value.replace(/\D/g, '')})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input type="email" value={newStaffData.email} onChange={e => setNewStaffData({...newStaffData, email: e.target.value})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-300">Password</label>
                    <input type="password" value={newStaffData.password} onChange={e => setNewStaffData({...newStaffData, password: e.target.value})} className="mt-1 block w-full bg-transparent border border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-[var(--color-accent-cyan)]"/>
                  </div>
                </>
              )}
            </div>
             <div className="mt-8 flex justify-end space-x-3">
                <button onClick={handleCloseModal} className="bg-gray-700/50 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600/50">Batal</button>
                <button onClick={handleAddStaff} className="btn-glow text-white px-4 py-2 rounded-lg">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;