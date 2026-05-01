// Детектор трансформації архетипу — спрацьовує після завершення рівнів 5-7,
// якщо новий кандидат-архетип "світліший" за поточний підтверджений.
//
// Логіка: «Бачу — ти більше не Жертва. Ти стала Опікуном. Прийняти?»

import { ARCHETYPES } from '../data/archetypes.js';
import { suggestArchetype } from './archetype-suggest.js';

const ELIGIBLE_LEVELS = [5, 6, 7];

export function detectArchetypeTransformation(state) {
  const cal = state.archetypeCalibration;
  if (!cal || cal.status !== 'confirmed' || !cal.confirmed) return null;

  // Знайти найвищий завершений з тригерних рівнів
  const completed = state.completedLevels || [];
  const eligibleLevel = ELIGIBLE_LEVELS
    .filter((n) => completed.includes(n))
    .sort((a, b) => b - a)[0];
  if (!eligibleLevel) return null;

  // Перевірка чи трансформацію вже пропоновано (прийнято або відхилено) після цього рівня
  const trans = state.archetypeTransformations || [];
  const alreadyForLevel = trans.some((t) => t.eligibleLevel === eligibleLevel);
  if (alreadyForLevel) return null;

  const ids = new Set(ARCHETYPES.map((a) => a.id));
  const newCandidateId = suggestArchetype(state, ids);
  if (!newCandidateId || newCandidateId === cal.confirmed) return null;

  const oldArc = ARCHETYPES.find((a) => a.id === cal.confirmed);
  const newArc = ARCHETYPES.find((a) => a.id === newCandidateId);
  if (!oldArc || !newArc) return null;

  // Тільки якщо це "сходинка вгору" — від тіні до світла
  if (!isUpgrade(oldArc, newArc)) return null;

  return { from: oldArc, to: newArc, eligibleLevel };
}

function isUpgrade(oldArc, newArc) {
  const oldPol = oldArc.polarity || '';
  const newPol = newArc.polarity || '';
  if (newPol !== 'light') return false;
  if (oldPol === 'shadow') return true;
  if (oldPol.includes('shadow')) return true;
  if (oldPol === 'light_shadow') return true;
  return false;
}
