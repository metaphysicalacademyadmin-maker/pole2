// 5 треків шляху — гравець обирає на основі мотивації/болю, не лише глибини.
// Кожен трек має свій фокус (чакри, пелюстки, канали), темп, тон.
// Гравець може підвищити трек у середині гри, але не понизити.
//
// Tier (рівень доступу):
//   free      — Корінь, доступний без оплати (вступ для всіх)
//   standard  — Серце, Голос, потребує підписки
//   deep      — Тінь, Ініціат, потребує розширеного доступу
//
// Фокус-поля використовуються для:
//   focusChakras       — підкреслює ці чакри у топбарі та body hologram
//   focusPetals        — рекомендує ці пелюстки на мандалі
//   recommendedChannels — пропонує ці канали у космо
//   antypIntensity     — частота появи Антипа
//
// Backward compat: legacy режими touch/path/depth мапляться у sanitize.js:
//   touch → root · path → heart · depth → initiate

export const PATH_MODES = {
  root: {
    id: 'root',
    name: 'Корінь',
    symbol: '🌍',
    color: '#a8c898',
    tag: 'опора',
    quote: '«Виснажений. Без ґрунту. Хочу повернутись у тіло.»',
    description: 'Для тих, хто живе у тривозі і втомі. Шлях через перші три чакри — '
                 + 'заземлення, відновлення тіла, повернення до простих опор.',
    forWhom: 'тривожні · виснажені · без ґрунту',
    questionsApprox: 28,
    durationApprox: '4–6 год',
    questionsPerLevel: 4,
    practicesPerLevel: 2,
    arbiterFreq: 'sparse',
    shadowsActive: false,
    constellationDepth: 'simple',
    details: [
      '4 питання на рівні',
      'без тіні — м`який вхід',
      'фокус на перших 3 чакрах',
      'багато тілесних практик',
      'Антип не турбує',
    ],
    focusChakras: [1, 2, 3],
    focusPetals: ['ii_body', 'iii_rod', 'iv_home'],
    recommendedChannels: ['tata', 'kraon', 'farun'],
    antypIntensity: 'low',
    tier: 'free',
    tierLabel: 'безкоштовно',
  },
  heart: {
    id: 'heart',
    name: 'Серце',
    symbol: '💗',
    color: '#f0a8b8',
    tag: 'любов і прощення',
    quote: '«Складні стосунки. Хочу любити без шантажу.»',
    description: 'Для тих, хто у складних стосунках, після розставання, у самотності. '
                 + 'Шлях через серединні чакри — серце, голос, прощення.',
    forWhom: 'самотні · у складних стосунках · після розставання',
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
      'тінь доступна',
      'повна розстановка з родом',
      'фокус на серці і голосі',
      'Антип з`являється регулярно',
    ],
    focusChakras: [3, 4, 5],
    focusPetals: ['v_relations', 'vi_creativity', 'i_self'],
    recommendedChannels: ['zevs', 'simargl'],
    antypIntensity: 'medium',
    tier: 'standard',
    tierLabel: 'підписка',
  },
  voice: {
    id: 'voice',
    name: 'Голос',
    symbol: '🗣',
    color: '#9fc8e8',
    tag: 'призначення і слово',
    quote: '«Творчо застряг. Не чую свого поклику.»',
    description: 'Для тих, у кризі сенсу — без поклику, з відчуттям недореалізованості, '
                 + 'творчо застряглих. Шлях через верхні чакри.',
    forWhom: 'у кризі сенсу · творчо застряглі · без поклику',
    questionsApprox: 42,
    durationApprox: '7–10 год',
    questionsPerLevel: 6,
    practicesPerLevel: 2,
    arbiterFreq: 'regular',
    shadowsActive: true,
    constellationDepth: 'full',
    details: [
      '6 питань на рівні',
      'тінь доступна',
      'фокус на голосі і призначенні',
      'розстановка з покликом',
      'Антип частіше на серці-горлі',
    ],
    focusChakras: [5, 6, 7],
    focusPetals: ['vii_realization', 'x_purpose', 'ix_knowledge'],
    recommendedChannels: ['farun-budda', 'gold-pyramid'],
    antypIntensity: 'medium',
    tier: 'standard',
    tierLabel: 'підписка',
  },
  shadow: {
    id: 'shadow',
    name: 'Тінь',
    symbol: '🌑',
    color: '#7a5a8a',
    tag: 'інтеграція',
    quote: '«Готовий зустрітись з тим, що ховаю. Без бігу.»',
    description: 'Для тих, хто пройшов терапію або глибоко знайомий зі собою, '
                 + 'готовий до зустрічі з тінню без захистів. Найжорсткіший трек.',
    forWhom: 'терапією-знайомі · готові до глибокої інтеграції',
    questionsApprox: 56,
    durationApprox: '10–14 год',
    questionsPerLevel: 8,
    practicesPerLevel: 3,
    arbiterFreq: 'frequent',
    shadowsActive: true,
    constellationDepth: 'full',
    details: [
      '8 питань на рівні',
      'тінь — основа гри',
      'дзеркала глибше',
      'Антип постійний супутник',
      'окрема пелюстка Тінь у фокусі',
    ],
    focusChakras: [3, 6, 7],
    focusPetals: ['xi_shadow', 'iii_rod', 'i_self'],
    recommendedChannels: ['sutra-karma', 'kkr'],
    antypIntensity: 'high',
    tier: 'deep',
    tierLabel: 'розширений',
  },
  initiate: {
    id: 'initiate',
    name: 'Ініціат',
    symbol: '✨',
    color: '#ffe7a8',
    tag: 'повне занурення',
    quote: '«Готовий йти на дно. Маю місяць. Простір для всього.»',
    description: 'Для тих, хто йде на космо повністю — усі 7 рівнів, 12 пелюсток, '
                 + '11 каналів. Найдовший шлях. Закінчується ініціацією у провідника.',
    forWhom: 'йдуть на космо повністю · готові до місяця занурення',
    questionsApprox: 84,
    durationApprox: '12–18 год',
    questionsPerLevel: 12,
    practicesPerLevel: 3,
    arbiterFreq: 'frequent',
    shadowsActive: true,
    constellationDepth: 'recursive',
    details: [
      '12 питань на рівні · максимум',
      'усі режими активні',
      'рекурсивна розстановка з кармою',
      'усі 11 каналів космо',
      'фінальна ініціація',
    ],
    focusChakras: [1, 2, 3, 4, 5, 6, 7],
    focusPetals: [],  // усі пелюстки у фокусі
    recommendedChannels: [],  // усі канали
    antypIntensity: 'high',
    tier: 'deep',
    tierLabel: 'розширений',
  },
};

export const PATH_MODE_ORDER = ['root', 'heart', 'voice', 'shadow', 'initiate'];

// Legacy mapping: для гравців із збереженим старим pathMode у localStorage.
export const LEGACY_TRACK_MAP = {
  touch: 'root',
  path: 'heart',
  depth: 'initiate',
};

export function migrateLegacyPathMode(oldId) {
  if (!oldId) return null;
  if (PATH_MODES[oldId]) return oldId;
  return LEGACY_TRACK_MAP[oldId] || null;
}
