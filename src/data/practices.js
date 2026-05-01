// Базові практики (тілесні, мантри, дихання) + академічні з методички
// + практики зі "Збірки практик метафізики та космоенергетики".
// Кожна має level, duration (хв), instruction, barometer.

import { ACADEMY_PRACTICES } from './practices-academy.js';
import { ZBIRKA_PRACTICES } from './practices-zbirka.js';

const BASIC_PRACTICES = [
  // ─── Рівень 1: Коріння ───
  { id: 'grounding',      level: 1, name: 'Заземлення', icon: '🌱', duration: 3, barometer: 'root',
    instruction: 'Стій босоніж або в шкарпетках. Стопи паралельно, на ширині таза. Закрий очі. Уяви, що з кожної стопи виростають коріння — глибоко, до серця землі. Дихай у стопи. 3 хвилини.' },
  { id: 'sensing_weight', level: 1, name: 'Відчуття ваги', icon: '⬇', duration: 2, barometer: 'root',
    instruction: 'Сядь або стій. Прийми тіло як вагу. Не намагайся бути легкою/легким — стань важким. Відчуй як гравітація тримає тебе. Це і є коріння. 2 хвилини.' },
  { id: 'pelvis_breath',  level: 1, name: 'Дихання у таз', icon: '◉', duration: 4, barometer: 'root',
    instruction: 'Лежи на спині, руку на низ живота. Дихай так, щоб таз м\'яко рухався. Уяви, що дихаєш через куприк. Це активує муладхару.' },

  // ─── Рівень 2: Потік ───
  { id: 'tear_release',   level: 2, name: 'Звільнення сліз', icon: '💧', duration: 5, barometer: 'flow',
    instruction: 'Сядь у тиші. Дозволь будь-чому що піднімається — піднятись. Не редагуй. Якщо хочуть прийти сльози — нехай. Це лікує.' },
  { id: 'voice_release',  level: 2, name: 'Звільнення звуком', icon: '🌬', duration: 3, barometer: 'flow',
    instruction: 'Стань. Видихай зі звуком — будь-який. Стогін, гул, крик у долоні. Не «правильний» — твій. Тіло саме знає що випустити.' },
  { id: 'water_movement', level: 2, name: 'Танець води', icon: '〰', duration: 5, barometer: 'flow',
    instruction: 'Поставити повільну музику. Закрий очі. Рухайся хвилями — від таза. Не танцюй — будь водою.' },

  // ─── Рівень 3: Воля і Рід ───
  { id: 'fist_release',   level: 3, name: 'Кулак-долоня', icon: '✊', duration: 2, barometer: 'will',
    instruction: 'Стисни кулаки сильно. Тримай 10 секунд. Рiзкo розкрий долоні і дозволь рукам впасти. Повтори тричі. Сила і відпускання.' },
  { id: 'no_practice',    level: 3, name: 'Тренування "ні"', icon: '⊘', duration: 5, barometer: 'will',
    instruction: 'У дзеркало вголос: «Ні. Ні. Ні. Я кажу ні.» Без виправдань. Витримай тишу що приходить після.' },
  { id: 'parent_dialogue',level: 3, name: 'Діалог з предком', icon: '⚭', duration: 8, barometer: 'will',
    instruction: 'Уяви маму чи тата перед собою. Скажи їм мовчки три речі: «Я тебе бачу. Я малий, ти великий. Я живу СВОЄ життя.» Тіло відгукнеться.' },

  // ─── Рівень 4: Серце ───
  { id: 'heart_hands',    level: 4, name: 'Долоні на серце', icon: '🤲', duration: 3, barometer: 'love',
    instruction: 'Праву долоню на центр грудей, ліву поверх. Закрий очі. Просто будь так 3 хвилини. Це самоприйняття без слів.' },
  { id: 'butterfly',      level: 4, name: 'Метелик', icon: '🦋', duration: 4, barometer: 'love',
    instruction: 'Схрести руки на грудях, долоні на плечі. Поплескуй по плечах — лiвo, правo, лiвo. Повільно. Це самозаспокоєння через body bilateral stimulation.' },
  { id: 'forgiveness',    level: 4, name: 'Прощення (для себе)', icon: '✦', duration: 6, barometer: 'love',
    instruction: 'Уяви того кому не пробачив. Скажи мовчки: «Я не пробачаю тобі. Але я відпускаю себе від цієї ноші.» Це не для нього — для тебе.' },

  // ─── Рівень 5: Голос ───
  { id: 'silence_listening', level: 5, name: 'Слухання тиші', icon: '◯', duration: 5, barometer: 'voice',
    instruction: 'Зупини зовнішнє. Сядь. Слухай тишу як слухав би людину. Не «медитуй» — просто слухай.' },
  { id: 'truth_speaking',  level: 5, name: 'Своя правда вголос', icon: '🗣', duration: 4, barometer: 'voice',
    instruction: 'Скажи вголос одну річ яку довго не казав. Сам собі. Якщо у тебе є нерозказана правда — нехай вона прозвучить.' },
  { id: 'mantra_om',       level: 5, name: 'Мантра ОМ', icon: 'ॐ', duration: 5, barometer: 'voice',
    instruction: 'Сядь з прямою спиною. Глибокий вдих. На видиху — протяжне «ом-м-м-м». 7 разів. Резонанс активує вішудху.' },

  // ─── Рівень 6: Видіння ───
  { id: 'between_brows',   level: 6, name: 'Між бровами', icon: '◈', duration: 5, barometer: 'clarity',
    instruction: 'Закрий очі. Звернись внутрішнім поглядом до точки між бровами. Не намагайся «побачити» — просто будь там.' },
  { id: 'dream_recall',    level: 6, name: 'Згадка сну', icon: '☾', duration: 3, barometer: 'clarity',
    instruction: 'Згадай останній сон. Не аналізуй — просто пам\'ятай. Запиши кілька слів. Сни — мова душі.' },
  { id: 'sign_seeking',    level: 6, name: 'Знак-прохання', icon: '✺', duration: 24*60, barometer: 'clarity',
    instruction: 'Сформулюй питання. Попроси Поле дати знак протягом дня. Слухай і дивись — як приходить.' },

  // ─── Рівень 7: Джерело ───
  { id: 'i_am_only',       level: 7, name: 'Тільки "Я є"', icon: '∞', duration: 7, barometer: 'light',
    instruction: 'Закрий очі. Внутрішньо повторюй: «Я є.» Без додавань. Просто два слова. 7 хвилин.' },
  { id: 'gratitude_naming',level: 7, name: 'Подяка по іменах', icon: '☉', duration: 5, barometer: 'gratitude',
    instruction: 'Назви по черзі 7 речей за які вдячний СЬОГОДНІ. Конкретно. Дрібниці теж рахуються.' },
  { id: 'surrender',       level: 7, name: 'Здавання', icon: '◌', duration: 4, barometer: 'light',
    instruction: 'Скажи внутрішньо: «Я не розумію. Не контролюю. І це нормально. Я довіряю.» Подихай у це.' },

  // ─── Бонусні (доступні з рівня 4+) ───
  { id: 'hands_power',     level: 4, name: 'Сила долонь', icon: '✋', duration: 4, barometer: 'love',
    instruction: 'Потри долоні швидко 30 секунд. Розведи їх — відчуй енергію між ними. Поклади на хворе чи затиснуте місце. Тримай 3 хв.' },
  { id: 'soul_voice',      level: 5, name: 'Голос Душі (запис)', icon: '🎙', duration: 3, barometer: 'voice',
    instruction: 'Запиши на телефон 1-3 хв свого голосу — про що зараз болить. Прослухай через день. Голос Душі чесний як ніхто.' },
  { id: 'mini_constellation', level: 6, name: 'Міні-розстановка', icon: '⊹', duration: 8, barometer: 'clarity',
    instruction: 'На столі. Постав 3 предмети — Я, мама, тато. Помацай інтуїтивно дистанції. Що тіло каже про порядок?' },
  { id: 'cosmic_breath',   level: 7, name: 'Космічне дихання', icon: '☄', duration: 6, barometer: 'light',
    instruction: 'На вдиху уяви, що приймаєш енергію зірок крізь маківку. На видиху — віддаєш землі. 6 хвилин.' },
];

// Об'єднуємо базові + академічні + зі збірки
export const PRACTICES = [...BASIC_PRACTICES, ...ACADEMY_PRACTICES, ...ZBIRKA_PRACTICES];

export function practicesForLevel(levelN) {
  return PRACTICES.filter((p) => p.level <= levelN);
}

export { ACADEMY_PRACTICES, ZBIRKA_PRACTICES };
