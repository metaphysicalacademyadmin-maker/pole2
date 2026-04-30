// Резонанс — псевдо-цифри інших гравців. Без сервера, просто симулюємо
// на основі hash відповіді гравця, щоб виглядало стабільно.

function hashStr(s) {
  let h = 0;
  for (const c of s || '') h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function resonanceCount(answerKey) {
  // Базовий діапазон 1-12 з певною кореляцією до глибини відповіді.
  const h = hashStr(answerKey);
  return 1 + (h % 12);
}

// Текст резонансу — ні точні цифри, а вiдчуття «не сам».
export function resonanceMessage(payload) {
  if (!payload) return null;
  const key = `${payload.choice}-${payload.depth}`;
  const n = resonanceCount(key);
  if (payload.depth === 'shadow') {
    return `${n} інших гравців прийшли через цю саму тінь. Ти не сам.`;
  }
  if (payload.depth === 'deep') {
    return `${n} інших побачили те саме. Поле тебе чує.`;
  }
  return null;
}
