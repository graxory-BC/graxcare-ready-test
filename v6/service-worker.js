const CACHE = 'graxcare-ready-premium-restore-20260815d';
const APP_SHELL = [
  './',
  './index.html',
  './manifest-commercial.webmanifest?r=premium-restore-20260815d',
  './assets/graxcare-emblem-premium-clean.svg?v=premium-restore-20260815d',
  './assets/graxcare-icon-1024.png?v=premium-restore-20260815d',
  './visual-v6.css?r=compact-commercial-20260807m',
  './visual-sync.css?r=visual-sync-20260808a',
  './premium-icon-art.css?r=compact-commercial-20260807m',
  './commercial-logo.css?r=premium-restore-20260815d',
  './commercial-logo.js?r=premium-restore-20260815d',
  './update-shell.js?r=visual-sync-20260808a',
  '../styles.css?r=compact-commercial-20260807m',
  '../visual-final.css?r=compact-commercial-20260807m',
  '../app.js?r=compact-commercial-20260807m'
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
