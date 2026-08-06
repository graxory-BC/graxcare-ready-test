(() => {
  'use strict';
  if (!('serviceWorker' in navigator)) return;

  const RESET_KEY = 'graxcare_v6_shell_reset_done';
  let refreshing = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', async () => {
    try {
      if (!localStorage.getItem(RESET_KEY)) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
        if ('caches' in window) {
          const names = await caches.keys();
          await Promise.all(names.map(name => caches.delete(name)));
        }
        localStorage.setItem(RESET_KEY, '1');
        window.location.replace('./?clean=v6');
        return;
      }

      const registration = await navigator.serviceWorker.register('./service-worker.js?v=6', {
        scope: './',
        updateViaCache: 'none'
      });
      await registration.update();
      if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } catch {
      // Visual and functional core remain available even if installation is unavailable.
    }
  });
})();
