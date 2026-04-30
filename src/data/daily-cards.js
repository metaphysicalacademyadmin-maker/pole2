// Картки дня — короткі архетипічні нагадування. Одна на день.
// Випадкова на основі дати — той самий день дає ту саму картку.

export const DAILY_CARDS = [
  { id: 'soil',      symbol: '🌱', name: 'Земля',     hint: 'Сьогодні відчуй опору. Стопи на землі.' },
  { id: 'water',     symbol: '💧', name: 'Вода',      hint: 'Дозволь що рухається — рухатись. Сльози, гнів, бажання.' },
  { id: 'fire',      symbol: '🔥', name: 'Вогонь',    hint: 'Своя воля. Сьогодні — твоє «ні» важливіше за чуже «так».' },
  { id: 'air',       symbol: '💨', name: 'Повітря',   hint: 'Слово, що довго не казане. Час прозвучати.' },
  { id: 'ether',     symbol: '☉',  name: 'Ефір',      hint: 'Те що більше за тебе. Подивись угору хвилину.' },
  { id: 'mirror',    symbol: '◯',  name: 'Дзеркало',  hint: 'Той хто тебе дратує — твій вчитель сьогодні.' },
  { id: 'mother',    symbol: '◈',  name: 'Мати',      hint: 'Уяви маму. Просто подивись на неї без оцінки.' },
  { id: 'father',    symbol: '◇',  name: 'Батько',    hint: 'Подяка тату. Хоч за щось одне.' },
  { id: 'shadow',    symbol: '☾',  name: 'Тінь',      hint: 'Те що не любиш у собі — теж ти. Не воюй.' },
  { id: 'gift',      symbol: '✦',  name: 'Дар',       hint: 'Що ти приніс у світ — тільки ти?' },
  { id: 'silence',   symbol: '◌',  name: 'Тиша',      hint: 'Хвилина без музики, телефону, голосу. Просто слухай.' },
  { id: 'forgive',   symbol: '⊹',  name: 'Прощення', hint: 'Не для нього — для себе.' },
  { id: 'gratitude', symbol: '☼',  name: 'Подяка',    hint: 'Назви три речі за які вдячний прямо зараз.' },
  { id: 'breath',    symbol: '∞',  name: 'Подих',     hint: 'Один свідомий подих змінює все.' },
];

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function cardForDate(date = new Date()) {
  // Detермінований seed з YYYYMMDD → стабільна картка дня.
  const k = dateKey(date);
  let h = 0;
  for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return DAILY_CARDS[Math.abs(h) % DAILY_CARDS.length];
}
