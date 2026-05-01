// Типи фігур для Розстановки рівня 3 (Воля і Рід).
// 18 фігур у 4 категоріях:
//   • inner — внутрішні (Я, его, душа, дух, тіло, свідомість, тінь)
//   • family — рід (батько, мама, предки, виключений, рано пішов)
//   • triangle — драматичний трикутник Карпмана + палач
//   • system — системні (непризнаний)

export const FIGURE_TYPES = {
  // ─── INNER ─── внутрішні фігури психіки
  self: {
    id: 'self', name: 'Я', symbol: '◉', color: '#f0c574',
    weight: 1.0, group: 'inner', optional: false,
    description: 'Ти — у центрі розстановки',
  },
  ego: {
    id: 'ego', name: 'Его', symbol: '◊', color: '#e8c476',
    weight: 1.2, group: 'inner', optional: true,
    description: 'Соціальна маска, та частина що хоче подобатись',
  },
  soul: {
    id: 'soul', name: 'Душа', symbol: '☉', color: '#ffe7a8',
    weight: 2.0, group: 'inner', optional: true,
    description: 'Сутнісна частина — те що було і буде',
  },
  spirit: {
    id: 'spirit', name: 'Дух', symbol: '✧', color: '#d9c4ec',
    weight: 1.8, group: 'inner', optional: true,
    description: 'Вищий аспект — зв\'язок з Джерелом',
  },
  body: {
    id: 'body', name: 'Тіло', symbol: '❀', color: '#a8c898',
    weight: 1.4, group: 'inner', optional: true,
    description: 'Фізичний носій — пам\'ять, інстинкти, відчуття',
  },
  consciousness: {
    id: 'consciousness', name: 'Свідомість', symbol: '✺', color: '#a89bd8',
    weight: 1.6, group: 'inner', optional: true,
    description: 'Спостерігач — те, що знає що ти зараз тут',
  },
  inner_shadow: {
    id: 'inner_shadow', name: 'Тінь', symbol: '☾', color: '#7a5a78',
    weight: 1.7, group: 'inner', optional: true,
    description: 'Все що ти у собі не визнаєш — і саме там твоя сила',
  },

  // ─── FAMILY ─── фігури роду
  father: {
    id: 'father', name: 'Батько', symbol: '◇', color: '#9fc8e8',
    weight: 1.5, group: 'family', optional: false,
    description: 'Той, хто дав тобі чоловічу лінію',
  },
  mother: {
    id: 'mother', name: 'Мама', symbol: '◈', color: '#f0a8b8',
    weight: 1.5, group: 'family', optional: false,
    description: 'Та, що дала тобі життя',
  },
  grandfather: {
    id: 'grandfather', name: 'Прадід', symbol: '⌃', color: '#7a9bb8',
    weight: 1.2, group: 'family', optional: true,
    description: 'Батько твого батька або матері',
  },
  grandmother: {
    id: 'grandmother', name: 'Прабабуся', symbol: '⌂', color: '#c89cb0',
    weight: 1.2, group: 'family', optional: true,
    description: 'Жіноча лінія через покоління',
  },
  excluded: {
    id: 'excluded', name: 'Виключений', symbol: '⊘', color: '#9985b8',
    weight: 1.8, group: 'family', optional: true,
    description: 'Той кого вилучили з пам\'яті роду — самогубець, ненароджений, "чорна вівця"',
  },
  early_dead: {
    id: 'early_dead', name: 'Хто пішов рано', symbol: '✦', color: '#a8c898',
    weight: 1.6, group: 'family', optional: true,
    description: 'Брат/сестра/дитина, що пішли раніше часу',
  },

  // ─── TRIANGLE ─── драматичний трикутник Карпмана + палач
  victim: {
    id: 'victim', name: 'Жертва', symbol: '◑', color: '#a890b0',
    weight: 1.5, group: 'triangle', optional: true,
    description: 'Та частина що відчуває безсилля, ображеність, "зі мною так чинять"',
  },
  persecutor: {
    id: 'persecutor', name: 'Переслідувач', symbol: '◐', color: '#b88080',
    weight: 1.6, group: 'triangle', optional: true,
    description: 'Той хто звинувачує — внутрішній критик або зовнішня фігура',
  },
  rescuer: {
    id: 'rescuer', name: 'Рятівник', symbol: '◒', color: '#80b8a0',
    weight: 1.4, group: 'triangle', optional: true,
    description: 'Той хто втручається не питаючи дозволу — "я знаю як тобі краще"',
  },
  executioner: {
    id: 'executioner', name: 'Палач', symbol: '✕', color: '#7a3a3a',
    weight: 1.9, group: 'triangle', optional: true,
    description: 'Внутрішній катувальник — крайня форма переслідувача',
  },

  // ─── SYSTEM ─── системні
  unrecognized: {
    id: 'unrecognized', name: 'Непризнаний', symbol: '◌', color: '#8a7a90',
    weight: 1.7, group: 'system', optional: true,
    description: 'Те що не визнавали — біологічний батько, ненароджений, прихована істина',
  },

  // ─── HIGHER ─── ієрархія Я
  hierarchical_self: {
    id: 'hierarchical_self', name: 'Ієрархічні Я', symbol: '☰', color: '#e8c476',
    weight: 1.6, group: 'higher', optional: true,
    description: 'Усі рівні Я разом — внутрішня вертикаль свідомості',
  },
  higher_self: {
    id: 'higher_self', name: 'Вище Я', symbol: '✦', color: '#ffe7a8',
    weight: 2.0, group: 'higher', optional: true,
    description: 'Та частина що знає більше ніж его — мудре Я яке завжди тут',
  },
  super_ego: {
    id: 'super_ego', name: 'Над Я', symbol: '✧', color: '#c8b478',
    weight: 1.5, group: 'higher', optional: true,
    description: 'Внутрішній моральний голос — голос виховання, норм, «правильно»',
  },
  spiritual_self: {
    id: 'spiritual_self', name: 'Духовне Я', symbol: '❋', color: '#d9c4ec',
    weight: 2.2, group: 'higher', optional: true,
    description: 'Те Я яке приходить до медитації, до тиші — стержень',
  },
  cosmic_self: {
    id: 'cosmic_self', name: 'Космічне Я', symbol: '✷', color: '#a8b8d8',
    weight: 2.5, group: 'higher', optional: true,
    description: 'Я як вічність — поза часом, поза формою',
  },

  // ─── TRANSCENDENT ─── трансцендентні
  creator: {
    id: 'creator', name: 'Творець', symbol: '⊙', color: '#fff7a8',
    weight: 3.0, group: 'transcendent', optional: true,
    description: 'Джерело — те, що створило все що ти знаєш як Я',
  },
  purpose: {
    id: 'purpose', name: 'Призначення', symbol: '⌖', color: '#f0c574',
    weight: 1.8, group: 'transcendent', optional: true,
    description: 'Те для чого ти прийшов — твоя мета пробудження',
  },
  destiny: {
    id: 'destiny', name: 'Доля', symbol: '✺', color: '#c89cb0',
    weight: 1.7, group: 'transcendent', optional: true,
    description: 'Шлях що визначений — фон, на якому проявляється воля',
  },
  karma: {
    id: 'karma', name: 'Карма', symbol: '⟲', color: '#9985b8',
    weight: 1.9, group: 'transcendent', optional: true,
    description: 'Несвої відповіді минулого — те що приходить до завершення',
  },
  cause: {
    id: 'cause', name: 'Причина', symbol: '◀', color: '#b8a8c8',
    weight: 1.7, group: 'transcendent', optional: true,
    description: 'Першопочаток — те, з чого все почалось у цій історії',
  },
  effect: {
    id: 'effect', name: 'Наслідок', symbol: '▶', color: '#c8a8b8',
    weight: 1.5, group: 'transcendent', optional: true,
    description: 'Те, що проросло з причини — симптом, ситуація, доля',
  },

  // ─── ENERGY ─── енергії
  stuck_power: {
    id: 'stuck_power', name: 'Застрягла сила', symbol: '⊗', color: '#7a3a3a',
    weight: 1.6, group: 'energy', optional: true,
    description: 'Енергія що замкнулась у симптомі, болю, повторі',
  },
  movement: {
    id: 'movement', name: 'Рух', symbol: '➤', color: '#a8d8a8',
    weight: 1.4, group: 'energy', optional: true,
    description: 'Жива течія — те що вже хоче статись',
  },
  dark_forces: {
    id: 'dark_forces', name: 'Чорні сили', symbol: '✘', color: '#3a2a3a',
    weight: 2.0, group: 'energy', optional: true,
    description: 'Деструктивні впливи — порча, вроки, паразитарні енергії',
  },
  dead: {
    id: 'dead', name: 'Мертві', symbol: '☠', color: '#5a4060',
    weight: 1.7, group: 'energy', optional: true,
    description: 'Енергії того хто пішов — прив\'язки, незавершені дії',
  },
  light_forces: {
    id: 'light_forces', name: 'Світлі сили', symbol: '☀', color: '#ffe7a8',
    weight: 2.2, group: 'energy', optional: true,
    description: 'Янголи, провідники, помічники Поля',
  },
  cosmic_influence: {
    id: 'cosmic_influence', name: 'Космічні впливи', symbol: '✶', color: '#a8b8d8',
    weight: 1.9, group: 'energy', optional: true,
    description: 'Зорі, планети, сонячно-місячні ритми що впливають на твоє поле',
  },
  // Внутрішні фігури — частини самого гравця, що домінують у системі.
  // Виставляються там, де відчуваєш їх вплив на твою лінію.
  mind: {
    id: 'mind',
    name: 'Розум / Логіка',
    symbol: '✧',
    color: '#9985b8',
    weight: 1.0,
    description: 'Голова, аналіз, контроль, бажання все зрозуміти — коли голос розуму голосніший за тіло',
    optional: true,
  },
  pain: {
    id: 'pain',
    name: 'Біль',
    symbol: '✕',
    color: '#c47878',
    weight: 1.4,
    description: 'Незавершена рана, що тримає тебе на місці — фізичний, душевний, родовий біль',
    optional: true,
  },
  block: {
    id: 'block',
    name: 'Блок',
    symbol: '◰',
    color: '#7a7a7a',
    weight: 1.3,
    description: 'Енергетичний/системний затор — те, що не пускає рух у певну сферу',
    optional: true,
  },
  // Зовнішні фігури — впливи з-поза тебе чи роду.
  external: {
    id: 'external',
    name: 'Сторонній вплив',
    symbol: '✶',
    color: '#5a4a3a',
    weight: 1.5,
    description: 'Чужа енергія, яка зайшла у поле — відьма/чаклун/недобрі побажання, важкі емоції від інших',
    optional: true,
  },
};

