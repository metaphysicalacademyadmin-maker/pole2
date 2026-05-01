// Евристика для калібровки архетипу на 3-й клітинці.
// Дивиться на: домінантний барометр, глибину відповідей (deep/mid/shadow),
// custom-варіанти. Повертає id з ARCHETYPES або null якщо невпевнено.
//
// Не "AI" — просте відображення першого зрізу. Гравець завжди може змінити.

const BAROMETER_TO_ARCHETYPE = {
  root: 'orphan',          // (якщо в плюсі) — Захисник дому; (в мінусі) — Сирота
  flow: 'lover',           // дозвіл відчувати → Коханець
  will: 'warrior',          // воля → Воїн
  love: 'innocent',         // любов і прийняття → Невинна
  voice: 'rebel',          // правда вголос → Бунтівник
  clarity: 'sage',         // ясність → Мудрець
  light: 'magician',       // єдність → Маг
  gratitude: 'innocent',   // подяка → Невинна
};

// id → бажаний фолбек якщо архетип-кандидат не існує у ARCHETYPES
const FALLBACKS = ['warrior', 'sage', 'lover', 'innocent', 'rebel'];

export function suggestArchetype(state, archetypeIds) {
  const r = state.resources || {};
  const answers = Object.values(state.cellAnswers || {});

  // 1. Знайти найвищий за модулем барометр
  let bestKey = null, bestAbs = 0;
  for (const [k, v] of Object.entries(r)) {
    if (Math.abs(v) > bestAbs) { bestAbs = Math.abs(v); bestKey = k; }
  }

  // 2. Якщо переважає тінь (всі низькі і > половини відповідей shadow) — Сирота/Бунтівник
  const shadowCount = answers.filter((a) => a.depth === 'shadow').length;
  if (shadowCount >= 2 && bestAbs <= 2) {
    return pickExisting(['orphan', 'rebel', 'warrior'], archetypeIds);
  }

  // 3. Якщо custom-відповіді присутні — Бунтівник або Творець
  const customCount = answers.filter((a) => a.customText).length;
  if (customCount >= 2) {
    return pickExisting(['rebel', 'creator', 'sage'], archetypeIds);
  }

  // 4. Барометрна логіка
  if (bestKey) {
    const candidate = BAROMETER_TO_ARCHETYPE[bestKey];
    if (candidate && archetypeIds.has(candidate)) return candidate;
  }

  // 5. Фолбек
  return pickExisting(FALLBACKS, archetypeIds);
}

function pickExisting(candidates, available) {
  for (const c of candidates) {
    if (available.has(c)) return c;
  }
  return null;
}
