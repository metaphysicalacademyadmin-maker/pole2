// Барометр → канал матчинг (узгоджено з 7-канальною схемою).
// Якщо барометр у мінусі (≤ -3) — рекомендуємо канал що його лікує.
// Зв'язок через смисл каналу:
//
//   root      — тіло/опора → Краон (омолодження, регенерація)
//   flow      — потік → Фіраст (очищення для потоку)
//   will      — воля/межі → Золота Піраміда (захист, накопичення)
//   love      — серце → Анаель (любов, гармонія)
//   voice     — голос/правда → Лугра (розчиняє блоки голосу)
//   clarity   — ясність → Фарун-Будда (запуск чакр, наповнення)
//   light     — світло/цінність → Золота Піраміда (духовна висота)
//   gratitude — подяка → Анаель (тепло, відкрите серце)

const BAROMETER_CHANNEL_MAP = {
  root:      { channelId: 'kraon',          hint: 'омолодження — поверне тіло у дім' },
  flow:      { channelId: 'firast',         hint: 'очистить аури і поверне потік' },
  will:      { channelId: 'golden_pyramid', hint: 'збудує захист — поверне межі' },
  love:      { channelId: 'anael',          hint: 'розкриє серце — без шантажу' },
  voice:     { channelId: 'lugra',          hint: 'розчинить блоки в горлі' },
  clarity:   { channelId: 'farun_budda',    hint: 'наповнить чакри ясною енергією' },
  light:     { channelId: 'golden_pyramid', hint: 'духовна висота — нагадає цінність' },
  gratitude: { channelId: 'anael',          hint: 'наповнить серце вдячністю' },
};

const BAROMETER_LABELS = {
  root: 'Корінь', flow: 'Потік', will: 'Воля', love: 'Любов',
  voice: 'Голос', clarity: 'Ясність', light: 'Світло', gratitude: 'Подяка',
};

const THRESHOLD = -3;     // починаємо рекомендувати коли барометр <= -3

/**
 * Знайти найслабший барометр і запропонувати канал.
 * Повертає null якщо нічого не критично, або об'єкт з рекомендацією.
 */
export function findChannelRecommendation(state) {
  const r = state?.resources || {};
  const channelsUnlocked = state?.channelsUnlocked || [];
  const cosmoApproved = state?.cosmoApplication?.status === 'approved'
    || state?.cosmoApplication?.status === 'initiated';

  // Шукаємо найслабший барометр який <= threshold (-3)
  let weakest = null;
  let minVal = Infinity;
  for (const [k, v] of Object.entries(r)) {
    if (v <= THRESHOLD && v < minVal) {
      minVal = v;
      weakest = k;
    }
  }
  if (!weakest) return null;

  const map = BAROMETER_CHANNEL_MAP[weakest];
  if (!map) return null;

  const hasChannel = channelsUnlocked.includes(map.channelId);

  return {
    barometer: weakest,
    barometerLabel: BAROMETER_LABELS[weakest] || weakest,
    barometerValue: r[weakest],
    channelId: map.channelId,
    channelHint: map.hint,
    hasAccess: hasChannel,
    cosmoApproved,
  };
}
