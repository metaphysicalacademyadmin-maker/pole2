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

export function getCellsForLevel(levelN, pathMode, state) {
  const all = CELLS_BY_LEVEL[levelN] || [];
  const maxPriority = !pathMode || !PATH_MODES[pathMode] ? 1
    : pathMode === 'touch' ? 1 : pathMode === 'path' ? 2 : 3;
  const main = all.filter((c) => c.priority <= maxPriority);
  const conditional = all
    .filter((c) => c.priority >= 4 && c.unlock)
    .filter((c) => isUnlocked(c, state));
  return [...main, ...conditional];
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
