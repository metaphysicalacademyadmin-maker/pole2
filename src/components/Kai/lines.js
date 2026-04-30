// Репліки Кая. Розкласифіковані за тригером і настроєм.
// Кай говорить мало, але вчасно. Не учитель — супутник.

export const KAI_LINES = {
  // ─── Привітання при старті сесії ───
  hello: [
    { text: 'Я тут. Не поспішай.', mood: 'gentle' },
    { text: 'Радий бачити тебе в полі.', mood: 'gentle' },
    { text: 'Дихаймо разом.', mood: 'gentle' },
  ],

  // ─── Реакція на тіньову відповідь ───
  shadow_caught: [
    { text: 'Чую. Це болить — і ти все одно сказав чесно. Дякую.', mood: 'concerned' },
    { text: 'Тінь — це теж твоя частина. Не воюй з нею. Просто дивись.', mood: 'gentle' },
    { text: 'Те що ти зараз признав — у багатьох ховається роками.', mood: 'concerned' },
  ],

  // ─── Реакція на глибоку відповідь ───
  deep_caught: [
    { text: 'Так. Це вже з тіла говорить.', mood: 'celebratory' },
    { text: 'Чути. Це твоя правда.', mood: 'gentle' },
    { text: 'Ось ти. Я тебе бачу.', mood: 'celebratory' },
  ],

  // ─── На custom answer (своя відповідь) ───
  custom_answer: [
    { text: 'Своїми словами — це найважче і найцінніше.', mood: 'celebratory' },
    { text: 'Спасибі що написав по-своєму. Готовим варіантам легко довіряти.', mood: 'gentle' },
  ],

  // ─── Перед розстановкою ───
  before_constellation: [
    { text: 'Зараз буде глибше. Дозволь полу читати.', mood: 'concerned' },
    { text: 'Це не просто гра — це фізичне відчуття. Йди повільно.', mood: 'gentle' },
  ],

  // ─── Після розстановки ───
  after_constellation: [
    { text: 'Поле тебе впізнало. Тепер ти трохи інший.', mood: 'celebratory' },
    { text: 'Те що ти зараз сказав — носи з собою.', mood: 'gentle' },
  ],

  // ─── Після ключа ───
  after_key: [
    { text: 'Цей ключ — твій. Ніхто не може забрати.', mood: 'celebratory' },
    { text: 'Дозволь словам прорости в тіло. Хвилину — у тиші.', mood: 'gentle' },
  ],

  // ─── Якщо гравець довго не відповідає ───
  stuck: [
    { text: 'Не маєш правильної відповіді — і це теж відповідь.', mood: 'gentle' },
    { text: 'Нічого. Просто подихай. Поле почекає.', mood: 'gentle' },
  ],

  // ─── При підвищенні рівня ───
  level_up: [
    { text: 'Новий рівень. Інша глибина. Знов — повільно.', mood: 'celebratory' },
  ],

  // ─── При завершенні гри ───
  finale: [
    { text: 'Ти прийшов сюди шукачем. Тепер ти і є те що шукав.', mood: 'celebratory' },
  ],
};

// Випадкова репліка з категорії, з seed для повторюваності.
export function pickLine(category, seed = Date.now()) {
  const list = KAI_LINES[category] || [];
  if (list.length === 0) return null;
  const idx = Math.abs(seed) % list.length;
  return list[idx];
}

// Категорія за контекстом відповіді
export function categorizeAnswer(payload) {
  if (payload.customText) return 'custom_answer';
  if (payload.depth === 'shadow') return 'shadow_caught';
  if (payload.depth === 'deep') return 'deep_caught';
  return null;
}
