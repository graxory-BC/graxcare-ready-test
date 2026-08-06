(async () => {
  'use strict';
  try {
    const parts = [1,2,3,4,5,6].map(number => `./logo-data/logo-part-${String(number).padStart(2,'0')}.txt`);
    const chunks = await Promise.all(parts.map(async path => {
      const response = await fetch(path);
      if (!response.ok) throw new Error('Logo data unavailable');
      return response.text();
    }));

    const base64 = chunks.join('').replace(/\s+/g,'');
    if (base64.length !== 21136) throw new Error('Logo data incomplete');

    const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const checksum = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2,'0')).join('');
    if (checksum !== 'dba3efff27f876a83a25d3861f1a01e0e3908610be100de6a6a9aaa803e8d39e') {
      throw new Error('Logo integrity check failed');
    }

    const src = `data:image/webp;base64,${base64}`;
    const brand = document.querySelector('.brand');
    if (!brand) return;

    const image = document.createElement('img');
    image.className = 'brand-logo-master';
    image.src = src;
    image.alt = 'GraxCare Ready';
    image.width = 160;
    image.height = 141;
    image.decoding = 'async';

    brand.querySelector('.brand-placeholder')?.replaceWith(image);
    brand.querySelector('.brand-copy')?.remove();
    document.documentElement.style.setProperty('--gcr-logo-image', `url("${src}")`);
    document.documentElement.classList.add('gcr-logo-ready');
  } catch {
    /* Keep the current fallback visible if an asset cannot be verified or loaded. */
  }
})();
