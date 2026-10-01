(() => {
  'use strict';

  /* ---------- Helpers ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Today's date in header ---------- */
  function renderToday() {
    const el = $('#todayDate');
    if (!el) return;
    const days = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    const now = new Date();
    el.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
  }

  /* ---------- Typewriter greeting ---------- */
  function initTypewriter() {
    const host = $('#heroGreeting');
    const target = $('#typewriterText');
    if (!host || !target) return;

    const text = host.dataset.greetingText || target.textContent || '';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      target.textContent = text;
      host.classList.add('is-typed');
      return;
    }

    let i = 0;
    const speed = 55;
    (function type() {
      target.textContent = text.slice(0, i);
      if (i < text.length) {
        i++;
        setTimeout(type, speed);
      } else {
        host.classList.add('is-typed');
      }
    })();
  }

  /* ---------- Looping typewriter for the motivation-of-the-day card ---------- */
  const MOTIVATION_QUOTES = [
    { quote: 'Лучший способ предсказать будущее — создать его самому.', author: 'Питер Друкер' },
    { quote: 'Образование — это не наполнение сосуда, а разжигание огня.', author: 'Уильям Батлер Йейтс' },
    { quote: 'Учитель, который пытается учить, не вдохновляя учиться, кует холодное железо.', author: 'Хорас Манн' },
    { quote: 'Инвестиции в знания всегда приносят наибольший доход.', author: 'Бенджамин Франклин' },
    { quote: 'Каждый день — это новый шанс стать лучше вчерашнего себя.', author: 'народная мудрость' },
  ];

  let motivationLoopStarted = false;
  function startMotivationTypewriter() {
    if (motivationLoopStarted) return;
    motivationLoopStarted = true;

    const textEl = $('#motivationQuoteText');
    const authorEl = $('#motivationAuthor');
    if (!textEl || !authorEl) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      const first = MOTIVATION_QUOTES[0];
      textEl.textContent = `«${first.quote}»`;
      authorEl.textContent = `— ${first.author}`;
      return;
    }

    let quoteIndex = 0;
    const typeSpeed = 42;
    const eraseSpeed = 22;
    const holdDelay = 2400;
    const nextDelay = 500;

    function typeNext() {
      const { quote, author } = MOTIVATION_QUOTES[quoteIndex];
      const full = `«${quote}»`;
      authorEl.textContent = `— ${author}`;

      let i = 0;
      (function type() {
        textEl.textContent = full.slice(0, i);
        if (i < full.length) {
          i++;
          setTimeout(type, typeSpeed);
        } else {
          setTimeout(eraseCurrent, holdDelay);
        }
      })();
    }

    function eraseCurrent() {
      const current = textEl.textContent;
      let i = current.length;
      (function erase() {
        textEl.textContent = current.slice(0, i);
        if (i > 0) {
          i--;
          setTimeout(erase, eraseSpeed);
        } else {
          quoteIndex = (quoteIndex + 1) % MOTIVATION_QUOTES.length;
          setTimeout(typeNext, nextDelay);
        }
      })();
    }

    typeNext();
  }

  /* ---------- Mobile sidebar ---------- */
  function initSidebar() {
    const sidebar = $('#sidebar');
    const overlay = $('#sidebarOverlay');
    const toggle = $('#menuToggle');
    if (!sidebar || !overlay || !toggle) return;

    const open = () => { sidebar.classList.add('is-open'); overlay.classList.add('is-open'); };
    const close = () => { sidebar.classList.remove('is-open'); overlay.classList.remove('is-open'); };

    toggle.addEventListener('click', open);
    overlay.addEventListener('click', close);
    $$('.nav-item', sidebar).forEach(item => item.addEventListener('click', close));
  }

  /* ---------- Active nav item ---------- */
  function initNav() {
    const items = $$('.nav-item[data-view]');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        // Items without a real destination page stay on this view; real links (index.html, messages.html) navigate normally.
        if (item.getAttribute('href') !== '#') return;
        e.preventDefault();
        items.forEach(i => i.classList.remove('is-active'));
        item.classList.add('is-active');
      });
    });
  }

  /* ---------- Dropdowns (language / notifications / user menu) ---------- */
  function initDropdowns() {
    const dropdowns = $$('.dropdown');

    function closeAll(except) {
      dropdowns.forEach(d => { if (d !== except) d.classList.remove('is-open'); });
    }

    dropdowns.forEach(drop => {
      const trigger = $('[data-dropdown-toggle]', drop);
      if (!trigger) return;
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !drop.classList.contains('is-open');
        closeAll();
        drop.classList.toggle('is-open', willOpen);
      });
    });

    document.addEventListener('click', () => closeAll());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  }

  /* ---------- Edit modal: field config per block ---------- */
  const EDIT_CONFIGS = {
    profile: {
      title: 'Редактировать общие сведения',
      successMessage: 'Общие сведения обновлены',
      fields: [
        { label: 'ФИО', type: 'text', value: 'Серікова Аружан Ермекқызы' },
        { label: 'Телефон', type: 'text', value: '+7 (701) 234-56-78' },
        { label: 'E-mail', type: 'email', value: 'aruzhan.serikova@inbox.ru' },
        { label: 'Национальность', type: 'text', value: 'Казашка' },
        {
          label: 'Пол', type: 'select', value: 'Женский',
          options: ['Женский', 'Мужской'],
        },
      ],
    },
    qualification: {
      title: 'Редактировать квалификацию',
      successMessage: 'Данные о квалификации обновлены',
      fields: [
        {
          label: 'Категория', type: 'select', value: 'Педагог',
          options: ['Педагог', 'Старший педагог', 'Педагог-методист', 'Педагог-исследователь'],
        },
        {
          label: 'Образование', type: 'select', value: 'Неполное высшее',
          options: ['Среднее', 'Среднее специальное', 'Неполное высшее', 'Высшее', 'Магистратура'],
        },
        {
          label: 'Учёная степень', type: 'select', value: 'Нет учёной степени',
          options: ['Нет учёной степени', 'Кандидат наук', 'Доктор наук', 'PhD'],
        },
        { label: 'Педагогический стаж, лет', type: 'number', value: '1' },
      ],
    },
    workplace: {
      title: 'Редактировать место работы',
      successMessage: 'Информация о месте работы обновлена',
      fields: [
        { label: 'Регион', type: 'text', value: 'г. Астана, район Есиль' },
        { label: 'Организация', type: 'text', value: 'ЧУ «Центр педагогического мастерства»' },
        { label: 'Должность', type: 'text', value: 'Менеджер' },
      ],
    },
  };

  function buildField(field, index) {
    const id = `editField_${index}`;
    const wrap = document.createElement('label');
    wrap.className = 'field';

    const span = document.createElement('span');
    span.textContent = field.label;
    wrap.appendChild(span);

    let control;
    if (field.type === 'select') {
      control = document.createElement('select');
      field.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (opt === field.value) option.selected = true;
        control.appendChild(option);
      });
    } else {
      control = document.createElement('input');
      control.type = field.type;
      control.value = field.value;
    }
    control.id = id;
    wrap.appendChild(control);
    return wrap;
  }

  function openEditModal(key) {
    const config = EDIT_CONFIGS[key];
    const modal = $('#editModal');
    if (!config || !modal) return;

    $('#editModalTitle').textContent = config.title;
    const form = $('#editForm');
    form.innerHTML = '';
    config.fields.forEach((field, index) => form.appendChild(buildField(field, index)));

    modal.dataset.successMessage = config.successMessage;
    modal.dataset.configKey = key;
    modal.classList.add('is-open');
  }

  /* ---------- Profile completion reward ---------- */
  function completeProfile() {
    const completionCard = $('#completionCard');
    const motivationCard = $('#motivationCard');
    const ring = $('#completionRing');
    const percent = $('#completionPercent');
    const heroSubtext = $('#heroSubtext');
    if (!completionCard || !motivationCard) return;
    if (motivationCard.hidden === false) return; // already completed

    if (ring) ring.style.strokeDashoffset = '0';
    if (percent) percent.textContent = '100%';
    if (heroSubtext) heroSubtext.textContent = 'Профиль заполнен на 100% — вам доступны мотивационные и эксклюзивные карточки.';

    completionCard.hidden = true;
    motivationCard.hidden = false;
    if (window.lucide) window.lucide.createIcons();
    startMotivationTypewriter();
  }

  function initEditTriggers() {
    $$('[data-edit-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openEditModal(btn.dataset.editTarget);
      });
    });
  }

  /* ---------- Modals (open/close plumbing + save actions) ---------- */
  function initModals() {
    const passwordOpeners = ['changePasswordLink', 'changePasswordBtn2'];
    passwordOpeners.forEach(id => {
      const btn = $('#' + id);
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        $('#passwordModal').classList.add('is-open');
      });
    });

    $$('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('is-open');
      });
      $$('[data-modal-close]', overlay).forEach(btn => {
        btn.addEventListener('click', () => overlay.classList.remove('is-open'));
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') $$('.modal-overlay.is-open').forEach(o => o.classList.remove('is-open'));
    });

    const saveEdit = $('#saveEditBtn');
    if (saveEdit) saveEdit.addEventListener('click', () => {
      const modal = $('#editModal');
      modal.classList.remove('is-open');
      showToast(modal.dataset.successMessage || 'Изменения сохранены');
      if (modal.dataset.configKey === 'profile') completeProfile();
    });

    const savePassword = $('#savePasswordBtn');
    if (savePassword) savePassword.addEventListener('click', () => {
      const form = $('#passwordForm');
      const inputs = $$('input', form);
      if (inputs.some(i => !i.value.trim())) {
        showToast('Заполните все поля пароля');
        return;
      }
      $('#passwordModal').classList.remove('is-open');
      form.reset();
      showToast('Пароль успешно изменён');
    });
  }

  /* ---------- Logout-all & trainer-profile actions ---------- */
  function initQuickActions() {
    ['logoutAllLink', 'logoutAllBtn2', 'userLogoutLink'].forEach(id => {
      const btn = $('#' + id);
      if (btn) btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Вы вышли со всех устройств');
      });
    });

    const trainerProfileBtn2 = $('#trainerProfileBtn2');
    if (trainerProfileBtn2) trainerProfileBtn2.addEventListener('click', () => showToast('Открываем публичный профиль тренера…'));

    const instagramBtn = $('#instagramBtn');
    if (instagramBtn) instagramBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Переходим в Instagram…');
    });
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  /* ---------- Generic [data-toast] buttons ---------- */
  function initToastButtons() {
    $$('[data-toast]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast(btn.dataset.toast);
      });
    });
  }

  /* ---------- Recommendations carousel ---------- */
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

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();
    renderToday();
    initTypewriter();
    initSidebar();
    initNav();
    initDropdowns();
    initEditTriggers();
    initModals();
    initQuickActions();
    initToastButtons();
    initRecommendCarousel();
  });
})();
