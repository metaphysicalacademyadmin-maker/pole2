// 3 режими шляху. Гравець обирає на старті, може підвищити в середині гри (не понизити).
// questionsPerLevel — скільки питань кожного рівня бачить гравець.
// shadowsActive — чи показувати «тіньові» варіанти відповідей (priority 1 завжди видно).

export const PATH_MODES = {
  touch: {
    id: 'touch',
    name: 'Дотик',
    symbol: '◌',
    tag: 'спробувати',
    quote: '«Я не знаю, чи готовий. Хочу торкнутися.»',
    questionsApprox: 28,
    durationApprox: '4–6 год',
    questionsPerLevel: 4,
    practicesPerLevel: 1,
    arbiterFreq: 'sparse',
    shadowsActive: false,
    constellationDepth: 'simple',
  },
  path: {
    id: 'path',
    name: 'Шлях',
    symbol: '✦',
    tag: 'свідомо',
    quote: '«Я готовий йти. Маю 2-3 тижні.»',
    questionsApprox: 42,
    durationApprox: '7–10 год',
    questionsPerLevel: 6,
    practicesPerLevel: 2,
    arbiterFreq: 'regular',
    shadowsActive: true,
    constellationDepth: 'full',
    recommended: true,
  },
  depth: {
    id: 'depth',
    name: 'Глибина',
    symbol: '◉',
    tag: 'повне занурення',
    quote: '«Готовий йти на дно. Маю місяць.»',
    questionsApprox: 84,
    durationApprox: '12–15 год',
    questionsPerLevel: 12,
    practicesPerLevel: 3,
    arbiterFreq: 'frequent',
    shadowsActive: true,
    constellationDepth: 'recursive',
  },
};

export const PATH_MODE_ORDER = ['touch', 'path', 'depth'];
