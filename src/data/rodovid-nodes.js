// Дерево родоводу — 3-4 покоління.
// Координати у SVG viewBox 800×600 для 4-х поколінь.
// При viewBox 600×500 (без 4-го) — нижні координати.

// Базові 7 вузлів (3 покоління)
export const RODOVID_NODES = [
  // Я
  { id: 'me',          label: 'Я',           x: 400, y: 540, color: '#f0c574', generation: 0 },

  // Батьки
  { id: 'father',      label: 'Тато',        x: 270, y: 400, color: '#9fc8e8', generation: 1, sex: 'male' },
  { id: 'mother',      label: 'Мама',        x: 530, y: 400, color: '#f0a8b8', generation: 1, sex: 'female' },

  // Дідусі/Бабусі
  { id: 'gf-paternal', label: 'Дідусь (по тат.)',  x: 140, y: 250, color: '#a8c898', generation: 2, sex: 'male', parent: 'father' },
  { id: 'gm-paternal', label: 'Бабуся (по тат.)',  x: 300, y: 250, color: '#c9b3e8', generation: 2, sex: 'female', parent: 'father' },
  { id: 'gf-maternal', label: 'Дідусь (по мам.)',  x: 500, y: 250, color: '#a8c898', generation: 2, sex: 'male', parent: 'mother' },
  { id: 'gm-maternal', label: 'Бабуся (по мам.)',  x: 660, y: 250, color: '#c9b3e8', generation: 2, sex: 'female', parent: 'mother' },
];

// 4-те покоління: 8 прадідів. Кожен дід/баба має 2 батьків.
// Структура: gg-{parent_id}-{m|f} (m = чоловік, f = жінка)
// Наприклад: gg-gf-paternal-m = тато діда по татовій лінії (прадід)
export const RODOVID_NODES_4TH = [
  // Прадіди по дідусю-татовому
  { id: 'gg-gf-paternal-m', label: 'Прадід',  x:  60, y: 100, color: '#8ab098', generation: 3, sex: 'male',   parent: 'gf-paternal' },
  { id: 'gg-gf-paternal-f', label: 'Прабаба', x: 140, y: 100, color: '#a899c0', generation: 3, sex: 'female', parent: 'gf-paternal' },
  // Прадіди по бабусі-татовій
  { id: 'gg-gm-paternal-m', label: 'Прадід',  x: 230, y: 100, color: '#8ab098', generation: 3, sex: 'male',   parent: 'gm-paternal' },
  { id: 'gg-gm-paternal-f', label: 'Прабаба', x: 320, y: 100, color: '#a899c0', generation: 3, sex: 'female', parent: 'gm-paternal' },
  // Прадіди по дідусю-маминому
  { id: 'gg-gf-maternal-m', label: 'Прадід',  x: 470, y: 100, color: '#8ab098', generation: 3, sex: 'male',   parent: 'gf-maternal' },
  { id: 'gg-gf-maternal-f', label: 'Прабаба', x: 550, y: 100, color: '#a899c0', generation: 3, sex: 'female', parent: 'gf-maternal' },
  // Прадіди по бабусі-маминій
  { id: 'gg-gm-maternal-m', label: 'Прадід',  x: 640, y: 100, color: '#8ab098', generation: 3, sex: 'male',   parent: 'gm-maternal' },
  { id: 'gg-gm-maternal-f', label: 'Прабаба', x: 730, y: 100, color: '#a899c0', generation: 3, sex: 'female', parent: 'gm-maternal' },
];

// Зв'язки (родинні лінії)
export const RODOVID_LINES = [
  { from: 'me', to: 'father' },
  { from: 'me', to: 'mother' },
  { from: 'father', to: 'gf-paternal' },
  { from: 'father', to: 'gm-paternal' },
  { from: 'mother', to: 'gf-maternal' },
  { from: 'mother', to: 'gm-maternal' },
];

export const RODOVID_LINES_4TH = [
  { from: 'gf-paternal', to: 'gg-gf-paternal-m' },
  { from: 'gf-paternal', to: 'gg-gf-paternal-f' },
  { from: 'gm-paternal', to: 'gg-gm-paternal-m' },
  { from: 'gm-paternal', to: 'gg-gm-paternal-f' },
  { from: 'gf-maternal', to: 'gg-gf-maternal-m' },
  { from: 'gf-maternal', to: 'gg-gf-maternal-f' },
  { from: 'gm-maternal', to: 'gg-gm-maternal-m' },
  { from: 'gm-maternal', to: 'gg-gm-maternal-f' },
];

export function allNodes(showFourth) {
  return showFourth ? [...RODOVID_NODES, ...RODOVID_NODES_4TH] : RODOVID_NODES;
}

export function allLines(showFourth) {
  return showFourth ? [...RODOVID_LINES, ...RODOVID_LINES_4TH] : RODOVID_LINES;
}

export function findNode(id) {
  return RODOVID_NODES.find((n) => n.id === id)
    || RODOVID_NODES_4TH.find((n) => n.id === id)
    || null;
}
