(() => {
  'use strict';

  const refreshKey = 'gcr-premium-direct-20260806f';
  if (!('serviceWorker' in navigator)) return;

  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || sessionStorage.getItem(refreshKey)) return;
    sessionStorage.setItem(refreshKey, '1');
    reloading = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.ready
      .then(registration => registration.update())
      .catch(() => {});
  }, { once: true });
})();
