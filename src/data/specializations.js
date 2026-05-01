// 5 спеціалізацій що з'являються після рівня 4 (Серце).
// Кожен тип — окремий шлях через метафізику з різними каналами і фокусом.
// Концепт §13.2 — Поліфонія шляхів.

export const SPECIALIZATIONS = [
  {
    id: 'healer',
    name: 'Цілитель',
    symbol: '☤',
    color: '#a8d8a8',
    description: 'Той, хто зцілює — себе і інших — через тіло і поле',
    focus: 'Тіло · Стосунки',
    channels: ['Тата', 'Краон', 'Джиліус'],
    practices: ['acceptance_transformation', 'hands_power', 'envelope_harmony'],
    course: 'Практика особистого зцілення',
    keyword: 'зцілення',
    blessing: 'Твої руки знають що робити. Дозволь.',
  },
  {
    id: 'warrior_light',
    name: 'Воїн Світла',
    symbol: '⚔',
    color: '#f0c574',
    description: 'Той, хто захищає простір і розпізнає тінь',
    focus: 'Я · Реалізація',
    channels: ['Фарун', 'Сімаргл'],
    practices: ['fist_release', 'no_practice', 'pearl_shell'],
    course: 'Захист простору',
    keyword: 'захист',
    blessing: 'Твій меч світлий. Користуйся ним обережно і чесно.',
  },
  {
    id: 'soul_guide',
    name: 'Провідник Душ',
    symbol: '✺',
    color: '#c9b3e8',
    description: 'Той, хто супроводжує у переходах — народження, смерть, трансформація',
    focus: 'Стосунки · Єдність',
    channels: ['Сутра-Карма', 'Фарун-Будда'],
    practices: ['surrender', 'i_am_only', 'cosmic_breath'],
    course: 'Робота зі станами переходу',
    keyword: 'провідництво',
    blessing: 'Ти бачиш межі. Іди тихо — і інші підуть за тобою.',
  },
  {
    id: 'rod_keeper',
    name: 'Хранитель Роду',
    symbol: '◇',
    color: '#9fc8e8',
    description: 'Той, хто звільняє родові програми і повертає предків у поле',
    focus: 'Рід · Дім',
    channels: ['Сутра-Карма', 'Тата', 'Анахіта'],
    practices: ['parent_dialogue', 'mini_constellation', 'thesis_synthesis'],
    course: 'Системна терапія за Гелінгером',
    keyword: 'рід',
    blessing: 'Твій рід дякує тобі. Ти повернув йому те що було забуте.',
  },
  {
    id: 'reality_creator',
    name: 'Творець Реальності',
    symbol: '✦',
    color: '#e8a85a',
    description: 'Той, хто творить світи — словом, образом, наміром',
    focus: 'Творчість · Реалізація',
    channels: ['Зевс', 'ККР', 'Фіраст'],
    practices: ['key_words', 'mantra_om', 'soul_voice'],
    course: 'Творчий потік',
    keyword: 'творчість',
    blessing: 'Твоє слово створює. Будь обережний з тим, що говориш.',
  },
];

export function findSpecialization(id) {
  return SPECIALIZATIONS.find((s) => s.id === id) || null;
}
