// Барометр → канал матчинг.
// Якщо барометр у мінусі (< -3) — рекомендуємо канал що його лікує.
// Зв'язок інтуїтивно через смисл каналу:
//
//   root        — заземлення/опора → Тата (оздоровчий)
//   flow        — потік/творчість → Зевс
//   will        — воля/межі → Сімаргл (захисний, спалює прив'язки)
//   love        — серце → Зевс (творчо-серцевий) або Фарун-Будда
//   voice       — голос/правда → Фарун-Будда (універсальний наповнюючий)
//   clarity     — ясність думок → ККР (контроль думок)
//   light       — світло/цінність → Золота Піраміда (масштаб, висока амплітуда)
//   gratitude   — подяка → Фарун-Будда

const BAROMETER_CHANNEL_MAP = {
  root:      { channelId: 'tata',         hint: 'оздоровчий — поверни тіло у дім' },
  flow:      { channelId: 'zevs',         hint: 'ударний — запалить твою чакру і потік' },
  will:      { channelId: 'simargl',      hint: 'спалить прив\'язки — поверни межі' },
  love:      { channelId: 'zevs',         hint: 'розпалить серце — без шантажу' },
  voice:     { channelId: 'farun-budda',  hint: 'наповнить голос чистою енергією' },
  clarity:   { channelId: 'kkr',          hint: 'розчистить негативні думки' },
  light:     { channelId: 'gold-pyramid', hint: 'духовний канал масштабу — нагадує цінність' },
  gratitude: { channelId: 'farun-budda',  hint: 'наповнить серце вдячністю' },
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
