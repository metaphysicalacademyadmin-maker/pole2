// ╔═══════════════════════════════════════════════════════════════════╗
// ║ Конфігурація мандали — єдине джерело істини для секторів/пелюсток ║
// ╚═══════════════════════════════════════════════════════════════════╝
//
// ── Призначення ──────────────────────────────────────────────────────
// Тут живуть ВСІ ідентифікатори, кількості і назви, з якими працює
// `Mandala/index.jsx` та (у майбутньому) ігровий стор. Якщо тобі треба
// додати/прибрати сектор, перейменувати його, переконфігурувати стартові
// блокування — РОБИ ЦЕ ТУТ. Не дублюй ці значення в інших файлах.
//
// ── Що НЕ можна міняти без перетеговування SVG ───────────────────────
// `TOTAL_RINGS`, `PETALS_PER_RING`, `TOTAL_PETALS` — ці числа збігаються
// зі структурою `src/assets/mandalas-1.svg` (теговано через
// `scripts/tag-mandala.js`). Якщо переекспортуєш SVG з Illustrator —
// перезапусти скрипт, потім онови ці константи.
//
// ── Як гра відкриває/блокує сектори і пелюстки ───────────────────────
// Mandala-компонент приймає 3 props (див. Mandala/index.jsx):
//   - lockedSectors:  Set<number>   ID 0..8 заблокованих секторів
//   - unlockedPetals: Set<string>   ключі точково-відкритих пелюсток
//   - lockedPetals:   Set<string>   ключі точково-заблокованих пелюсток
//
// Ключ пелюстки — рядок виду "ring-petal" (наприклад "3-17"). Створюй
// через `petalKey(ring, petal)`, парс через `parsePetalKey(key)`.
//
// Приклади:
//   // Відкрити сектор «Творчість» (id=5):
//   const next = new Set(prevLockedSectors);
//   next.delete(5);
//   setLockedSectors(next);
//
//   // Відкрити одну пелюстку поверх заблокованого сектора:
//   setUnlockedPetals(new Set([petalKey(3, 17)]));
//
//   // Заблокувати конкретну пелюстку у відкритому секторі:
//   setLockedPetals(new Set([petalKey(2, 4)]));
//
// Логіка пріоритетів (див. `isPetalLocked` нижче):
//   1) пелюстка є в `unlockedPetals` → ВІДКРИТА (точкове перевизначення)
//   2) пелюстка є в `lockedPetals`   → ЗАБЛОКОВАНА (точкове перевизначення)
//   3) сектор є в `lockedSectors`    → ЗАБЛОКОВАНА (за сектором)
//   4) інакше                         → ВІДКРИТА

// ─── Структура SVG ─────────────────────────────────────────────
// Ці значення зафіксовані формою SVG (mandalas-1.svg після
// scripts/tag-mandala.js). Не міняти без перетеговування ассета.
export const TOTAL_RINGS = 9;
export const PETALS_PER_RING = 35;
export const TOTAL_PETALS = TOTAL_RINGS * PETALS_PER_RING; // 315

// ─── Сектори ───────────────────────────────────────────────────
// 9 секторів за годинниковою стрілкою від верху. Назви взято з
// pole(html)/Exelentpole_game.html (стара версія гри).
export const SECTORS = [
  { id: 0, glyph: '☉', name: 'Я · Самість' },
  { id: 1, glyph: '✶', name: 'Тіло' },
  { id: 2, glyph: '⚭', name: 'Рід' },
  { id: 3, glyph: '⌂', name: 'Дім · Матерія' },
  { id: 4, glyph: '☯', name: 'Стосунки' },
  { id: 5, glyph: '✺', name: 'Творчість' },
  { id: 6, glyph: '⚡', name: 'Реалізація' },
  { id: 7, glyph: '✦', name: 'Духовність' },
  { id: 8, glyph: '∞', name: 'Єдність' },
];

export const TOTAL_SECTORS = SECTORS.length; // 9
export const PETALS_PER_SECTOR = TOTAL_PETALS / TOTAL_SECTORS; // 35

// ─── Ключі пелюсток ────────────────────────────────────────────
// Ключ виду "ring-petal" (рядок) — стабільний ID пелюстки. Використовується
// для Set обраних/розблокованих, для ID у DOM (`#petal-${ring}-${petal}`).
export function petalKey(ring, petal) {
  return `${ring}-${petal}`;
}

