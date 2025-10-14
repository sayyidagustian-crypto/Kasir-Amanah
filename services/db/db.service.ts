/**
 * Kasir Amanah - IndexedDB Service
 * --------------------------------
 * Pondasi utama sistem penyimpanan data offline.
 * Semua data aplikasi (produk, transaksi, pengaturan, laporan)
 * disimpan secara lokal di browser masing-masing pengguna.
 *
 * Prinsip utama:
 * - Tidak mengirim data ke server eksternal.
 * - Semua operasi bersifat asinkron.
 * - Aman, efisien, dan dapat di-backup dalam format JSON.
 */
import { Product, Transaction, Setting } from '../../types';

export class KasirAmanahDB {
  private dbName = "kasir_amanah_db";
  private dbVersion = 3; // Incremented version for new email index
  private stores = [
    { name: "products", keyPath: "id" },
    { name: "transactions", keyPath: "id" },
    { name: "settings", keyPath: "key" },
    { name: "users", keyPath: "id" },
    { name: "reports", keyPath: "id" },
    { name: "logs", keyPath: "id" },
  ];

  private db: IDBDatabase | null = null;
  private readyPromise: Promise<IDBDatabase>;

  constructor() {
    this.readyPromise = this.init();
  }

  // FIX: Added a public method to safely expose the readiness promise.
  public ready(): Promise<IDBDatabase> {
    return this.readyPromise;
  }

  private init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          this.stores.forEach(storeDef => {
              if (!db.objectStoreNames.contains(storeDef.name)) {
                db.createObjectStore(storeDef.name, { keyPath: storeDef.keyPath });
              }
          });

          // Ensure indexes exist for schema updates
          const tx = (event.target as IDBOpenDBRequest).transaction;
          if (tx) {
              const productStore = tx.objectStore('products');
              if (!productStore.indexNames.contains('name')) {
                  productStore.createIndex('name', 'name', { unique: false });
              }

              const transactionStore = tx.objectStore('transactions');
              if (!transactionStore.indexNames.contains('createdAt')) {
                  transactionStore.createIndex('createdAt', 'createdAt', { unique: false });
              }
              
              const logStore = tx.objectStore('logs');
              if (!logStore.indexNames.contains('timestamp')) {
                  logStore.createIndex('timestamp', 'timestamp', { unique: false });
              }

              const userStore = tx.objectStore('users');
              if (!userStore.indexNames.contains('email')) {
                  // Add email index for admin login
                  userStore.createIndex('email', 'email', { unique: true });
              }
          }
        };

        request.onsuccess = () => {
          this.db = request.result;
          console.info("✅ [KasirAmanahDB] Database siap digunakan.");
          resolve(this.db);
        };

        request.onerror = () => {
          console.error("❌ [KasirAmanahDB] Gagal membuka database:", request.error);
          reject(request.error);
        };
    });
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = "readonly"): Promise<IDBObjectStore> {
    const db = await this.readyPromise;
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getBy(storeName: string, indexName: string, value: any): Promise<any | undefined> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getStore(storeName);
      const index = store.index(indexName);
      const request = index.get(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getById<T>(storeName: string, id: string | number): Promise<T | undefined> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  }

  async add<T>(storeName: string, data: T): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getStore(storeName, "readwrite");
      const request = store.add(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async update<T>(storeName: string, data: T): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getStore(storeName, "readwrite");
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: string | number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getStore(storeName, "readwrite");
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearStore(storeName: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const store = await this.getStore(storeName, 'readwrite');
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
  }

  async exportData(): Promise<Record<string, unknown[]>> {
    const exportResult: Record<string, unknown[]> = {};
    const db = await this.readyPromise;
    for (const storeName of db.objectStoreNames) {
      exportResult[storeName] = await this.getAll(storeName);
    }
    return exportResult;
  }

  async importData(data: Record<string, any[]>): Promise<void> {
    for (const storeName in data) {
        if (Object.prototype.hasOwnProperty.call(data, storeName)) {
            await this.clearStore(storeName);
            for (const item of data[storeName]) {
                await this.add(storeName, item);
            }
        }
    }
  }
  
  async resetDatabase(): Promise<void> {
    const db = await this.readyPromise;
    db.close();
    
    this.readyPromise = new Promise((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase(this.dbName);
        deleteRequest.onsuccess = () => {
            console.warn("⚠️ [KasirAmanahDB] Semua data lokal telah dihapus.");
            this.init().then(resolve).catch(reject);
        };
        deleteRequest.onerror = () => reject("Gagal menghapus database.");
        deleteRequest.onblocked = () => reject("Proses hapus database terhalang.");
    });
    
    await this.readyPromise;
  }
}

export const db = new KasirAmanahDB();

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