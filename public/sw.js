// HabitaVC CRM — Service Worker
// Strategy: Network First with Cache Fallback

const CACHE_NAME = 'habitavc-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/crmhabita',
  '/login',
];

// Install: pre-cache shell routes
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Fail silently if some routes aren't available
      });
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network First
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and Chrome extension requests
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // Skip Supabase API calls (always need fresh data)
  if (event.request.url.includes('supabase.co')) return;
  
  // Skip Next.js internal requests
  if (event.request.url.includes('/_next/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // For navigation requests: Network First, cache on success
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline: serve from cache or fallback
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // For navigation, return the CRM page if cached
          if (event.request.mode === 'navigate') {
            return caches.match('/crmhabita');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});
