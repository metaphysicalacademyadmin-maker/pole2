// Детектор Кризи Системи і Точки Перевороту.
//
// Криза: 3+ барометри < -5. З'являється модалка-стоп.
// Якщо хоча б один < -8 → також показуємо helpline.
//
// Точка Перевороту: 4+ shadow-відповідей за останні 7 відповідей,
// І не показано раніше у цій сесії.

const CRISIS_THRESHOLD = -5;
const CRITICAL_THRESHOLD = -8;
const CRISIS_MIN_BAROMETERS = 3;
const TURNING_RECENT_WINDOW = 7;
const TURNING_SHADOW_MIN = 4;

export function detectCrisis(state) {
  const r = state.resources || {};
  const critical = [];
  const inCrisis = [];
  for (const [key, value] of Object.entries(r)) {
    if (value <= CRITICAL_THRESHOLD) critical.push({ key, value });
    if (value <= CRISIS_THRESHOLD) inCrisis.push({ key, value });
  }
  if (inCrisis.length < CRISIS_MIN_BAROMETERS) return null;
  return {
    inCrisis,
    critical,
    helpline: critical.length > 0,
  };
}

export function detectTurningPoint(state) {
  if (state.turningPointShown) return null;
  const answers = Object.values(state.cellAnswers || {})
    .sort((a, b) => (a.ts || 0) - (b.ts || 0));
  if (answers.length < TURNING_RECENT_WINDOW) return null;
  const recent = answers.slice(-TURNING_RECENT_WINDOW);
  const shadowCount = recent.filter((a) => a.depth === 'shadow').length;
  if (shadowCount < TURNING_SHADOW_MIN) return null;
  return { shadowCount, total: TURNING_RECENT_WINDOW };
}

// Точка Перевороту — фіксований "шаблон" клітинки. Не у data/cells/,
// бо це не звичайна клітинка а серйозна подія.
export const TURNING_POINT_CELL = {
  id: 'turning_point',
  title: '⚡ Точка Перевороту',
  prologue: 'Поле зупинило тебе тут невипадково. Це не питання-вибір. Це питання-визнання.',
  question: 'Що з цього найближче до правди тебе зараз — хоча жодне не зручне?',
  options: [
    { text: 'Я біжу від чогось — і втома вже не дає бігти.',
      barometer: 'will', delta: 2 },
    { text: 'Я перетворююсь на того, ким мені казали стати — а себе вже не пам\'ятаю.',
      barometer: 'voice', delta: 2 },
    { text: 'Я зробив собі домом біль — і боюсь що без нього мене нема.',
      barometer: 'flow', delta: 2 },
  ],
};
