// Інструменти-кабінету. Кожен — практика яку гравець може використати
// у будь-який момент після відкриття.
//
// Логіка відкриття: функція unlockedBy(state) → boolean.
// Якщо false — інструмент видно як «заблокований» з підказкою як відкрити.

export const TOOLS = [
  {
    id: 'constellation',
    icon: '🔮',
    name: 'Розстановка',
    short: 'системний метод за Хеллінгером',
    description: 'Постав фігури — слухай тіло. 4 сценарії: тінь, симптом, рішення, стосунки.',
    unlockedBy: (s) => (s.completedLevels || []).includes(3),
    unlockHint: 'після рівня 3 (Воля і Рід)',
    color: '#a890b0',
  },
  {
    id: 'rodovid',
    icon: '🌳',
    name: 'Родове Дерево',
    short: 'робота з родом + Хеллінгер',
    description: '7-15 вузлів роду, виключені, переплетіння, ритуали з батьками.',
    unlockedBy: (s) => !!s.petalProgress?.iii_rod?.completed
      || (s.completedLevels || []).includes(3),
    unlockHint: 'після пелюстки «Рід» або рівня 3',
    color: '#e8b0b8',
  },
  {
    id: 'archetype-dialog',
    icon: '💬',
    name: 'Діалог з архетипом',
    short: 'розмова з внутрішньою частиною',
    description: 'Чат з підтвердженим архетипом. LLM-репліки або fallback.',
    unlockedBy: (s) => !!s.archetypeCalibration?.confirmed,
    unlockHint: 'після калібрування архетипу',
    color: '#c9b3e8',
  },
  {
    id: 'body-map',
    icon: '🫁',
    name: 'Карта тіла',
    short: 'симптоми і відчуття у тілі',
    description: 'Клікни на силует — постав мітку. Відстежуй що звідки приходить.',
    unlockedBy: (s) => (s.completedLevels || []).length >= 1
      || Object.keys(s.bodyMap || {}).length > 0,
    unlockHint: 'після першого рівня',
    color: '#a8c898',
  },
  {
    id: 'breath',
    icon: '🫁',
    name: 'Дихальні практики',
    short: 'заземлення, концентрація, спокій',
    description: 'Підбір дихальних практик з основного списку — найкорисніші для тіла.',
    unlockedBy: () => true,        // завжди доступно
    unlockHint: 'доступно з самого початку',
    color: '#9fc8e8',
  },
  {
    id: 'shadow-work',
    icon: '🌑',
    name: 'Робота з тінню',
    short: 'інтеграція непрожитого',
    description: 'Дзеркало, провокатор, тінь-діалог. Не воюй — обніми.',
    unlockedBy: (s) => !!s.petalProgress?.xi_shadow?.completed
      || s.shadowPetalAcknowledged,
    unlockHint: 'після пелюстки XI (Тінь)',
    color: '#7a5a8a',
  },
  {
    id: 'mantra',
    icon: '♪',
    name: 'Solfeggio мантра',
    short: 'звукове налаштування поля',
    description: '12 частот за чакрами/пелюстками. Тон + 5-та + октава вниз.',
    unlockedBy: (s) => Object.values(s.petalProgress || {})
      .filter((p) => p?.completed).length >= 1,
    unlockHint: 'після першої завершеної пелюстки',
    color: '#f0c574',
  },
  {
    id: 'library',
    icon: '📚',
    name: 'Бібліотека Академії',
    short: 'космо · методичка · об\'єднана база',
    description: '660+ статей з матеріалів академії. Пошук + читання. Готується для AI-пошуку.',
    unlockedBy: () => true,         // завжди доступно — це довідник
    unlockHint: 'довідник методу',
    color: '#9fc8e8',
  },
  {
    id: 'mental-code',
    icon: '◯',
    name: 'Ментальний Код',
    short: 'діагностика 7 кодів свідомості',
    description: 'Радар-діаграма твоїх внутрішніх кодів: поведінки, здоров\'я, реалізації, космос, природа, буття.',
    unlockedBy: (s) => (s.completedLevels || []).length >= 1,
    unlockHint: 'після першого рівня',
    color: '#c9b3e8',
  },
  {
    id: 'elements',
    icon: '🜃',
    name: 'Стихії Метатрона',
    short: 'ритуальний прохід 6 стихій',
    description: 'Повітря · Вогонь · Вода · Земля · Метал · Ефір. 5-кроковий ритуал на стихію + Куб Метатрона.',
    unlockedBy: (s) => (s.completedLevels || []).length >= 2,
    unlockHint: 'після 2 рівнів',
    color: '#74c5b5',
  },
  {
    id: 'blindness',
    icon: '🌑',
    name: 'Ніч Я',
    short: '7 затемнень свідомості',
    description: 'Метафізична карта станів коли Я зникає з власного поля. Не діагноз — фази еволюції.',
    unlockedBy: () => true,        // завжди доступно — для важких моментів
    unlockHint: 'для важких моментів',
    color: '#7a5a8a',
  },
  {
    id: 'protective',
    icon: '🛡',
    name: 'Захисні практики',
    short: 'кордони, очищення, заземлення',
    description: 'Скоро. Захист від чужих емоцій, очищення поля, робота з кордонами.',
    unlockedBy: () => false,        // PLACEHOLDER — поки не реалізовано
    unlockHint: 'у розробці',
    color: '#74c5b5',
    placeholder: true,
  },
];

export function findTool(id) {
  return TOOLS.find((t) => t.id === id) || null;
}

export function unlockedTools(state) {
  return TOOLS.filter((t) => !t.placeholder && t.unlockedBy(state));
}

export function lockedTools(state) {
  return TOOLS.filter((t) => !t.placeholder && !t.unlockedBy(state));
}

export function placeholderTools() {
  return TOOLS.filter((t) => t.placeholder);
}
