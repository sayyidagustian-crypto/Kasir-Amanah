# 🕌 Kasir Amanah v1.0 (Offline Edition)

**Kasir Amanah** adalah aplikasi kasir (Point of Sale) modern yang dirancang dengan prinsip **Amanah, Cerdas, dan Mandiri**. Aplikasi ini beroperasi **100% offline**, menyimpan semua data secara aman di perangkat Anda tanpa memerlukan koneksi internet atau server eksternal.

---

## 🌿 Prinsip Amanah

Aplikasi ini dibangun di atas tiga pilar utama yang menjamin kepercayaan dan keamanan pengguna:

1.  **Privasi Data Penuh:** Semua data transaksi, produk, dan staf disimpan secara eksklusif di browser Anda (menggunakan IndexedDB). Tidak ada data yang dikirim ke server mana pun.
2.  **Kemandirian Total:** Berjalan lancar tanpa koneksi internet. Sangat cocok untuk area dengan konektivitas terbatas atau untuk menjaga kerahasiaan operasional bisnis.
3.  **Transparansi & Akuntabilitas:** Setiap transaksi tercatat dengan jelas, termasuk siapa kasir yang bertugas, memberikan jejak audit yang kuat dan transparan.

---

## ✨ Fitur Unggulan

Kasir Amanah dilengkapi dengan fitur-fitur setara sistem POS profesional:

### 1. **Antarmuka Kasir (Point of Sale)**
*   Pencarian produk yang cepat.
*   Manajemen keranjang belanja yang intuitif (tambah, hapus, update kuantitas).
*   Proses pembayaran lengkap dengan kalkulasi kembalian otomatis.
*   Antarmuka yang bersih, responsif, dan mudah digunakan.

### 2. **Manajemen Produk**
*   Tambah, edit, dan hapus produk dengan mudah.
*   Pencatatan harga beli dan harga jual untuk analisis laba.
*   Manajemen stok yang terintegrasi langsung dengan transaksi penjualan.

### 3. **Laporan & Analisis Cerdas**
*   Dashboard laporan interaktif dengan filter periode (Hari Ini, 7 Hari, 30 Hari).
*   Kartu ringkasan untuk metrik kunci:
    *   **Total Pendapatan**
    *   **Total Laba Kotor**
    *   **Jumlah Transaksi**
    *   **Jumlah Produk Terjual**
*   Tabel **Produk Terlaris** untuk membantu strategi penjualan.

### 4. **Manajemen Staf & Keamanan**
*   Sistem **login offline berbasis PIN** 4 digit.
*   Dukungan multi-user dengan dua peran: **Admin** dan **Kasir**.
*   Admin dapat mengelola data staf (tambah/hapus).
*   Setiap transaksi secara otomatis ditautkan ke kasir yang sedang login.

### 5. **Backup & Restore Data**
*   Fitur **Backup** untuk mengekspor seluruh data aplikasi (produk, transaksi, staf) ke dalam satu file `.json`.
*   Fitur **Restore** untuk mengimpor data dari file backup, memastikan keamanan data jika perangkat rusak atau diganti.
*   **Reset Data Total** untuk memulai dari awal (hanya bisa diakses oleh Admin).

---

## ⚙️ Teknologi yang Digunakan

*   **Frontend:** React + TypeScript + TailwindCSS
*   **Database Lokal:** IndexedDB (melalui wrapper kustom)
*   **Arsitektur:** Offline-First, Single Page Application (SPA)
*   **Ikon:** Lucide React (via kustom komponen)

---

## 🚀 Cara Memulai

1.  **Buka Aplikasi:** Cukup buka file `index.html` di browser modern (Chrome, Firefox, Edge).
2.  **Setup Admin Pertama:** Saat pertama kali dijalankan, aplikasi akan meminta Anda untuk membuat akun **Admin** pertama beserta PIN-nya.
3.  **Login:** Gunakan PIN yang telah dibuat untuk masuk ke sistem.
4.  **Tambah Produk:** Masuk ke halaman **Produk** untuk mulai menambahkan barang dagangan Anda.
5.  **Mulai Bertransaksi:** Buka halaman **Kasir** dan Anda siap untuk melakukan penjualan pertama!

---

### Lisensi & Kredit

All praise and thanks are due to Allah.

Powered by Google, Gemini, and AI Studio.  
Development assisted by OpenAI technologies.

© 2025 SAT18 Official  
For suggestions & contact: sayyidagustian@gmail.com