export const FIGURE_GROUPS = [
  { id: 'inner',       label: 'внутрішні',     color: '#f0c574' },
  { id: 'family',      label: 'рід',           color: '#9fc8e8' },
  { id: 'higher',      label: 'ієрархія Я',    color: '#ffe7a8' },
  { id: 'triangle',    label: 'трикутник',     color: '#b88080' },
  { id: 'transcendent', label: 'трансцендентні', color: '#fff7a8' },
  { id: 'energy',      label: 'енергії',       color: '#a8d8a8' },
  { id: 'system',      label: 'системні',      color: '#8a7a90' },
];

export const REQUIRED_FIGURES = ['self', 'father', 'mother'];

export const OPTIONAL_FIGURES = [
  'ego', 'soul', 'spirit', 'body', 'consciousness', 'inner_shadow',
  'grandfather', 'grandmother', 'excluded', 'early_dead',
  'mind', 'pain', 'block', 'external',
  'hierarchical_self', 'higher_self', 'super_ego', 'spiritual_self', 'cosmic_self',
  'victim', 'persecutor', 'rescuer', 'executioner',
  'creator', 'purpose', 'destiny', 'karma', 'cause', 'effect',
  'stuck_power', 'movement', 'dark_forces', 'dead', 'light_forces', 'cosmic_influence',
  'unrecognized',
];

