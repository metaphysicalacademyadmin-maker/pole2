import level1 from './level1.js';
import level2 from './level2.js';
import level3 from './level3.js';
import level4 from './level4.js';
import level5 from './level5.js';
import level6 from './level6.js';
import level7 from './level7.js';
import { PATH_MODES } from '../pathmodes.js';

// CELLS_BY_LEVEL[n] — масив усіх клітинок рівня n.
//   priority 1-3 — стандартні (фільтруються за pathMode)
//   priority 4 (kind:'snake') — тіньові, доступні коли барометр у мінусі
//   priority 5 (kind:'awakening') — інсайт-клітинки, доступні коли барометр високий
export const CELLS_BY_LEVEL = {
  1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7,
};

// Treck → базовий maxPriority (глибина клітинок).
//   1 — лише найважливіші питання (поверхневий вхід)
//   2 — основні + глибші
//   3 — усі стандартні
const TRACK_MAX_PRIORITY = {
  // Нові 5 треків
  root:     1,         // Корінь — м'який вхід, тільки priority 1
  heart:    2,         // Серце — глибше, priority 1+2
  voice:    2,         // Голос — те саме
  shadow:   3,         // Тінь — все включно, готовий до глибокого
  initiate: 3,         // Ініціат — повне занурення
  // Legacy compatibility (для гравців із старим pathMode у localStorage)
  touch:    1,
  path:     2,
  depth:    3,
};

export function getCellsForLevel(levelN, pathMode, state) {
  const all = CELLS_BY_LEVEL[levelN] || [];
  const mode = PATH_MODES[pathMode];

  // Базовий поріг за треком
  const baseMax = TRACK_MAX_PRIORITY[pathMode] ?? 1;

  // Boost: на focus-чакрах треку даємо +1 priority (глибше у фокус-зоні)
  const isFocusLevel = !!mode?.focusChakras?.includes(levelN);
  const maxPriority = isFocusLevel ? Math.min(3, baseMax + 1) : baseMax;

  const main = all.filter((c) => c.priority <= maxPriority);

  // Якщо трек НЕ активує тінь (root) — приховуємо shadow-опції у options
  const filtered = (mode?.shadowsActive === false)
    ? main.map((cell) => ({
        ...cell,
        options: Array.isArray(cell.options)
          ? cell.options.filter((o) => o.depth !== 'shadow')
          : cell.options,
      }))
    : main;

  // Снейк- і awakening-клітинки відкриваються через resource thresholds
  const conditional = all
    .filter((c) => c.priority >= 4 && c.unlock)
    .filter((c) => isUnlocked(c, state));

  return [...filtered, ...conditional];
}

// Кількість заблокованих умовних клітинок на цьому рівні (для UI-індикатора)
export function getLockedCellsForLevel(levelN, state) {
  const all = CELLS_BY_LEVEL[levelN] || [];
  return all
    .filter((c) => c.priority >= 4 && c.unlock)
    .filter((c) => !isUnlocked(c, state))
    .map((c) => ({ id: c.id, kind: c.kind, unlock: c.unlock, hint: lockHint(c) }));
}

function isUnlocked(cell, state) {
  if (!state || !cell.unlock) return false;
  const r = state.resources || {};
  const u = cell.unlock;
  if (u.resource && typeof u.max === 'number') {
    return (r[u.resource] || 0) <= u.max;
  }
  if (u.resource && typeof u.min === 'number') {
    return (r[u.resource] || 0) >= u.min;
  }
  return false;
}

function lockHint(cell) {
  const u = cell.unlock || {};
  if (!u.resource) return 'умова не визначена';
  if (typeof u.max === 'number') {
    return `відкриється коли ${u.resource} ≤ ${u.max} (тіньова робота)`;
  }
  if (typeof u.min === 'number') {
    return `відкриється коли ${u.resource} ≥ ${u.min} (зміцнення)`;
  }
  return '';
}
