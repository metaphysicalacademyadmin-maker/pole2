// Партнерство: код-генератор і псевдо-партнер з хешу.
// Без бекенду — створює відчуття пари через детермінований хеш.

import { PSEUDO_NAMES, PSEUDO_CITIES, RESONANCE_MESSAGES } from '../data/social.js';
import { ARCHETYPES } from '../data/archetypes.js';

const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // без 0/O/1/I — щоб не плутати

function hashStr(s) {
  let h = 0;
  for (const c of s || '') h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

// Генерує 6-символьний код у форматі XXX-XXX з seed
export function generateCode(seed) {
  const h = hashStr(seed);
  let chars = '';
  let n = h;
  for (let i = 0; i < 6; i++) {
    chars += ALPHA[n % ALPHA.length];
    n = Math.floor(n / ALPHA.length) + (i + 1) * 17;
  }
  return `${chars.slice(0, 3)}-${chars.slice(3)}`;
}

// Нормалізація — приймає в любому регістрі та форматі
export function normalizeCode(input) {
  const stripped = (input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (stripped.length !== 6) return null;
  // Перевірка валідних символів
  for (const c of stripped) if (!ALPHA.includes(c)) return null;
  return `${stripped.slice(0, 3)}-${stripped.slice(3)}`;
}

// З коду → псевдо-партнер (стабільно)
export function partnerFromCode(code) {
  const h = hashStr(code);
  const name = PSEUDO_NAMES[h % PSEUDO_NAMES.length];
  const city = PSEUDO_CITIES[Math.floor(h / 13) % PSEUDO_CITIES.length];
  const age = 22 + (h % 33);
  const archetype = ARCHETYPES[Math.floor(h / 7) % ARCHETYPES.length];
  // Псевдо-намір
  const INTENTIONS = [
    'знайти своє коріння',
    'звільнити серце',
    'почути свій голос',
    'пробачити',
    'жити своє життя',
    'довіритись потоку',
    'бачити ясно',
    'служити з любов\'ю',
  ];
  const intention = INTENTIONS[h % INTENTIONS.length];
  return { name, city, age, archetype, intention };
}

// Псевдо-відповідь партнера на спільне питання — з хешу коду + qId
export function partnerAnswerFor(code, questionId, barometer = 'love') {
  const seed = `${code}-${questionId}`;
  const h = hashStr(seed);
  const pool = RESONANCE_MESSAGES[barometer] || RESONANCE_MESSAGES.love;
  return pool[h % pool.length];
}