export function parsePetalKey(key) {
  const [ring, petal] = key.split('-').map(Number);
  return { ring, petal };
}

// ─── Стартовий стан блокування ─────────────────────────────────
// Стартово 5 секторів відкрито (0..4 — Я, Тіло, Рід, Дім, Стосунки),
// 4 заблоковано (5..8 — Творчість, Реалізація, Духовність, Єдність).
// Гра пізніше переопрацює цей стан через store.
export const DEFAULT_LOCKED_SECTORS = new Set([5, 6, 7, 8]);

// Стартово жодна окрема пелюстка не «розблокована-окремо» — всі підкоряються
// логіці свого сектора. Гра може додавати сюди ключі для точкового відкриття
// (наприклад «гравець відкрив petal-3-17 за досягнення X» поверх locked sector).
export const DEFAULT_UNLOCKED_PETALS = new Set();

// Аналогічно для індивідуально-заблокованих пелюсток (поверх відкритого сектора).
export const DEFAULT_LOCKED_PETALS = new Set();

// Пелюстки у стані «маяк» — щойно розблоковані, активні для гравця, мають
// пульсувати золотим світлом щоб привернути увагу. Гра передає цю Set'у
// після події unlock; коли гравець клікне на пелюстку (відкриє модалку
// рівнів / завершить рівень) — гра має прибрати ключ із Set'и.
// Може містити багато ключів одночасно.
export const DEFAULT_BEACON_PETALS = new Set();

// ─── Рівні всередині пелюстки (геймплей-прогресія) ─────────────
// Кожна пелюстка має N «рівнів». Виконав рівень → пелюстка зафарбовується
// пропорційно. Кількість рівнів МОЖЕ ВАРІЮВАТИСЬ:
//   - дефолт runtime: береться з кількості sub-`<g>` пелюстки (детектиться
//     при mount у Mandala/index.jsx). Зовнішні ринги 1-3 мають 4-7
//     sub-group'ів → 4-7 рівнів; внутрішні ринги 7-9 мають 1-2 → 1-2 рівні.
//   - якщо у пелюстки 0 sub-group'ів (рідкісний кейс) — fallback на
//     `DEFAULT_LEVELS_PER_PETAL` (5)
//   - override через `petalLevelOverrides` (Map: petalKey → number)
//     перебиває дефолт; гра передає її у props
//
// Візуальне фарбування: floor((done/total) * subGroupCount) перших
// sub-group'ів підсвічуються золотом. Якщо total ≠ subGroupCount (через
// override), фарбування все одно гранулюється по наявних sub-group'ах.
export const DEFAULT_LEVELS_PER_PETAL = 5;
export const DEFAULT_PETAL_LEVEL_OVERRIDES = new Map(); // empty → автодетект із sub-group'ів

// Стан проходження: petalKey → Set<levelIndex> (1-based). Пуста Map =
// нічого не пройдено. Гра передаватиме свою Map через `petalProgress` prop.
export const DEFAULT_PETAL_PROGRESS = new Map();

export function getPetalLevelCount(ring, petal, overrides = DEFAULT_PETAL_LEVEL_OVERRIDES) {
  const k = petalKey(ring, petal);
  return overrides.get(k) ?? DEFAULT_LEVELS_PER_PETAL;
}

export function getPetalCompletedSet(ring, petal, progress = DEFAULT_PETAL_PROGRESS) {
  const k = petalKey(ring, petal);
  return progress.get(k) ?? new Set();
}

export function getPetalCompletionRatio(ring, petal, overrides, progress) {
  const total = getPetalLevelCount(ring, petal, overrides);
  const done = getPetalCompletedSet(ring, petal, progress).size;
  return total > 0 ? done / total : 0;
}

