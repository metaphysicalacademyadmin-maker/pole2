// Спільні утиліти для контенту каналів — стадії проходження каналу
// слідують канонічній структурі з §14.3 концепту:
//   1-3  → theory      (теорія)
//   4-6  → practice    (перші активації)
//   7-9  → self_work   (робота на собі)
//   10-11 → others     (робота з іншими)
//   12   → certification (звіт + сертифікат)

export const STAGES = {
  theory:        { label: 'теорія',         color: '#9fc8e8' },
  practice:      { label: 'практика',       color: '#a8c898' },
  self_work:     { label: 'на собі',        color: '#f0c574' },
  others:        { label: 'на інших',       color: '#f0a8b8' },
  certification: { label: 'сертифікація',   color: '#ffe7a8' },
};

export function stageOf(cellIdx) {
  if (cellIdx < 3) return 'theory';
  if (cellIdx < 6) return 'practice';
  if (cellIdx < 9) return 'self_work';
  if (cellIdx < 11) return 'others';
  return 'certification';
}