// Початкове розташування — кожна фігура з'являється у своєму секторі.
// Гравець потім перетягує куди відчуває.
export const INITIAL_POSITIONS = {
  // Inner — навколо Я внизу
  self:          { x: 300, y: 480, rotation: 0 },
  ego:           { x: 380, y: 500, rotation: 0 },
  soul:          { x: 300, y: 360, rotation: 0 },
  spirit:        { x: 300, y: 100, rotation: 0 },
  body:          { x: 220, y: 500, rotation: 0 },
  consciousness: { x: 460, y: 380, rotation: 0 },
  inner_shadow:  { x: 140, y: 480, rotation: 0 },
  // Family — вгорі
  father:        { x: 220, y: 270, rotation: 180 },
  mother:        { x: 380, y: 270, rotation: 180 },
  grandfather:   { x: 170, y: 150, rotation: 180 },
  grandmother:   { x: 430, y: 150, rotation: 180 },
  excluded:      { x: 90,  y: 380, rotation: 0 },
  early_dead:    { x: 520, y: 460, rotation: 0 },
  // Remote-додані фігури (із main)
  mind:          { x: 250, y: 380, rotation: 0 },
  pain:          { x: 350, y: 380, rotation: 0 },
  block:         { x: 150, y: 470, rotation: 0 },
  external:      { x: 450, y: 470, rotation: 0 },
  // Triangle — кути
  victim:        { x: 80,  y: 220, rotation: 0 },
  persecutor:    { x: 520, y: 220, rotation: 180 },
  rescuer:       { x: 520, y: 320, rotation: 180 },
  executioner:   { x: 80,  y: 320, rotation: 0 },
  // Higher — ієрархія Я (вгорі)
  hierarchical_self: { x: 60,  y: 80,  rotation: 180 },
  higher_self:       { x: 250, y: 60,  rotation: 180 },
  super_ego:         { x: 350, y: 60,  rotation: 180 },
  spiritual_self:    { x: 480, y: 80,  rotation: 180 },
  cosmic_self:       { x: 560, y: 80,  rotation: 180 },
  // Transcendent — над і навколо
  creator:       { x: 300, y: 20,  rotation: 180 },
  purpose:       { x: 270, y: 560, rotation: 0 },
  destiny:       { x: 50,  y: 540, rotation: 0 },
  karma:         { x: 550, y: 540, rotation: 0 },
  cause:         { x: 60,  y: 420, rotation: 90 },
  effect:        { x: 540, y: 420, rotation: 270 },
  // Energy — внизу + по краях
  stuck_power:      { x: 200, y: 560, rotation: 0 },
  movement:         { x: 400, y: 560, rotation: 0 },
  dark_forces:      { x: 30,  y: 200, rotation: 0 },
  dead:             { x: 100, y: 580, rotation: 0 },
  light_forces:     { x: 570, y: 160, rotation: 180 },
  cosmic_influence: { x: 460, y: 580, rotation: 0 },
  // System — дуже високо
  unrecognized:  { x: 300, y: 40,  rotation: 180 },
};

export function getFiguresByGroup(groupId) {
  return Object.values(FIGURE_TYPES).filter((f) => f.group === groupId);
}
