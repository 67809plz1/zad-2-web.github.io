const STORAGE_KEY = 'currencyDashboardConfig';

// Поддерживаемые валютные пары
const SUPPORTED_PAIRS = ['USD', 'EUR', 'GBP', 'JPY'];

// Загрузка конфигурации из localStorage
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Сохранение конфигурации в localStorage
function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}