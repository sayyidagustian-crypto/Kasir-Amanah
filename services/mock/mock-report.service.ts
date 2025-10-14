/**
 * Kasir Amanah - Mock Report Service
 * ----------------------------------
 * Service ini adalah replika dari ReportService asli, namun
 * beroperasi pada data statis (sampleTransactions) untuk
 * keperluan demo di Mode Tamu.
 */

import { Transaction, ReportSummary, BestSellingProduct } from '../../types';
import { sampleTransactions } from './sample-transactions';

export const MockReportService = {
  getTransactionsByPeriod(startDate: Date, endDate: Date): Transaction[] {
    return sampleTransactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  },

  getSummary(startDate: Date, endDate: Date): ReportSummary {
    const transactions = this.getTransactionsByPeriod(startDate, endDate);
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

  getBestSellingProducts(startDate: Date, endDate: Date, limit: number = 5): BestSellingProduct[] {
    const transactions = this.getTransactionsByPeriod(startDate, endDate);
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
