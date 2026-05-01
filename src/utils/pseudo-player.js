// Генератор псевдо-гравців для Резонансних Дзеркал.
// Детермінований — однакові seed дадуть однакового "гравця" (стабільність).

import { PSEUDO_NAMES, PSEUDO_CITIES, RESONANCE_MESSAGES } from '../data/social.js';

function hashStr(s) {
  let h = 0;
  for (const c of s || '') h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function pickPseudoPlayer(seed) {
  const h = hashStr(seed);
  const name = PSEUDO_NAMES[h % PSEUDO_NAMES.length];
  const city = PSEUDO_CITIES[Math.floor(h / 17) % PSEUDO_CITIES.length];
  const age = 20 + (h % 35);
  return { id: `pp-${h}`, name, city, age };
}

export function pickResonanceMessage(barometer, seed) {
  const pool = RESONANCE_MESSAGES[barometer] || RESONANCE_MESSAGES.light;
  const h = hashStr(seed);
  return pool[h % pool.length];
}

// "1247 людей зараз у тиші" — псевдо-лічильник колективного ритуалу.
// Стабільне число для поточного дня + фази місяця.
export function collectiveCount(dateKey, phase) {
  const seed = `${dateKey}-${phase}`;
  const h = hashStr(seed);
  // 800-2400 людей — реалістичний діапазон
  return 800 + (h % 1600);
}
