const CACHE_NAME = 'kasir-amanah-v1';

// Aset inti yang wajib ada agar aplikasi berjalan
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/index.tsx',
  '/assets/icon.svg',
];

// Aset eksternal yang bagus jika berhasil di-cache
const EXTERNAL_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap',
];

// Event 'install': dijalankan saat service worker pertama kali diinstal
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Memaksa service worker baru untuk aktif segera
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache dibuka. Menyimpan aset inti.');
        // Simpan aset inti terlebih dahulu. Ini adalah bagian terpenting.
        return cache.addAll(CORE_ASSETS).then(() => {
            console.log('Aset inti berhasil disimpan. Mencoba menyimpan aset eksternal.');
            // Setelah aset inti aman, coba simpan aset eksternal.
            // Jika ini gagal, tidak akan membatalkan instalasi.
            return cache.addAll(EXTERNAL_ASSETS).catch(error => {
                console.warn('Gagal menyimpan semua aset eksternal, namun aplikasi inti sudah siap offline.', error);
            });
        });
      })
  );
});

// Event 'activate': dijalankan setelah instalasi, berguna untuk membersihkan cache lama
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Hapus cache lain yang tidak ada di whitelist
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Event 'fetch': dijalankan setiap kali ada permintaan jaringan dari aplikasi
self.addEventListener('fetch', (event) => {
  // Strategi: Cache-first.
  // Coba ambil dari cache dulu, jika tidak ada, baru ambil dari jaringan.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Jika ditemukan di cache, langsung kembalikan
        if (response) {
          return response;
        }

        // Jika tidak ada di cache, lakukan permintaan ke jaringan
        return fetch(event.request).then(
          (networkResponse) => {
            // Periksa apakah respons valid untuk disimpan di cache
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Gandakan respons karena stream hanya bisa dibaca sekali
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Simpan respons jaringan ke dalam cache untuk permintaan selanjutnya
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});
