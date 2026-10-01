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

  document.addEventListener('DOMContentLoaded', initToastButtons);
})();
