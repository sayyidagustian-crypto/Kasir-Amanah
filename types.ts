// FIX: Removed a self-import of 'Product' that was causing a name conflict.
export const GUEST_USER_ID = 'GUEST_SESSION';

export interface Product {
  id: string;
  name: string;
  category?: string;
  priceBuy: number;
  priceSell: number;
  stock: number;
  unit?: string; // contoh: pcs, kg, liter
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  costPrice: number;
}

export interface Transaction {
  id: string; // Receipt number
  items: TransactionItem[];
  totalAmount: number;
  totalCost: number;
  paymentMethod: 'cash' | 'card' | 'qris';
  amountPaid: number; // Amount given by customer
  change: number; // Change given back to customer
  discount?: number;
  notes?: string;
  createdAt: string; // ISO 8001 format
  cashierId: string; // ID of the user who processed the transaction
  cashierName: string; // Name of the user who processed the transaction
  shiftId?: string;
}

export interface Setting {
  key: string;
  value: any;
}

export interface User {
  id:string;
  name: string;
  role: 'admin' | 'cashier' | 'guest';
  createdAt: string;
  
  // For PIN-based login (cashiers)
  pin?: string; 

  // For email/password-based login (admins)
  email?: string;
  passwordHash?: string;
  salt?: string;
}

export enum Page {
  CASHIER = 'CASHIER',
  PRODUCTS = 'PRODUCTS',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
}

export interface ReportSummary {
    revenue: number;
    profit: number;
    transactionCount: number;
    itemsSoldCount: number;
}

export interface BestSellingProduct {
    productId: string;
    productName: string;
    quantitySold: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'admin_access' | 'system';
  action: string;
  details?: Record<string, any>;
}