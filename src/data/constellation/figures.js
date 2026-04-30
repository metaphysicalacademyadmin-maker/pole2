// Типи фігур для Розстановки рівня 3 (Воля і Рід).
// Кожна — символічний "представник" з певною вагою у системі роду.

export const FIGURE_TYPES = {
  self: {
    id: 'self',
    name: 'Я',
    symbol: '◉',
    color: '#f0c574',
    weight: 1.0,
    description: 'Ти — у центрі розстановки',
    optional: false,
  },
  father: {
    id: 'father',
    name: 'Батько',
    symbol: '◇',
    color: '#9fc8e8',
    weight: 1.5,
    description: 'Той, хто дав тобі чоловічу лінію',
    optional: false,
  },
  mother: {
    id: 'mother',
    name: 'Мама',
    symbol: '◈',
    color: '#f0a8b8',
    weight: 1.5,
    description: 'Та, що дала тобі життя',
    optional: false,
  },
  grandfather: {
    id: 'grandfather',
    name: 'Прадід',
    symbol: '⌃',
    color: '#7a9bb8',
    weight: 1.2,
    description: 'Батько твого батька або матері',
    optional: true,
  },
  grandmother: {
    id: 'grandmother',
    name: 'Прабабуся',
    symbol: '⌂',
    color: '#c89cb0',
    weight: 1.2,
    description: 'Жіноча лінія через покоління',
    optional: true,
  },
  excluded: {
    id: 'excluded',
    name: 'Виключений',
    symbol: '☾',
    color: '#9985b8',
    weight: 1.8,
    description: 'Той, кого вилучили з пам\'яті роду — самогубець, ненароджений, "чорна вівця"',
    optional: true,
  },
  early_dead: {
    id: 'early_dead',
    name: 'Той, хто пішов рано',
    symbol: '✦',
    color: '#a8c898',
    weight: 1.6,
    description: 'Брат/сестра/дитина, що пішли раніше часу',
    optional: true,
  },
};

export const REQUIRED_FIGURES = ['self', 'father', 'mother'];

export const OPTIONAL_FIGURES = [
  'grandfather', 'grandmother', 'excluded', 'early_dead',
];

// Початкове розташування — лінія з Я знизу, батьки вище за тобою.
// Гравець потім перетягує куди відчуває.
export const INITIAL_POSITIONS = {
  self:        { x: 300, y: 480, rotation: 0 },
  father:      { x: 220, y: 280, rotation: 180 },
  mother:      { x: 380, y: 280, rotation: 180 },
  grandfather: { x: 180, y: 140, rotation: 180 },
  grandmother: { x: 420, y: 140, rotation: 180 },
  excluded:    { x: 90,  y: 380, rotation: 0 },
  early_dead:  { x: 510, y: 380, rotation: 0 },
};
