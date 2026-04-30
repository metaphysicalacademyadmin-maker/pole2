// Детектор архетипів — який архетип «виявився» з останньою дією гравця.
// Викликається у store.recordAnswer та інших ключових мутаціях.

import { ARCHETYPES } from '../data/archetypes.js';

export function detectArchetype(state, event) {
  // event: { type: 'answer'|'practice'|'channel'|'level'|'constellation', payload }
  const triggers = collectTriggers(state, event);

  // Знайти архетипи що відповідають хоча б 1 тригеру
  const matched = ARCHETYPES.filter((a) =>
    a.triggers && a.triggers.some((t) => triggers.has(t))
  );

  // Виключити вже зустрінуті
  const already = new Set((state.archetypesMet || []).map((m) => m.id));
  const fresh = matched.filter((a) => !already.has(a.id));

  return fresh[0] || null;     // повертаємо лише ОДИН за раз
}

function collectTriggers(state, event) {
  const triggers = new Set();

  // Поточний event
  if (event.type === 'answer') {
    const p = event.payload;
    if (p.depth === 'shadow' && p.shadow) triggers.add(`shadow_${p.shadow}`);
    if (p.customText) triggers.add('custom_answer_given');
  }

  // Практики
  for (const pc of state.practiceCompletions || []) {
    if (pc.id === 'no_practice') triggers.add('no_practice_done');
    if (['heart_hands', 'butterfly', 'forgiveness'].includes(pc.id)) triggers.add('heart_practice_done');
    if (pc.id === 'gratitude_naming') triggers.add('gratitude_naming_done');
    if (pc.id === 'forgiveness') triggers.add('forgiveness_given');
  }

  // Resources thresholds
  const r = state.resources || {};
  if ((r.will || 0) >= 8) triggers.add('will_resource_high');
  if ((r.love || 0) >= 8) triggers.add('love_resource_high');
  if ((r.flow || 0) >= 8) triggers.add('flow_resource_high');
  if ((r.voice || 0) >= 8) triggers.add('voice_resource_high');
  if ((r.clarity || 0) >= 8) triggers.add('clarity_resource_high');

  // Levels
  for (const n of state.completedLevels || []) {
    triggers.add(`level_${n}_complete`);
  }
  if ((state.completedLevels || []).length === 7) triggers.add('all_keys_collected');

  // Розстановка з виключеним
  for (const c of Object.values(state.constellations || {})) {
    if (c.figures?.some((f) => f.type === 'excluded')) triggers.add('excluded_in_constellation');
    if (c.resolution) triggers.add('constellation_resolution_done');
    // Перевірка mother_far
    const self = c.figures?.find((f) => f.type === 'self');
    const mother = c.figures?.find((f) => f.type === 'mother');
    if (self && mother) {
      const dx = self.x - mother.x, dy = self.y - mother.y;
      if (Math.sqrt(dx*dx + dy*dy) > 280) triggers.add('mother_far');
    }
  }

  // Тінь — 3+ shadow відповідей
  const shadowCount = Object.values(state.cellAnswers || {})
    .filter((a) => a.depth === 'shadow').length;
  if (shadowCount >= 3) triggers.add('shadow_caught_3times');

  // Канали
  if ((state.channelsUnlocked || []).length > 0) triggers.add('channel_unlocked');

  return triggers;
}
