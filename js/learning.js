(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  let toastTimer = null;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function initCatalogLinks() {
    const catalogBtn = $('#goToCatalogBtn');
    if (catalogBtn) catalogBtn.addEventListener('click', () => showToast('Переходим в каталог курсов…'));

    const servicesBtn = $('#goToServicesBtn');
    if (servicesBtn) servicesBtn.addEventListener('click', () => showToast('Переходим к услугам центра…'));
  }

  function initTabs() {
    const tabs = $$('.tab');
    if (tabs.length === 0) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        $$('.tab-panel').forEach(panel => {
          panel.hidden = panel.dataset.panel !== tab.dataset.tab;
        });
      });
    });
  }

  function initClickableCards(selector) {
    $$(selector).forEach(card => {
      const link = card.querySelector('a[href]');
      if (!link) return;
      card.classList.add('is-clickable');
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        window.location.href = link.href;
      });
    });
  }

  function init() {
    initCatalogLinks();
    initTabs();
    initClickableCards('.event-card');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
