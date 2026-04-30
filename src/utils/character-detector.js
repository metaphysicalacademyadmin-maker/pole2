// Вирішує коли і кого з персонажів викликати у відповідь на дію гравця.
// Пріоритет: Антип > Арбітр > Кай (тобто провокація важливіша за похвалу).

import { findAntypProvocation } from '../data/antyp.js';
import { findArbiterLine } from '../data/arbiter.js';

// Аналіз поточного state — що відбувається
function analyzeState(state, lastAnswer) {
  const answers = Object.values(state.cellAnswers || {});
  const recentAnswers = answers.slice(-5);

  // Скільки deep підряд без custom
  let deepRun = 0;
  for (let i = recentAnswers.length - 1; i >= 0; i--) {
    if (recentAnswers[i].depth === 'deep' && !recentAnswers[i].customText) {
      deepRun++;
    } else break;
  }

  // Скільки shadow поспіль уникнуто (тобто є shadow option у клітинці але обрано не shadow)
  // Це складніше — для спрощення дивимось на загальний паттерн.
  const shadowCount = answers.filter((a) => a.depth === 'shadow').length;
  const totalAnswers = answers.length;
  const allDeepNoShadow = totalAnswers >= 6 && shadowCount === 0;

  // Скільки custom answers
  const customCount = answers.filter((a) => a.customText).length;

  return {
    deepRun, shadowCount, totalAnswers, customCount, allDeepNoShadow,
    completedLevels: state.completedLevels || [],
    constellations: state.constellations || {},
    activeChannels: state.channelsActive || [],
    keys: state.keys || [],
  };
}

// ───── Головна функція: визначає чи треба показати персонажа ─────
// Повертає {character: 'antyp'|'arbiter', payload: ...} або null
export function detectCharacter(state, event) {
  const seenAntyp = (state.antypAppearances || []).map((a) => a.id);
  const seenArbiter = (state.arbiterAppearances || []).map((a) => a.id);
  const analysis = analyzeState(state, event?.payload);

  // ─── Антип ─── (тригер пріоритетний)

  // 1. Поверхневий патерн (3+ deep підряд без custom)
  if (analysis.deepRun >= 3) {
    const p = findAntypProvocation('safe_pattern', {}, seenAntyp);
    if (p) return { character: 'antyp', payload: p };
  }

  // 2. Уникнення тіні (6+ відповідей без жодної shadow)
  if (analysis.allDeepNoShadow) {
    const p = findAntypProvocation('shadow_avoidance', {}, seenAntyp);
    if (p) return { character: 'antyp', payload: p };
  }

  // 3. Ріст ресурсів без тіні і без власних відповідей
  const totalResources = Object.values(state.resources || {}).reduce((a, b) => a + b, 0);
  if (totalResources >= 15 && analysis.shadowCount === 0 && analysis.customCount === 0) {
    const p = findAntypProvocation('imitating_growth', {}, seenAntyp);
    if (p) return { character: 'antyp', payload: p };
  }

  // 4. Розстановка з далекою мамою / батьком
  for (const lvlN of Object.keys(analysis.constellations)) {
    const c = analysis.constellations[lvlN];
    if (!c.figures || c.resolution) continue;
    const self = c.figures.find((f) => f.type === 'self');
    if (!self) continue;
    for (const ftype of ['mother', 'father']) {
      const fig = c.figures.find((f) => f.type === ftype);
      if (fig) {
        const dx = self.x - fig.x, dy = self.y - fig.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 280) {
          const p = findAntypProvocation('constellation_distance', { figureType: ftype }, seenAntyp);
          if (p) return { character: 'antyp', payload: p };
        }
      }
    }
  }

  // 5. Зібрав 3+ ключі — перевірка чи не духовне втечище
  if (analysis.keys.length >= 3) {
    const p = findAntypProvocation('collected_keys', { value: analysis.keys.length }, seenAntyp);
    if (p) return { character: 'antyp', payload: p };
  }

  // ─── Арбітр ─── (приходить після значущих подій, не для рутини)

  // 1. Custom answer count
  if (event?.type === 'answer' && event.payload?.customText) {
    const line = findArbiterLine('custom_answer_count', { value: analysis.customCount }, seenArbiter);
    if (line) return { character: 'arbiter', payload: line };
  }

  // 2. Constellation resolution
  if (event?.type === 'constellation_done') {
    const line = findArbiterLine('constellation_resolution', {}, seenArbiter);
    if (line) return { character: 'arbiter', payload: line };
  }

  // 3. Антип прийнятий (callback з AntypModal)
  if (event?.type === 'antyp_accepted') {
    const line = findArbiterLine('antyp_accepted', {}, seenArbiter);
    if (line) return { character: 'arbiter', payload: line };
  }

  // 4. Рівень завершено (з claimKey)
  if (event?.type === 'level_complete') {
    const line = findArbiterLine('level_complete', { levelN: event.payload?.levelN }, seenArbiter);
    if (line) return { character: 'arbiter', payload: line };
  }

  // 5. Усі 7 рівнів пройдено
  if (analysis.completedLevels.length === 7) {
    const line = findArbiterLine('all_levels_complete', { value: 7 }, seenArbiter);
    if (line) return { character: 'arbiter', payload: line };
  }

  // 6. Глибокі відповіді
  const deepCount = Object.values(state.cellAnswers || {}).filter((a) => a.depth === 'deep').length;
  if (deepCount >= 5) {
    const line = findArbiterLine('deep_answer_count', { value: deepCount }, seenArbiter);
    if (line) return { character: 'arbiter', payload: line };
  }

  return null;
}
