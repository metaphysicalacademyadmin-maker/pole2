// Захист від пошкодженого / старого state (наприклад з оригінального HTML-ПОЛЯ).
// Якщо state інконсистентний — нормалізуємо до safe-defaults.

const KNOWN_PATH_MODES = new Set(['touch', 'path', 'depth']);
const VALID_BAROMETERS = ['root', 'flow', 'will', 'love', 'voice', 'clarity', 'light', 'gratitude'];
const VALID_SCALES = ['energy', 'wound', 'bondage', 'clarity', 'protection'];

/**
 * sanitize(state) — повертає нормалізований state. Чистить:
 *  - чужі поля з оригінальної гри (currentCell, petalProgress, тощо)
 *  - неконсистентні комбінації (intention є, але pathMode нема → reset)
 *  - неправильні типи / out-of-range числа
 *  - відсутні обов'язкові поля resources/stateScales
 */
export function sanitizeState(s, defaults) {
  if (!s || typeof s !== 'object') return null;

  // 1. Якщо немає валідного pathMode — зкидаємо intention/progress.
  //    Це обробляє «успадкований state» з HTML-ПОЛЯ де pathMode не було.
  if (!KNOWN_PATH_MODES.has(s.pathMode)) {
    s.pathMode = null;
    s.intention = '';
    s.currentLevel = 0;
    s.currentCellIdx = 0;
  }

  // 2. Якщо pathMode є але intention нема — гравець на Entry, currentLevel<=0.
  if (s.pathMode && (!s.intention || typeof s.intention !== 'string')) {
    s.intention = '';
    if (typeof s.currentLevel !== 'number' || s.currentLevel < 0) s.currentLevel = 0;
  }

  // 3. Currentlevel в межах 0..8 (8 = фінал).
  if (typeof s.currentLevel !== 'number' || s.currentLevel < 0) s.currentLevel = 0;
  if (s.currentLevel > 8) s.currentLevel = 8;

  // 4. currentCellIdx — невід'ємне ціле.
  if (typeof s.currentCellIdx !== 'number' || s.currentCellIdx < 0) s.currentCellIdx = 0;

  // 5. Масиви — гарантовано масиви.
  for (const k of ['unlockedLevels', 'completedLevels', 'journal', 'visited', 'keys',
                    'archetypesMet', 'unlockedAbilities', 'completedInitiations']) {
    if (!Array.isArray(s[k])) s[k] = [...(defaults[k] || [])];
  }

  // 6. Об'єкти — гарантовано об'єкти.
  for (const k of ['levelKeys', 'levelProgress', 'cellAnswers']) {
    if (!s[k] || typeof s[k] !== 'object') s[k] = {};
  }

  // 7. Resources — всі 8 барометрів, числа.
  if (!s.resources || typeof s.resources !== 'object') s.resources = {};
  for (const key of VALID_BAROMETERS) {
    if (typeof s.resources[key] !== 'number') s.resources[key] = 0;
  }

  // 8. State scales — всі 5 шкал, числа в межах -2..2.
  if (!s.stateScales || typeof s.stateScales !== 'object') s.stateScales = {};
  for (const key of VALID_SCALES) {
    const v = s.stateScales[key];
    if (typeof v !== 'number') s.stateScales[key] = 0;
    else if (v < -2) s.stateScales[key] = -2;
    else if (v > 2) s.stateScales[key] = 2;
  }

  // 9. Видаляємо чужі поля з оригінальної HTML-гри (вони непотрібні і
  //    лише засмічують fullSnapshot на бекенді).
  const ALLOWED_KEYS = new Set([
    ...Object.keys(defaults),
    'savedAt', 'startedAt', 'sessionId', // identity завжди дозволено
  ]);
  for (const k of Object.keys(s)) {
    if (!ALLOWED_KEYS.has(k)) delete s[k];
  }

  return s;
}
