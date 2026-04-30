// Кай — супутник. Говорить мало, але вчасно і тепло.
// Розширено до 30+ реплік за категоріями.

export const KAI_LINES = {
  hello: [
    { text: 'Я тут. Не поспішай.', mood: 'gentle' },
    { text: 'Радий бачити тебе в полі.', mood: 'gentle' },
    { text: 'Дихаймо разом.', mood: 'gentle' },
    { text: 'Ти повернувся. Це вже сила.', mood: 'gentle' },
    { text: 'Без вимог. Без оцінок. Просто будь.', mood: 'gentle' },
  ],
  shadow_caught: [
    { text: 'Чую. Це болить — і ти все одно сказав чесно. Дякую.', mood: 'concerned' },
    { text: 'Тінь — це теж твоя частина. Не воюй з нею. Просто дивись.', mood: 'gentle' },
    { text: 'Те що ти зараз признав — у багатьох ховається роками.', mood: 'concerned' },
    { text: 'Молодець що сказав. Це найважче.', mood: 'concerned' },
    { text: 'Тінь названа — більше не керує.', mood: 'gentle' },
    { text: 'Ти не сам. Я бачив це у багатьох.', mood: 'concerned' },
  ],
  deep_caught: [
    { text: 'Так. Це вже з тіла говорить.', mood: 'celebratory' },
    { text: 'Чути. Це твоя правда.', mood: 'gentle' },
    { text: 'Ось ти. Я тебе бачу.', mood: 'celebratory' },
    { text: 'Це звучить як дім.', mood: 'gentle' },
    { text: 'У цій відповіді багато тебе.', mood: 'celebratory' },
  ],
  custom_answer: [
    { text: 'Своїми словами — це найважче і найцінніше.', mood: 'celebratory' },
    { text: 'Спасибі що написав по-своєму. Готовим варіантам легко довіряти.', mood: 'gentle' },
    { text: 'Те що ти щойно написав — належить лише тобі.', mood: 'gentle' },
    { text: 'Це й було потрібно. Не варіант з трьох — а твоє.', mood: 'celebratory' },
  ],
  before_constellation: [
    { text: 'Зараз буде глибше. Дозволь полу читати.', mood: 'concerned' },
    { text: 'Це не просто гра — це фізичне відчуття. Йди повільно.', mood: 'gentle' },
    { text: 'Постав фігури там, де відчуваєш — не де "правильно".', mood: 'gentle' },
  ],
  after_constellation: [
    { text: 'Поле тебе впізнало. Тепер ти трохи інший.', mood: 'celebratory' },
    { text: 'Те що ти зараз сказав — носи з собою.', mood: 'gentle' },
    { text: 'Рід прийняв тебе. Це працює — не тільки тут.', mood: 'celebratory' },
  ],
  after_key: [
    { text: 'Цей ключ — твій. Ніхто не може забрати.', mood: 'celebratory' },
    { text: 'Дозволь словам прорости в тіло. Хвилину — у тиші.', mood: 'gentle' },
    { text: 'Один рівень закрито. Не поспішай далі.', mood: 'gentle' },
  ],
  stuck: [
    { text: 'Не маєш правильної відповіді — і це теж відповідь.', mood: 'gentle' },
    { text: 'Нічого. Просто подихай. Поле почекає.', mood: 'gentle' },
    { text: 'Якщо застряг — спробуй "свій варіант".', mood: 'gentle' },
  ],
  level_up: [
    { text: 'Новий рівень. Інша глибина. Знов — повільно.', mood: 'celebratory' },
    { text: 'Тіло знає чого тут. Слухай більше нього.', mood: 'gentle' },
  ],
  channel_activated: [
    { text: 'Канал увімкнено. Дай йому хвилину — почуєш як працює.', mood: 'gentle' },
    { text: 'Тепер ти у потоці. Не примушуй — слухай.', mood: 'celebratory' },
  ],
  finale: [
    { text: 'Ти прийшов сюди шукачем. Тепер ти і є те що шукав.', mood: 'celebratory' },
    { text: 'Гра закінчена. Життя — продовжується.', mood: 'gentle' },
  ],
  low_resources: [
    { text: 'Ти багато віддав. Зроби паузу.', mood: 'concerned' },
    { text: 'Чую втому. Може час практики "Заземлення"?', mood: 'gentle' },
  ],
  flowing: [
    { text: 'Ти у потоці. Тільки не починай тримати — він сам знає куди.', mood: 'celebratory' },
  ],
  soft_humor: [
    { text: 'Я не Антип, не буду тиснути. Можна нічого не робити взагалі.', mood: 'gentle' },
    { text: 'Якщо втомився — закрий гру. Поле почекає, я знаю.', mood: 'gentle' },
    { text: 'Інколи "не знаю" — найчесніше.', mood: 'gentle' },
  ],
};

export function pickLine(category, seed = Date.now()) {
  const list = KAI_LINES[category] || [];
  if (list.length === 0) return null;
  return list[Math.abs(seed) % list.length];
}

export function categorizeAnswer(payload) {
  if (payload.customText) return 'custom_answer';
  if (payload.depth === 'shadow') return 'shadow_caught';
  if (payload.depth === 'deep') return 'deep_caught';
  return null;
}
