// Спільнота — анонімні «дари у Поле» від гравців.
//
// За замовчуванням все локально (зберігається у gifts[]). Якщо парент-вікно
// metaphysical-way.academy інжектить `window.__POLE_COMMUNITY__`, гра
// синхронізується з реальною спільнотою.
//
// Контракт парента:
//   window.__POLE_COMMUNITY__ = {
//     publish: async (gift) => { /* зберігає у MongoDB і повертає true */ },
//     count: 124,                                  // скільки дарів у Полі зараз
//     sample: async (kind) => [{...}, ...],        // приклади чужих дарів (опційно)
//   }

export async function publishGift(gift) {
  if (typeof window === 'undefined') return false;
  const c = window.__POLE_COMMUNITY__;
  if (c && typeof c.publish === 'function') {
    try {
      await c.publish(gift);
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}

export function communityCount() {
  if (typeof window === 'undefined') return null;
  const c = window.__POLE_COMMUNITY__;
  if (c && typeof c.count === 'number') return c.count;
  // fallback — детермінована псевдо-кількість на основі дня
  const day = Math.floor(Date.now() / 86_400_000);
  return 40 + ((day * 13) % 80);
}

// 4 типи дарів — щоб гравець мав структуру
export const GIFT_KINDS = [
  {
    id: 'blessing',
    icon: '🙏',
    title: 'Благословення',
    hint: 'Кілька слів для тих, хто щойно зайшов у Поле — від тебе, який пройшов далі',
    placeholder: 'наприклад: «Не бійся повільності. Усе, що повільне — твоє.»',
    forNew: true,
  },
  {
    id: 'key',
    icon: '🗝',
    title: 'Ключ-натхнення',
    hint: 'Один із твоїх ключів-слів — як натхнення для тих, хто на тому ж рівні',
    placeholder: 'наприклад: «Я є — і цього достатньо.»',
    needsLevel: true,
  },
  {
    id: 'practice',
    icon: '🌿',
    title: 'Практика, що врятувала',
    hint: 'Яка практика витягувала тебе у важкий момент — щоб інші могли спробувати',
    placeholder: 'наприклад: «Заземлення. Завжди починаю з нього коли тривога.»',
  },
  {
    id: 'reflection',
    icon: '◯',
    title: 'Свідчення',
    hint: 'Що ти зрозумів про себе у цій грі — те, чого не знав до неї',
    placeholder: 'наприклад: «Я думав, що я слабкий. Виявилось — я просто не дозволяв собі.»',
  },
];

export function findGiftKind(id) {
  return GIFT_KINDS.find((k) => k.id === id) || null;
}
