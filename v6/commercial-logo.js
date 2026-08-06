(async () => {
  'use strict';
  try {
    const response = await fetch('./assets/graxcare-logo-master-small.b64.txt');
    if (!response.ok) throw new Error('Logo data unavailable');

    const base64 = (await response.text()).replace(/\s+/g,'');
    if (base64.length !== 5248) throw new Error('Logo data incomplete');

    const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const checksum = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2,'0')).join('');
    if (checksum !== 'ea522338f8b0336d2a87ef230f574065c0956a9a55b22ab92d51cb9186bd8860') {
      throw new Error('Logo integrity check failed');
    }

    const src = `data:image/webp;base64,${base64}`;
    const brand = document.querySelector('.brand');
    if (!brand) return;

    const image = document.createElement('img');
    image.className = 'brand-logo-master';
    image.src = src;
    image.alt = 'GraxCare Ready';
    image.width = 80;
    image.height = 70;
    image.decoding = 'async';

    brand.querySelector('.brand-placeholder')?.replaceWith(image);
    brand.querySelector('.brand-copy')?.remove();
    document.documentElement.style.setProperty('--gcr-logo-image', `url("${src}")`);
    document.documentElement.classList.add('gcr-logo-ready');
  } catch {
    /* Keep the current fallback visible if an asset cannot be verified or loaded. */
  }
})();
