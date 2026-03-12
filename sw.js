/* Notes Arena - Optimized Offline Service Worker */
const CACHE_NAME = 'notes-arena-v1.5.2';

// Sirf main file ko cache karein kyunke CSS/JS isi ke andar hain
const ASSETS_TO_CACHE = [
  './',
  './index.html'
];

// 1. Install Event: Files ko memory mein save karna
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Notes Arena: Offline mode active ho raha hai...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Purana cache saaf karna
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Event: Airplane mode mein file cache se uthana
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Agar cache mein file hai (Offline mode), to wahi dikhao
      // Warna internet (Network) se lo
      return response || fetch(event.request).catch(() => {
        // Agar internet bhi nahi hai aur file bhi nahi mili, to index.html pe bhej do
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
