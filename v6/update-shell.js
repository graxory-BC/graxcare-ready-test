(() => {
  'use strict';

  const style = document.createElement('style');
  style.id = 'gcr-premium-balance-k';
  style.textContent = `
    #situationsGrid .situation-card{grid-template-columns:1fr!important;grid-template-rows:66px minmax(48px,auto)!important;place-items:center!important;gap:8px!important;min-height:150px!important;padding:13px 10px 14px!important;text-align:center!important}
    #situationsGrid .situation-icon{display:block!important;width:62px!important;height:62px!important;flex:0 0 62px!important;border-radius:17px!important;background-color:#fff!important;background-image:url('./assets/premium-icons-16.svg?r=premium-balance-20260807k')!important;background-repeat:no-repeat!important;background-size:400% 400%!important;box-shadow:0 6px 14px rgba(13,27,61,.13)!important}
    #situationsGrid .situation-icon::before,#situationsGrid .situation-icon::after{display:none!important;content:none!important}
    #situationsGrid .situation-card strong{font-size:17px!important;line-height:1.20!important;font-weight:820!important;text-align:center!important;overflow-wrap:anywhere!important;word-break:normal!important}
    .bottom-nav{min-height:72px!important;padding-top:5px!important}
    .bottom-nav .nav-button{font-size:12px!important;font-weight:760!important;line-height:1.05!important}
    .bottom-nav .nav-button span{display:block!important;width:30px!important;height:30px!important;margin:0 auto 3px!important;border:0!important;border-radius:0!important;background-color:transparent!important;background-image:url('./assets/premium-icons-16.svg?r=premium-balance-20260807k')!important;background-repeat:no-repeat!important;background-size:400% 400%!important;box-shadow:none!important;outline:0!important;filter:drop-shadow(0 0 1px rgba(255,255,255,.42))!important;color:transparent!important;font-size:0!important}
    .bottom-nav .nav-button.active span{background-color:transparent!important;box-shadow:none!important;outline:0!important;filter:none!important}
    .bottom-nav .nav-button:nth-child(1) span{background-position:0% 100%!important}.bottom-nav .nav-button:nth-child(2) span{background-position:33.333% 100%!important}.bottom-nav .nav-button:nth-child(3) span{background-position:66.667% 100%!important}.bottom-nav .nav-button:nth-child(4) span{background-position:100% 100%!important}
    @media(max-width:359px){#situationsGrid .situation-card{grid-template-rows:62px auto!important;min-height:142px!important;padding-inline:8px!important}#situationsGrid .situation-icon{width:58px!important;height:58px!important;flex-basis:58px!important}#situationsGrid .situation-card strong{font-size:16px!important}.bottom-nav .nav-button{font-size:11.5px!important}.bottom-nav .nav-button span{width:28px!important;height:28px!important}}
    @media(min-width:768px){#situationsGrid .situation-card{grid-template-rows:68px auto!important;min-height:154px!important}#situationsGrid .situation-icon{width:64px!important;height:64px!important;flex-basis:64px!important}#situationsGrid .situation-card strong{font-size:17.5px!important}.bottom-nav .nav-button span{width:32px!important;height:32px!important}}
  `;
  document.head.appendChild(style);

  const refreshKey = 'gcr-premium-balance-20260807k';
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
