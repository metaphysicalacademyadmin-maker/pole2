// Черга модалок — щоб гравець бачив їх по черзі, не накладеними.
// Кожна має пріоритет (вище = важливіше). Високопріоритетна може витіснити поточну.

export const MODAL_PRIORITY = {
  crisis: 100,
  'shadow-mirror-helpline': 95,
  'archetype-transform': 60,
  'shadow-mirror': 50,
  specialization: 40,
  'archetype-calibration': 35,
  resonance: 20,
};

// Зменшує payload-копії — повертає актуальний пріоритет
export function getPriority(id, payload) {
  if (id === 'shadow-mirror' && payload?.helpline) {
    return MODAL_PRIORITY['shadow-mirror-helpline'];
  }
  return MODAL_PRIORITY[id] ?? 30;
}
