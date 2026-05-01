// Сканер тіньових тригерів у тексті custom-відповіді гравця.
// Повертає {category, keyword, reflection, weight, helpline?} або null.
// Пріоритет: doom першим, далі за вагою.

import { SHADOW_CATEGORIES, CATEGORY_ORDER } from '../data/shadow-keywords.js';

export function detectShadow(text) {
  if (!text || typeof text !== 'string') return null;
  const lower = text.toLowerCase();

  // Перевіряємо у пріоритетному порядку (doom першим)
  for (const catId of CATEGORY_ORDER) {
    const cat = SHADOW_CATEGORIES[catId];
    if (!cat) continue;
    for (const kw of cat.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return {
          category: cat.id,
          label: cat.label,
          keyword: kw,
          reflection: cat.reflection.replace('{matched}', kw),
          weight: cat.weight,
          helpline: !!cat.helpline,
        };
      }
    }
  }
  return null;
}
