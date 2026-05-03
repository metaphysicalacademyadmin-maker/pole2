// LLM-Арбітр — персональний свідок-відгук на custom answer гравця.
//
// Контракт парент-сторінки (metaphysical-way2):
//
//   window.__POLE_LLM__ = {
//     witness: async ({ text, levelN, chakra, intention }) => {
//       // Бекенд: POST /api/pole-llm/witness
//       // Повертає: { text: 'свідчу — ...', tone?: 'gentle'|'serious'|'celebratory' }
//       //   або null/throws якщо не вийшло (rate limit, кризовий filter, etc.)
//     },
//   };
//
// Принципи дизайну (для бекенд-промпту):
//   • Тон Арбітра — свідок, не порадник. Не "ти маєш зробити X".
//   • 1-2 речення, не довше. Не есе.
//   • Не діагноз. Не оцінка. "Я чую — це болить, і ти все одно сказав."
//   • Перевіряти на crisis-сигнали і повернути null + ескалувати у helpline.

const TIMEOUT_MS = 8000;        // не тримаємо плашку більше 8 секунд
const MIN_TEXT_LEN = 20;        // не запитуємо для коротких "так", "ні"

export function isLlmWitnessAvailable() {
  if (typeof window === 'undefined') return false;
  const api = window.__POLE_LLM__;
  return !!(api && typeof api.witness === 'function');
}

export async function fetchWitness(payload) {
  if (!isLlmWitnessAvailable()) return null;
  if (!payload?.text || payload.text.trim().length < MIN_TEXT_LEN) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const result = await Promise.race([
      window.__POLE_LLM__.witness({
        text: payload.text,
        levelN: payload.levelN || null,
        chakra: payload.chakra || null,
        intention: payload.intention || null,
        signal: controller.signal,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS + 200)),
    ]);
    clearTimeout(timer);
    if (!result || !result.text) return null;
    return {
      text: String(result.text).trim().slice(0, 400),
      tone: result.tone || 'gentle',
    };
  } catch (e) {
    clearTimeout(timer);
    return null;  // graceful — нічого не показуємо
  }
}
