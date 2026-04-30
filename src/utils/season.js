// Сезонність — місяць/пора року впливає на колір cosmos і репліки.
// Без зовнішніх API — все обчислюється з Date.

export function currentSeason(date = new Date()) {
  const m = date.getMonth();
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
}

// Простий розрахунок фази місяця. Не астрономічно точний — для атмосфери достатньо.
export function moonPhase(date = new Date()) {
  // Дні від відомого нового місяця (2000-01-06)
  const refNew = new Date('2000-01-06T00:00:00Z').getTime();
  const lunarCycle = 29.53059;
  const days = (date.getTime() - refNew) / (1000 * 60 * 60 * 24);
  const phase = ((days % lunarCycle) + lunarCycle) % lunarCycle;
  if (phase < 1.84) return { id: 'new',      name: 'Новий місяць',     symbol: '○' };
  if (phase < 5.53) return { id: 'waxing_c', name: 'Молодий',          symbol: '☽' };
  if (phase < 9.22) return { id: 'first_q',  name: 'Перша чверть',     symbol: '◐' };
  if (phase < 12.91) return { id: 'waxing_g', name: 'Зростаючий',      symbol: '◑' };
  if (phase < 16.61) return { id: 'full',    name: 'Повний',           symbol: '●' };
  if (phase < 20.30) return { id: 'waning_g', name: 'Спадаючий',       symbol: '◓' };
  if (phase < 24.00) return { id: 'last_q',  name: 'Остання чверть',   symbol: '◒' };
  return                   { id: 'waning_c', name: 'Старий',           symbol: '☾' };
}

// Тон cosmos-bg за сезоном
export function seasonTone(season) {
  switch (season) {
    case 'spring': return { hue: 100, sat: 30 };  // зеленувате
    case 'summer': return { hue: 220, sat: 50 };  // насичено-синє
    case 'autumn': return { hue: 30,  sat: 40 };  // теплий пурпур
    case 'winter': return { hue: 270, sat: 35 };  // холодно-фіолетове (зараз)
    default:       return { hue: 270, sat: 35 };
  }
}

// Шепіт сезону — коротке нагадування (показується разом з картою дня)
export function seasonWhisper(season, phase) {
  const seasonText = {
    spring: 'Земля прокидається. Дозволь і собі.',
    summer: 'Все живе. Свети повно.',
    autumn: 'Час відпускати. Лист падає — і це ок.',
    winter: 'Внутрішнє важливіше за зовнішнє зараз.',
  }[season];
  const phaseText = {
    new:       'Новий місяць — час намірів.',
    full:      'Повний місяць — час відпускати.',
    first_q:   'Половина росту — рухайся.',
    last_q:    'Половина спаду — підбивай підсумки.',
  }[phase.id] || '';
  return [seasonText, phaseText].filter(Boolean).join(' ');
}
