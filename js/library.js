(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  let activeTab = 'all';
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
    $$('.book-card__cta[data-toast]').forEach(btn => {
      btn.addEventListener('click', () => showToast(btn.dataset.toast));
    });
  }

  function initSaveButtons() {
    $$('.book-card__save').forEach(btn => {
      btn.addEventListener('click', () => {
        const nowSaved = !btn.classList.contains('is-saved');
        btn.classList.toggle('is-saved', nowSaved);
        showToast(nowSaved ? btn.dataset.toastOn : btn.dataset.toastOff);
        updateSavedCount();
        if (activeTab === 'saved') applyFilter();
      });
    });
  }

  function updateSavedCount() {
    const count = $$('.book-card__save.is-saved').length;
    const countEl = $('.tab[data-tab="saved"] .tab__count');
    if (countEl) countEl.textContent = count;
  }

  function applyFilter() {
    const cards = $$('.book-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const isSaved = !!$('.book-card__save.is-saved', card);
      const show = activeTab === 'all' || isSaved;
      card.hidden = !show;
      if (show) visibleCount++;
    });

    const emptyState = $('#savedEmpty');
    if (emptyState) emptyState.hidden = !(activeTab === 'saved' && visibleCount === 0);
  }

  function initTabs() {
    $$('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        $$('.tab').forEach(t => {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        applyFilter();
      });
    });
  }

  function init() {
    initToastButtons();
    initSaveButtons();
    initTabs();
    updateSavedCount();
    applyFilter();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
