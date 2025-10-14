import { Product } from '../../types';

export const sampleProducts: Product[] = [
  { id: 'P-SAMPLE-1', name: 'Kopi Susu Gula Aren', category: 'Minuman', priceBuy: 8000, priceSell: 18000, stock: 50, unit: 'cup', createdAt: new Date().toISOString() },
  { id: 'P-SAMPLE-2', name: 'Croissant Cokelat', category: 'Kue', priceBuy: 10000, priceSell: 22000, stock: 25, unit: 'pcs', createdAt: new Date().toISOString() },
  { id: 'P-SAMPLE-3', name: 'Teh Melati', category: 'Minuman', priceBuy: 4000, priceSell: 12000, stock: 100, unit: 'cup', createdAt: new Date().toISOString() },
  { id: 'P-SAMPLE-4', name: 'Donat Gula Halus', category: 'Kue', priceBuy: 3000, priceSell: 8000, stock: 40, unit: 'pcs', createdAt: new Date().toISOString() },
  { id: 'P-SAMPLE-5', name: 'Air Mineral Botol', category: 'Minuman', priceBuy: 2000, priceSell: 5000, stock: 80, unit: 'btl', createdAt: new Date().toISOString() },
];
