(() => {
  'use strict';

  document.documentElement.dataset.visualBuild = 'visual-sync-20260808d';
  const style = document.createElement('style');
  style.id = 'gcr-compact-commercial-q';
  style.textContent = `
    html body .view[hidden]{display:none!important}

    @media(max-width:719px){
      html body #situationsGrid.situations-grid{
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
        gap:8px!important;
        margin-top:10px!important;
      }
      html body #situationsGrid .situation-card{
        display:grid!important;
        grid-template-columns:42px minmax(0,1fr)!important;
        grid-template-rows:1fr!important;
        align-items:center!important;
        justify-items:start!important;
        min-height:88px!important;
        padding:8px!important;
        gap:7px!important;
        border-radius:15px!important;
        text-align:left!important;
      }
      html body #situationsGrid .situation-icon{
        width:40px!important;
        height:40px!important;
        flex:0 0 40px!important;
        border-radius:12px!important;
      }
      html body #situationsGrid .situation-icon::before{width:32px!important;height:32px!important}
      html body #situationsGrid .situation-card strong{
        margin:0!important;
        font-size:10.5px!important;
        line-height:1.14!important;
        font-weight:850!important;
        text-align:left!important;
        overflow-wrap:normal!important;
        word-break:normal!important;
      }
      html body .bottom-nav{
        min-height:68px!important;
        padding:6px!important;
        border-radius:18px!important;
      }
      html body .bottom-nav .nav-button{
        position:relative!important;
        z-index:1!important;
        pointer-events:auto!important;
        min-height:52px!important;
        gap:2px!important;
        padding:3px!important;
        font-size:10px!important;
        line-height:1.05!important;
        font-weight:800!important;
        touch-action:manipulation!important;
      }
      html body .bottom-nav .nav-button span{
        pointer-events:none!important;
        width:32px!important;
        height:30px!important;
        margin:0 auto 2px!important;
        border-radius:10px!important;
      }
      html body .bottom-nav .nav-button span::before{
        pointer-events:none!important;
        width:24px!important;
        height:24px!important;
      }
    }
    @media(max-width:350px){
      html body #situationsGrid.situations-grid{gap:7px!important}
      html body #situationsGrid .situation-card{
        grid-template-columns:38px minmax(0,1fr)!important;
        min-height:84px!important;
        padding:7px!important;
        gap:6px!important;
      }
      html body #situationsGrid .situation-icon{width:36px!important;height:36px!important;flex-basis:36px!important;border-radius:11px!important}
      html body #situationsGrid .situation-icon::before{width:29px!important;height:29px!important}
      html body #situationsGrid .situation-card strong{font-size:10px!important;line-height:1.12!important}
      html body .bottom-nav .nav-button{font-size:9.5px!important}
      html body .bottom-nav .nav-button span{width:29px!important;height:28px!important}
      html body .bottom-nav .nav-button span::before{width:22px!important;height:22px!important}
    }
  `;
  document.head.appendChild(style);

  function headerOffset() {
    const header = document.querySelector('.app-header');
    return Math.max(8, Math.ceil(header?.getBoundingClientRect().height || 0) + 8);
  }

  /* The original V6 router owns route state. This helper only places the
     route that V6 already opened into the visible viewport. */
  function revealSelectedRoute(route) {
    const target = document.querySelector(`.view[data-view="${route}"]`);
    if (!target || target.hidden || getComputedStyle(target).display === 'none') return;

    target.style.scrollMarginTop = `${headerOffset()}px`;
    target.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });

    setTimeout(() => {
      if (target.hidden || getComputedStyle(target).display === 'none') return;
      target.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
    }, 80);
  }

  /* Situation cards are rendered by app.js. After app.js switches to the
     action route, focus the selected situation itself instead of leaving the
     user at the top of the document. */
  function revealSelectedAction() {
    const actionView = document.querySelector('.view[data-view="action"]');
    const target = document.querySelector('#actionContent .action-hero');
    if (!actionView || actionView.hidden || !target || getComputedStyle(actionView).display === 'none') return;

    target.style.scrollMarginTop = `${headerOffset()}px`;
    target.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });

    setTimeout(() => {
      if (actionView.hidden || getComputedStyle(actionView).display === 'none') return;
      target.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
    }, 80);
  }

  document.addEventListener('click', event => {
    const situationButton = event.target.closest?.('#situationsGrid .situation-card[data-situation-id]');
    if (situationButton && !situationButton.disabled) {
      setTimeout(revealSelectedAction, 0);
      return;
    }

    const button = event.target.closest?.('.bottom-nav .nav-button[data-route]');
    if (!button) return;
    const route = button.dataset.route;
    if (!['home','followup','backup','help'].includes(route)) return;

    setTimeout(() => revealSelectedRoute(route), 0);
  });

  const refreshKey = 'gcr-visual-sync-20260808d';
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