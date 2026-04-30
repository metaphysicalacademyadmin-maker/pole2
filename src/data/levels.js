// Піраміда — 8 рівнів (0 = вхід, 1-7 = основні рівні розвитку).
// chakra прив'язує рівень до однієї з 7 чакр (рівень 0 — без чакри).
// keyText — слова Арбітра, які гравець отримує по завершенні рівня.

export const PYRAMID_LEVELS = [
  {
    n: 0,
    id: 'entry',
    name: 'Вхід',
    sub: 'намір, перший подих',
    color: 'var(--ink-tertiary)',
    cellWidth: 96,
    chakra: null,
    keyText: 'Я не знаю куди йду — і вже йду.',
  },
  {
    n: 1,
    id: 'roots',
    name: 'Коріння',
    sub: 'тіло, дім, безпека',
    color: 'var(--lvl-1)',
    cellWidth: 90,
    chakra: { id: 'muladhara', name: 'Муладхара', y: 165, color: '#a8c898' },
    keyText: 'Я тут. Більше нічого не треба.',
  },
  {
    n: 2,
    id: 'flow',
    name: 'Потік',
    sub: 'емоції, творчість',
    color: 'var(--lvl-2)',
    cellWidth: 80,
    chakra: { id: 'svadhisthana', name: 'Свадхістана', y: 145, color: '#9fc8e8' },
    keyText: 'Хочу — і не пояснюю кому.',
  },
  {
    n: 3,
    id: 'will',
    name: 'Воля і Рід',
    sub: 'дія, кордони, рід',
    color: 'var(--lvl-3)',
    cellWidth: 72,
    chakra: { id: 'manipura', name: 'Маніпура', y: 125, color: '#f5b870' },
    keyText: 'Я не герой свого роду. І це звільняє.',
  },
  {
    n: 4,
    id: 'heart',
    name: 'Серце',
    sub: 'любов, прощення',
    color: 'var(--lvl-4)',
    cellWidth: 62,
    chakra: { id: 'anahata', name: 'Анахата', y: 105, color: '#f0a8b8' },
    keyText: 'Серце відкрите. Воно витримає.',
  },
  {
    n: 5,
    id: 'voice',
    name: 'Голос',
    sub: 'слово, правда',
    color: 'var(--lvl-5)',
    cellWidth: 52,
    chakra: { id: 'vishuddha', name: 'Вішудха', y: 85, color: '#9fc8e8' },
    keyText: 'Те що сказано тілом — теж сказано.',
  },
  {
    n: 6,
    id: 'vision',
    name: 'Видіння',
    sub: 'призначення, мудрість',
    color: 'var(--lvl-6)',
    cellWidth: 42,
    chakra: { id: 'ajna', name: 'Аджна', y: 65, color: '#c9b3e8' },
    keyText: 'Я бачу — і не сперечаюсь з побаченим.',
  },
  {
    n: 7,
    id: 'source',
    name: 'Джерело',
    sub: 'єднання',
    color: 'var(--lvl-7)',
    cellWidth: 30,
    chakra: { id: 'sahasrara', name: 'Сахасрара', y: 45, color: '#ffe7a8' },
    keyText: 'Усе, що я шукав, шукало мене.',
  },
];

export function levelByNumber(n) {
  return PYRAMID_LEVELS.find((l) => l.n === n) || PYRAMID_LEVELS[0];
}
