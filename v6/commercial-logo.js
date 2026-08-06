(() => {
  'use strict';
  const parts = [1,2,3,4,5,6].map(number => `./logo-data/logo-part-${String(number).padStart(2,'0')}.txt`);
  Promise.all(parts.map(path => fetch(path).then(response => {
    if (!response.ok) throw new Error('Logo data unavailable');
    return response.text();
  }))).then(chunks => {
    const base64 = chunks.join('').replace(/\s+/g,'');
    if (base64.length !== 21136) throw new Error('Logo data incomplete');
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
  }).catch(() => {
    /* Keep the current fallback visible if an asset cannot be loaded. */
  });
})();
