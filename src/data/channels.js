// Космоенергетичні канали — частотні канали для лікування і налаштування.
// З оригінальної космоенергетики Петрова. У грі — символічні рівні підтримки.
//
// Канал розблоковується при певній умові, активується через 3-хв медитацію.

export const CHANNELS = [
  {
    id: 'kraon', name: 'Краон', icon: '◊',
    color: '#c0aedc',
    purpose: 'базовий канал захисту',
    unlock: { resource: 'root', threshold: 5 },
    practice: 'Уяви фіолетово-блакитну сферу навколо себе. Дихай у неї. 3 хвилини.',
    effect: 'захист · опір тіньовим впливам',
  },
  {
    id: 'zeus', name: 'Зевс', icon: '⚡',
    color: '#f5b870',
    purpose: 'канал волі та сили',
    unlock: { resource: 'will', threshold: 6 },
    practice: 'Уяви блискавку що проходить крізь тебе зверху вниз. Випрями спину.',
    effect: 'воля · рішучість',
  },
  {
    id: 'raja', name: 'Раджа', icon: '✺',
    color: '#e8c476',
    purpose: 'канал благополуччя',
    unlock: { resource: 'gratitude', threshold: 4 },
    practice: 'Золоте сяйво над головою — як корона. Прийми її.',
    effect: 'фінансова стабільність · щастя',
  },
  {
    id: 'midgard', name: 'Мідгард', icon: '◯',
    color: '#a8c898',
    purpose: 'канал зв\'язку з родом',
    unlock: { resource: 'will', threshold: 8 },
    practice: 'Уяви свій рід як дерево. Ти — гілка. Корені у землі. Подихай у дерево.',
    effect: 'родова сила · підтримка предків',
  },
  {
    id: 'impulse', name: 'Імпульс', icon: '✦',
    color: '#9fc8e8',
    purpose: 'канал прориву',
    unlock: { resource: 'flow', threshold: 6 },
    practice: 'Уяви блакитний промінь з серця у простір. Це твій намір — летить.',
    effect: 'руйнування блоків · прорив',
  },
  {
    id: 'firast', name: 'Фіраст', icon: '☼',
    color: '#f0a8b8',
    purpose: 'канал любові',
    unlock: { resource: 'love', threshold: 5 },
    practice: 'Рожеве світло у грудях. Розширюй його. Виходить далеко за межі тіла.',
    effect: 'відкритість серця · стосунки',
  },
  {
    id: 'agap', name: 'Агап', icon: '⊹',
    color: '#c9b3e8',
    purpose: 'канал прощення',
    unlock: { resource: 'love', threshold: 8 },
    practice: 'Уяви тих кому не пробачив. Скажи: «Я звільняю себе від цієї ноші».',
    effect: 'прощення · звільнення',
  },
  {
    id: 'sahara', name: 'Сахара', icon: '∞',
    color: '#ffe7a8',
    purpose: 'канал вищої свідомості',
    unlock: { resource: 'light', threshold: 6 },
    practice: 'Маківка відкривається. Чисте золоте світло вливається. Стає тобою.',
    effect: 'розширення свідомості · контакт з вищим',
  },
];

export function checkChannelsUnlock(resources) {
  // Повертає список ID каналів які треба розблокувати на цьому стейті.
  return CHANNELS
    .filter((c) => (resources[c.unlock.resource] || 0) >= c.unlock.threshold)
    .map((c) => c.id);
}

export function findChannel(id) {
  return CHANNELS.find((c) => c.id === id);
}
