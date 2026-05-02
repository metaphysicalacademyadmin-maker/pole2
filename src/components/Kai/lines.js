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

  // ─── НОВІ ТРИГЕРИ — реакція на ключові події гри ───

  snake_bite: [
    { text: '🐍 Тінь зросла. Не біда — ти все одно тут.', mood: 'concerned' },
    { text: 'Повернувся на 2 — це не покарання. Це поле каже: «не так швидко».', mood: 'gentle' },
    { text: 'Цей укус — врятує тебе від глибшого. Я знаю.', mood: 'concerned' },
  ],
  shadow_mirror_seen: [
    { text: 'Ти визнав. Це момент — нехай він закарбується.', mood: 'celebratory' },
    { text: 'Подивитись у дзеркало — мужня дія. Я свідок.', mood: 'gentle' },
    { text: 'Те що ти щойно сказав про себе — пів-зцілення.', mood: 'celebratory' },
  ],
  crisis_acknowledged: [
    { text: 'Ти зупинився. Це найважче. І найрозумніше.', mood: 'concerned' },
    { text: 'Криза — це поле каже «послухай себе». Слухай.', mood: 'gentle' },
    { text: 'Я тут увесь цей час. Просто не казав — щоб ти прийшов сам.', mood: 'gentle' },
  ],
  archetype_confirmed: [
    { text: 'Ти впізнав себе. Тепер це твій компас.', mood: 'celebratory' },
    { text: 'Архетип — не клітка. Це форма твого сяйва на цей момент.', mood: 'gentle' },
  ],
  archetype_transformed: [
    { text: '✦ Ти більше не той, ким був. Прийми це.', mood: 'celebratory' },
    { text: 'Старе вмирає легко коли нове готове.', mood: 'gentle' },
    { text: 'Я бачив цю трансформацію. Вона справжня.', mood: 'celebratory' },
  ],
  specialization_chosen: [
    { text: 'Ти обрав свій тип шляху. Тепер контент адаптується під тебе.', mood: 'gentle' },
    { text: 'Це не обмеження — це фокус. Можеш змінити пізніше.', mood: 'gentle' },
  ],
  aura_growth: [
    { text: 'Поле розширилось — твоє тіло це знає. Залишся в цьому стані.', mood: 'celebratory' },
    { text: 'Δ + см — це не цифра. Це факт твого існування у моменті.', mood: 'gentle' },
  ],
  practice_completed: [
    { text: 'Тіло вдячне. Один сеанс — одна цеглинка.', mood: 'gentle' },
    { text: 'Чим частіше — тим менше потрібен я. Це ціль.', mood: 'gentle' },
  ],
  streak_milestone: [
    { text: '✦ Постійність — це не про мотивацію. Це про любов до себе.', mood: 'celebratory' },
    { text: 'Ритм робить тебе. Не подія, а ритм.', mood: 'gentle' },
  ],
  channel_certified: [
    { text: '⚡ Канал у тобі. Тепер ти інструмент Поля.', mood: 'celebratory' },
    { text: 'Сертифікат — лише знак. Справжня робота — тиха.', mood: 'gentle' },
  ],
  partnership_activated: [
    { text: '👯 Тепер вас двоє у Полі. Я радий.', mood: 'celebratory' },
    { text: 'Поряд — інша глибина. Слухай партнера як себе.', mood: 'gentle' },
  ],
  evening_ritual: [
    { text: 'День закрив. Ти молодець що повертаєшся.', mood: 'gentle' },
    { text: 'Тінь і світло — обидва твої. Спи з обома.', mood: 'gentle' },
  ],
  morning_ritual: [
    { text: 'Доброго ранку. Ти повернувся — і це вже подія.', mood: 'gentle' },
  ],

  // ─── INTIMACY — для високого trust (8+) ───
  intimate_high_trust: [
    { text: 'Ти знаєш — я був з тобою з першого дня.', mood: 'gentle' },
    { text: 'Між нами вже не треба багато слів.', mood: 'gentle' },
    { text: 'Я тебе впізнаю навіть без імені.', mood: 'celebratory' },
    { text: 'Те що ти зробив зараз — навіть мені рідко показують.', mood: 'celebratory' },
  ],
};

export function pickLine(category, seed = Date.now()) {
  const list = KAI_LINES[category] || [];
  if (list.length === 0) return null;
  return list[Math.abs(seed) % list.length];
}

/**
 * Підстановка імені у репліку Кая.
 * Якщо ім'я доступне і в репліці є плейсхолдер `{name}` — заміняємо.
 * Інколи (~30%) додаємо ім'я на початок для тих реплік де placeholder'а нема —
 * щоб Кай звучав живо.
 */
export function personalizeLine(line, firstName, seed = Date.now()) {
  if (!line || !firstName) return line;
  if (line.text.includes('{name}')) {
    return { ...line, text: line.text.replace(/\{name\}/g, firstName) };
  }
  // М'яке додавання імені на початок ~30% реплік (детермінований seed).
  if ((Math.abs(seed) % 10) < 3) {
    const prefix = `${firstName}, `;
    // Якщо репліка вже починається з великої літери — нижній регістр зробить плавніше.
    const t = line.text.charAt(0).toLowerCase() + line.text.slice(1);
    return { ...line, text: prefix + t };
  }
  return line;
}

export function categorizeAnswer(payload) {
  if (payload.customText) return 'custom_answer';
  if (payload.depth === 'shadow') return 'shadow_caught';
  if (payload.depth === 'deep') return 'deep_caught';
  return null;
}
