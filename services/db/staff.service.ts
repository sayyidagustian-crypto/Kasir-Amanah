/**
 * Kasir Amanah - Staff Service
 * -----------------------------
 * Modul untuk manajemen staf/kasir (Users).
 *
 * Fitur utama:
 * - CRUD untuk data staf.
 * - Otentikasi login offline menggunakan PIN.
 * - Pembuatan ID unik untuk setiap staf.
 */

import { db } from "./db.service";
import { User } from "../../types";
import { passwordHash, sha256Hex } from "../utils/crypto.service";

/** Utility untuk membuat ID unik user */
function generateUserId(): string {
  return "U-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

type NewUserData = {
    name: string;
    role: 'admin' | 'cashier';
    pin?: string;
    email?: string;
    password?: string;
}

/**
 * Service utama transaksi
 */
export const StaffService = {
  /** Ambil semua data staf */
  async getAll(): Promise<User[]> {
    return await db.getAll<User>("users");
  },

  /** Tambah staf baru */
  async add(data: NewUserData): Promise<User> {
    if (!data.name) throw new Error("Nama staf tidak boleh kosong.");

    const newUser: Omit<User, 'id' | 'createdAt'> & {id?: string, createdAt?: string} = {
        name: data.name,
        role: data.role,
    };
    
    if (data.role === 'admin') {
        if (!data.email || !data.password) throw new Error("Email dan password wajib diisi untuk admin.");
        const existingAdmin = await db.getBy('users', 'email', data.email.toLowerCase());
        if(existingAdmin) throw new Error("Email sudah digunakan.");

        const salt = Date.now().toString(36);
        newUser.email = data.email.toLowerCase();
        newUser.salt = salt;
        newUser.passwordHash = await passwordHash(data.email, data.password, salt);

    } else { // cashier
        if (!data.pin || !/^\d{4}$/.test(data.pin)) {
            throw new Error("PIN harus terdiri dari 4 digit angka.");
        }
        const allUsers = await this.getAll();
        if (allUsers.some(u => u.pin === data.pin)) {
            throw new Error("PIN sudah digunakan oleh staf lain.");
        }
        newUser.pin = data.pin;
    }

    const finalUser: User = {
      ...newUser,
      id: generateUserId(),
      createdAt: new Date().toISOString(),
    };

    await db.add("users", finalUser);
    return finalUser;
  },

  /** Hapus data staf */
  async delete(id: string): Promise<void> {
    await db.delete("users", id);
  },

  /**
   * Proses login menggunakan PIN untuk kasir.
   */
  async loginWithPin(pin: string): Promise<User | null> {
    if (!/^\d{4}$/.test(pin)) return null;
    const allUsers = await this.getAll();
    const user = allUsers.find(u => u.pin === pin);
    return user || null;
  },

  /** Verifikasi akun admin (email + password) */
  async verifyAdminCredentials(email: string, password: string): Promise<User | false> {
    if (!email || !password) return false;
    const admin = await db.getBy('users', 'email', email.toLowerCase());
    if (!admin || admin.role !== 'admin' || !admin.salt || !admin.passwordHash) return false;
    
    const hash = await passwordHash(email, password, admin.salt);
    return hash === admin.passwordHash ? admin : false;
  },

  /** Verifikasi kode dev singkat (legacy) */
  async verifyDevCode(plainCode: string): Promise<boolean> {
    const storedHash = await db.getById<any>("settings", "admin_code_hash");
    if (!storedHash?.value) return false;
    
    const hashed = await sha256Hex(plainCode.trim());
    return hashed === storedHash.value;
  },
};

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