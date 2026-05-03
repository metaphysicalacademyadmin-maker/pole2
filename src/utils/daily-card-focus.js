// Денна карта впливає на мандалу: підсвічує 1 пелюстку дня.
// Картка → пелюстка через мапу id → petalId.
//
// Не всі 14 карток мають жорсткий зв'язок — деякі багатозначні.
// Якщо нема прямого матчу — ротуємо за днем тижня (детерміновано).

import { cardForDate } from '../data/daily-cards.js';

const CARD_PETAL_MAP = {
  soil:      'iv_home',         // земля → дім / гроші
  water:     'ii_body',         // вода → тіло / емоції
  fire:      'vii_realization', // вогонь → воля / реалізація
  air:       'vi_creativity',   // повітря → творчість / голос
  ether:     'viii_spirit',     // ефір → духовність
  mirror:    'v_relations',     // дзеркало → стосунки
  mother:    'iii_rod',         // мати → рід
  father:    'iii_rod',         // батько → рід
  shadow:    'xi_shadow',       // тінь → тінь
  gift:      'x_purpose',       // дар → призначення
  silence:   'ix_unity',        // тиша → єдність
  forgive:   'v_relations',     // прощення → стосунки
  gratitude: 'i_self',          // подяка → я
  breath:    'ii_body',         // подих → тіло
};

/**
 * Повертає { card, focusPetalId } для даного дня.
 */
export function focusForToday(date = new Date()) {
  const card = cardForDate(date);
  const focusPetalId = CARD_PETAL_MAP[card.id] || null;
  return { card, focusPetalId };
}
