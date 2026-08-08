(async () => {
  'use strict';
  try {
    const src = './assets/graxcare-icon-512.png?v=20260807v';
    const probe = new Image();
    probe.src = src;
    probe.decoding = 'async';
    await probe.decode();
    if (probe.naturalWidth !== 512 || probe.naturalHeight !== 512) throw new Error('Commercial icon dimensions invalid');

    const brand = document.querySelector('.brand');
    if (!brand) return;

    const image = document.createElement('img');
    image.className = 'brand-logo-master';
    image.src = src;
    image.alt = 'GraxCare Ready';
    image.width = 80;
    image.height = 80;
    image.decoding = 'async';

    brand.querySelector('.brand-placeholder')?.replaceWith(image);
    brand.querySelector('.brand-copy')?.remove();
    document.documentElement.style.setProperty('--gcr-logo-image', `url("${src}")`);
    document.documentElement.classList.add('gcr-logo-ready');
  } catch {
    /* Keep the clean text fallback if the verified commercial PNG cannot render. */
  }
})();
