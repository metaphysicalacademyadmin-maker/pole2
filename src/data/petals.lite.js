// LITE-варіант — лише метадані 12 пелюсток без 36 клітинок контенту.
// Економія: ~30 KB raw.

export const PETALS = [
  { id: 'i_self',          n: 1, name: 'Я',           symbol: 'I',    color: '#f0c574',
    domain: 'ідентичність · межі · авторство',         description: '', cells: [] },
  { id: 'ii_body',         n: 2, name: 'Тіло',        symbol: 'II',   color: '#a8c898',
    domain: 'здоров\'я · сексуальність',               description: '', cells: [] },
  { id: 'iii_rod',         n: 3, name: 'Рід',         symbol: 'III',  color: '#e8b0b8',
    domain: 'предки · родові програми',                description: '', cells: [] },
  { id: 'iv_home',         n: 4, name: 'Дім',         symbol: 'IV',   color: '#9fc8e8',
    domain: 'простір · опора · гроші',                 description: '', cells: [] },
  { id: 'v_relations',     n: 5, name: 'Стосунки',    symbol: 'V',    color: '#f0a8b8',
    domain: 'партнерство · прощення',                  description: '', cells: [] },
  { id: 'vi_creativity',   n: 6, name: 'Творчість',   symbol: 'VI',   color: '#c9b3e8',
    domain: 'натхнення · потік · дар',                 description: '', cells: [] },
  { id: 'vii_realization', n: 7, name: 'Реалізація',  symbol: 'VII',  color: '#f5b870',
    domain: 'місія · голос у світі',                   description: '', cells: [] },
  { id: 'viii_spirit',     n: 8, name: 'Духовність',  symbol: 'VIII', color: '#a89bd8',
    domain: 'інтуїція · знаки · віра',                 description: '', cells: [] },
  { id: 'ix_knowledge',    n: 9, name: 'Знання',      symbol: 'IX',   color: '#9fb8d8',
    domain: 'допитливість · навчання · істина',        description: '', cells: [] },
  { id: 'x_purpose',       n: 10, name: 'Призначення', symbol: 'X',   color: '#e8a050',
    domain: 'дар · місія · служіння світу',            description: '', cells: [] },
  { id: 'xi_shadow',       n: 11, name: 'Тінь',       symbol: 'XI',   color: '#7a5a8a',
    domain: 'інтеграція · правда про себе',            description: '', cells: [] },
  { id: 'ix_unity',        n: 12, name: 'Єдність',    symbol: 'XII',  color: '#ffe7a8',
    domain: 'подяка · здавання · "Я є"',               description: '', cells: [] },
];

export function findPetal(id) {
  return PETALS.find((p) => p.id === id) || null;
}
