(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  let orders = [
    {
      id: '81856',
      title: 'Повышение квалификации руководителей организаций образования «Менеджмент в образовании»',
      amount: 22000,
      date: '11.05.2024 09:57',
      group: '02-115-8820-24-M',
      trainer: 'Қасымова Гүлнар Нұрланқызы',
      paid: false,
    },
    {
      id: '144472',
      title: 'Международная научно-практическая конференция «XIV NIS Conference 2025»',
      amount: 20000,
      date: '15.05.2025 08:38',
      group: '01-270-1482-25-E',
      trainer: 'Баймырза Мирас Төлеуханұлы',
      paid: true,
    },
    {
      id: '242593',
      title: 'Развитие предметных компетенций педагогов: эффективные практики обучения английскому языку',
      amount: 17000,
      date: '17.09.2026 12:09',
      group: '09-208-20032-26',
      trainer: 'Оспанов Ерболат Турсынтаевич',
      paid: false,
    },
    {
      id: '244660',
      title: 'Гибкие навыки (soft skills) для повышения профессиональной ценности школьной команды',
      amount: 12000,
      date: '24.09.2026 11:48',
      group: '05-331-7742-26-S',
      trainer: 'Әбдірахманова Динара Серікқызы',
      paid: false,
    },
  ];

  let toastTimer = null;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function formatAmount(amount) {
    return amount.toLocaleString('ru-RU') + ' ₸';
  }

  function buildOrderCard(order) {
    const card = document.createElement('article');
    card.className = 'order-card';

    card.innerHTML = `
      <div class="order-card__row">
        <div class="order-card__number-group">
          <span class="order-card__number">Заказ №${order.id}</span>
          ${order.paid
            ? '<span class="status-pill status-pill--ok">Заказ оплачен</span>'
            : '<span class="status-pill status-pill--muted">Ожидает оплаты</span>'}
        </div>
        <span class="order-card__date">${order.date}</span>
      </div>
      <p class="order-card__amount">${formatAmount(order.amount)}</p>
      <p class="order-card__title">${order.title}</p>
    `;

    card.addEventListener('click', () => openOrderModal(order));
    return card;
  }

  function render() {
    const list = $('#orderList');
    list.innerHTML = '';
    orders.forEach(order => list.appendChild(buildOrderCard(order)));
    if (window.lucide) window.lucide.createIcons();
  }

  function openOrderModal(order) {
    const modal = $('#orderModal');
    if (!modal) return;

    $('#orderModalTitle').textContent = `Мой заказ №${order.id}`;
    $('#orderModalName').textContent = order.title;
    $('#orderModalGroup').textContent = order.group;
    $('#orderModalTrainer').textContent = order.trainer;
    $('#orderModalDate').textContent = order.date;
    $('#orderModalAmount').textContent = formatAmount(order.amount);

    $('#orderModalPayWrap').hidden = order.paid;
    $('#orderModalPaidWrap').hidden = !order.paid;

    const payBtn = $('#orderModalPayBtn');
    payBtn.onclick = () => {
      order.paid = true;
      modal.classList.remove('is-open');
      render();
      showToast(`Заказ №${order.id} оплачен`);
    };

    if (window.lucide) window.lucide.createIcons();
    modal.classList.add('is-open');
  }

  function init() {
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
