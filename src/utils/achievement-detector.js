// Детектор досягнень. Викликається при mount Cabinet — повертає список
// ID нових досягнень (тих що дозріли але ще не у state.achievements).

import { ACHIEVEMENTS } from '../data/achievements.js';

export function detectNewAchievements(state) {
  const earned = new Set((state.achievements || []).map((a) => a.id));
  const newlyDone = [];
  for (const ach of ACHIEVEMENTS) {
    if (earned.has(ach.id)) continue;
    try {
      if (ach.when(state)) newlyDone.push(ach.id);
    } catch (_) { /* skip */ }
  }
  return newlyDone;
}

export function getAchievementsState(state) {
  const earned = new Set((state.achievements || []).map((a) => a.id));
  return ACHIEVEMENTS.map((ach) => ({
    ...ach,
    earned: earned.has(ach.id),
    earnedAt: (state.achievements || []).find((a) => a.id === ach.id)?.ts || null,
  }));
}
