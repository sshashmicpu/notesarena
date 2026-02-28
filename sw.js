/* Notes Arena - Service Worker */
const CACHE_NAME = 'notes-arena-v1'; // Jab bhi update karni ho, v1 ko v2 kar dein

// Un sab files ki list jo offline chalani hain
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  // Agar aapki CSS/JS files ke naam mukhtalif hain to yahan sahi karlein:
  './style.css',
  './script.js'
];

// 1. Install Event: Sab assets ko memory (Cache) mein save karna
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Notes Arena: Files cache ho rahi hain...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Naye version ko foran active karne ke liye
});

// 2. Activate Event: Purani files ko delete karna jab version update ho
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Notes Arena: Purana cache clear ho raha hai...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Event: Airplane mode mein cache se file uthana
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Agar cache mein file hai to wahi dikhao, warna network se lo
      return response || fetch(event.request).catch(() => {
        // Agar internet nahi hai aur file cache mein bhi nahi, to ye fallback hai
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
