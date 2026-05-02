// LITE-варіант — лише метадані 11 каналів, без 132 клітинок контенту.
// Підмінюється через alias у vite.config.js при mode === 'embed-lite'.
// Економія: ~80 KB raw / ~30 KB gzip.

export { STAGES, stageOf } from './_helpers.js';

export const COSMO_CHANNELS = [
  { id: 'tata',          name: 'Тата',           symbol: '⭐', color: '#a8c898',
    description: 'Оздоровчий канал · нормалізація ваги, гормонів',          type: 'оздоровчий',           cells: [] },
  { id: 'farun-budda',   name: 'Фарун-Будда',    symbol: '🌟', color: '#ffe7a8',
    description: 'Універсальний наповнюючий · чиста космічна енергія',       type: 'наповнюючий',          cells: [] },
  { id: 'farun',         name: 'Фарун',          symbol: '⚡', color: '#f5b870',
    description: 'Ударний канал · кістки, м\'язи, сольові відкладення',      type: 'ударний',              cells: [] },
  { id: 'zevs',          name: 'Зевс',           symbol: '🔥', color: '#e8a85a',
    description: 'Творчість · ударний канал для запуску чакр',                type: 'ударний/творчий',      cells: [] },
  { id: 'simargl',       name: 'Сімаргл',        symbol: '💧', color: '#9fc8e8',
    description: 'Спалює прив\'язки · захист бізнесу · ораторство',           type: 'захисний',             cells: [] },
  { id: 'sutra-karma',   name: 'Сутра-Карма',    symbol: '🌑', color: '#7a5a78',
    description: 'Родові програми · кармічні вузли · до 7-го коліна',         type: 'кармічний',            cells: [] },
  { id: 'kkr',           name: 'ККР',            symbol: '🧠', color: '#a89bd8',
    description: 'Контроль негативних думок · психічні здібності',            type: 'енергетично-магічний', cells: [] },
  { id: 'firast',        name: 'Фіраст',         symbol: '🏠', color: '#9fc8e8',
    description: 'Очищення аури, кімнат, предметів',                          type: 'очищувальний',         cells: [] },
  { id: 'kraon',         name: 'Краон',          symbol: '🩸', color: '#d89098',
    description: 'Кров · печінка · нормалізація цукру',                       type: 'оздоровчий/кров',      cells: [] },
  { id: 'dzhilius',      name: 'Джиліус',        symbol: '💉', color: '#b87080',
    description: 'Ударний канал крові · інфекції · вірусні страхи',           type: 'ударний/кров',         cells: [] },
  { id: 'gold-pyramid',  name: 'Золота Піраміда', symbol: '🏵', color: '#ffe7a8',
    description: 'Канал масштабу · висока амплітуда',                         type: 'духовний',             cells: [] },
];

export function findChannel(id) {
  return COSMO_CHANNELS.find((c) => c.id === id) || null;
}

export function getCellByIdx(channelId, idx) {
  const ch = findChannel(channelId);
  return ch?.cells?.[idx] || null;
}
