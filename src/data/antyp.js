// Антип — внутрішній провокатор. Тінь у фігурі, що штовхає тебе на правду.
// Не злий, не добрий. Каталізатор. Якщо гравець грає у "правильні відповіді",
// Антип кличе його на справжнє.
//
// Триггериться коли гравець:
//   1. Дає 3+ "deep" відповідей поспіль без custom — поверхневість
//   2. Уникає тіньових варіантів попри shadow detection
//   3. Має високі ресурси, але мало журналу — імітує
//   4. Має >5 клітинок без жодної shadow/deep тіні — все «гарно»
//
// Кожен виклик має 3 варіанти відповіді з наслідками для барометрів.

export const ANTYP_PROVOCATIONS = [
  {
    id: 'too_safe',
    trigger: 'safe_pattern',
    title: 'Антип',
    setup: 'Ти 3 раз поспіль обираєш «глибоку» відповідь. Як на іспиті.',
    challenge: 'Хочеш виглядати чи бути?',
    options: [
      {
        id: 'truth',
        text: 'Скажу правду — навіть якщо вона не фотогенічна',
        effect: { praxis: +1, customMode: true },
        arbiterTrigger: 'antyp_accepted',
        text_after: 'Тоді відкривай. Зараз твій час.',
      },
      {
        id: 'defend',
        text: 'Я й так чесний — це справді мої відповіді',
        effect: { resource: { will: -2 } },
        text_after: 'Можливо. Але я залишусь поруч — подивимось.',
      },
      {
        id: 'leave_me',
        text: 'Залиш мене. Не лізь',
        effect: { praxis: -2, addShadow: 'засліплення' },
        text_after: 'Як хочеш. Але я тут — коли будеш готовий.',
      },
    ],
  },
  {
    id: 'avoiding_shadow',
    trigger: 'shadow_avoidance',
    title: 'Антип',
    setup: 'Я бачу тіньові варіанти у клітинках. Ти проходиш повз.',
    challenge: 'Що ти ховаєш?',
    options: [
      {
        id: 'admit',
        text: 'Назву те що боюсь визнати',
        effect: { customMode: true, addShadow: 'застряг' },
        arbiterTrigger: 'antyp_accepted',
        text_after: 'Тінь названа — більше не керує.',
      },
      {
        id: 'no_shadow',
        text: 'У мене немає тіні в цьому',
        effect: { resource: { clarity: -2 }, addShadow: 'благочестя' },
        text_after: '"Я не такий" — найбільша тінь.',
      },
      {
        id: 'maybe_later',
        text: 'Колись. Не зараз.',
        effect: {},
        text_after: 'Колись = ніколи. Я повернусь.',
      },
    ],
  },
  {
    id: 'high_resources_no_shadow',
    trigger: 'imitating_growth',
    title: 'Антип',
    setup: 'Барометри ростуть, ні тіні, ні удару. Як ти це робиш?',
    challenge: 'Ти граєш чи живеш?',
    options: [
      {
        id: 'real',
        text: 'Це справжнє — я багато працюю над собою',
        effect: { resource: { will: +1 } },
        text_after: 'Гарно. Тоді покажи мені своє слабе місце.',
      },
      {
        id: 'truth_admit',
        text: 'Чесно — частково я імітую "хорошу гру"',
        effect: { customMode: true, praxis: +2 },
        arbiterTrigger: 'antyp_accepted',
        text_after: 'Ось так. Зараз ти став.',
      },
      {
        id: 'doubt',
        text: 'Я не знаю — й сам себе не до кінця розумію',
        effect: { resource: { clarity: +1 } },
        text_after: 'Не знати — теж глибина. Дивись далі.',
      },
    ],
  },
  {
    id: 'mother_far',
    trigger: 'constellation_distance',
    figureType: 'mother',
    title: 'Антип',
    setup: 'У розстановці мама далеко від тебе. Ти кажеш "усе добре".',
    challenge: 'Що між вами не сказано?',
    options: [
      {
        id: 'say_it',
        text: 'Я скажу їй мовчки три речі — те, що боявся',
        effect: { customMode: true, praxis: +2 },
        arbiterTrigger: 'antyp_accepted',
        text_after: 'Так. Те що сказано — звільняє.',
      },
      {
        id: 'fine',
        text: 'У нас все нормально, ти перебільшуєш',
        effect: { resource: { love: -1 }, addShadow: 'благочестя' },
        text_after: '"Нормально" — це слово яким люди ховають все.',
      },
    ],
  },
  {
    id: 'father_far',
    trigger: 'constellation_distance',
    figureType: 'father',
    title: 'Антип',
    setup: 'З батьком теж дистанція. Він стоїть як чужий.',
    challenge: 'Чи прийняв ти його як свого?',
    options: [
      {
        id: 'accept',
        text: 'Я приймаю його — таким який є',
        effect: { resource: { will: +2, root: +1 } },
        arbiterTrigger: 'antyp_accepted',
        text_after: 'Прийняв. Це звільняє вас обох.',
      },
      {
        id: 'still_angry',
        text: 'Я ще на нього злий — не готовий',
        effect: { resource: { flow: +1 } },
        text_after: 'Гнів — теж сила. Зустрінь її.',
      },
      {
        id: 'not_my_father',
        text: 'Він мені більше не батько',
        effect: { addShadow: 'гординя', resource: { root: -2 } },
        text_after: 'Кров не розрізняється волею.',
      },
    ],
  },
  {
    id: 'too_many_keys',
    trigger: 'collected_keys',
    threshold: 3,
    title: 'Антип',
    setup: 'У тебе вже 3 ключі. А ноги в землі стоять?',
    challenge: 'Чи це не духовне втечище від реального життя?',
    options: [
      {
        id: 'real_life',
        text: 'Я живу — і граю одночасно. Гра не замість життя',
        effect: { resource: { root: +2 } },
        text_after: 'Тоді добре. Граємо далі.',
      },
      {
        id: 'admit_avoidance',
        text: 'Чесно — я ховаюсь тут від чогось у житті',
        effect: { customMode: true, praxis: +1 },
        arbiterTrigger: 'antyp_accepted',
        text_after: 'Назвав. Це означає що скоро повернешся.',
      },
    ],
  },
];

// Знайти першу доречну провокацію
export function findAntypProvocation(triggerKey, params, alreadySeen) {
  return ANTYP_PROVOCATIONS.find((p) => {
    if (alreadySeen.includes(p.id)) return false;
    if (p.trigger !== triggerKey) return false;
    if (p.threshold && params.value < p.threshold) return false;
    if (p.figureType && params.figureType !== p.figureType) return false;
    return true;
  }) || null;
}
