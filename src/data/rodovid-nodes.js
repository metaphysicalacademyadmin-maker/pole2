// Дерево родоводу — фіксована структура 3 поколінь.
// Координати у SVG viewBox 600×500.

export const RODOVID_NODES = [
  // Я
  { id: 'me',          label: 'Я',           x: 300, y: 420, color: '#f0c574', generation: 0 },

  // Батьки
  { id: 'father',      label: 'Тато',        x: 200, y: 280, color: '#9fc8e8', generation: 1, sex: 'male' },
  { id: 'mother',      label: 'Мама',        x: 400, y: 280, color: '#f0a8b8', generation: 1, sex: 'female' },

  // Дідусі/Бабусі
  { id: 'gf-paternal', label: 'Дідусь (по тат.)',  x:  90, y: 130, color: '#a8c898', generation: 2, sex: 'male', parent: 'father' },
  { id: 'gm-paternal', label: 'Бабуся (по тат.)',  x: 230, y: 130, color: '#c9b3e8', generation: 2, sex: 'female', parent: 'father' },
  { id: 'gf-maternal', label: 'Дідусь (по мам.)',  x: 370, y: 130, color: '#a8c898', generation: 2, sex: 'male', parent: 'mother' },
  { id: 'gm-maternal', label: 'Бабуся (по мам.)',  x: 510, y: 130, color: '#c9b3e8', generation: 2, sex: 'female', parent: 'mother' },
];

// Зв'язки (родинні лінії)
export const RODOVID_LINES = [
  // Я ← мама + тато
  { from: 'me', to: 'father' },
  { from: 'me', to: 'mother' },
  // Тато ← діди по татовій лінії
  { from: 'father', to: 'gf-paternal' },
  { from: 'father', to: 'gm-paternal' },
  // Мама ← діди по маминій лінії
  { from: 'mother', to: 'gf-maternal' },
  { from: 'mother', to: 'gm-maternal' },
];

export function findNode(id) {
  return RODOVID_NODES.find((n) => n.id === id) || null;
}
