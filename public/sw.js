const CACHE_NAME = 'version-4';
const urlsToCache = [ '/', '/index.html' ];

// 1. Installation & Prise en main immédiate
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force le nouveau SW à s'activer sans attendre
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. Activation & Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            // Supprime uniquement les anciens caches SW, JAMAIS le localStorage
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend le contrôle direct de toutes les pages ouvertes
  );
});

// 3. Stratégie réseau d'abord pour le HTML / Cache d'abord pour les assets
self.addEventListener('fetch', (event) => {
  // Pour la page principale, on essaye le réseau d'abord pour toujours avoir la dernière version
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Pour le reste (CSS, JS, images), cache d'abord avec fallback réseau
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});