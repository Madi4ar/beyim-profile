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

  function initToastButtons() {
    $$('[data-toast]').forEach(btn => {
      btn.addEventListener('click', () => showToast(btn.dataset.toast));
    });
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

  function initServicesCta() {
    const btn = $('#goToServicesBtn');
    if (btn) btn.addEventListener('click', () => showToast('Переходим к услугам центра…'));
  }

  function initRecommendCarousel() {
    const track = $('#recommendTrack');
    const prev = $('#recPrev');
    const next = $('#recNext');
    if (!track || !prev || !next) return;

    const scrollByCard = (direction) => {
      const card = track.querySelector('.recommend-item');
      const amount = card ? card.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };

    prev.addEventListener('click', () => scrollByCard(-1));
    next.addEventListener('click', () => scrollByCard(1));
  }

  function init() {
    initToastButtons();
    initTabs();
    initServicesCta();
    initRecommendCarousel();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
