import level1 from './level1.js';
import level2 from './level2.js';
import level3 from './level3.js';
import level4 from './level4.js';
import level5 from './level5.js';
import level6 from './level6.js';
import level7 from './level7.js';
import { PATH_MODES } from '../pathmodes.js';

// CELLS_BY_LEVEL[n] — масив усіх клітинок рівня n (priority 1-3).
// Реальний список для гравця залежить від обраного pathMode і визначається getCellsForLevel.
export const CELLS_BY_LEVEL = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
  6: level6,
  7: level7,
};

/**
 * Повертає клітинки рівня, відфільтровані під обраний шлях:
 *   touch → priority 1 (4-6 клітинок)
 *   path  → priority 1, 2 (~6-10 клітинок)
 *   depth → priority 1, 2, 3 (всі)
 */
export function getCellsForLevel(levelN, pathMode) {
  const all = CELLS_BY_LEVEL[levelN] || [];
  if (!pathMode || !PATH_MODES[pathMode]) return all.filter((c) => c.priority === 1);
  const maxPriority = pathMode === 'touch' ? 1 : pathMode === 'path' ? 2 : 3;
  return all.filter((c) => c.priority <= maxPriority);
}
