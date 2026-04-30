// Дзеркало — інверсний персонаж. Бере відповідь і повертає її як питання.
// Не провокує (як Антип) і не свідчить (як Арбітр) — тільки відображає.
//
// Тригер: ~25% шанс після custom answer.

export const MIRROR_REFLECTIONS = [
  {
    id: 'reflect_what_if',
    triggerType: 'custom_answer',
    template: 'Ти сказав: «{quote}». А якщо це не зовсім правда — як було б тоді?',
  },
  {
    id: 'reflect_who_else',
    triggerType: 'custom_answer',
    template: '«{quote}» — а хто ще у твоєму житті це сказав би тими ж словами?',
  },
  {
    id: 'reflect_before',
    triggerType: 'custom_answer',
    template: '«{quote}» — а як би ти сказав це до того як виріс?',
  },
  {
    id: 'reflect_to_whom',
    triggerType: 'custom_answer',
    template: '«{quote}» — кому ти насправді це говориш зараз?',
  },
  {
    id: 'reflect_body_says',
    triggerType: 'custom_answer',
    template: '«{quote}» — що говорить тіло прямо зараз? Голова чи серце?',
  },
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
