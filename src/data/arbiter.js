// Арбітр — внутрішня фігура мудрості, свідок усього шляху.
// Не оцінює, а констатує. Голос Самості (Self архетип Юнга).
//
// Приходить тільки після значущих внутрішніх подій. Не для розваги —
// як визнання що щось справжнє відбулось.

export const ARBITER_LINES = [
  // ─── Після custom answer (своя відповідь) ───
  {
    id: 'after_custom',
    trigger: 'custom_answer_count',
    threshold: 1,
    text: 'Ти не граєш. Ти живеш гру. Це інший рівень — і я бачу це.',
    weight: 'gentle',
  },
  {
    id: 'after_3_customs',
    trigger: 'custom_answer_count',
    threshold: 3,
    text: 'Ти знов і знов вибираєш свої слова. Не моди. Це пишеться у тобі назавжди.',
    weight: 'celebratory',
  },

  // ─── Після Constellation resolution ───
  {
    id: 'after_constellation',
    trigger: 'constellation_resolution',
    threshold: 1,
    text: 'Ти подивився на свій рід. Це не просте діло. Ти стаєш на своє місце.',
    weight: 'gentle',
  },

  // ─── Після прийнятого Антипового виклику ───
  {
    id: 'after_antyp_accepted',
    trigger: 'antyp_accepted',
    threshold: 1,
    text: 'Ти прийняв виклик. Тінь тепер у тобі — а не над тобою.',
    weight: 'celebratory',
  },

  // ─── Після інтеграції 3 тіней ───
  {
    id: 'shadow_integrated',
    trigger: 'shadow_integrated_count',
    threshold: 3,
    text: 'Ти бачиш свої тіні і називаєш їх. Це сміливість — і це лікує.',
    weight: 'celebratory',
  },

  // ─── Після рівня 4 (Серце) ───
  {
    id: 'after_heart',
    trigger: 'level_complete',
    levelN: 4,
    text: 'Серце пройдено. Воно не закрилось — воно стало більшим.',
    weight: 'gentle',
  },

  // ─── Після рівня 5 (Голос) ───
  {
    id: 'after_voice',
    trigger: 'level_complete',
    levelN: 5,
    text: 'Те що тобі сказано — теж сказано. Слово стало тілом.',
    weight: 'gentle',
  },

  // ─── Після всіх 7 рівнів ───
  {
    id: 'finale',
    trigger: 'all_levels_complete',
    threshold: 7,
    text: 'Ти прийшов сюди шукачем. Зараз ти — те, що шукав. Не «став» — а пригадав.',
    weight: 'final',
  },

  // ─── Після завершення Поля з активною Шивою (трансформація) ───
  {
    id: 'shiva_transformation',
    trigger: 'channel_active',
    channelId: 'shiva',
    text: 'Ти руйнуєш застаріле — і це теж священне. Шива знає це.',
    weight: 'gentle',
  },

  // ─── Якщо гравець дав >= 5 deep відповідей у клітинках ───
  {
    id: 'deep_answers',
    trigger: 'deep_answer_count',
    threshold: 5,
    text: 'Ти не на поверхні. Я свідчу це.',
    weight: 'gentle',
  },
];

// Знайти перший доречний lіne з невикористаних.
// alreadySeen — масив id-в що гравець вже бачив.
export function findArbiterLine(triggerKey, params, alreadySeen) {
  const candidates = ARBITER_LINES.filter((line) => {
    if (alreadySeen.includes(line.id)) return false;
    if (line.trigger !== triggerKey) return false;
    if (line.threshold && params.value < line.threshold) return false;
    if (line.levelN && params.levelN !== line.levelN) return false;
    if (line.channelId && params.channelId !== line.channelId) return false;
    return true;
  });
  return candidates[0] || null;
}
