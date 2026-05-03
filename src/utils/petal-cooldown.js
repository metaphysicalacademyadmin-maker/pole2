// Час між пелюстками — 24 години (м'яко).
// Не блокує жорстко: показує модалку «поле дозріває», гравець може
// зачекати або свідомо «увійти зараз». Час між клітинками всередині
// однієї пелюстки — без cooldown.

export const COOLDOWN_MS = 24 * 60 * 60 * 1000;

/**
 * Знайти останню завершену пелюстку (max ts серед completed).
 * Повертає { id, ts } або null.
 */
export function findLastCompletion(petalProgress) {
  let best = null;
  for (const [id, p] of Object.entries(petalProgress || {})) {
    if (p?.completed && p.ts) {
      if (!best || p.ts > best.ts) best = { id, ts: p.ts };
    }
  }
  return best;
}

/**
 * Чи повинен спрацювати cooldown коли гравець відкриває petalId?
 * Не спрацьовує якщо:
 *   • це продовження вже початої пелюстки (answeredIds.length > 0 і не completed)
 *   • нема завершених пелюсток (перша)
 *   • > 24 год від останнього завершення
 *   • гравець уже override'нув для цієї пелюстки (cooldownOverrides[petalId] = true)
 */
export function shouldShowCooldown(petalId, petalProgress, cooldownOverrides) {
  const cur = petalProgress?.[petalId];
  // Продовження вже початої — без cooldown
  if (cur?.answeredIds?.length > 0 && !cur.completed) return null;
  // Override вже зроблений
  if (cooldownOverrides?.[petalId]) return null;

  const last = findLastCompletion(petalProgress);
  if (!last) return null;

  const elapsed = Date.now() - last.ts;
  if (elapsed >= COOLDOWN_MS) return null;

  return {
    lastPetalId: last.id,
    elapsedMs: elapsed,
    remainingMs: COOLDOWN_MS - elapsed,
    remainingHours: Math.floor((COOLDOWN_MS - elapsed) / 3600000),
    remainingMinutes: Math.floor(((COOLDOWN_MS - elapsed) % 3600000) / 60000),
  };
}

export function formatCooldownRemaining(remainingMs) {
  const h = Math.floor(remainingMs / 3600000);
  const m = Math.floor((remainingMs % 3600000) / 60000);
  if (h <= 0) return `${m} хв`;
  if (h < 24) return `${h} год ${m} хв`;
  return `${h} год`;
}
