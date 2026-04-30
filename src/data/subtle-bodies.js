// 7 тонких тіл — основа Карти Поля.
// Кожне тіло має integrity score 0-100 і свій набір відновлювачів.

export const SUBTLE_BODIES = [
  {
    id: 'physical',
    name: 'Фізичне',
    sub: 'тіло · щільність · здоров\'я',
    color: '#a8c898',
    radius: 100,                    // позиція у концентричній мандалі
    description: 'Перше тіло. Те що ти можеш помацати. Тут живуть м\'язи, кістки, хвороби, втома, енергія.',
    sourceLevel: 1,                 // який рівень піраміди живить
    sourceResources: ['root'],      // які барометри додають integrity
    restoredByPractices: ['grounding', 'sensing_weight', 'pelvis_breath', 'hands_power'],
    restoredByChannels: ['midgard', 'kraon'],
  },
  {
    id: 'etheric',
    name: 'Ефірне',
    sub: 'енергія · аура · сила',
    color: '#9fc8e8',
    radius: 130,
    description: 'Друге тіло. Енергетичний шар навколо фізичного. Тут — сила долонь, ауричні дірки, праксис.',
    sourceLevel: 1,
    sourceResources: ['root', 'flow'],
    restoredByPractices: ['hands_power', 'tear_release', 'water_movement'],
    restoredByChannels: ['kraon', 'impulse'],
  },
  {
    id: 'astral',
    name: 'Астральне',
    sub: 'емоції · бажання · чуттєвість',
    color: '#f0a8b8',
    radius: 160,
    description: 'Третє тіло. Тут живуть емоції — гнів, любов, смуток, бажання. Сильно реагує на інших.',
    sourceLevel: 2,
    sourceResources: ['flow', 'love'],
    restoredByPractices: ['butterfly', 'tear_release', 'voice_release', 'forgiveness'],
    restoredByChannels: ['firast', 'agap'],
  },
  {
    id: 'mental',
    name: 'Ментальне',
    sub: 'думки · переконання · структура',
    color: '#c9b3e8',
    radius: 190,
    description: 'Четверте тіло. Думки, картина світу, переконання. Тут засліплення і ясність живуть.',
    sourceLevel: 4,
    sourceResources: ['voice', 'clarity'],
    restoredByPractices: ['silence_listening', 'mantra_om', 'truth_speaking'],
    restoredByChannels: ['zeus'],
  },
  {
    id: 'causal',
    name: 'Каузальне',
    sub: 'сенс · призначення · вибір',
    color: '#e8c476',
    radius: 220,
    description: 'П\'яте тіло. Тут призначення, вибори що формують долю, моральні дилеми.',
    sourceLevel: 5,
    sourceResources: ['will', 'clarity'],
    restoredByPractices: ['parent_dialogue', 'no_practice', 'mini_constellation'],
    restoredByChannels: ['zeus', 'midgard'],
  },
  {
    id: 'buddhic',
    name: 'Будхіальне',
    sub: 'мудрість · інтуїція · знання без слів',
    color: '#9a8fc0',
    radius: 250,
    description: 'Шосте тіло. Мудрість що приходить без розуму. Сни, знаки, інтуїція, видіння.',
    sourceLevel: 6,
    sourceResources: ['clarity', 'light'],
    restoredByPractices: ['between_brows', 'dream_recall', 'sign_seeking'],
    restoredByChannels: ['raja', 'sahara'],
  },
  {
    id: 'atmic',
    name: 'Атмічне',
    sub: 'Я є · контакт з більшим · трансценденція',
    color: '#ffe7a8',
    radius: 280,
    description: 'Сьоме тіло. Тут «Я є» — без імен, без ролей. Контакт з тим що більше за тебе.',
    sourceLevel: 7,
    sourceResources: ['light', 'gratitude'],
    restoredByPractices: ['i_am_only', 'gratitude_naming', 'surrender', 'cosmic_breath'],
    restoredByChannels: ['sahara'],
  },
];

export function findBody(id) {
  return SUBTLE_BODIES.find((b) => b.id === id) || null;
}

