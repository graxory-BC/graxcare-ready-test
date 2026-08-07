(() => {
  'use strict';

  document.documentElement.dataset.visualBuild = 'approved-sync-20260807l';
  const style = document.createElement('style');
  style.id = 'gcr-approved-sync-l';
  style.textContent = `
    /* Restore the approved V6 mobile proportions. Keep the premium art, without the rejected enlargement. */
    html body #situationsGrid .situation-card{
      display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;
      min-height:132px!important;padding:13px 12px 12px!important;gap:10px!important;text-align:left!important;
    }
    html body #situationsGrid .situation-icon{
      display:grid!important;place-items:center!important;width:50px!important;height:50px!important;flex:0 0 50px!important;
      border-radius:15px!important;background-image:none!important;background-position:center!important;background-size:auto!important;
      color:var(--card-icon,#087c76)!important;
    }
    html body #situationsGrid .situation-icon::before{
      content:""!important;display:block!important;width:29px!important;height:29px!important;
      background-position:center!important;background-repeat:no-repeat!important;background-size:contain!important;
      -webkit-mask:none!important;mask:none!important;
    }
    html body #situationsGrid .situation-icon::after{display:block!important;content:""!important}
    html body #situationsGrid .situation-card strong{
      font-size:12px!important;line-height:1.22!important;font-weight:880!important;text-align:left!important;
      overflow-wrap:normal!important;word-break:normal!important;
    }

    /* Restore the previously approved lower navigation icon family. */
    html body .bottom-nav{min-height:72px!important;padding:7px!important}
    html body .bottom-nav .nav-button{font-size:10px!important;font-weight:820!important;line-height:1.05!important}
    html body .bottom-nav .nav-button span{
      display:grid!important;place-items:center!important;width:32px!important;height:32px!important;margin:0 auto 3px!important;
      border-radius:11px!important;background:rgba(255,255,255,.07)!important;background-image:none!important;
      border:1px solid rgba(255,255,255,.08)!important;box-shadow:none!important;color:inherit!important;font-size:0!important;
    }
    html body .bottom-nav .nav-button span::before{
      content:""!important;display:block!important;width:21px!important;height:21px!important;background:currentColor!important;background-image:none!important;
      -webkit-mask-image:var(--gcr-sprite)!important;mask-image:var(--gcr-sprite)!important;
      -webkit-mask-size:500% 400%!important;mask-size:500% 400%!important;
      -webkit-mask-position:var(--gcr-x) var(--gcr-y)!important;mask-position:var(--gcr-x) var(--gcr-y)!important;
      -webkit-mask-repeat:no-repeat!important;mask-repeat:no-repeat!important;
    }
    html body .bottom-nav .nav-button[data-route="home"] span::before{--gcr-x:50%;--gcr-y:66.67%}
    html body .bottom-nav .nav-button[data-route="followup"] span::before{--gcr-x:75%;--gcr-y:66.67%}
    html body .bottom-nav .nav-button[data-route="backup"] span::before{--gcr-x:100%;--gcr-y:66.67%}
    html body .bottom-nav .nav-button[data-route="help"] span::before{--gcr-x:0%;--gcr-y:100%}
    html body .bottom-nav .nav-button.active span{
      color:#087c76!important;background:#e6f6f3!important;border-color:#c7e9e4!important;box-shadow:none!important;outline:0!important;
    }

    @media(max-width:350px){
      html body #situationsGrid .situation-card{min-height:124px!important;padding:10px 9px!important;gap:8px!important}
      html body #situationsGrid .situation-icon{width:44px!important;height:44px!important;flex-basis:44px!important;border-radius:13px!important}
      html body #situationsGrid .situation-icon::before{width:25px!important;height:25px!important}
      html body #situationsGrid .situation-card strong{font-size:10.5px!important;line-height:1.18!important}
      html body .bottom-nav .nav-button span{width:29px!important;height:29px!important}
      html body .bottom-nav .nav-button span::before{width:20px!important;height:20px!important}
    }
    @media(min-width:720px){
      html body #situationsGrid .situation-card{min-height:136px!important}
      html body #situationsGrid .situation-icon{width:52px!important;height:52px!important;flex-basis:52px!important}
      html body #situationsGrid .situation-icon::before{width:31px!important;height:31px!important}
      html body #situationsGrid .situation-card strong{font-size:13px!important}
    }
    @media(min-width:1100px){
      html body #situationsGrid .situation-card{min-height:140px!important}
      html body #situationsGrid .situation-icon{width:54px!important;height:54px!important;flex-basis:54px!important}
      html body #situationsGrid .situation-icon::before{width:33px!important;height:33px!important}
      html body #situationsGrid .situation-card strong{font-size:14px!important}
    }
  `;
  document.head.appendChild(style);

  const refreshKey = 'gcr-approved-sync-20260807l';
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
