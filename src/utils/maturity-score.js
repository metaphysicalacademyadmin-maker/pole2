// Барометр Зрілості (9-й, derived).
// На відміну від 8 «жовтих» барометрів (root..gratitude) які гравець
// двигає прямо відповідями, Зрілість — це похідна метрика з maturity
// matrix: сума depth усіх 35 клітинок (max 35×3 = 105), нормалізована
// у 0..10.
//
// Депти беруться з buildMaturityMatrix(state). Цей util не імпортує
// сам матрицю щоб не тягнути її в lite-build — depth можна порахувати
// з більш простих сигналів.

const MAX_PETALS = 12;
const MAX_LEVELS = 7;
const MAX_PRACTICES = 25;
const MAX_CHANNELS = 11;
const MAX_CUSTOM_ANSWERS = 30;     // 30 «своїх» відповідей вже глибоко
const MAX_QUESTS_COMPLETED = 5;    // 5 виконаних обіцянок — серйозна зрілість

/**
 * Зрілість 0..10 (float). Float щоб barometer-bar мав плавний перехід.
 *
 * Складники (з вагами):
 *   — пелюстки завершені: 0..3
 *   — рівні завершені:    0..2
 *   — практик зроблено:   0..1.5
 *   — каналів пройдено:   0..1.5
 *   — свої відповіді:     0..1
 *   — обіцянки виконані:  0..1
 *
 * Сума × clamp [0..10].
 */
export function computeMaturity(state) {
  if (!state) return 0;

  const petals = Object.values(state.petalProgress || {}).filter((p) => p?.completed).length;
  const levels = (state.completedLevels || []).length;
  const practices = (state.practiceCompletions || []).length;
  const channels = (state.channelsUnlocked || []).length;
  const customAnswers = Object.values(state.cellAnswers || {})
    .filter((a) => a?.customText).length
    + Object.values(state.petalAnswers || {})
    .filter((a) => a?.customText).length;
  const questsDone = (state.questHistory || [])
    .filter((q) => q.status === 'completed').length;

  const score =
    (Math.min(petals, MAX_PETALS) / MAX_PETALS) * 3 +
    (Math.min(levels, MAX_LEVELS) / MAX_LEVELS) * 2 +
    (Math.min(practices, MAX_PRACTICES) / MAX_PRACTICES) * 1.5 +
    (Math.min(channels, MAX_CHANNELS) / MAX_CHANNELS) * 1.5 +
    (Math.min(customAnswers, MAX_CUSTOM_ANSWERS) / MAX_CUSTOM_ANSWERS) * 1 +
    (Math.min(questsDone, MAX_QUESTS_COMPLETED) / MAX_QUESTS_COMPLETED) * 1;

  return Math.max(0, Math.min(10, score));
}

/**
 * Повертає словесну стадію зрілості з барометром 0-10.
 */
export function maturityStage(score) {
  if (score < 1)  return { label: 'насіння',         color: '#a890b0', icon: '·' };
  if (score < 3)  return { label: 'паросток',        color: '#a8c898', icon: '∘' };
  if (score < 5)  return { label: 'стебло',          color: '#9fc8e8', icon: '◌' };
  if (score < 7)  return { label: 'листя',           color: '#c9b3e8', icon: '◇' };
  if (score < 9)  return { label: 'квітування',      color: '#f0c574', icon: '✦' };
  return            { label: 'плід',             color: '#ffe7a8', icon: '✺' };
}
