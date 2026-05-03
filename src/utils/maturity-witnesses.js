// Генератор свідчень для Матриці Зрілості 7×5.
//
// Матриця: 7 чакр × 5 граней (Опора · Потік · Воля · Любов · Знання).
// У кожній клітинці — коротке свідчення (5-15 слів) про стан гравця
// у цьому перетині, генероване з його стану гри:
//   • levelKeys (7 слів-ключів)
//   • cellAnswers (custom + готові відповіді)
//   • petalProgress (12 пелюсток)
//   • practiceCompletions
//
// Це НЕ оцінка і НЕ рейтинг. Це дзеркало — що проявилось у тобі.

export const FACETS = [
  { id: 'opora',   label: 'Опора',   icon: '⏚', color: '#a8c898' },
  { id: 'potik',   label: 'Потік',   icon: '〜', color: '#9fc8e8' },
  { id: 'volya',   label: 'Воля',    icon: '△', color: '#f5b870' },
  { id: 'lyubov',  label: 'Любов',   icon: '♡', color: '#f0a8b8' },
  { id: 'znannya', label: 'Знання',  icon: '◌', color: '#c9b3e8' },
];

// Чакра-id → номер рівня (1..7)
export const CHAKRA_LEVELS = [
  { n: 1, id: 'muladhara',    name: 'Корінь',     primary: 'opora' },
  { n: 2, id: 'svadhisthana', name: 'Потік',      primary: 'potik' },
  { n: 3, id: 'manipura',     name: 'Воля',       primary: 'volya' },
  { n: 4, id: 'anahata',      name: 'Серце',      primary: 'lyubov' },
  { n: 5, id: 'vishuddha',    name: 'Голос',      primary: 'volya' },
  { n: 6, id: 'ajna',         name: 'Видіння',    primary: 'znannya' },
  { n: 7, id: 'sahasrara',    name: 'Джерело',    primary: 'znannya' },
];

// Pelyustok мапиться у грань (для розширення свідчень)
const PETAL_FACET_MAP = {
  i_self:          ['opora'],
  ii_body:         ['potik', 'opora'],
  iii_rod:         ['opora'],
  iv_home:         ['opora'],
  v_relations:     ['lyubov'],
  vi_creativity:   ['potik'],
  vii_realization: ['volya'],
  viii_spirit:     ['znannya'],
  ix_knowledge:    ['znannya'],
  x_purpose:       ['volya'],
  xi_shadow:       ['znannya', 'lyubov'],
  ix_unity:        ['znannya', 'lyubov'],
};

// Базові свідчення-шаблони для кожного перетину (fallback коли мало даних).
// Не використовуються автоматично — лише як прикраса/підказка.
const TEMPLATES = {
  '1-opora':    'У тілі є дім.',
  '2-potik':    'Дозволяю собі відчувати.',
  '3-volya':    'Кажу «ні» без виправдань.',
  '4-lyubov':   'Люблю без шантажу.',
  '5-volya':    'Слово несе мою правду.',
  '5-lyubov':   'Голос не воює.',
  '6-znannya':  'Бачу істину, не зручність.',
  '7-znannya':  'Я є — без додавань.',
  '7-lyubov':   'Здаюсь у довіру.',
};

/**
 * Створити матрицю 7×5 свідчень для гравця.
 * Повертає масив масивів: rows[chakraIdx][facetIdx] = { text, depth, hint }.
 *   - text: свідчення (string, max 60 символів)
 *   - depth: 0 (порожньо) | 1 (базове) | 2 (підтверджене) | 3 (поглиблене)
 *   - hint: який джерело використано
 */
export function buildMaturityMatrix(state) {
  const levelKeys = state?.levelKeys || {};
  const completedLevels = new Set(state?.completedLevels || []);
  const petalProgress = state?.petalProgress || {};
  const practiceCompletions = state?.practiceCompletions || [];
  const cellAnswers = state?.cellAnswers || {};

  // Лічимо практики/відповіді per чакра
  const chakraDepth = {};        // chakraN → загальна глибина (0..N)
  for (const c of Object.values(cellAnswers)) {
    if (!c.cellId) continue;
  }

  return CHAKRA_LEVELS.map((chakra) => {
    return FACETS.map((facet) => {
      return witnessFor(chakra, facet, {
        levelKeys, completedLevels, petalProgress, practiceCompletions, cellAnswers,
      });
    });
  });
}

function witnessFor(chakra, facet, ctx) {
  const isPrimary = facet.id === chakra.primary;
  const isLevelComplete = ctx.completedLevels.has(chakra.n);
  const levelKey = ctx.levelKeys[chakra.n];

  // 1. Якщо рівень завершено і це primary грань — використати ключ
  if (isLevelComplete && isPrimary && levelKey) {
    return { text: `«${trim(levelKey, 50)}»`, depth: 3, hint: 'level-key' };
  }

  // 2. Якщо рівень завершено, але грань не primary — м'яке свідчення
  if (isLevelComplete && isPrimary) {
    return { text: TEMPLATES[`${chakra.n}-${facet.id}`] || '✓ пройдено', depth: 2, hint: 'level-done' };
  }

  // 3. Дивимось на пелюстки що відповідають цій грані
  const matchingPetals = Object.keys(PETAL_FACET_MAP)
    .filter((id) => PETAL_FACET_MAP[id].includes(facet.id) && ctx.petalProgress[id]?.completed);
  if (isPrimary && matchingPetals.length > 0) {
    return {
      text: TEMPLATES[`${chakra.n}-${facet.id}`] || `✦ ${matchingPetals.length} пелюст. розкрито`,
      depth: 2,
      hint: 'petals',
    };
  }

  // 4. Практики на рівні цієї чакри
  const chakraPractices = ctx.practiceCompletions.filter((p) => p.levelN === chakra.n);
  if (isPrimary && chakraPractices.length >= 3) {
    return {
      text: TEMPLATES[`${chakra.n}-${facet.id}`] || 'тіло знає шлях',
      depth: 1,
      hint: 'practices',
    };
  }

  // 5. Будь-які custom-answers на цьому рівні
  const customsOnLevel = Object.values(ctx.cellAnswers).filter(
    (a) => a.customText && a.cellId?.startsWith(`r${chakra.n}`),
  );
  if (isPrimary && customsOnLevel.length >= 2) {
    return { text: 'своїми словами — починається', depth: 1, hint: 'customs' };
  }

  // 6. Шаблон для primary без даних — як підказка чого досягати
  if (isPrimary && TEMPLATES[`${chakra.n}-${facet.id}`]) {
    return { text: TEMPLATES[`${chakra.n}-${facet.id}`], depth: 0, hint: 'template' };
  }

  // 7. Empty
  return { text: '—', depth: 0, hint: 'empty' };
}

function trim(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

// Sumарна "зрілість" — для одного числа на показ.
export function maturityScore(matrix) {
  let total = 0;
  let max = 0;
  for (const row of matrix) {
    for (const cell of row) {
      total += cell.depth;
      max += 3;
    }
  }
  return { total, max, ratio: max > 0 ? total / max : 0 };
}
