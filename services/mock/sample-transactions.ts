import { Transaction } from '../../types';

// Data transaksi contoh untuk mode Tamu, menggunakan produk dari sample-products.ts
export const sampleTransactions: Transaction[] = [
  {
    id: 'TRX-GUEST-1',
    items: [
      { productId: 'P-SAMPLE-1', productName: 'Kopi Susu Gula Aren', quantity: 2, price: 18000, costPrice: 8000 },
      { productId: 'P-SAMPLE-2', productName: 'Croissant Cokelat', quantity: 1, price: 22000, costPrice: 10000 },
    ],
    totalAmount: 58000,
    totalCost: 26000,
    paymentMethod: 'qris',
    amountPaid: 58000,
    change: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    cashierId: 'guest-cashier',
    cashierName: 'Demo Kasir',
  },
  {
    id: 'TRX-GUEST-2',
    items: [
      { productId: 'P-SAMPLE-4', productName: 'Donat Gula Halus', quantity: 5, price: 8000, costPrice: 3000 },
      { productId: 'P-SAMPLE-5', productName: 'Air Mineral Botol', quantity: 2, price: 5000, costPrice: 2000 },
    ],
    totalAmount: 50000,
    totalCost: 19000,
    paymentMethod: 'cash',
    amountPaid: 50000,
    change: 0,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    cashierId: 'guest-cashier',
    cashierName: 'Demo Kasir',
  },
  {
    id: 'TRX-GUEST-3',
    items: [
      { productId: 'P-SAMPLE-3', productName: 'Teh Melati', quantity: 3, price: 12000, costPrice: 4000 },
    ],
    totalAmount: 36000,
    totalCost: 12000,
    paymentMethod: 'card',
    amountPaid: 36000,
    change: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    cashierId: 'guest-cashier',
    cashierName: 'Demo Kasir',
  },
  {
    id: 'TRX-GUEST-4',
    items: [
      { productId: 'P-SAMPLE-1', productName: 'Kopi Susu Gula Aren', quantity: 4, price: 18000, costPrice: 8000 },
    ],
    totalAmount: 72000,
    totalCost: 32000,
    paymentMethod: 'qris',
    amountPaid: 72000,
    change: 0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    cashierId: 'guest-cashier',
    cashierName: 'Demo Kasir',
  },
    {
    id: 'TRX-GUEST-5',
    items: [
      { productId: 'P-SAMPLE-2', productName: 'Croissant Cokelat', quantity: 3, price: 22000, costPrice: 10000 },
      { productId: 'P-SAMPLE-3', productName: 'Teh Melati', quantity: 2, price: 12000, costPrice: 4000 },
      { productId: 'P-SAMPLE-5', productName: 'Air Mineral Botol', quantity: 3, price: 5000, costPrice: 2000 },
    ],
    totalAmount: 105000,
    totalCost: 44000,
    paymentMethod: 'cash',
    amountPaid: 110000,
    change: 5000,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    cashierId: 'guest-cashier',
    cashierName: 'Demo Kasir',
  },
];

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