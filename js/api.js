// Загрузка данных курса валют для виджета
async function loadCurrencyData(widget) {
  const pair = widget.dataset.pair;
  const content = widget.querySelector('.widget-content');
  content.innerHTML = `<div class="loader"></div>`;

  try {
    // Используем ЦБ РФ API для получения курсов валют
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    if (!response.ok) throw new Error('Ошибка сети');
    
    const data = await response.json();
    
    if (!data.Valute || !data.Valute[pair]) {
      throw new Error(`Нет данных для валюты ${pair}`);
    }

    const currency = data.Valute[pair];
    const rate = currency.Value;
    const previousRate = currency.Previous;
    
    const changePercent = ((rate - previousRate) / previousRate) * 100;

    content.innerHTML = `
      <div class="currency-rate">${rate.toFixed(2)} ₽</div>
      <div class="currency-change ${changePercent >= 0 ? 'positive' : 'negative'}">
        ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%
      </div>
      <div class="currency-date">${new Date().toLocaleDateString('ru-RU')}</div>
    `;
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
    content.innerHTML = `
      <div class="error-message">Ошибка загрузки</div>
      <button class="error-retry-btn">Повторить</button>
    `;
    content.querySelector('.error-retry-btn').addEventListener('click', () => {
      loadCurrencyData(widget);
    });
  }
}