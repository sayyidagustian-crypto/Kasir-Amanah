/**
 * Kasir Amanah - Product Service
 * ------------------------------
 * Modul pengelolaan data produk.
 * Menggunakan IndexedDB melalui db.service.ts sebagai penyimpanan utama.
 *
 * Fitur utama:
 * - CRUD (Create, Read, Update, Delete)
 * - Validasi sederhana sebelum penyimpanan
 * - Impor dan ekspor produk dalam format JSON
 */

import { db } from "./db.service";
import { Product } from "../../types";

/** Utility untuk membuat ID unik produk */
function generateProductId(): string {
  return "P-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

/** Validasi sederhana data produk sebelum disimpan */
function validateProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt"> | Product): void {
  if (!product.name) throw new Error("Nama produk tidak boleh kosong.");
  if (product.priceSell < 0) throw new Error("Harga jual tidak boleh negatif.");
  if (product.stock < 0) throw new Error("Stok tidak boleh negatif.");
}

/**
 * Service utama produk
 */
export const ProductService = {
  /** Ambil semua produk */
  async getAll(): Promise<Product[]> {
    return await db.getAll<Product>("products");
  },

  /** Ambil produk berdasarkan ID */
  async getById(id: string): Promise<Product | undefined> {
    return await db.getById<Product>("products", id);
  },

  /** Tambah produk baru */
  async add(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    validateProduct(data);
    const newProduct: Product = {
      ...data,
      id: generateProductId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.add("products", newProduct);
    return newProduct;
  },

  /** Update produk */
  async update(product: Product): Promise<void> {
    const productToUpdate = {
        ...product,
        updatedAt: new Date().toISOString()
    };
    validateProduct(productToUpdate);
    await db.update("products", productToUpdate);
  },

  /** Hapus produk */
  async delete(id: string): Promise<void> {
    await db.delete("products", id);
  },

  /** Impor banyak produk dari JSON */
  async importFromJSON(jsonData: Product[]): Promise<void> {
    for (const item of jsonData) {
      try {
        if (!item.id) item.id = generateProductId();
        if (!item.createdAt) item.createdAt = new Date().toISOString();
        await db.add("products", item);
      } catch (err) {
        console.warn("⚠️ Gagal menambah produk:", err);
      }
    }
  },

  /** Ekspor semua produk ke JSON */
  async exportToJSON(): Promise<string> {
    const data = await db.getAll<Product>("products");
    return JSON.stringify(data, null, 2);
  },

  /** Reset seluruh produk (hati-hati!) */
  async clearAll(): Promise<void> {
    await db.clearStore("products");
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
