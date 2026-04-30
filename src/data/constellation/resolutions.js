// Resolution sentences — Хеллінгер-фрази що гравець вимовляє наприкінці.
// Текст збирається з 3-х частин: визнання, місце, передача.
//
// Адаптується під присутність фігур у полі.

import { distance } from './readings.js';

const ACK_FATHER = [
  'Тату, я визнаю тебе таким, який ти є.',
  'Тату, я бачу тебе. Ти більший за мене — це правильно.',
  'Тату, я приймаю усе що ти зміг дати. Цього достатньо.',
];
const ACK_MOTHER = [
  'Мамо, я визнаю тебе. Я ношу тебе у серці.',
  'Мамо, дякую за життя. Це найбільший дар.',
  'Мамо, я приймаю свою матір такою, якою ти є.',
];
const ACK_EXCLUDED = [
  'Я бачу тебе, забутий. Ти належиш до нашого роду — нарівні з усіма.',
  'Тобі є місце у мене. У моїй пам\'яті ти є.',
];
const ACK_EARLY_DEAD = [
  'Ти, хто пішов рано — я благословляю твій спокій.',
  'Я несу твоє ім\'я з повагою. Я живу — за нас обох.',
];
const PLACE = [
  'Я беру своє місце як дитина у роді.',
  'Я малий, ви великі. Це порядок.',
  'Я приймаю своє життя як ваш дар.',
];
const RELEASE = [
  'Я звільняю від тих ноша, що не мої.',
  'Те, що ваше — нехай залишиться у вас. Я несу лише своє.',
  'Я живу СВОЄ життя. Не ваше. І це правильно.',
];

function pick(arr, seed) {
  // Детерміновано — повторюваність на тих же figures.
  const idx = Math.abs(seed) % arr.length;
  return arr[idx];
}

function hashFigures(figures) {
  let h = 0;
  for (const f of figures) {
    h = (h * 31 + (f.type.charCodeAt(0) || 0) + Math.round(f.x + f.y)) | 0;
  }
  return h;
}

/**
 * Збирає вирішальну фразу з присутніх у полі фігур.
 * Логіка:
 *   - визнання батька (якщо присутній)
 *   - визнання мами (якщо присутня)
 *   - визнання виключеного / рано померлого (якщо присутні)
 *   - своє місце
 *   - звільнення від чужого
 */
export function buildResolution(figures) {
  if (!figures || figures.length === 0) return '';
  const seed = hashFigures(figures);
  const lines = [];

  const has = (type) => figures.some((f) => f.type === type);

  if (has('father'))   lines.push(pick(ACK_FATHER, seed));
  if (has('mother'))   lines.push(pick(ACK_MOTHER, seed + 1));
  if (has('excluded')) lines.push(pick(ACK_EXCLUDED, seed + 2));
  if (has('early_dead')) lines.push(pick(ACK_EARLY_DEAD, seed + 3));

  // Особливе: якщо self далеко від обох батьків — додаємо "хочу повернутись"
  const self = figures.find((f) => f.type === 'self');
  const father = figures.find((f) => f.type === 'father');
  const mother = figures.find((f) => f.type === 'mother');
  if (self && father && mother) {
    const farFromBoth = distance(self, father) > 250 && distance(self, mother) > 250;
    if (farFromBoth) lines.push('Я повертаюсь. Я був далеко — час прийти ближче.');
  }

  lines.push(pick(PLACE, seed + 4));
  lines.push(pick(RELEASE, seed + 5));

  return lines.join('\n');
}

// Стислий заголовок для зведень / журналу
export function summarizeFigures(figures) {
  const types = figures.map((f) => f.type);
  const count = figures.length;
  if (types.includes('excluded')) return `${count} фігур, з виключеним`;
  if (types.includes('early_dead')) return `${count} фігур, з тим хто пішов`;
  return `${count} фігур у полі`;
}
