const CACHE = 'graxcare-ready-definitive-commercial-20260806';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest?r=scrollfix-20260805',
  './visual-v6.css?r=commercial-20260806',
  './commercial-theme.css?r=commercial-20260806',
  './commercial-sprite.css?r=commercial-20260806',
  './commercial-icons.css?r=commercial-20260806',
  './update-shell.js?r=scrollfix-20260805',
  '../styles.css?r=scrollfix-20260805',
  '../visual-final.css?r=scrollfix-20260805',
  '../app.js?r=scrollfix-20260805',
  '../assets/placeholder-icon-192.png',
  '../assets/placeholder-icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('graxcare-ready-') && key !== CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request, fallbackUrl = null) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await caches.match(fallbackUrl);
      if (fallback) return fallback;
    }
    return Response.error();
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
