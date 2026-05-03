// Тригери для появи Учителя Поля.
// Учитель не нав'язується — з'являється коли є привід:
//   • дуже низький барометр (<= -5)
//   • завершення тіньової пелюстки
//   • 3+ дилем без відповіді (ігнор)
//   • перша обіцянка
//
// Кожен тригер має cooldown 24 години — не показуємо повторно одне й те ж.

const TRIGGER_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const TRIGGERS = [
  {
    id: 'low-barometer',
    topicId: 'difficult_moment',
    check: (s) => {
      const r = s?.resources || {};
      const min = Math.min(...Object.values(r));
      if (min <= -5) {
        const k = Object.entries(r).find(([_, v]) => v === min)?.[0];
        return { barometer: k, value: min };
      }
      return null;
    },
    text: 'я бачу — поле важке. побудь хвилину.',
  },
  {
    id: 'shadow-completed',
    topicId: 'shadow_work',
    check: (s) => {
      const sh = s?.petalProgress?.xi_shadow;
      if (sh?.completed) {
        // Лише якщо нещодавно (за останні 10 хв)
        const elapsed = Date.now() - (sh.ts || 0);
        if (elapsed < 10 * 60000) return true;
      }
      return null;
    },
    text: 'ти зустрів тінь. дозволь полю прийняти це.',
  },
  {
    id: 'first-quest',
    topicId: 'how_to_play',
    check: (s) => {
      if (s?.currentQuest && (s.questHistory || []).length === 0) {
        // Перша обіцянка — тільки що взята
        const elapsed = Date.now() - (s.currentQuest.startedAt || 0);
        if (elapsed < 5 * 60000) return true;
      }
      return null;
    },
    text: 'твоя перша обіцянка прийнята. поле тримає.',
  },
];

/**
 * Знайти активний тригер. Повертає { id, topicId, text } або null.
 * shownHistory = state.teacherWhisperHistory: { [triggerId]: ts }
 */
export function findActiveTrigger(state, shownHistory = {}) {
  for (const trigger of TRIGGERS) {
    const lastShown = shownHistory[trigger.id] || 0;
    const elapsed = Date.now() - lastShown;
    if (elapsed < TRIGGER_COOLDOWN_MS) continue;
    const data = trigger.check(state);
    if (data) {
      return { id: trigger.id, topicId: trigger.topicId, text: trigger.text, data };
    }
  }
  return null;
}