// ─── Стан блокування пелюстки ───────────────────────────────────
// Повертає одне з:
//   'sector' — заблокована, бо весь сектор закритий (темно-сіра пелюстка)
//   'petal'  — заблокована точково в межах ВІДКРИТОГО сектора (інший
//              колір — синюватий — щоб гравець бачив що це «майже відкрито,
//              ще треба щось зробити»)
//   null     — відкрита, клікабельна
//
// Логіка пріоритетів:
//   1. unlockedPetals містить ключ → null (точкове відкриття поверх locked sector)
//   2. lockedPetals містить ключ → 'petal' (точкове блокування у відкритому)
//   3. lockedSectors містить sectorId → 'sector'
//   4. Інакше — null
export function getPetalLockState({
  ring, petal, sector,
  lockedSectors = DEFAULT_LOCKED_SECTORS,
  unlockedPetals = DEFAULT_UNLOCKED_PETALS,
  lockedPetals = DEFAULT_LOCKED_PETALS,
}) {
  const key = petalKey(ring, petal);
  if (unlockedPetals.has(key)) return null;
  if (lockedPetals.has(key)) return 'petal';
  if (lockedSectors.has(sector)) return 'sector';
  return null;
}

// ╔═══════════════════════════════════════════════════════════════════╗
// ║ COLORS — глобальна палітра мандали (фігура + анімаційна душа)     ║
// ╚═══════════════════════════════════════════════════════════════════╝
//
// Єдине джерело істини для всіх кольорів. Зміна тут → зміна і в JS-коді
// (Mandala/index.jsx — soul, дивайдери, мітки), і в CSS (styles.css —
// fills, drop-shadow, text). Технічно: компонент інжектить ці значення як
// CSS custom properties (`--mnd-*`) у inline style на .mnd-overlay,
// styles.css ці змінні читає через `var(--mnd-*)`.
export const COLORS = {
  // ─── Золото (відкриті пелюстки, мітки, дивайдери, hover) ───────
  gold:          '#f0c574',                       // основний золотий (мітки секторів, дивайдери)
  goldBright:    '#ffd700',                       // selected: яскравий fill білого силуету
  goldDeep:      '#a85d10',                       // selected: глибокий fill темної деталі
  goldGlow:      'rgba(232, 196, 118, 0.7)',      // hover drop-shadow одиночної пелюстки
  goldSoft:      'rgba(232, 196, 118, 0.5)',      // sector-hover drop-shadow (35 одночасно)
  goldHaze:      'rgba(232, 196, 118, 0.12)',     // м'який ореол навколо SVG
  goldHairline:  'rgba(232, 196, 118, 0.15)',     // межа stage container
  goldFaintBg:   'rgba(232, 196, 118, 0.1)',      // hover bg на close-button

  // ─── Бронза / «червоне золото» (petal-locked у відкритому секторі) ─
  bronzeFill:    'rgba(205, 127, 50, 0.6)',       // білий силует semi-transparent
  bronzeDeep:    '#5e3a1a',                       // темна деталь — глибока бронза

  // ─── Locked сектор ─────────────────────────────────────────────
  sectorLockedText: '#5a4e5c',                    // мітка приглушена сіро-фіолетова

  // ─── Текст ─────────────────────────────────────────────────────
  textPrimary:   '#fff7e0',                       // заголовки, mnd-title
  textSecondary: '#c8b9a0',                       // mnd-info, close button

  // ─── Overlay фон ───────────────────────────────────────────────
  overlayBgTop:    'rgba(8, 4, 16, 0.97)',
  overlayBgBottom: 'rgba(20, 14, 30, 0.98)',
  stageBg:         'rgba(255, 247, 224, 0.02)',   // ледь-освітлений bg всередині stage

  // ─── «Душа» в центрі — фіолетова палітра частинок ──────────────
  soulParticles: [
    '#c4b5fd', // light lavender
    '#a78bfa', // violet
    '#d8b4fe', // orchid
    '#e9d5ff', // pearl-violet
    '#f0abfc', // pink-magenta
  ],

  // ─── Вогонь (beacon-burning effect) ────────────────────────────
  fireOrange:    '#ff7a1a',
  fireYellow:    '#ffd055',
  fireRed:       '#ff3d00',
  fireEmber:     '#ff9540',

  // ─── Рубінова палітра (beacon pulse) ───────────────────────────
  rubyLight:     '#dc2c47',                       // м'який (нижня межа пульсації)
  rubyBright:    '#ff1744',                       // яскравий (пік пульсації)
  ruby:          '#b80f2c',                       // повний рубін (для drop-shadow)
  rubyDeep:      '#5c0815',                       // глибокий (deep-detail на піку)
  rubyDeepMute:  '#2e0510',                       // приглушений deep (нижня межа)
};

