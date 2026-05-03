// «Заявка на навчальну групу» — зовнішнє посилання на сторінку академії.
// Можна override через window.__POLE_JOIN_URL__ якщо парент-сторінка
// інжектить інший URL (наприклад, налаштована форма у CMS).

const DEFAULT_URL = 'https://metaphysical-way.academy/join';
const FALLBACK_TELEGRAM = 'https://t.me/dr_Zayats';

export function getJoinUrl() {
  if (typeof window === 'undefined') return DEFAULT_URL;
  return window.__POLE_JOIN_URL__ || DEFAULT_URL;
}

export function getFallbackContact() {
  if (typeof window === 'undefined') return FALLBACK_TELEGRAM;
  return window.__POLE_TELEGRAM_URL__ || FALLBACK_TELEGRAM;
}

// Open у новій вкладці. Безпечно (rel noopener noreferrer).
export function openJoinForm() {
  if (typeof window === 'undefined') return;
  const url = getJoinUrl();
  window.open(url, '_blank', 'noopener,noreferrer');
}
