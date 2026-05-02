// Доступ до режимів гри. За замовчуванням — лише free (Дотик).
//
// Парент-вікно (metaphysical-way.academy) інжектить розширений доступ
// у `window.__POLE_ENTITLEMENTS__`, наприклад:
//   { tiers: ['free', 'standard'], premium: true, source: 'subscription' }
//
// Поки бекенд оплат не підключено — повертаємо UNLOCKED для всього,
// щоб гравець міг тестувати усі режими (preview-mode).

const PREVIEW_ALL = true;  // ⚠ змінити на false коли paywall активується

export function getEntitlements() {
  if (typeof window !== 'undefined' && window.__POLE_ENTITLEMENTS__) {
    return window.__POLE_ENTITLEMENTS__;
  }
  if (PREVIEW_ALL) {
    return { tiers: ['free', 'standard', 'deep'], premium: true, source: 'preview' };
  }
  return { tiers: ['free'], premium: false, source: 'default' };
}

export function isTierUnlocked(tier) {
  const ent = getEntitlements();
  return (ent.tiers || []).includes(tier);
}

// Текстова мітка під назвою режиму:
//   free       → 'безкоштовно'
//   unlocked   → 'доступно' (платний, але куплений)
//   locked     → 'преміум' (платний, ще не куплений)
export function tierStatus(mode) {
  if (mode.tier === 'free') return { kind: 'free', label: 'безкоштовно' };
  if (isTierUnlocked(mode.tier)) return { kind: 'unlocked', label: 'доступно' };
  return { kind: 'locked', label: mode.tierLabel || 'преміум' };
}
