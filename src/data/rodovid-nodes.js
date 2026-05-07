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

// ───────────── РОЗШИРЕННЯ ДО 7 ПОКОЛІНЬ ─────────────
//
// Indexing convention: у поколінні N (gen=0..6) є 2^gen вузлів,
// idx=0..2^gen-1. Перші 2^(gen-1) — материнська лінія, решта — батьківська.
// Materinska/batkivska частина рекурсивно ділиться так само на materinsku/batkivsku.
//
// Маппінг до legacy IDs (gen 0..3) щоб не ламати існуюче state.rodovid:
//   gen 0: 'me'
//   gen 1: 0='mother', 1='father'
//   gen 2: 0='gm-maternal', 1='gf-maternal', 2='gm-paternal', 3='gf-paternal'
//   gen 3: 0..7 legacy IDs у тому самому order: m-m-f, m-m-m, m-f-f, m-f-m, f-m-f, f-m-m, f-f-f, f-f-m
//
// Для gen 4..6 — нова схема "g{N}-{idx}".
const GEN2_MAP = ['gm-maternal', 'gf-maternal', 'gm-paternal', 'gf-paternal'];
const GEN3_MAP = [
  'gg-gm-maternal-f', 'gg-gm-maternal-m',
  'gg-gf-maternal-f', 'gg-gf-maternal-m',
  'gg-gm-paternal-f', 'gg-gm-paternal-m',
  'gg-gf-paternal-f', 'gg-gf-paternal-m',
];

export function lineageId(gen, idx) {
  if (gen === 0) return 'me';
  if (gen === 1) return idx === 0 ? 'mother' : 'father';
  if (gen === 2) return GEN2_MAP[idx];
  if (gen === 3) return GEN3_MAP[idx];
  return `g${gen}-${idx}`;
}

/** Повертає мета-дані вузла (id, label, color, sex). */
export function lineageNodeMeta(gen, idx) {
  const id = lineageId(gen, idx);
  const legacy = findNode(id);
  if (legacy) return legacy;
  // Generated meta для поколінь 4-6: idx parity = sex (even=female, odd=male)
  const isFemale = (idx & 1) === 0;
  const labelPrefix = gen === 4 ? 'Прапрадід' : gen === 5 ? 'Прапрапрадід' : 'Пращур';
  const labelFem    = gen === 4 ? 'Прапрабаба' : gen === 5 ? 'Прапрапрабаба' : 'Пращурка';
  return {
    id, generation: gen,
    label: isFemale ? labelFem : labelPrefix,
    color: isFemale ? '#a899c0' : '#7a9bb8',
    sex: isFemale ? 'female' : 'male',
  };
}

export function countAtGen(gen) {
  return 2 ** gen;
}
