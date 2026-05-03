// Поле — присутність інших гравців.
//
// За замовчуванням повертає ПСЕВДО-presence (детерміновано з поточної години),
// щоб дати відчуття «ти не сам» без серверу.
//
// Якщо metaphysical-way.academy парент-вікно інжектить реальні цифри
// у `window.__POLE_PRESENCE__`, ми використовуємо їх.
//
// Очікуваний формат real-payload (для майбутнього бекенду):
//   { total: 24, byLevel: [3, 4, 6, 5, 3, 2, 1], updatedAt: 1731234567890 }
//   де byLevel — масив довжиною 7 (індекс 0 = рівень 1 ... індекс 6 = рівень 7).

const HOUR_MS = 3_600_000;
const LEVELS = 7;

function hashStr(s) {
  let h = 0;
  for (const c of s || '') h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

// Детерміноване ціле у [min, max] з seed.
function intBetween(seed, min, max) {
  return min + (seed % (max - min + 1));
}

function pseudoPresenceForHour(hourBucket) {
  const seed = hashStr(`pole-presence-${hourBucket}`);
  // Total — від 8 до 42, з нахилом до середнього (25-30).
  const total = intBetween(seed, 8, 42);

  // Розподіл по 7 рівнях — bell-curve з центром на 3-4 (серце-горло),
  // бо більшість гравців затримуються на середині.
  const weights = [0.10, 0.13, 0.17, 0.20, 0.18, 0.13, 0.09];
  // Невелика варіація розподілу від seed
  const variants = weights.map((w, i) => {
    const noise = ((seed >> (i * 3)) & 0xf) / 60; // 0..0.25
    return Math.max(0.04, w + noise - 0.06);
  });
  const sumW = variants.reduce((a, b) => a + b, 0);
  const byLevel = variants.map((v) => Math.round((v / sumW) * total));

  // Підгон щоб сума == total (через округлення може відхилитись на ±2)
  let diff = total - byLevel.reduce((a, b) => a + b, 0);
  let i = 3; // починаємо з центру
  while (diff !== 0) {
    byLevel[i] = Math.max(0, byLevel[i] + Math.sign(diff));
    diff -= Math.sign(diff);
    i = (i + 1) % LEVELS;
  }

  return { total, byLevel, updatedAt: hourBucket * HOUR_MS, source: 'pseudo' };
}

export function getFieldPresence() {
  if (typeof window !== 'undefined' && window.__POLE_PRESENCE__) {
    const real = window.__POLE_PRESENCE__;
    if (Array.isArray(real.byLevel) && real.byLevel.length === LEVELS) {
      return { ...real, source: 'real' };
    }
  }
  const hourBucket = Math.floor(Date.now() / HOUR_MS);
  return pseudoPresenceForHour(hourBucket);
}

// Скільки людей на тому ж рівні що й гравець (без нього самого).
export function peersAtLevel(presence, currentLevel) {
  if (!presence?.byLevel || currentLevel < 1 || currentLevel > LEVELS) return 0;
  return Math.max(0, presence.byLevel[currentLevel - 1] - 1);
}

// Час до наступного оновлення (мс) — для UI «оновиться через ~12 хв»
export function msUntilNextRefresh() {
  return HOUR_MS - (Date.now() % HOUR_MS);
}

// Скільки людей зараз у пелюстках (12 спіраль).
// Якщо парент дав petalsActive — використовуємо. Інакше — ~25-35% від total.
export function peersInPetals(presence) {
  if (!presence) return 0;
  if (typeof presence.petalsActive === 'number') return presence.petalsActive;
  const seed = hashStr(`petals-${Math.floor((presence.updatedAt || Date.now()) / HOUR_MS)}`);
  const pct = 0.25 + ((seed % 100) / 1000);   // 0.25..0.35
  return Math.round(presence.total * pct);
}
