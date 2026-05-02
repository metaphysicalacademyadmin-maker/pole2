// Початковий стан гри ПОЛЕ · Втілення.
// Виокремлено з gameStore.js, щоб тримати головний файл під лімітом 300 рядків.
// КРИТИЧНО: Identity-поля (sessionId, startedAt, savedAt) — частина контракту з
// бекендом metaphysical-way.academy, не перейменовувати.

export const SAVE_KEY = 'pole_game_state_v1';
export const HISTORY_KEY = 'pole_game_history_v1';
export const HISTORY_MAX = 50;

export const genSessionId = () =>
  Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);

export const defaultState = {
  // ─── Identity (КРИТИЧНІ — не перейменовувати) ───
  sessionId: null,
  startedAt: null,
  savedAt: null,

  // ─── Шлях ───
  intention: '',
  pathMode: null,             // 'touch' | 'path' | 'depth'
  currentLevel: 0,            // 0 = вхід, 1..7 = рівні
  unlockedLevels: [0, 1],
  completedLevels: [],
  levelKeys: {},              // {1: 'Я тут...', 2: 'Хочу...'}

  // ─── Прогрес рівня ───
  levelProgress: {},          // {levelN: {answeredCells: ['r1','r2']}}
  cellAnswers: {},            // {cellId: {choice, customText, barometer, delta, ts}}
  currentCellIdx: 0,
  awaitingKey: false,         // true після останньої клітинки рівня → показуємо Key

  // ─── Ресурси та шкали ───
  resources: {
    root: 0, flow: 0, will: 0, love: 0,
    voice: 0, clarity: 0, light: 0, gratitude: 0,
  },
  stateScales: { energy: 0, wound: 0, bondage: 0, clarity: 0, protection: 0 },

  // ─── Журнал ───
  journal: [],

  // ─── Сумісність із загальним бекенд-контрактом ───
  visited: [],
  keys: [],
  soulLevel: 0,
  barometers: { spirit: 0, psyche: 0, emotion: 0, awareness: 0 },
  // archetypesMet — масив {id, ts, context, ...}; детектори додають через addArchetype.
  archetypesMet: [],
  unlockedAbilities: [],
  completedInitiations: [],

  // ─── Розстановки (Хвиля 4) ───
  // {level3: {figures: [{id, type, x, y, rotation, weight}], readings: [], resolution: ''}}
  constellations: {},

  // ─── Карта тіла ───
  // {cellId: [{x, y, depth, ts, sensation}]}
  bodyMap: {},

  // ─── Практики (Академія) ───
  // [{id, levelN, durationSec, reflection, ts}]
  practiceCompletions: [],

  // ─── Космоенергетичні канали ───
  channelsUnlocked: [],         // ['kraon', 'zeus', ...]
  channelsActive: [],           // що зараз увімкнено
  channelActivations: {},       // {channelId: {count, lastUsed}}

  // ─── Кай — супутник ───
  kaiState: {
    trust: 0,                   // 0..10, росте від чесних відповідей
    lastSpoke: null,            // ts
    mood: 'gentle',             // 'gentle' | 'concerned' | 'celebratory'
  },

  // ─── Денні чек-іни ───
  // [{date, scales, dream, morning, ts}] — ранок / [{date, evening, ts}] — вечір
  dailyCheckIns: [],
  lastCheckInDate: null,        // 'YYYY-MM-DD' — ранковий
  lastEveningDate: null,        // 'YYYY-MM-DD' — вечірній

  // ─── Моральні дилеми (рівень 4) ───
  // {dilemmaId: {choice, customText, weight, ts}}
  moralChoices: {},

  // ─── Голос Душі ───
  // {keyN: dataUrl_base64}
  voiceRecordings: {},

  // ─── Резонанс ───
  resonanceSeen: [],

  // ─── Еволюція між сесіями ───
  // {previousSessionId, previousIntention, previousKeys, divergenceScore}
  evolutionEcho: null,

  // ─── Карта Поля (Хвиля 5) ───
  // [{bodyId, score, ts}] — історія вимірювань
  bodyMeasurements: [],

  // ─── Арбітр і Антип (Хвиля 6) ───
  arbiterAppearances: [],
  antypAppearances: [],
  praxis: 5,

  // ─── Реактивне тіло (Хвиля 7) ───
  flashChakraId: null,
  flashCounter: 0,
  // dim — пригасання чакри після shadow-вибору (3 сек)
  dimChakraId: null,
  dimCounter: 0,

  // ─── Mirror persona (Хвиля 7) ───
  mirrorAppearances: [],

  // ─── Аура: вимірювання до/після практики ключових слів ───
  // [{cellId, levelN, before, after, delta, keyword, ts}] — у см
  auraReadings: [],

  // ─── Калібровка архетипу (на 3-й клітинці) ───
  archetypeCalibration: { status: null, suggested: null, confirmed: null, ts: null },

  // ─── Трансформація архетипу (після рівнів 5-7) ───
  currentArchetypeTransformation: null,
  archetypeTransformations: [],

  // ─── Спеціалізація (після рівня 4) ───
  specialization: null,
  specializationOpen: false,

  // ─── 12 пелюсток (post-game expansion) ───
  petalsActive: false,
  currentPetalId: null,
  petalAnswers: {},
  petalProgress: {},

  // ─── Гілка космоенергетики (5 рівнів) ───
  cosmoApplication: null,
  cosmoIntroSeen: [],
  channelProgress: {},
  channelAnswers: {},
  currentChannelId: null,

  // ─── Резонансні дзеркала (псевдо-соціал) ───
  currentResonance: null,
  resonanceHistory: [],
  joinedCircle: null,

  // ─── Партнерство ───
  partnership: null,

  // ─── Snake-клітинки: подвійне падіння ───
  snakePenalties: [],

  // ─── Дзеркало Тіні (AI-аналіз custom-відповіді) ───
  currentShadowMirror: null,
  shadowMirrorHistory: [],

  // ─── Криза Системи + Точка Перевороту ───
  crisisAcknowledgedTs: null,
  turningPointShown: false,
  turningPointResponse: null,

  // ─── Черга модалок (одна за раз, з пріоритетами) ───
  activeModal: null,
  modalQueue: [],

  // ─── Досягнення (Personal Cabinet) ───
  // [{id, ts}] — ID + коли отримано
  achievements: [],

  // ─── UI preferences ───
  uiMode: 'map',
  themeMode: 'dark',

  // ─── Onboarding ───
  onboardingDone: false,
};

export function ensureSession(s) {
  return {
    sessionId: s.sessionId || genSessionId(),
    startedAt: s.startedAt || Date.now(),
    savedAt: Date.now(),
  };
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
