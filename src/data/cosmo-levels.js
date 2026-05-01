// 5 рівнів шляху космоенергетики (концепт §14).
// 0 → 1 → 2 → 3 → 4: від гри до інціації.
// Кожен рівень має критерій, статус і контент (теорія, заявка, канали).

export const COSMO_LEVELS = [
  {
    n: 0, id: 'player', name: 'Гра ПОЛЕ', symbol: '🌱',
    color: '#a8c898',
    description: 'Ти граєш — і це вже шлях. Безкоштовно для всіх.',
    criterion: 'входить кожен',
    unlock: () => true,
    content: { kind: 'reference', message: '108 клітинок, без вимог. Поле тебе бачить — і це початок.' },
  },
  {
    n: 1, id: 'curious', name: 'Цікавий', symbol: '🌿',
    color: '#9fc8e8',
    description: 'Ти отримав достатньо ключів — гра відкриває гілку метафізики як можливість.',
    criterion: '5+ ключів отримано',
    unlock: (state) => (state.completedLevels || []).length >= 5,
    content: {
      kind: 'intro',
      cards: [
        { id: 'kai', symbol: '⚡', title: 'Що таке КАЕ',
          text: 'КАЕ — Космічна Альфа-Енергія. Не магія у містичному сенсі — це інструмент. Людина, що з ним працює, не дає власну енергію — вона є провідником, через якого проходить чистий потік.' },
        { id: 'channels', symbol: '🌊', title: 'Чому канали — не магія',
          text: 'Канал — це частота, яка активується для зцілення, очищення, захисту або трансформації. Він має структуру і направленість. Це інженерія тонкого рівня.' },
        { id: 'guides', symbol: '🔮', title: 'Хто такі провідники',
          text: 'Провідник КАЕ — той, хто пройшов фізичну ініціацію на семінарі. Без неї канали не активуються. Це принципово — фільтр готовності.' },
        { id: 'path', symbol: '🛤', title: 'Як вибрати свій шлях',
          text: 'Подивись зараз свою спеціалізацію (якщо обрана) — вона підкаже які канали тобі резонують найбільше. Або просто почитай про них на наступному рівні.' },
      ],
      cta: { label: 'подати заявку', requiresLevel: 2 },
    },
  },
  {
    n: 2, id: 'ready', name: 'Готовий', symbol: '🌳',
    color: '#f0c574',
    description: 'Ти пройшов 7 рівнів свідомості і твої барометри переважно у плюсі. Готовий податись.',
    criterion: '7 ключів + barометри ≥ 0',
    unlock: (state) => {
      const keys = (state.completedLevels || []).length;
      if (keys < 7) return false;
      const r = state.resources || {};
      const negCount = Object.values(r).filter((v) => v < -3).length;
      return negCount === 0;
    },
    content: {
      kind: 'application',
      questions: [
        { id: 'why', label: 'Чому ти хочеш йти у космоенергетику?', placeholder: 'не "бо цікаво" — про твоє справжнє бажання...' },
        { id: 'service', label: 'Кому і як ти плануєш служити?', placeholder: 'для себе, для близьких, як практик...' },
        { id: 'shadow', label: 'Чи готовий ти зустріти свою тінь у процесі?', placeholder: 'те, що приходить коли стає важко...' },
      ],
    },
  },
  {
    n: 3, id: 'accepted', name: 'Прийнятий', symbol: '🔮',
    color: '#c9b3e8',
    description: 'Заявку прийнято. Гілка космоенергетики відкрилась — теорія перед семінаром.',
    criterion: 'дозвіл наставника',
    unlock: () => false,         // тільки через адмін-панель
    locked: { reason: 'очікує дозволу наставника', actionable: false },
    content: {
      kind: 'theory',
      message: 'Тут з\'явиться: ієрархія КАЕ, розкриття центрів, закони чистоти, етика провідника, безпека роботи.',
    },
  },
  {
    n: 4, id: 'initiated', name: 'Ініційований', symbol: '⚡',
    color: '#ffe7a8',
    description: 'Після фізичного семінару — усі канали відкриваються. По 12 клітинок на канал.',
    criterion: 'після семінару',
    unlock: () => false,         // тільки після ритуалу
    locked: { reason: 'чекає на ритуал ініціації', actionable: false },
    content: {
      kind: 'channels',
      list: ['Тата', 'Фарун', 'Зевс', 'Сімаргл', 'Сутра-Карма', 'ККР',
             'Фарун-Будда', 'Фіраст', 'Краон', 'Джиліус', 'Золота Піраміда'],
    },
  },
];

export function findCosmoLevel(n) {
  return COSMO_LEVELS.find((l) => l.n === n) || null;
}

export function currentCosmoLevel(state) {
  // Найвищий рівень для якого виконано unlock + не заблоковано вручну
  let maxLevel = 0;
  for (const lvl of COSMO_LEVELS) {
    if (lvl.locked) continue;            // 3 і 4 — тільки через дію
    if (lvl.unlock(state)) maxLevel = lvl.n;
  }
  if (state.cosmoApplication?.status === 'approved') maxLevel = Math.max(maxLevel, 3);
  if (state.cosmoApplication?.status === 'initiated') maxLevel = Math.max(maxLevel, 4);
  return maxLevel;
}
