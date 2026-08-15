(() => {
  'use strict';

  const brand = document.querySelector('.brand');
  if (!brand) return;

  const primary = './assets/graxcare-emblem-premium-clean.svg?v=premium-clean-20260815c';
  const image = new Image();
  image.className = 'brand-logo-master';
  image.alt = 'GraxCare Ready emblem';
  image.width = 512;
  image.height = 512;
  image.decoding = 'async';

  image.addEventListener('load', () => {
    brand.querySelector('.brand-placeholder')?.replaceWith(image);
    document.documentElement.style.setProperty('--gcr-logo-image', `url("${image.src}")`);
    document.documentElement.classList.add('gcr-logo-ready');
  });

  image.src = primary;
})();
