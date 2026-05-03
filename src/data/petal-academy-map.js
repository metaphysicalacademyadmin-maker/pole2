// Мапа пелюстка → тема / fallback-курси академії.
// Динамічні курси беруться з window.__POLE_ACADEMY__.events і фільтруються
// за theme. Якщо парент-сторінка не інжектила або матчингу нема — показуємо
// статичні картки-натяки (нижче), які ведуть на загальну сторінку академії.

import { getJoinUrl } from '../utils/group-application.js';

// Кожна пелюстка має 1-2 теми зі словника `themeMeta` у utils/academy.js
// (body, shadow, voice, relations, spirit, rod, cosmo).
export const PETAL_THEMES = {
  i_self:           ['spirit', 'shadow'],     // хто я
  ii_body:          ['body'],                  // тіло
  iii_rod:          ['rod', 'shadow'],         // рід
  iv_home:          ['body', 'spirit'],        // дім / гроші / земля
  v_relations:      ['relations', 'shadow'],   // стосунки
  vi_creativity:    ['voice', 'spirit'],       // творчість
  vii_realization:  ['voice', 'spirit'],       // реалізація
  viii_spirit:      ['spirit', 'cosmo'],       // духовність
  ix_knowledge:     ['cosmo', 'spirit'],       // знання
  x_purpose:        ['voice', 'spirit'],       // призначення
  xi_shadow:        ['shadow'],                // тінь
  ix_unity:         ['cosmo', 'spirit'],       // єдність
};

// Fallback-картки: показуються якщо динамічних подій під цю тему нема.
// Ведуть на /academy або на /demo-сторінку gameJoinUrl.
export const FALLBACK_HINTS = {
  i_self: {
    title: 'Програма «Авторство»',
    desc: 'Архетипи і життєві ролі — як зняти маски без втрати опори.',
    icon: '◯',
  },
  ii_body: {
    title: 'Тіло як вівтар',
    desc: 'Ретрит і онлайн-курс — повернути увагу до тіла без спорту.',
    icon: '🌿',
  },
  iii_rod: {
    title: 'Розстановки роду',
    desc: 'Робота з родовими програмами у груповому форматі.',
    icon: '🌳',
  },
  iv_home: {
    title: 'Гроші як заземлення',
    desc: 'Грошова чакра, потік ресурсу і земля як основа.',
    icon: '🏔',
  },
  v_relations: {
    title: 'Близькість без розчинення',
    desc: 'Парна і одиночна група — стосунки як простір зростання.',
    icon: '💞',
  },
  vi_creativity: {
    title: 'Творчість як шлях',
    desc: 'Голос, дар, гра — без оцінки і без мети.',
    icon: '✨',
  },
  vii_realization: {
    title: 'Місія і голос',
    desc: 'Реалізація через дар, не через тиск ринку.',
    icon: '◉',
  },
  viii_spirit: {
    title: 'Духовність без релігії',
    desc: 'Знаки, синхронності, особиста міфологія.',
    icon: '✦',
  },
  ix_knowledge: {
    title: 'Космоенергетика',
    desc: 'Канали, ініціації, робота з полем — для тих хто йде глибше.',
    icon: '🔮',
  },
  x_purpose: {
    title: 'Призначення',
    desc: 'Що ти прийшов сюди робити — і як це втілити без вигорання.',
    icon: '⚡',
  },
  xi_shadow: {
    title: 'Робота з тінню',
    desc: 'Дзеркало, провокатор, ріжучий — як стати цілісним.',
    icon: '🌑',
  },
  ix_unity: {
    title: 'Єдність',
    desc: 'Інтеграція всього шляху — від коріння до джерела.',
    icon: '✺',
  },
};

export function getPetalThemes(petalId) {
  return PETAL_THEMES[petalId] || ['spirit'];
}

export function getFallbackHint(petalId) {
  return FALLBACK_HINTS[petalId] || null;
}

export { getJoinUrl };
