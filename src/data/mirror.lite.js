// LITE — лише 5 базових рефлексій замість 25.

export const MIRROR_REFLECTIONS = [
  { id: 'reflect_what_if', triggerType: 'custom_answer',
    template: 'Ти сказав: «{quote}». А якщо це не зовсім правда — як було б тоді?' },
  { id: 'reflect_who_else', triggerType: 'custom_answer',
    template: '«{quote}» — а хто ще у твоєму житті це сказав би тими ж словами?' },
  { id: 'reflect_to_whom', triggerType: 'custom_answer',
    template: '«{quote}» — кому ти насправді це говориш зараз?' },
  { id: 'reflect_body_says', triggerType: 'custom_answer',
    template: '«{quote}» — що говорить тіло прямо зараз? Голова чи серце?' },
  { id: 'reflect_witness', triggerType: 'custom_answer',
    template: '«{quote}» — є хтось хто це чує і не осуджує? Ось я. Чую.' },
];

export function pickMirrorReflection(answerText, seed) {
  const list = MIRROR_REFLECTIONS;
  const idx = Math.abs(seed) % list.length;
  const tpl = list[idx];
  const shortQuote = answerText.length > 50 ? answerText.slice(0, 47).trim() + '…' : answerText;
  return { ...tpl, text: tpl.template.replace('{quote}', shortQuote) };
}
