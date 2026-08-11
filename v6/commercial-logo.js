(() => {
  'use strict';

  const brand = document.querySelector('.brand');
  if (!brand) return;

  const primary = './assets/graxcare-app-icon.svg?v=visual-sync-20260811a';
  const fallback = './assets/graxcare-icon-512.png?v=visual-sync-20260811a';
  const image = new Image();
  image.className = 'brand-logo-master';
  image.alt = 'GraxCare Ready emblem';
  image.width = 320;
  image.height = 320;
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
