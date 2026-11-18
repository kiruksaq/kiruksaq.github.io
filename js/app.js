document.addEventListener('DOMContentLoaded', () => {
  // 1. Splash-экран загрузки при входе
  const loader = document.getElementById('page-loader');
  const bar = loader ? loader.querySelector('.loader-bar') : null;
  const status = document.getElementById('loader-status');
  if (loader && bar) {
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      bar.style.width = '55%';
      if (status) status.textContent = 'Загрузка модулей...';
    });
    setTimeout(() => {
      bar.style.width = '100%';
      if (status) status.textContent = 'Готово';
    }, 300);
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 650);
  }

  // 2. Мобильное бургер-меню
  const burgerBtn = document.getElementById('burger-btn');
  const mainNav = document.getElementById('main-nav');
  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle('open');
      burgerBtn.setAttribute('aria-expanded', isOpen);
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !burgerBtn.contains(e.target)) {
        mainNav.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. IntersectionObserver для плавного появления блоков
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // 4. Кастомный дропдаун услуг
  const customSelect = document.getElementById('custom-select');
  const selectTrigger = customSelect.querySelector('.select-trigger');
  const selectValueText = customSelect.querySelector('.select-value');
  const serviceInput = document.getElementById('service-select');
  const selectOptions = customSelect.querySelectorAll('.select-option');

  function setCustomSelectValue(val) {
    serviceInput.value = val;
    selectOptions.forEach(opt => {
      const isMatch = opt.dataset.value === val;
      opt.classList.toggle('active', isMatch);
      if (isMatch) selectValueText.textContent = opt.textContent;
    });
  }

  selectTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = customSelect.classList.toggle('open');
    selectTrigger.setAttribute('aria-expanded', isOpen);
  });

  selectOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      setCustomSelectValue(opt.dataset.value);
      customSelect.classList.remove('open');
      selectTrigger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove('open');
      selectTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  // 5. Подстановка услуги из карточек тарифов
  const contactSection = document.getElementById('contact');
  document.querySelectorAll('.select-service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setCustomSelectValue(btn.dataset.service);
      contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 6. Мини-калькулятор в Hero
  const checkboxes = document.querySelectorAll('.calc-checkbox');
  const totalEl = document.getElementById('calc-total');
  const applyCalcBtn = document.getElementById('calc-apply-btn');
  const commentField = document.getElementById('user-comment');

  function updateTotal() {
    let sum = 0;
    checkboxes.forEach(cb => { if (cb.checked) sum += Number(cb.dataset.price); });
    totalEl.textContent = `${sum.toLocaleString('ru-RU')} ₽`;
  }
  checkboxes.forEach(cb => cb.addEventListener('change', updateTotal));

  if (applyCalcBtn) {
    applyCalcBtn.addEventListener('click', () => {
      const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.dataset.name);
      if (selected.length > 0) {
        setCustomSelectValue('Индивидуальный расчёт');
        commentField.value = `Выбрано в калькуляторе: ${selected.join(', ')} (Итого: ${totalEl.textContent}).`;
      }
      contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
  // 7. Кликабельные кейсы
  const modal = document.getElementById('case-modal');
  if (modal) {
    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalMockup = document.getElementById('modal-mockup');
    const modalDetails = document.getElementById('modal-details');
    const modalOrderBtn = document.getElementById('modal-order-btn');
    const modalCloseBtn = document.getElementById('modal-close');

    const casesData = [
      {
        badge: 'Автосервис · 1 день',
        title: 'Лендинг для детейлинг-студии',
        serviceValue: 'Сайт + заявки в ВК/MAX',
        p1: 'Макет: Лендинг + калькулятор услуг + сравнение ДО/ПОСЛЕ',
        p2: 'Интеграция: Мгновенные заявки в личку ВКонтакте (Web3Forms)',
        task: 'Упаковать услуги полировки и химчистки салона для рекламы ВКонтакте.',
        done: 'Собрали одностраничник с интерактивным прайсом и формой записи мастеру.',
        stat: 'Результат: запуск за 18 часов · 14 заявок в первую неделю без затрат на хостинг.'
      },
      {
        badge: 'Бьюти-сфера · 1 день',
        title: 'Сайт-визитка мастера маникюра',
        serviceValue: 'Сайт-визитка',
        p1: 'Макет: Mobile-First визитка + галерея работ + прайс-лист',
        p2: 'Интеграция: Прямой переход в диалог ВК / мессенджер MAX',
        task: 'Заменить неудобное меню в группе ВК на быстрый мобильный сайт.',
        done: 'Спроектировали адаптивную страницу с отзывами и быстрой записью.',
        stat: 'Результат: загрузка страницы 0.15 сек · рост конверсии из клика в запись на 28%.'
      },
      {
        badge: 'B2B / Парсинг · 4 часа',
        title: 'Сбор базы поставщиков и групп',
        serviceValue: 'Парсер базы',
        p1: 'Выгрузка: ID сообщества | Название | Подписчики | Контакт админа',
        p2: 'Статус: Отфильтровано 4 200 активных групп в export_base.xlsx',
        task: 'Собрать актуальную базу оптовых поставщиков и целевых сообществ.',
        done: 'Написали парсер, отсеяли заброшенные группы и выгрузили чистую таблицу.',
        stat: 'Результат: 4 200 целевых контактов собраны за 4 часа и переданы в Excel / CSV.'
      }
    ];

    let currentService = 'Сайт-визитка';
    const openModal = (idx) => {
      const item = casesData[idx];
      if (!item) return;
      modalBadge.textContent = item.badge;
      modalTitle.textContent = item.title;
      modalMockup.innerHTML = `<div class="preview-code" style="margin-top:0">${item.p1}<br>${item.p2}</div>`;
      modalDetails.innerHTML = `<p><strong>Задача:</strong> ${item.task}</p><p><strong>Что сделано:</strong> ${item.done}</p><div class="modal-stat">${item.stat}</div>`;
      currentService = item.serviceValue;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.case-card').forEach(c => c.addEventListener('click', () => openModal(Number(c.dataset.case))));
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
    modalOrderBtn.addEventListener('click', () => {
      closeModal();
      setCustomSelectValue(currentService);
      contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 8. Интерактивные этапы работы
  const workflowPreview = document.getElementById('workflow-preview');
  const workflowCards = document.querySelectorAll('.workflow-card');
  const previewBadge = document.getElementById('preview-badge');
  const previewMeta = document.getElementById('preview-meta');
  const previewBody = document.getElementById('preview-body');

  if (workflowPreview && previewBody) {
    const wrap = document.createElement('div');
    wrap.className = 'preview-content-wrap';
    while (workflowPreview.firstChild) wrap.appendChild(workflowPreview.firstChild);
    workflowPreview.appendChild(wrap);

    const stepsData = [
      { badge: 'Этап 01 · Входящая заявка от клиента', meta: 'Время: ~5 минут', html: `<p>Вы скидываете ссылку на группу ВК или коротко описываете услугу. Никаких длинных брифов.</p><div class="preview-code">Клиент: «Привет! Занимаемся химчисткой мебели. Вот группа ://vk.com, нужен простой сайт с прайсом».</div>` },
      { badge: 'Этап 02 · Сборка бесплатного прототипа', meta: 'Срок: до 24 часов · Оплата: 0 ₽', html: `<p>Я анализирую вашу группу, вытаскиваю фото работ и цены, после чего собираю рабочий макет.</p><div class="preview-code">Результат: рабочая ссылка вида preview-clean21.pages.dev — можно открыть с телефона до оплаты.</div>` },
      { badge: 'Этап 03 · Правки и подключение уведомлений', meta: 'Каналы: ВКонтакте / MAX / E-mail', html: `<p>Меняем тексты или цены по вашим комментариям и привязываем форму к вашему мессенджеру.</p><div class="preview-code">[Новая заявка с сайта] Имя: Дмитрий | Контакт: +7 (905) 123-45-67 | Услуга: Химчистка дивана</div>` },
      { badge: 'Этап 04 · Перенос на домен и расчёт', meta: 'Хостинг: 0 ₽/мес · Гарантия правок: 30 дней', html: `<p>Публикуем готовый проект на облачный хостинг, привязываем домен и только после проверки вы оплачиваете работу.</p><div class="preview-code">Статус: HTTPS подключён · Скорость загрузки: 0.18 сек · Инструкция передана.</div>` }
    ];

    let activeStepIndex = -1;
    let switchTimer = null;
    const renderStep = (index, animate = true) => {
      if (index === activeStepIndex || !stepsData[index]) return;
      activeStepIndex = index;
      workflowCards.forEach((c, i) => c.classList.toggle('active', i === index));
      const applyData = () => {
        previewBadge.textContent = stepsData[index].badge;
        previewMeta.textContent = stepsData[index].meta;
        previewBody.innerHTML = stepsData[index].html;
      };
      if (!animate) { applyData(); return; }
      clearTimeout(switchTimer);
      workflowPreview.classList.add('switching');
      switchTimer = setTimeout(() => { applyData(); workflowPreview.classList.remove('switching'); }, 180);
    };
    workflowCards.forEach((card, idx) => card.addEventListener('click', () => renderStep(idx, true)));
    renderStep(0, false);
  }

  // 9. Плавный FAQ-аккордеон
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  // 10. Toast-уведомления
  function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 11. Умная валидация + отправка в Web3Forms
  const form = document.getElementById('order-form');
  const submitBtn = document.getElementById('submit-btn');
  const nameInput = document.getElementById('user-name');
  const contactInput = document.getElementById('user-contact');
  const commentInput = document.getElementById('user-comment');

  function setFieldError(input, msg) {
    const group = input.closest('.form-group');
    let err = group.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      group.appendChild(err);
    }
    err.textContent = msg;
    group.classList.add('has-error');
    input.classList.add('invalid');
  }

  function clearFieldError(input) {
    const group = input.closest('.form-group');
    if (group) group.classList.remove('has-error');
    input.classList.remove('invalid');
  }

  [nameInput, contactInput].forEach(inp => inp.addEventListener('input', () => clearFieldError(inp)));

  function validateForm() {
    let valid = true;
    if (!/^[а-яА-ЯёЁa-zA-Z\s-]{2,40}$/.test(nameInput.value.trim())) {
      setFieldError(nameInput, 'Введите корректное имя (минимум 2 буквы, без цифр)');
      valid = false;
    }
    const cVal = contactInput.value.trim();
    const digits = cVal.replace(/\D/g, '');
    const isPhone = (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) || (digits.length === 10 && digits.startsWith('9'));
    const isLink = /^(https?:\/\/)?(www\.)?(vk\.com|vk\.ru|max\.ru|t\.me)\/[a-zA-Z0-9_.-]{2,}$/i.test(cVal);
    const isUser = /^@[a-zA-Z0-9_]{3,32}$/.test(cVal);
    if (!isPhone && !isLink && !isUser) {
      setFieldError(contactInput, 'Укажите телефон (+7...) или ссылку вида ://vk.com...');
      valid = false;
    }
    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const lastSent = Number(localStorage.getItem('wc21_last_submit') || 0);
    if (Date.now() - lastSent < 60000) {
      showToast('Заявка уже отправлена. Повторная отправка через 1 минуту.', true);
      return;
    }

    const cleanTags = (s) => s.replace(/[\u003c\u003e]/g, '').trim();
    nameInput.value = cleanTags(nameInput.value);
    contactInput.value = cleanTags(contactInput.value);
    if (commentInput) commentInput.value = cleanTags(commentInput.value);

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);
    payload.botcheck = Boolean(formData.get('botcheck'));

    try {
      const res = await fetch('https://web3forms.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.status === 200 && data.success) {
        localStorage.setItem('wc21_last_submit', String(Date.now()));
        showToast('Заявка успешно отправлена! Скоро свяжусь с вами.');
        form.reset();
        setCustomSelectValue('Сайт-визитка');
        updateTotal();
      } else {
        showToast(data.message || 'Ошибка отправки. Проверьте Access Key.', true);
      }
    } catch (err) {
      showToast('Ошибка сети. Напишите напрямую в ВКонтакте.', true);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});