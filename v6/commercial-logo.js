(async () => {
  'use strict';
  try {
    const response = await fetch('./assets/graxcare-app-icon.svg?brand=commercial-hq-20260807u', { cache: 'no-store' });
    if (!response.ok) throw new Error('Commercial logo unavailable');

    const svg = await response.text();
    const match = svg.match(/href=["'](data:image\/(?:webp|png|jpeg);base64,[^"']+)["']/i);
    if (!match) throw new Error('Commercial logo data missing');

    const src = match[1];
    const image = document.createElement('img');
    image.className = 'brand-logo-master';
    image.src = src;
    image.alt = 'GraxCare Ready';
    image.width = 80;
    image.height = 70;
    image.decoding = 'async';
    await image.decode();

    if (image.naturalWidth < 300 || image.naturalHeight < 300) {
      throw new Error('Commercial logo resolution below target');
    }

    const brand = document.querySelector('.brand');
    if (!brand) return;

    brand.querySelector('.brand-placeholder')?.replaceWith(image);
    brand.querySelector('.brand-copy')?.remove();
    document.documentElement.style.setProperty('--gcr-logo-image', `url("${src}")`);
    document.documentElement.classList.add('gcr-logo-ready');
  } catch {
    /* Keep the clean text fallback if the commercial asset cannot be verified. */
  }
})();
