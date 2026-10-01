(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const TYPE_META = {
    event:  { modifier: 'event',  label: 'Мероприятие' },
    course: { modifier: 'course', label: 'Курс' },
    system: { modifier: 'system', label: 'Система' },
  };

  let messages = [
    {
      id: 1,
      type: 'event',
      title: 'Вы зачислены на мероприятие',
      meta: 'Beyim Meetup 2026 · 5 октября, Алматы',
      createdAt: '23.07.2026 18:44',
      readAt: null,
      cta: 'Посмотреть мероприятие',
      details: [
        { label: 'Группа', value: '02-154-0987-31-A' },
        { label: 'Тренер', value: 'Сапарова Айгерім Нұрланқызы' },
      ],
    },
    {
      id: 2,
      type: 'course',
      title: 'Доступен новый модуль курса',
      meta: '«AI в образовании» · Модуль 6 из 8',
      createdAt: '21.09.2026 09:10',
      readAt: null,
      cta: 'Открыть курс',
      details: [
        { label: 'Модуль', value: '6 из 8' },
        { label: 'Куратор', value: 'Жандос Ермекұлы' },
      ],
    },
    {
      id: 3,
      type: 'event',
      title: 'Вы зачислены на мероприятие',
      meta: 'Вебинар «AI в оценивании знаний» · 2 октября, онлайн',
      createdAt: '23.07.2026 18:44',
      readAt: '21.09.2026 11:28',
      cta: 'Посмотреть мероприятие',
      details: [
        { label: 'Группа', value: '03-220-1145-09-B' },
        { label: 'Спикер', value: 'Данияр Қайратұлы' },
      ],
    },
    {
      id: 4,
      type: 'event',
      title: 'Вы зачислены на мероприятие',
      meta: 'Открытый урок «Педагогический дизайн»',
      createdAt: '02.07.2025 16:27',
      readAt: '02.07.2025 16:31',
      cta: 'Посмотреть мероприятие',
      details: [
        { label: 'Группа', value: '01-392-2328-26-E' },
        { label: 'Тренер', value: 'Ботагөз Серікқызы' },
      ],
    },
  ];

  let activeTab = 'unread';

  /* ---------- Toast (page-local, mirrors the one in script.js) ---------- */
  let toastTimer = null;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  /* ---------- Rendering ---------- */
  function buildMessageCard(msg) {
    const meta = TYPE_META[msg.type];
    const isUnread = !msg.readAt;

    const card = document.createElement('article');
    card.className = 'message-card' + (isUnread ? ' message-card--unread' : '');
    card.dataset.id = msg.id;

    card.innerHTML = `
      <div class="message-card__body">
        <div class="message-card__title-row">
          <p class="message-card__title">${msg.title}${isUnread ? '<span class="message-card__dot" aria-label="Непрочитано"></span>' : ''}</p>
          <span class="tag tag--${meta.modifier}">${meta.label}</span>
        </div>
        <p class="message-card__meta">${msg.meta}</p>
        <div class="message-card__timestamps">
          <span>Получено: ${msg.createdAt}</span>
          ${msg.readAt ? `<span>Прочитано: ${msg.readAt}</span>` : '<span class="message-card__unread-label">Не прочитано</span>'}
        </div>
      </div>
      <button class="btn btn--outline btn--sm message-card__cta" type="button">
        ${msg.cta}
        <i data-lucide="arrow-up-right"></i>
      </button>
    `;

    card.addEventListener('click', () => openDetailModal(msg));

    const ctaBtn = $('.message-card__cta', card);
    ctaBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      markAsRead(msg.id);
      showToast(`Открываем: ${msg.meta}`);
    });

    return card;
  }

  /* ---------- Message detail modal ---------- */
  function openDetailModal(msg) {
    const modal = $('#messageDetailModal');
    if (!modal) return;

    $('#messageDetailTitle').textContent = msg.title;
    $('#messageDetailName').textContent = msg.meta;

    const fields = $('#messageDetailFields');
    fields.innerHTML = (msg.details || [])
      .map(d => `<div class="message-detail__row"><dt>${d.label}:</dt><dd>${d.value}</dd></div>`)
      .join('');

    const cta = $('#messageDetailCta');
    cta.textContent = msg.cta;
    cta.onclick = () => {
      markAsRead(msg.id);
      modal.classList.remove('is-open');
      showToast(`Открываем: ${msg.meta}`);
    };

    markAsRead(msg.id);
    modal.classList.add('is-open');
  }

  function render() {
    const list = $('#messagesList');
    const empty = $('#messagesEmpty');
    const filtered = messages.filter(m => (activeTab === 'unread' ? !m.readAt : !!m.readAt));

    list.innerHTML = '';

    if (filtered.length === 0) {
      list.hidden = true;
      empty.hidden = false;
      if (activeTab === 'unread') {
        $('#messagesEmptyTitle').textContent = 'Непрочитанных сообщений нет';
        $('#messagesEmptyText').textContent = 'Все уведомления прочитаны. Новые зачисления и обновления курсов появятся здесь.';
        $('#messagesEmptyCta').textContent = 'Перейти к мероприятиям';
      } else {
        $('#messagesEmptyTitle').textContent = 'Прочитанных сообщений пока нет';
        $('#messagesEmptyText').textContent = 'Сообщения, которые вы откроете, будут собираться здесь.';
        $('#messagesEmptyCta').textContent = 'Перейти к мероприятиям';
      }
    } else {
      list.hidden = false;
      empty.hidden = true;
      filtered.forEach(msg => list.appendChild(buildMessageCard(msg)));
      if (window.lucide) window.lucide.createIcons();
    }

    updateCounts();
  }

  function updateCounts() {
    const unread = messages.filter(m => !m.readAt).length;
    const read = messages.filter(m => !!m.readAt).length;
    $('#unreadCount').textContent = unread;
    $('#readCount').textContent = read;

    const badge = $('#sidebarUnreadBadge');
    if (badge) {
      badge.textContent = unread;
      badge.style.visibility = unread > 0 ? 'visible' : 'hidden';
    }

    const markAllBtn = $('#markAllReadBtn');
    if (markAllBtn) markAllBtn.hidden = activeTab !== 'unread' || unread === 0;
  }

  function stampRead(msg) {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    msg.readAt = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  function markAsRead(id) {
    const msg = messages.find(m => m.id === id);
    if (!msg || msg.readAt) return;
    stampRead(msg);
    render();
  }

  function markAllAsRead() {
    const unread = messages.filter(m => !m.readAt);
    if (unread.length === 0) return;
    unread.forEach(stampRead);
    render();
    showToast('Все сообщения отмечены как прочитанные');
  }

  function initTabs() {
    $$('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        $$('.tab').forEach(t => {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        render();
      });
    });
  }

  function init() {
    initTabs();
    render();

    const markAllBtn = $('#markAllReadBtn');
    if (markAllBtn) markAllBtn.addEventListener('click', markAllAsRead);

    const emptyCta = $('#messagesEmptyCta');
    if (emptyCta) emptyCta.addEventListener('click', () => showToast('Переходим к разделу мероприятий…'));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