// ╔═══════════════════════════════════════════════════════════════════╗
// ║ LAYOUT — геометрія мандали (radii, центри, розміри міток)         ║
// ╚═══════════════════════════════════════════════════════════════════╝
// SVG viewBox 800×800. Mandala центр (400, 400). Ринги розташовані
// концентрично; ring-1 (зовн.) ~radius 300, ring-9 (внутр.) ~radius 110.
export const LAYOUT = {
  CX: 400, CY: 400,                     // центр мандали у viewBox

  // Душа в центрі — частинки рухаються у радіусі R_MAX від центру
  SOUL_RADIUS_MAX: 95,                  // безпечно вписано в void перед ring-9 (~111)

  // Радіальні роздільники секторів (тонкі золоті лінії)
  SECTOR_DIVIDER_INNER: 105,            // початок: за ring-9, не зачіпаючи душу
  SECTOR_DIVIDER_OUTER: 360,            // кінець: за ring-1
  SECTOR_LABEL_RADIUS: 395,             // позиція тексту мітки

  DIVIDER_STROKE_WIDTH: 1.2,            // товщина роздільника
  DIVIDER_OPACITY: 0.32,                // прозорість роздільника

  LABEL_GLYPH_FONT_SIZE: 22,            // гліф над назвою сектора
  LABEL_NAME_FONT_SIZE: 12,             // назва сектора
  LABEL_NAME_DY: 22,                    // вертикальний відступ назви від гліфа
};

// ╔═══════════════════════════════════════════════════════════════════╗
// ║ SOUL — параметри анімаційних частинок «душі» в центрі              ║
// ╚═══════════════════════════════════════════════════════════════════╝
// Налаштування частинок (не кольори — кольори в COLORS.soulParticles).
// Усі ймовірнісні параметри використовуються один раз при створенні
// частинки; вживляються кожний кадр у requestAnimationFrame loop.
export const SOUL = {
  PARTICLE_COUNT: 50,                   // загальна кількість частинок

  // Розмір кола (radius у SVG units)
  SIZE_MIN: 10,
  SIZE_RANGE: 22,                       // максимум = MIN + RANGE (32)

  // Прозорість частинок (опорна; реальна модулюється «диханням»)
  OPACITY_MIN: 0.35,
  OPACITY_RANGE: 0.4,                   // максимум = MIN + RANGE (0.75)

  // Початкова позиція: random angle, radius у [0, R_MAX·R_INIT_RATIO]
  R_INIT_RATIO: 0.6,                    // 60% від SOUL_RADIUS_MAX

  // Початкова швидкість (vx/vy у [-VEL_INIT/2, +VEL_INIT/2])
  VELOCITY_INIT: 0.6,

  // Хаотичний поштовх (random forces щокадра)
  CHAOS_FORCE: 0.4,                     // (random()-0.5) * CHAOS_FORCE

  // Демпфування швидкості (множник на кадр)
  DAMPING: 0.92,                        // 0.9-0.95 = плавний рух

  // Тяжіння до центру коли частинка йде далеко
  CENTER_PULL_NEAR: 0.05,               // м'яке притягування біля межі (>70%)
  CENTER_PULL_FAR: 0.22,                // сильніше за межею
  CENTER_PULL_THRESHOLD: 0.7,           // ratio від R_MAX, далі — NEAR

  // «Дихання» opacity: amplitude·sin(t·SPEED + phase) + base
  BREATHE_SPEED: 2.2,                   // швидкість пульсації
  BREATHE_AMPLITUDE: 0.45,              // розмах
  BREATHE_BASE: 0.55,                   // нижня межа

  // Blur layer для туманного ефекту (px)
  BLUR_PX: 7,
};

