(() => {
  'use strict';

  const brand = document.querySelector('.brand');
  if (!brand) return;

  const primary = './assets/graxcare-emblem-premium.svg?v=visual-sync-20260811c';
  const fallback = './assets/graxcare-icon-512.png?v=visual-sync-20260811c';
  const image = new Image();
  image.className = 'brand-logo-master';
  image.alt = 'GraxCare Ready emblem';
  image.width = 512;
  image.height = 512;
  image.decoding = 'async';
  let usingFallback = false;

  image.addEventListener('load', () => {
    brand.querySelector('.brand-placeholder')?.replaceWith(image);
    document.documentElement.style.setProperty('--gcr-logo-image', `url("${image.src}")`);
    document.documentElement.classList.add('gcr-logo-ready');
  });

  image.addEventListener('error', () => {
    if (usingFallback) return;
    usingFallback = true;
    image.src = fallback;
  });

  image.src = primary;
})();
