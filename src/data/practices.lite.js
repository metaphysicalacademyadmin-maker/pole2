// LITE — лише 22 базові практики (без 11 академічних і 3 зі збірки).
// Економія: ~22 KB raw.

const BASIC_PRACTICES = [
  // ─── Рівень 1: Коріння ───
  { id: 'grounding',      level: 1, name: 'Заземлення', icon: '🌱', duration: 3, barometer: 'root',
    instruction: 'Стій босоніж. Стопи паралельно, на ширині таза. Закрий очі. Уяви — з кожної стопи виростають коріння — глибоко в землю. Дихай у стопи. 3 хвилини.' },
  { id: 'sensing_weight', level: 1, name: 'Відчуття ваги', icon: '⬇', duration: 2, barometer: 'root',
    instruction: 'Сядь або стій. Прийми тіло як вагу. Не намагайся бути легким — стань важким. Відчуй як гравітація тримає тебе.' },
  { id: 'pelvis_breath',  level: 1, name: 'Дихання у таз', icon: '◉', duration: 4, barometer: 'root',
    instruction: 'Лежи на спині, руку на низ живота. Дихай так, щоб таз м\'яко рухався. Це активує муладхару.' },

  // ─── Рівень 2: Потік ───
  { id: 'tear_release',   level: 2, name: 'Звільнення сліз', icon: '💧', duration: 5, barometer: 'flow',
    instruction: 'Сядь у тиші. Дозволь будь-чому що піднімається — піднятись. Якщо хочуть прийти сльози — нехай.' },
  { id: 'voice_release',  level: 2, name: 'Звільнення звуком', icon: '🌬', duration: 3, barometer: 'flow',
    instruction: 'Видихай зі звуком — стогін, гул, крик у долоні. Не «правильний» — твій.' },
  { id: 'water_movement', level: 2, name: 'Танець води', icon: '〰', duration: 5, barometer: 'flow',
    instruction: 'Поставити повільну музику. Закрий очі. Рухайся хвилями — від таза. Будь водою.' },

  // ─── Рівень 3: Воля і Рід ───
  { id: 'fist_release',   level: 3, name: 'Кулак-долоня', icon: '✊', duration: 2, barometer: 'will',
    instruction: 'Стисни кулаки сильно. Тримай 10 секунд. Різко розкрий долоні. Повтори тричі.' },
  { id: 'no_practice',    level: 3, name: 'Тренування "ні"', icon: '⊘', duration: 5, barometer: 'will',
    instruction: 'У дзеркало вголос: «Ні. Ні. Ні. Я кажу ні.» Без виправдань.' },
  { id: 'parent_dialogue',level: 3, name: 'Діалог з предком', icon: '⚭', duration: 8, barometer: 'will',
    instruction: 'Уяви маму чи тата. Скажи мовчки: «Я тебе бачу. Я малий, ти великий. Я живу СВОЄ життя.»' },

  // ─── Рівень 4: Серце ───
  { id: 'heart_hands',    level: 4, name: 'Долоні на серце', icon: '🤲', duration: 3, barometer: 'love',
    instruction: 'Праву долоню на центр грудей, ліву поверх. Закрий очі. Просто будь так 3 хв.' },
  { id: 'butterfly',      level: 4, name: 'Метелик', icon: '🦋', duration: 4, barometer: 'love',
    instruction: 'Схрести руки на грудях, долоні на плечі. Поплескуй по плечах — лiвo, правo. Body bilateral stimulation.' },
  { id: 'forgiveness',    level: 4, name: 'Прощення (для себе)', icon: '✦', duration: 6, barometer: 'love',
    instruction: 'Уяви того кому не пробачив. Скажи: «Я не пробачаю тобі. Але я відпускаю себе від цієї ноші.»' },

  // ─── Рівень 5: Голос ───
  { id: 'silence_listening', level: 5, name: 'Слухання тиші', icon: '◯', duration: 5, barometer: 'voice',
    instruction: 'Зупини зовнішнє. Слухай тишу як слухав би людину.' },
  { id: 'truth_speaking',  level: 5, name: 'Своя правда вголос', icon: '🗣', duration: 4, barometer: 'voice',
    instruction: 'Скажи вголос одну річ яку довго не казав. Сам собі.' },
  { id: 'mantra_om',       level: 5, name: 'Мантра ОМ', icon: 'ॐ', duration: 5, barometer: 'voice',
    instruction: 'Сядь з прямою спиною. Вдих. На видиху — протяжне «ом-м-м-м». 7 разів.' },

  // ─── Рівень 6: Видіння ───
  { id: 'between_brows',   level: 6, name: 'Між бровами', icon: '◈', duration: 5, barometer: 'clarity',
    instruction: 'Закрий очі. Звернись внутрішнім поглядом до точки між бровами. Будь там.' },
  { id: 'dream_recall',    level: 6, name: 'Згадка сну', icon: '☾', duration: 3, barometer: 'clarity',
    instruction: 'Згадай останній сон. Не аналізуй — просто пам\'ятай. Запиши кілька слів.' },
  { id: 'sign_seeking',    level: 6, name: 'Знак-прохання', icon: '✺', duration: 1440, barometer: 'clarity',
    instruction: 'Сформулюй питання. Попроси Поле дати знак протягом дня.' },

  // ─── Рівень 7: Джерело ───
  { id: 'i_am_only',       level: 7, name: 'Тільки "Я є"', icon: '∞', duration: 7, barometer: 'light',
    instruction: 'Закрий очі. Внутрішньо повторюй: «Я є.» Без додавань. 7 хвилин.' },
  { id: 'gratitude_naming',level: 7, name: 'Подяка по іменах', icon: '☉', duration: 5, barometer: 'gratitude',
    instruction: 'Назви по черзі 7 речей за які вдячний СЬОГОДНІ. Конкретно.' },
  { id: 'surrender',       level: 7, name: 'Здавання', icon: '◌', duration: 4, barometer: 'light',
    instruction: 'Скажи внутрішньо: «Я не розумію. Не контролюю. І це нормально. Я довіряю.»' },
  { id: 'cosmic_breath',   level: 7, name: 'Космічне дихання', icon: '☄', duration: 6, barometer: 'light',
    instruction: 'На вдиху — енергія зірок крізь маківку. На видиху — віддаєш землі. 6 хвилин.' },
];

export const PRACTICES = BASIC_PRACTICES;
export const ACADEMY_PRACTICES = [];
export const ZBIRKA_PRACTICES = [];

export function practicesForLevel(levelN) {
  return PRACTICES.filter((p) => p.level <= levelN);
}
