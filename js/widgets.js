const dashboardGrid = document.getElementById('dashboard-grid');
const availableList = document.getElementById('available-list');

// Создание DOM-элемента виджета
function createWidget(pair) {
  const widget = document.createElement('div');
  widget.className = 'widget';
  widget.setAttribute('draggable', 'true');
  widget.dataset.pair = pair;

  widget.innerHTML = `
    <div class="widget-header">
      <div class="widget-title">${pair} / RUB</div>
      <div class="widget-buttons">
        <button class="refresh-btn" title="Обновить">↻</button>
        <button class="remove-btn" title="Удалить">×</button>
      </div>
    </div>
    <div class="widget-content">
      <div class="loader"></div>
    </div>
  `;

  // Обработчики кнопок
  widget.querySelector('.refresh-btn').addEventListener('click', () => {
    loadCurrencyData(widget);
  });

  widget.querySelector('.remove-btn').addEventListener('click', () => {
    removeWidget(widget);
  });

  // Drag & Drop обработчики
  widget.addEventListener('dragstart', dragStart);
  widget.addEventListener('dragend', dragEnd);

  return widget;
}

// Добавить виджет в дашборд
function addWidget(pair) {
  // Проверяем, что виджет с такой парой еще не добавлен
  const existingWidgets = [...dashboardGrid.querySelectorAll('.widget')];
  if (existingWidgets.some(w => w.dataset.pair === pair)) {
    alert(`Виджет для ${pair} / RUB уже добавлен.`);
    return;
  }

  const widget = createWidget(pair);
  dashboardGrid.appendChild(widget);
  saveCurrentConfig();
  loadCurrencyData(widget);
}

// Удалить виджет
function removeWidget(widget) {
  widget.remove();
  saveCurrentConfig();
}

// Сохранить текущий порядок и пары виджетов
function saveCurrentConfig() {
  const widgets = [...dashboardGrid.querySelectorAll('.widget')];
  const config = widgets.map(w => w.dataset.pair);
  saveConfig(config);
}

// Восстановить виджеты из localStorage
function restoreWidgets() {
  const config = loadConfig();
  config.forEach(pair => {
    if (SUPPORTED_PAIRS.includes(pair)) {
      const widget = createWidget(pair);
      dashboardGrid.appendChild(widget);
      loadCurrencyData(widget);
    }
  });
}

// Обработчик добавления виджета из списка
availableList.addEventListener('click', e => {
  if (e.target.classList.contains('add-widget-btn')) {
    const pair = e.target.dataset.pair;
    addWidget(pair);
  }
});