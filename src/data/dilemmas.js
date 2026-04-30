// Моральні дилеми — ситуації без правильної відповіді. Тестують зрілість Серця.
// Викликаються після половини рівня 4 (Серце) як проміжна «розетка».

export const DILEMMAS = [
  {
    id: 'lying_partner',
    level: 4,
    title: 'Близька людина бреше',
    setup: 'Ти випадково дізнався що близька людина бреше тобі багато років. Не критично — про дрібниці. Але систематично. Ти знаєш, але вона не знає що ти знаєш.',
    question: 'Що робиш?',
    options: [
      { id: 'confront', text: 'Прямо питаю. Витримую все що приходить.', weight: 'mature', barometer: 'voice', delta: 2 },
      { id: 'wait',     text: 'Чекаю. Можливо, вона сама розкаже коли буде готова.', weight: 'gentle', barometer: 'love', delta: 1 },
      { id: 'leave',    text: 'Тихо віддалюсь. Без сцен.', weight: 'shadow', barometer: 'love', delta: 0 },
      { id: 'pretend',  text: 'Роблю вигляд що не знаю. Краще не псувати все.', weight: 'avoidance', barometer: 'voice', delta: 0, shadow: 'засліплення' },
    ],
  },
  {
    id: 'parent_dying',
    level: 4,
    title: 'Помираючий батько',
    setup: 'Батько/мама на смертному ложі. Ти багато років на нього/неї ображений. Зараз — твій останній шанс.',
    question: 'Що скажеш у останньому диханні?',
    options: [
      { id: 'forgive',     text: '«Я тебе люблю. Я відпускаю.»', weight: 'deep', barometer: 'love', delta: 3 },
      { id: 'truth',       text: '«Ти мене ранив. Але я несу твоє ім\'я.»', weight: 'mature', barometer: 'voice', delta: 2 },
      { id: 'silence',     text: 'Просто тримаю руку. Без слів.', weight: 'deep', barometer: 'love', delta: 2 },
      { id: 'cant',        text: 'Не можу прийти. Це задорого.', weight: 'shadow', barometer: 'love', delta: 0, shadow: 'застряг' },
    ],
  },
  {
    id: 'cheating_friend',
    level: 4,
    title: 'Зрада близького',
    setup: 'Найкращий друг зрадив дружбу — взяв і обманом використав тебе. Він просить пробачення.',
    question: 'Що ти у глибині серця знаєш?',
    options: [
      { id: 'forgive_in', text: 'Пробачаю всередині. Стосунки — як піде.', weight: 'mature', barometer: 'love', delta: 2 },
      { id: 'forgive_out', text: 'Пробачаю і далі друзі. Усі помиляються.', weight: 'gentle', barometer: 'love', delta: 1 },
      { id: 'limit',     text: 'Розумію. Але йому я більше не довіряю.', weight: 'mature', barometer: 'will', delta: 2 },
      { id: 'revenge',   text: 'Поки що — холодно. Подивимось.', weight: 'shadow', barometer: 'love', delta: 0, shadow: 'холодний розум' },
    ],
  },
  {
    id: 'love_or_safety',
    level: 4,
    title: 'Любов чи безпека?',
    setup: 'Маєш зробити вибір: безпечні стабільні стосунки де тебе люблять — або ризик нової любові у яку ти провалився, але вона нестабільна.',
    question: 'У який бік душа реально тягне?',
    options: [
      { id: 'safety_honest', text: 'Залишусь у безпеці. Це не ідеал, але моє.', weight: 'mature', barometer: 'will', delta: 2 },
      { id: 'risk',          text: 'Йду у нове. Хочу жити, не лише відпочивати.', weight: 'deep', barometer: 'flow', delta: 2 },
      { id: 'paralyzed',     text: 'Не знаю. Стою у колі ще місяці.', weight: 'shadow', barometer: 'will', delta: 0, shadow: 'розлитий' },
    ],
  },
  {
    id: 'child_choice',
    level: 4,
    title: 'Питання дитини',
    setup: 'Близька людина пропонує мати дитину разом. Ти не впевнений що готовий.',
    question: 'Що скажеш?',
    options: [
      { id: 'honest',  text: '«Я не готовий поки що. Хочу про це поговорити.»', weight: 'mature', barometer: 'voice', delta: 2 },
      { id: 'agree',   text: 'Погоджуюсь — заради неї/нього. Розберусь по дорозі.', weight: 'shadow', barometer: 'voice', delta: 0, shadow: 'розлитий' },
      { id: 'no',      text: '«Ні. Не зараз. Можливо взагалі ні.»', weight: 'mature', barometer: 'will', delta: 2 },
      { id: 'maybe',   text: 'Уникаю розмови. Може саме розсосеться.', weight: 'shadow', barometer: 'voice', delta: 0, shadow: 'застряг' },
    ],
  },
];

export function dilemmasForLevel(levelN) {
  return DILEMMAS.filter((d) => d.level === levelN);
}
