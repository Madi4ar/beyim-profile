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

  function initCollapsibles() {
    $$('.collapsible').forEach(block => {
      const toggle = $('[data-collapsible-toggle]', block);
      const body = $('.collapsible__body', block);
      if (!toggle || !body) return;

      toggle.addEventListener('click', () => {
        const willOpen = body.hidden;
        body.hidden = !willOpen;
        block.classList.toggle('is-open', willOpen);
      });
    });
  }

  function initRating() {
    const stars = $$('.rating-stars__btn');
    const submitBtn = $('#submitRatingBtn');
    if (stars.length === 0 || !submitBtn) return;

    let selected = 0;

    function paint() {
      stars.forEach(btn => {
        btn.classList.toggle('is-filled', Number(btn.dataset.value) <= selected);
      });
    }

    stars.forEach(btn => {
      btn.addEventListener('click', () => {
        selected = Number(btn.dataset.value);
        paint();
      });
      btn.addEventListener('mouseenter', () => {
        stars.forEach(s => s.classList.toggle('is-hover', Number(s.dataset.value) <= Number(btn.dataset.value)));
      });
      btn.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('is-hover'));
      });
    });

    submitBtn.addEventListener('click', () => {
      if (selected === 0) {
        showToast('Поставьте оценку от 1 до 5 звёзд');
        return;
      }
      showToast('Спасибо за вашу оценку!');
      $('#ratingComment').value = '';
    });
  }

  function init() {
    initCollapsibles();
    initRating();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
