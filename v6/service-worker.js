const CACHE = 'graxcare-ready-premium-accessibility-20260807i';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest?r=premium-accessibility-20260807i',
  './visual-v6.css?r=premium-accessibility-20260807i',
  './premium-icon-art.css?r=premium-accessibility-20260807i',
  './commercial-logo.css?r=original-logo-20260806',
  './commercial-logo.js?r=original-logo-20260806',
  './update-shell.js?r=premium-accessibility-20260807i',
  './assets/graxcare-logo-master-small.b64.txt',
  './assets/premium-icons-16.svg?r=premium-accessibility-20260807i',
  '../styles.css?r=premium-accessibility-20260807i',
  '../visual-final.css?r=premium-accessibility-20260807i',
  '../app.js?r=premium-accessibility-20260807i',
  '../assets/placeholder-icon-192.png',
  '../assets/placeholder-icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(APP_SHELL.map(async url => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) await cache.put(url, response);
      } catch {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('graxcare-ready-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
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
  event.respondWith(networkFirst(request));
});
