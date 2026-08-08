(() => {
  'use strict';

  const brand = document.querySelector('.brand');
  if (!brand) return;

  const src = './assets/graxcare-icon-source-20260807.svg?v=visual-sync-20260808a';
  const image = new Image();
  image.className = 'brand-logo-master';
  image.alt = 'GraxCare Ready';
  image.width = 394;
  image.height = 347;
  image.decoding = 'async';

  image.addEventListener('load', () => {
    brand.querySelector('.brand-placeholder')?.replaceWith(image);
    brand.querySelector('.brand-copy')?.remove();
    document.documentElement.style.setProperty('--gcr-logo-image', `url("${src}")`);
    document.documentElement.classList.add('gcr-logo-ready');
  }, { once: true });

  image.src = src;
})();
