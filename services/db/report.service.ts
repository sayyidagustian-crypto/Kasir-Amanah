/**
 * Kasir Amanah - Report Service
 * -----------------------------
 * Modul untuk menghasilkan laporan dan analisis dari data transaksi.
 *
 * Fitur utama:
 * - Menghitung ringkasan penjualan (pendapatan, laba, dll.)
 * - Mengidentifikasi produk terlaris.
 * - Bekerja berdasarkan rentang waktu yang dinamis.
 */

import { Transaction, ReportSummary, BestSellingProduct } from '../../types';
import { TransactionService } from './transaction.service';

export const ReportService = {
  /**
   * Mengambil dan memfilter transaksi berdasarkan rentang tanggal.
   * @param startDate - Tanggal mulai.
   * @param endDate - Tanggal selesai.
   * @returns Array transaksi yang sudah difilter.
   */
  async getTransactionsByPeriod(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const allTransactions = await TransactionService.getAll();
    return allTransactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  },

  /**
   * Menghasilkan ringkasan penjualan untuk periode tertentu.
   * @param startDate - Tanggal mulai.
   * @param endDate - Tanggal selesai.
   * @returns Objek ReportSummary yang berisi total pendapatan, laba, dll.
   */
  async getSummary(startDate: Date, endDate: Date): Promise<ReportSummary> {
    const transactions = await this.getTransactionsByPeriod(startDate, endDate);

    return transactions.reduce((summary, t) => {
      summary.revenue += t.totalAmount;
      summary.profit += (t.totalAmount - t.totalCost);
      summary.transactionCount += 1;
      summary.itemsSoldCount += t.items.reduce((sum, item) => sum + item.quantity, 0);
      return summary;
    }, {
      revenue: 0,
      profit: 0,
      transactionCount: 0,
      itemsSoldCount: 0,
    });
  },

  /**
   * Mendapatkan daftar produk terlaris dalam periode tertentu.
   * @param startDate - Tanggal mulai.
   * @param endDate - Tanggal selesai.
   * @param limit - Jumlah produk teratas yang ingin ditampilkan.
   * @returns Array BestSellingProduct yang sudah diurutkan.
   */
  async getBestSellingProducts(startDate: Date, endDate: Date, limit: number = 5): Promise<BestSellingProduct[]> {
    const transactions = await this.getTransactionsByPeriod(startDate, endDate);
    
    const productSales: Record<string, { productName: string, quantitySold: number }> = {};

    transactions.forEach(t => {
      t.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { productName: item.productName, quantitySold: 0 };
        }
        productSales[item.productId].quantitySold += item.quantity;
      });
    });

    return Object.entries(productSales)
      .map(([productId, data]) => ({
        productId,
        productName: data.productName,
        quantitySold: data.quantitySold,
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, limit);
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