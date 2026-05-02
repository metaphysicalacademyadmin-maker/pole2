// 3 режими шляху. Гравець обирає на старті, може підвищити в середині гри (не понизити).
// questionsPerLevel — скільки питань кожного рівня бачить гравець.
// shadowsActive — чи показувати «тіньові» варіанти відповідей (priority 1 завжди видно).
//
// Tier (рівень доступу):
//   free      — Дотик, доступний без оплати
//   standard  — Шлях, потребує підписки на metaphysical-way.academy
//   deep      — Глибина, потребує розширеного доступу

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
    details: [
      '4 питання на рівні',
      'без тіньових варіантів',
      'проста розстановка на 3-му',
      'Антип з`являється рідко',
    ],
    tier: 'free',
    tierLabel: 'безкоштовно',
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
    details: [
      '6 питань на рівні',
      'тінь завжди доступна',
      'повна розстановка з родом',
      'Антип з`являється регулярно',
    ],
    tier: 'standard',
    tierLabel: 'підписка',
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
    details: [
      '12 питань на рівні · максимум',
      'тінь і власні відповіді — основа',
      'рекурсивна розстановка з кармою',
      'Антип — постійний супутник',
    ],
    tier: 'deep',
    tierLabel: 'розширений доступ',
  },
};

export const PATH_MODE_ORDER = ['touch', 'path', 'depth'];