// ╔═══════════════════════════════════════════════════════════════════╗
// ║ BEACON — параметри пульсації «активної» пелюстки                   ║
// ╚═══════════════════════════════════════════════════════════════════╝
// Налаштування ефекту .mnd-petal.is-beacon. Колір беремо з COLORS.ruby*
// (керується звідти, не тут). Тут — ВИКЛЮЧНО геометрія/тривалість пульсу:
//   - тривалість одного циклу
//   - тривалість для prefers-reduced-motion
//   - радіуси halo (rest stage / peak inner / peak outer)
//
// Щоб змінити колір рубіна → редагуй COLORS.ruby/rubyBright/rubyLight/etc.
// Щоб поміняти швидкість/інтенсивність пульсу → тут.
export const BEACON = {
  DURATION_MS: 3500,                    // повний цикл pulse
  DURATION_REDUCED_MS: 5000,            // для prefers-reduced-motion
  SHADOW_BASE_PX: 4,                    // halo у момент спокою (0% і 100%)
  SHADOW_PEAK_OUTER_PX: 18,             // велике зовнішнє кільце на 50%
  SHADOW_PEAK_INNER_PX: 8,              // ближнє внутрішнє кільце на 50%
};

// ╔═══════════════════════════════════════════════════════════════════╗
// ║ MODAL_OPEN — фази відкриття модалки рівнів (Trace → Modal)         ║
// ╚═══════════════════════════════════════════════════════════════════╝
// Драматичне відкриття — дві спіральні лінії вилітають із клікнутої
// пелюстки, спіраллю йдуть до протилежних кутів майбутньої модалки,
// далі обводять її контур по периметру. Коли рамка майже домальована —
// усередині матеріалізується модалка зі списком рівнів.
//
// Часова шкала:
//   0                                  TRACE_DRAW_MS
//   |--- spiral з пелюстки → перимеетр модалки ---|
//                          ^                       ^
//                   MODAL_REVEAL_DELAY_MS    + MODAL_REVEAL_MS
//
// TRACE_TURNS — скільки повних обертів робить спіраль перед досягненням
// кута модалки. Більше — більш «магічний» feel, менше — швидше.
// MODAL_W/MODAL_H — приблизні розміри модалки (для розрахунку траси).
export const MODAL_OPEN = {
  TRACE_DRAW_MS: 1400,                  // тривалість малювання спіралі+рамки
  MODAL_REVEAL_DELAY_MS: 1100,          // коли модалка починає матеріалізуватись
  MODAL_REVEAL_MS: 500,                 // тривалість появи модалки
  TRACE_TURNS: 1.5,                     // скільки обертів робить спіраль
  TRACE_SAMPLES: 60,                    // points у спіральній частині path
  // MODAL_W/H — максимум; ModalTrace обмежує їх viewport-ом (vw-32, vh-32).
  // Зараз модалка повноекранна, тому ставимо великі значення (cap не діє).
  MODAL_W: 4000,
  MODAL_H: 4000,

  // Закриття у зворотньому порядку:
  //   0          MODAL_REVEAL_MS       TRACE_DRAW_MS    +OVERLAY_FADE_MS
  //   |--модалка згасає--|                              |
  //   |---trace стирається у напрямку до пелюстки-------|
  //                                                     |--overlay fade--|
  CLOSE_OVERLAY_FADE_DELAY_MS: 1400,    // коли overlay починає згасати (= TRACE_DRAW_MS)
  CLOSE_OVERLAY_FADE_MS: 400,           // тривалість згасання overlay
};
// Загальна тривалість закриття — для setTimeout на unmount
export const MODAL_CLOSE_TOTAL_MS =
  MODAL_OPEN.CLOSE_OVERLAY_FADE_DELAY_MS + MODAL_OPEN.CLOSE_OVERLAY_FADE_MS;

// ╔═══════════════════════════════════════════════════════════════════╗
// ║ ANIMATION — тривалості анімацій                                    ║
// ╚═══════════════════════════════════════════════════════════════════╝
export const ANIMATION = {
  ENTRY_DURATION_MS: 700,               // mandala emerge fade-in/blur/scale
  ENTRY_DURATION_REDUCED_MS: 300,       // для prefers-reduced-motion
  PETAL_TRANSITION_MS: 300,             // hover/select/locked transitions
  FILL_TRANSITION_MS: 1100,             // fill-color transition (beacon, selected, done — плавне появлення)
  MODAL_FADE_MS: 200,                   // overlay модалки рівнів
};

// ╔═══════════════════════════════════════════════════════════════════╗
// ║ Z_INDEX — z-індекси для overlay-шарів                              ║
// ╚═══════════════════════════════════════════════════════════════════╝
export const Z_INDEX = {
  OVERLAY: 1100,                        // .mnd-overlay (мандала)
  MODAL: 1200,                          // .mnd-levels-overlay (модалка рівнів)
};