// 5 діагностичних питань на кожне тіло. 3 варіанти: deep (+10), mid (+5), shadow (+0).
export const BODY_QUESTIONS = {
  physical: [
    {
      q: 'Як зараз відчуваєш своє тіло?',
      options: [
        { text: 'Живе, тепле, вдома у ньому', score: 10 },
        { text: 'Інструмент який працює', score: 5 },
        { text: 'Чужий, важкий, болить', score: 0 },
      ],
    },
    {
      q: 'Сон останні 3 ночі?',
      options: [
        { text: 'Глибокий, з силою прокидаюсь', score: 10 },
        { text: 'З перебоями', score: 5 },
        { text: 'Поганий або не пам\'ятаю', score: 0 },
      ],
    },
    {
      q: 'Рухаєш тіло щодня?',
      options: [
        { text: 'Так — рух у звичці', score: 10 },
        { text: 'Іноді', score: 5 },
        { text: 'Майже не рухаюсь', score: 0 },
      ],
    },
    {
      q: 'Зв\'язок з голодом і ситістю?',
      options: [
        { text: 'Чую сигнали тіла', score: 10 },
        { text: 'Часто пропускаю або переїдаю', score: 5 },
        { text: 'Втратив контакт', score: 0 },
      ],
    },
    {
      q: 'Заземленість (стопи, опора)?',
      options: [
        { text: 'Я тут і у тілі', score: 10 },
        { text: 'Іноді відчуваю', score: 5 },
        { text: 'Над землею літаю', score: 0 },
      ],
    },
  ],
  etheric: [
    { q: 'Стільки енергії скільки треба для життя?',
      options: [{ text: 'Так', score: 10 }, { text: 'Інколи', score: 5 }, { text: 'Постійна втома', score: 0 }] },
    { q: 'Відчуваєш енергію в долонях?',
      options: [{ text: 'Так — тепло, поколювання', score: 10 }, { text: 'Іноді', score: 5 }, { text: 'Ніколи', score: 0 }] },
    { q: 'Приходиш у себе після виснаження?',
      options: [{ text: 'Швидко відновлююсь', score: 10 }, { text: 'Повільно', score: 5 }, { text: 'Не виходжу', score: 0 }] },
    { q: 'Аура — чи захищена від чужих?',
      options: [{ text: 'Так, маю «костюм»', score: 10 }, { text: 'Часом просочується', score: 5 }, { text: 'Все на мене виливають', score: 0 }] },
    { q: 'Робиш ритуали для енергії?',
      options: [{ text: 'Регулярно (медитація, дихання)', score: 10 }, { text: 'Зрідка', score: 5 }, { text: 'Ні', score: 0 }] },
  ],
  astral: [
    { q: 'Емоції — рухаються чи застрягають?',
      options: [{ text: 'Як вода — приходять і йдуть', score: 10 }, { text: 'Деякі застрягають', score: 5 }, { text: 'Заморожені', score: 0 }] },
    { q: 'Плачеш коли треба?',
      options: [{ text: 'Так, без сорому', score: 10 }, { text: 'Сам із собою', score: 5 }, { text: 'Греблю не пробивало', score: 0 }] },
    { q: 'Зв\'язок з бажаннями?',
      options: [{ text: 'Знаю чого хочу', score: 10 }, { text: 'Розмито', score: 5 }, { text: 'Бажань нема', score: 0 }] },
    { q: 'Гнів виходить здорово?',
      options: [{ text: 'Так, як межа', score: 10 }, { text: 'Іноді вибухаю', score: 5 }, { text: 'Тримаю в тілі', score: 0 }] },
    { q: 'Здатність відчувати чужу емоцію?',
      options: [{ text: 'Розрізняю своє і чуже', score: 10 }, { text: 'Переплутую', score: 5 }, { text: 'Закрив емпатію', score: 0 }] },
  ],
  mental: [
    { q: 'Думки — твої чи нав\'язані?',
      options: [{ text: 'Я обираю про що думаю', score: 10 }, { text: 'Часто розпорошуюсь', score: 5 }, { text: 'Голос у голові керує', score: 0 }] },
    { q: 'Можеш не думати 5 хв?',
      options: [{ text: 'Так — у медитації', score: 10 }, { text: 'Важко але можу', score: 5 }, { text: 'Ніколи', score: 0 }] },
    { q: 'Здатність змінити думку коли є нові факти?',
      options: [{ text: 'Так — гнучкий', score: 10 }, { text: 'Інколи', score: 5 }, { text: 'Тримаюсь свого', score: 0 }] },
    { q: 'Картина світу — переглядаєш?',
      options: [{ text: 'Регулярно', score: 10 }, { text: 'Раз на роки', score: 5 }, { text: 'Ніколи', score: 0 }] },
    { q: 'Структура у житті (плани, рутини)?',
      options: [{ text: 'Працюючий ритм', score: 10 }, { text: 'Хаотично', score: 5 }, { text: 'Параліч аналізу', score: 0 }] },
  ],
  causal: [
    { q: 'Знаєш своє Призначення?',
      options: [{ text: 'Так — і йду', score: 10 }, { text: 'Здогадуюсь', score: 5 }, { text: 'Ні', score: 0 }] },
    { q: 'Вибори робиш свідомо?',
      options: [{ text: 'Так — і несу наслідки', score: 10 }, { text: 'Часто пливу', score: 5 }, { text: 'Інші вирішують за мене', score: 0 }] },
    { q: 'Коли роблю не своє — чую це?',
      options: [{ text: 'Так — і виходжу', score: 10 }, { text: 'Інколи', score: 5 }, { text: 'Не розрізняю', score: 0 }] },
    { q: 'Готовий нести свою унікальність?',
      options: [{ text: 'Так', score: 10 }, { text: 'З оглядкою', score: 5 }, { text: 'Маскуюсь', score: 0 }] },
    { q: 'У контакті з причинно-наслідковим?',
      options: [{ text: 'Так — бачу свої гачки', score: 10 }, { text: 'Іноді', score: 5 }, { text: 'Все «випадково»', score: 0 }] },
  ],
  buddhic: [
    { q: 'Інтуїції довіряєш?',
      options: [{ text: 'Так — частіше за логіку', score: 10 }, { text: 'Інколи', score: 5 }, { text: 'Тільки факти', score: 0 }] },
    { q: 'Сни — як учителі?',
      options: [{ text: 'Записую і слухаю', score: 10 }, { text: 'Помічаю', score: 5 }, { text: 'Не пам\'ятаю', score: 0 }] },
    { q: 'Знаки і синхронії бачиш?',
      options: [{ text: 'Постійно', score: 10 }, { text: 'Інколи', score: 5 }, { text: 'Це випадковості', score: 0 }] },
    { q: 'Можеш чути «не словами»?',
      options: [{ text: 'Так', score: 10 }, { text: 'Іноді', score: 5 }, { text: 'Ні', score: 0 }] },
    { q: 'Бачиш суть людини за словами?',
      options: [{ text: 'Так — рідко помиляюсь', score: 10 }, { text: 'Інколи', score: 5 }, { text: 'Тільки те що сказано', score: 0 }] },
  ],
  atmic: [
    { q: 'Маєш досвід «я є» без імен?',
      options: [{ text: 'Так — пам\'ятаю його', score: 10 }, { text: 'Мав короткий', score: 5 }, { text: 'Ніколи', score: 0 }] },
    { q: 'Контакт з тим що більше за тебе?',
      options: [{ text: 'Так — щодня', score: 10 }, { text: 'Інколи', score: 5 }, { text: 'Я сам', score: 0 }] },
    { q: 'Здатний здаватись?',
      options: [{ text: 'Так — у довірі', score: 10 }, { text: 'Інколи', score: 5 }, { text: 'Все контролюю', score: 0 }] },
    { q: 'Подяка як стан?',
      options: [{ text: 'Так', score: 10 }, { text: 'За щось конкретне', score: 5 }, { text: 'Бачу нестачу', score: 0 }] },
    { q: 'Готовий до власної смерті?',
      options: [{ text: 'Памʼятаю про неї — і живу', score: 10 }, { text: 'Уникаю думки', score: 5 }, { text: 'Боюсь', score: 0 }] },
  ],
};

export function questionsForBody(bodyId) {
  return BODY_QUESTIONS[bodyId] || [];
}
