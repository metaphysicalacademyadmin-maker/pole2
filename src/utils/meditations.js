// Медитації — завантажуються з metaphysical-way.academy через window-injection.
//
// Контракт парент-сторінки (metaphysical-way2):
//
//   window.__POLE_MEDITATIONS__ = [
//     {
//       id: 'med_grounding_8min',
//       title: 'Заземлення',
//       description: 'Базова практика повернення у тіло',
//       durationSec: 480,
//       category: 'root',                 // root|flow|will|heart|voice|clarity|light
//       audioUrl: 'https://academy.../grounding.mp3',
//       coverUrl: 'https://academy.../grounding.jpg',   // опційно
//       teacher: 'Заєць',                                 // опційно
//       transcript: '...',                                // опційно
//     },
//     ...
//   ];
//
//   window.__POLE_MEDITATIONS_API__ = {
//     trackComplete: async ({ id, durationSec, ts }) => {...}, // опційно
//     trackStart: async ({ id, ts }) => {...},                  // опційно
//   };

const CATEGORY_META = {
  root:    { label: 'Корінь',    icon: '🌍', color: '#a8c898' },
  flow:    { label: 'Потік',     icon: '🌊', color: '#9fc8e8' },
  will:    { label: 'Воля',      icon: '🔥', color: '#f5b870' },
  heart:   { label: 'Серце',     icon: '💗', color: '#f0a8b8' },
  voice:   { label: 'Голос',     icon: '🗣',  color: '#9fc8e8' },
  clarity: { label: 'Видіння',   icon: '👁',  color: '#c9b3e8' },
  light:   { label: 'Джерело',   icon: '✨', color: '#ffe7a8' },
  general: { label: 'Загальна',  icon: '◯',  color: '#e0d4c0' },
};

export function getMeditations() {
  if (typeof window === 'undefined') return null;
  const list = window.__POLE_MEDITATIONS__;
  if (!Array.isArray(list)) return null;
  return list.filter((m) => m && m.id && m.title && m.audioUrl);
}

export function categoryMeta(cat) {
  return CATEGORY_META[cat] || CATEGORY_META.general;
}

export function formatDuration(sec) {
  if (!sec) return '';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return s > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${m} хв`;
}

export async function trackMeditationStart(id) {
  if (typeof window === 'undefined') return;
  const api = window.__POLE_MEDITATIONS_API__;
  if (api?.trackStart) {
    try { await api.trackStart({ id, ts: Date.now() }); } catch (_) {}
  }
}

export async function trackMeditationComplete(id, durationSec) {
  if (typeof window === 'undefined') return;
  const api = window.__POLE_MEDITATIONS_API__;
  if (api?.trackComplete) {
    try { await api.trackComplete({ id, durationSec, ts: Date.now() }); } catch (_) {}
  }
}