// Маппінг ВСІХ налаштувань у CSS custom properties — інжектиться через
// inline style на .mnd-overlay у компоненті. styles.css читає `var(--mnd-*)`.
export function buildCssVars() {
  return {
    // Кольори
    '--mnd-gold': COLORS.gold,
    '--mnd-gold-bright': COLORS.goldBright,
    '--mnd-gold-deep': COLORS.goldDeep,
    '--mnd-gold-glow': COLORS.goldGlow,
    '--mnd-gold-soft': COLORS.goldSoft,
    '--mnd-gold-haze': COLORS.goldHaze,
    '--mnd-gold-hairline': COLORS.goldHairline,
    '--mnd-gold-faint-bg': COLORS.goldFaintBg,
    '--mnd-bronze-fill': COLORS.bronzeFill,
    '--mnd-bronze-deep': COLORS.bronzeDeep,
    '--mnd-sector-locked-text': COLORS.sectorLockedText,
    '--mnd-text-primary': COLORS.textPrimary,
    '--mnd-text-secondary': COLORS.textSecondary,
    '--mnd-overlay-bg-top': COLORS.overlayBgTop,
    '--mnd-overlay-bg-bottom': COLORS.overlayBgBottom,
    '--mnd-stage-bg': COLORS.stageBg,
    '--mnd-fire-orange': COLORS.fireOrange,
    '--mnd-fire-yellow': COLORS.fireYellow,
    '--mnd-fire-red': COLORS.fireRed,
    '--mnd-fire-ember': COLORS.fireEmber,
    '--mnd-ruby-light': COLORS.rubyLight,
    '--mnd-ruby-bright': COLORS.rubyBright,
    '--mnd-ruby': COLORS.ruby,
    '--mnd-ruby-deep': COLORS.rubyDeep,
    '--mnd-ruby-deep-mute': COLORS.rubyDeepMute,

    // Beacon (pulse-effect knobs)
    '--mnd-beacon-duration': `${BEACON.DURATION_MS}ms`,
    '--mnd-beacon-duration-reduced': `${BEACON.DURATION_REDUCED_MS}ms`,
    '--mnd-beacon-shadow-base': `${BEACON.SHADOW_BASE_PX}px`,
    '--mnd-beacon-shadow-peak-outer': `${BEACON.SHADOW_PEAK_OUTER_PX}px`,
    '--mnd-beacon-shadow-peak-inner': `${BEACON.SHADOW_PEAK_INNER_PX}px`,

    // Modal open (trace + reveal phases)
    '--mnd-trace-draw-ms': `${MODAL_OPEN.TRACE_DRAW_MS}ms`,
    '--mnd-modal-reveal-delay-ms': `${MODAL_OPEN.MODAL_REVEAL_DELAY_MS}ms`,
    '--mnd-modal-reveal-ms': `${MODAL_OPEN.MODAL_REVEAL_MS}ms`,
    '--mnd-close-overlay-fade-delay-ms': `${MODAL_OPEN.CLOSE_OVERLAY_FADE_DELAY_MS}ms`,
    '--mnd-close-overlay-fade-ms': `${MODAL_OPEN.CLOSE_OVERLAY_FADE_MS}ms`,

    // Анімації
    '--mnd-entry-ms': `${ANIMATION.ENTRY_DURATION_MS}ms`,
    '--mnd-entry-ms-reduced': `${ANIMATION.ENTRY_DURATION_REDUCED_MS}ms`,
    '--mnd-petal-transition-ms': `${ANIMATION.PETAL_TRANSITION_MS}ms`,
    '--mnd-fill-transition-ms': `${ANIMATION.FILL_TRANSITION_MS}ms`,
    '--mnd-modal-fade-ms': `${ANIMATION.MODAL_FADE_MS}ms`,

    // Z-індекси
    '--mnd-z-overlay': Z_INDEX.OVERLAY,
    '--mnd-z-modal': Z_INDEX.MODAL,
  };
}

// Backward-compat alias (видалити коли всі споживачі переїдуть)
export const buildColorCssVars = buildCssVars;
