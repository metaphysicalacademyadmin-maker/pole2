// LITE-варіант розстановок — 7 базових фігур замість 35.
// Економія: ~12 KB raw.

export const FIGURE_TYPES = {
  self: { id: 'self', name: 'Я', symbol: '◉', color: '#f0c574',
    weight: 1.0, group: 'family', optional: false,
    description: 'Ти — у центрі розстановки' },
  father: { id: 'father', name: 'Батько', symbol: '◇', color: '#9fc8e8',
    weight: 1.5, group: 'family', optional: false,
    description: 'Той, хто дав тобі чоловічу лінію' },
  mother: { id: 'mother', name: 'Мама', symbol: '◈', color: '#f0a8b8',
    weight: 1.5, group: 'family', optional: false,
    description: 'Та, що дала тобі життя' },
  grandfather: { id: 'grandfather', name: 'Прадід', symbol: '⌃', color: '#7a9bb8',
    weight: 1.2, group: 'family', optional: true,
    description: 'Батько твого батька або матері' },
  grandmother: { id: 'grandmother', name: 'Прабабуся', symbol: '⌂', color: '#c89cb0',
    weight: 1.2, group: 'family', optional: true,
    description: 'Жіноча лінія через покоління' },
  excluded: { id: 'excluded', name: 'Виключений', symbol: '⊘', color: '#9985b8',
    weight: 1.8, group: 'family', optional: true,
    description: 'Той, кого вилучили з пам\'яті роду' },
  early_dead: { id: 'early_dead', name: 'Хто пішов рано', symbol: '✦', color: '#a8c898',
    weight: 1.6, group: 'family', optional: true,
    description: 'Брат/сестра/дитина, що пішли раніше' },
};

export const FIGURE_GROUPS = [
  { id: 'family', label: 'рід', color: '#9fc8e8' },
];

export const REQUIRED_FIGURES = ['self', 'father', 'mother'];
export const OPTIONAL_FIGURES = ['grandfather', 'grandmother', 'excluded', 'early_dead'];

export const INITIAL_POSITIONS = {
  self:        { x: 300, y: 480, rotation: 0 },
  father:      { x: 220, y: 270, rotation: 180 },
  mother:      { x: 380, y: 270, rotation: 180 },
  grandfather: { x: 170, y: 150, rotation: 180 },
  grandmother: { x: 430, y: 150, rotation: 180 },
  excluded:    { x: 90,  y: 380, rotation: 0 },
  early_dead:  { x: 520, y: 460, rotation: 0 },
};

export function getFiguresByGroup(groupId) {
  return Object.values(FIGURE_TYPES).filter((f) => f.group === groupId);
}
