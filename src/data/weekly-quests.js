// Тижневі обіцянки (квести). 7 днів — простий ритм.
// Поле тримає обіцянку: гравець коммітить → щодня може відмітити → у кінці тиждень
// або завершено (повністю), або частково (рефлексія), або відмовлено (також рефлексія).
//
// Quest-теми покриють основні архетипічні руху:
//   тіло, тиша, межа, чесність, поле, дія, помилування

export const QUEST_DURATION_DAYS = 7;

export const WEEKLY_QUESTS = [
  // Тіло
  {
    id: 'body-walk',
    chakra: 'root',
    icon: '🚶',
    title: '7 днів — щодня ходити пішки',
    text: 'Кожен день — мінімум 20 хв пішки, поза розкладом. Без цілі. Просто ноги несуть.',
    fieldHint: 'тіло поверне голову',
  },
  {
    id: 'body-water',
    chakra: 'flow',
    icon: '💧',
    title: '7 днів — 2 літри води',
    text: 'Щодня 2 літри води. Не «добре б», а — є. Це обіцянка тілу.',
    fieldHint: 'потік є — у тобі',
  },
  {
    id: 'body-no-screen',
    chakra: 'will',
    icon: '🌙',
    title: '7 днів — без екранів за годину до сну',
    text: 'Останню годину дня — без телефона. Лише ти, тіло, повітря.',
    fieldHint: 'твій час — твій',
  },

  // Тиша
  {
    id: 'silence-morning',
    chakra: 'voice',
    icon: '🌅',
    title: '7 днів — 5 хв тиші зранку',
    text: 'Прокинувся — 5 хв нічого. Не телефон, не думки, не плани. Просто є.',
    fieldHint: 'тиша — твоя сила',
  },
  {
    id: 'silence-meal',
    chakra: 'flow',
    icon: '🍽',
    title: '7 днів — один прийом їжі без розмов',
    text: 'Раз на день їсти у тиші. Чути тіло, смак, ситість.',
    fieldHint: 'смак це теж відповідь',
  },

  // Межа
  {
    id: 'boundary-no',
    chakra: 'will',
    icon: '⚔',
    title: '7 днів — одне «ні» щодня',
    text: 'Кожен день говорити «ні» хоч одному запиту. Не виправдовуватись.',
    fieldHint: 'твоє «ні» захищає твоє «так»',
  },
  {
    id: 'boundary-noevening',
    chakra: 'will',
    icon: '🛑',
    title: '7 днів — після 21:00 нічого не вирішувати',
    text: 'Жодних рішень, жодних повідомлень з вагою після 21:00. Тіло вночі.',
    fieldHint: 'ніч — для відновлення',
  },

  // Чесність
  {
    id: 'honest-journal',
    chakra: 'voice',
    icon: '📖',
    title: '7 днів — 3 чесних рядки увечері',
    text: 'Кожен вечір 3 чесних рядки про день. Не для іншого. Для себе.',
    fieldHint: 'чесність наодинці — рідкість',
  },
  {
    id: 'honest-feeling',
    chakra: 'love',
    icon: '💔',
    title: '7 днів — назвати почуття',
    text: 'Раз на день вголос або в журналі назвати що відчуваєш. Без «нормально».',
    fieldHint: 'почуття назване — звільнено',
  },

  // Поле
  {
    id: 'field-pause',
    chakra: 'clarity',
    icon: '⌛',
    title: '7 днів — 3 паузи на день',
    text: 'Тричі на день — 1 хв паузи. Зупинись, відчуй тіло, зроби 3 вдихи.',
    fieldHint: 'пауза — це молитва',
  },
  {
    id: 'field-gratitude',
    chakra: 'gratitude',
    icon: '🙏',
    title: '7 днів — 3 подяки увечері',
    text: 'Перед сном — 3 подяки. За що завгодно. Одне що ловить тебе зараз.',
    fieldHint: 'подяка змінює оптику',
  },

  // Дія
  {
    id: 'action-onestep',
    chakra: 'will',
    icon: '✦',
    title: '7 днів — один маленький крок',
    text: 'Щодня один крок до того що тебе кличе. Маленький. Реальний.',
    fieldHint: 'кроки складаються',
  },
];

/**
 * Підібрати 3 квести під поточну пелюстку (за чакрою).
 * Якщо нема релевантних — повертає 3 загальних.
 */
export function suggestQuestsForChakra(chakraId) {
  const matching = WEEKLY_QUESTS.filter((q) => q.chakra === chakraId);
  if (matching.length >= 3) return matching.slice(0, 3);
  // Доповнюємо рандомними з решти
  const others = WEEKLY_QUESTS.filter((q) => q.chakra !== chakraId);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return [...matching, ...shuffled].slice(0, 3);
}

export function findQuest(id) {
  return WEEKLY_QUESTS.find((q) => q.id === id);
}
