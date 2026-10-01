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

  function initToastLinks() {
    $$('[data-toast]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        showToast(el.dataset.toast);
      });
    });
  }

  function init() {
    initToastLinks();

    const telegramLink = $('#telegramLink');
    if (telegramLink) telegramLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Открываем Telegram…');
    });

    const supportBtn = $('#supportBtn');
    if (supportBtn) supportBtn.addEventListener('click', () => {
      showToast('Открываем форму обращения в поддержку…');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
