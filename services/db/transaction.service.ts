/**
 * Kasir Amanah - Transaction Service
 * ----------------------------------
 * Modul untuk menangani semua logika transaksi penjualan.
 *
 * Fitur utama:
 * - Membuat transaksi baru dan menyimpan ke IndexedDB.
 * - Mengurangi stok produk secara otomatis.
 * - Menghasilkan ID transaksi (nomor struk) unik.
 * - Menangani kalkulasi pembayaran dan kembalian.
 */

import { Transaction, Product } from '../../types';
import { db } from './db.service';

/** Utility untuk membuat ID unik transaksi */
function generateTransactionId(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TRX-${year}${month}${day}-${randomPart}`;
}

/**
 * Service utama transaksi
 */
export const TransactionService = {
  /** Ambil semua transaksi, diurutkan dari yang terbaru */
  async getAll(): Promise<Transaction[]> {
    const transactions = await db.getAll<Transaction>("transactions");
    return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Tambah transaksi baru, update stok, dan kembalikan data transaksi yang telah dibuat.
   * @param data - Data transaksi dari kasir (items, total, metode pembayaran, jumlah bayar)
   * @param cashier - Objek berisi ID dan nama kasir yang sedang login
   */
  async add(data: Omit<Transaction, 'id' | 'createdAt' | 'change' | 'cashierId' | 'cashierName'>, cashier: { id: string, name: string }): Promise<Transaction> {
    if (data.amountPaid < data.totalAmount && data.paymentMethod === 'cash') {
      throw new Error("Jumlah pembayaran tunai tidak mencukupi.");
    }

    const newTransaction: Transaction = {
      ...data,
      id: generateTransactionId(),
      createdAt: new Date().toISOString(),
      change: data.amountPaid - data.totalAmount,
      cashierId: cashier.id,
      cashierName: cashier.name,
    };

    // 1. Update stock for each product atomically
    const stockUpdatePromises = newTransaction.items.map(async (item) => {
      const product = await db.getById<Product>("products", item.productId);
      if (product) {
        if (product.stock < item.quantity) {
          throw new Error(`Stok tidak mencukupi untuk produk: ${product.name}`);
        }
        const updatedProduct: Product = {
          ...product,
          stock: product.stock - item.quantity,
          updatedAt: new Date().toISOString(),
        };
        await db.update("products", updatedProduct);
      } else {
        throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan.`);
      }
    });

    await Promise.all(stockUpdatePromises);
    
    // 2. If all stock updates succeed, add the transaction record
    await db.add("transactions", newTransaction);

    return newTransaction;
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