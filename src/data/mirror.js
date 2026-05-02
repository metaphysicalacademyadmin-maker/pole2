// Дзеркало — інверсний персонаж. Бере відповідь і повертає її як питання.
// Не провокує (як Антип) і не свідчить (як Арбітр) — тільки відображає.
//
// Тригер: ~25% шанс після custom answer.

export const MIRROR_REFLECTIONS = [
  // Базові — відображення-перевертки
  { id: 'reflect_what_if', triggerType: 'custom_answer',
    template: 'Ти сказав: «{quote}». А якщо це не зовсім правда — як було б тоді?' },
  { id: 'reflect_who_else', triggerType: 'custom_answer',
    template: '«{quote}» — а хто ще у твоєму житті це сказав би тими ж словами?' },
  { id: 'reflect_before', triggerType: 'custom_answer',
    template: '«{quote}» — а як би ти сказав це до того як виріс?' },
  { id: 'reflect_to_whom', triggerType: 'custom_answer',
    template: '«{quote}» — кому ти насправді це говориш зараз?' },
  { id: 'reflect_body_says', triggerType: 'custom_answer',
    template: '«{quote}» — що говорить тіло прямо зараз? Голова чи серце?' },

  // Питання-зворотні: «а якби навпаки»
  { id: 'reflect_opposite', triggerType: 'custom_answer',
    template: '«{quote}» — а якби сказати протилежне, що б ти відчув?' },
  { id: 'reflect_to_self', triggerType: 'custom_answer',
    template: '«{quote}» — а ти сам себе чуєш, коли це говориш?' },
  { id: 'reflect_age', triggerType: 'custom_answer',
    template: '«{quote}» — скільки років тому ти вперше це знав?' },
  { id: 'reflect_year_ago', triggerType: 'custom_answer',
    template: '«{quote}» — а рік тому ти би сказав те саме?' },
  { id: 'reflect_who_taught', triggerType: 'custom_answer',
    template: '«{quote}» — хто перший навчив тебе цій формулі?' },
  { id: 'reflect_avoid', triggerType: 'custom_answer',
    template: '«{quote}» — від чого ця думка тебе захищає?' },
  { id: 'reflect_payoff', triggerType: 'custom_answer',
    template: '«{quote}» — а що ти отримуєш від того, що віриш у це?' },
  { id: 'reflect_loss', triggerType: 'custom_answer',
    template: '«{quote}» — а від чого довелось відмовитись щоб так думати?' },
  { id: 'reflect_repeat', triggerType: 'custom_answer',
    template: '«{quote}» — як часто ти повторюєш це собі за день?' },
  { id: 'reflect_silence', triggerType: 'custom_answer',
    template: '«{quote}» — а у тиші, без слів, це теж правда?' },
  { id: 'reflect_5y', triggerType: 'custom_answer',
    template: '«{quote}» — а через 5 років це матиме ту саму вагу?' },
  { id: 'reflect_decision', triggerType: 'custom_answer',
    template: '«{quote}» — це факт чи рішення яке ти прийняв колись?' },
  { id: 'reflect_dream', triggerType: 'custom_answer',
    template: '«{quote}» — у мріях ти теж так думаєш про себе?' },
  { id: 'reflect_friend', triggerType: 'custom_answer',
    template: '«{quote}» — другу б ти сказав ці ж слова на його місці?' },
  { id: 'reflect_ancestor', triggerType: 'custom_answer',
    template: '«{quote}» — це твоя думка, чи від когось у роді?' },
  { id: 'reflect_root', triggerType: 'custom_answer',
    template: '«{quote}» — а під цим яка глибша правда лежить?' },
  { id: 'reflect_action', triggerType: 'custom_answer',
    template: '«{quote}» — і що ти зробиш з цим знанням сьогодні?' },
  { id: 'reflect_witness', triggerType: 'custom_answer',
    template: '«{quote}» — є хтось хто це чує і не осуджує? Ось я. Чую.' },
  { id: 'reflect_breath', triggerType: 'custom_answer',
    template: '«{quote}» — подихай 3 рази у це. Що змінюється?' },
  { id: 'reflect_mantra', triggerType: 'custom_answer',
    template: '«{quote}» — повтори собі 3 рази. Це мантра чи прокляття?' },
];

export function pickMirrorReflection(answerText, seed) {
  const list = MIRROR_REFLECTIONS;
  const idx = Math.abs(seed) % list.length;
  const tpl = list[idx];
  // Скорочуємо цитату
  const shortQuote = answerText.length > 50
    ? answerText.slice(0, 47).trim() + '…'
    : answerText;
  return {
    ...tpl,
    text: tpl.template.replace('{quote}', shortQuote),
  };
}
