(() => {
  'use strict';

  document.documentElement.dataset.visualBuild = 'premium-balance-final-20260807k2';
  const style = document.createElement('style');
  style.id = 'gcr-premium-balance-k2';
  style.textContent = `
    html body #situationsGrid .situation-card{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;min-height:146px!important;padding:12px 10px 14px!important;text-align:center!important}
    html body #situationsGrid .situation-icon{display:block!important;width:58px!important;height:58px!important;flex:0 0 58px!important;border-radius:16px!important;background-color:#fff!important;background-image:url('./assets/premium-icons-16.svg?r=premium-balance-final-20260807k2')!important;background-repeat:no-repeat!important;background-size:400% 400%!important;box-shadow:0 6px 14px rgba(13,27,61,.12)!important;color:transparent!important;font-size:0!important}
    html body #situationsGrid .situation-icon::before,html body #situationsGrid .situation-icon::after{display:none!important;content:none!important}
    html body #situationsGrid .situation-card strong{font-size:17px!important;line-height:1.20!important;font-weight:820!important;text-align:center!important;overflow-wrap:anywhere!important;word-break:normal!important}
    html body .bottom-nav{min-height:72px!important;padding-top:5px!important}
    html body .bottom-nav .nav-button{font-size:12px!important;font-weight:760!important;line-height:1.05!important}
    html body .bottom-nav .nav-button span{display:block!important;width:30px!important;height:30px!important;margin:0 auto 3px!important;border:0!important;border-radius:0!important;background-color:transparent!important;background-image:url('./assets/premium-icons-16.svg?r=premium-balance-final-20260807k2')!important;background-repeat:no-repeat!important;background-size:400% 400%!important;box-shadow:none!important;outline:0!important;filter:drop-shadow(0 0 1px rgba(255,255,255,.38))!important;color:transparent!important;font-size:0!important}
    html body .bottom-nav .nav-button.active span{background-color:transparent!important;border:0!important;box-shadow:none!important;outline:0!important;filter:none!important}
    html body .bottom-nav .nav-button:nth-child(1) span{background-position:0% 100%!important}html body .bottom-nav .nav-button:nth-child(2) span{background-position:33.333% 100%!important}html body .bottom-nav .nav-button:nth-child(3) span{background-position:66.667% 100%!important}html body .bottom-nav .nav-button:nth-child(4) span{background-position:100% 100%!important}
    @media(max-width:359px){html body #situationsGrid .situation-card{min-height:140px!important;padding-inline:8px!important}html body #situationsGrid .situation-icon{width:54px!important;height:54px!important;flex-basis:54px!important}html body #situationsGrid .situation-card strong{font-size:16px!important}html body .bottom-nav .nav-button{font-size:11.5px!important}html body .bottom-nav .nav-button span{width:28px!important;height:28px!important}}
    @media(min-width:768px){html body #situationsGrid .situation-card{min-height:150px!important}html body #situationsGrid .situation-icon{width:60px!important;height:60px!important;flex-basis:60px!important}html body #situationsGrid .situation-card strong{font-size:17.5px!important}html body .bottom-nav .nav-button span{width:32px!important;height:32px!important}}
  `;
  document.head.appendChild(style);

  const refreshKey = 'gcr-premium-balance-final-20260807k2';
  if (!('serviceWorker' in navigator)) return;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || sessionStorage.getItem(refreshKey)) return;
    sessionStorage.setItem(refreshKey, '1');
    reloading = true;
    window.location.reload();
  });
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
    } catch {}
  }, { once: true });
})();
