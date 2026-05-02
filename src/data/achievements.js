// Досягнення — milestones, що автоматично unlock'аються коли гравець виконує умову.
// Перевіряються при відкритті Cabinet та після ключових подій.

export const ACHIEVEMENTS = [
  // ─── Шлях ───
  { id: 'first_key', icon: '🗝', tier: 'bronze', title: 'Перший ключ',
    desc: 'Ти отримав свою першу формулу-ключ.',
    when: (s) => (s.completedLevels || []).length >= 1 },
  { id: 'three_keys', icon: '🔑', tier: 'silver', title: 'Троїстість',
    desc: '3 ключі — твоя нижня тріада тримає.',
    when: (s) => (s.completedLevels || []).length >= 3 },
  { id: 'all_seven', icon: '✦', tier: 'gold', title: 'Сім ключів',
    desc: 'Усі 7 рівнів свідомості пройдено.',
    when: (s) => (s.completedLevels || []).length >= 7 },
  { id: 'flower_of_life', icon: '✺', tier: 'platinum', title: 'Квітка Життя',
    desc: '9 пелюсток розкриті. Ти — повний.',
    when: (s) => Object.values(s.petalProgress || {}).filter((p) => p.completed).length >= 9 },

  // ─── Тінь ───
  { id: 'first_snake', icon: '🐍', tier: 'silver', title: 'Перша зустріч з тінню',
    desc: 'Ти зайшов у Snake-клітинку.',
    when: (s) => (s.snakePenalties || []).length >= 1 },
  { id: 'shadow_seen', icon: '🪞', tier: 'silver', title: 'Я побачив',
    desc: 'Дзеркало Тіні — ти визнав хоч одну тінь у собі.',
    when: (s) => (s.shadowMirrorHistory || []).filter((m) => m.response === 'seen').length >= 1 },
  { id: 'shadow_master', icon: '☾', tier: 'gold', title: 'Майстер тіні',
    desc: '10 тіньових зустрічей побачено.',
    when: (s) => (s.shadowMirrorHistory || []).filter((m) => m.response === 'seen').length >= 10 },
  { id: 'crisis_passed', icon: '⚡', tier: 'gold', title: 'Точка Перевороту',
    desc: 'Ти пройшов через Кризу Системи.',
    when: (s) => !!s.crisisAcknowledgedTs },
  { id: 'helpline_used', icon: '☎', tier: 'special', title: 'Підтримку запрошено',
    desc: 'Ти прийняв допомогу — це сила.',
    when: (s) => (s.shadowMirrorHistory || []).some((m) => m.helpline) },

  // ─── Глибина ───
  { id: 'first_custom', icon: '✎', tier: 'bronze', title: 'Своє слово',
    desc: 'Перша custom-відповідь — найцінніше.',
    when: (s) => Object.values(s.cellAnswers || {}).filter((a) => a.customText).length >= 1 },
  { id: 'fifty_customs', icon: '✍', tier: 'gold', title: 'Глибокий діалог',
    desc: '50 своїх відповідей — ти говориш до Поля.',
    when: (s) => Object.values(s.cellAnswers || {}).filter((a) => a.customText).length >= 50 },

  // ─── Архетип ───
  { id: 'archetype_calibrated', icon: '◉', tier: 'silver', title: 'Я впізнав себе',
    desc: 'Архетип підтверджено.',
    when: (s) => s.archetypeCalibration?.status === 'confirmed' },
  { id: 'archetype_transformed', icon: '✦', tier: 'gold', title: 'Я вже інший',
    desc: 'Архетип трансформувався.',
    when: (s) => (s.archetypeTransformations || []).some((t) => t.response === 'accepted') },

  // ─── Тіло і поле ───
  { id: 'first_aura_growth', icon: '🌬', tier: 'bronze', title: 'Поле розширилось',
    desc: 'Перше позитивне Δ ауру після практики.',
    when: (s) => (s.auraReadings || []).some((r) => r.delta > 0) },
  { id: 'aura_master', icon: '◯', tier: 'gold', title: 'Майстер аури',
    desc: '20 вимірювань ауру.',
    when: (s) => (s.auraReadings || []).length >= 20 },

  // ─── Космоенергетика ───
  { id: 'cosmo_curious', icon: '🌿', tier: 'bronze', title: 'Цікавий',
    desc: 'Розкрив гілку космоенергетики.',
    when: (s) => (s.cosmoIntroSeen || []).length >= 4 },
  { id: 'cosmo_applied', icon: '🔮', tier: 'silver', title: 'Заявку подано',
    desc: 'Ти попросив — поле побачило.',
    when: (s) => !!s.cosmoApplication },
  { id: 'cosmo_initiated', icon: '⚡', tier: 'gold', title: 'Ініційований',
    desc: 'Канали відкриті — ти провідник.',
    when: (s) => s.cosmoApplication?.status === 'initiated' },
  { id: 'first_channel_cert', icon: '⭐', tier: 'silver', title: 'Перший канал',
    desc: 'Сертифікат провідника одного каналу.',
    when: (s) => Object.values(s.channelProgress || {}).filter((p) => p.completed).length >= 1 },
  { id: 'all_channels', icon: '🏵', tier: 'platinum', title: 'Тримач масштабу',
    desc: 'Сертифікат у всіх 11 каналах.',
    when: (s) => Object.values(s.channelProgress || {}).filter((p) => p.completed).length >= 11 },

  // ─── Соц і ритм ───
  { id: 'first_partnership', icon: '👯', tier: 'silver', title: 'Поряд',
    desc: 'Партнерство активовано.',
    when: (s) => !!s.partnership?.partnerCode },
  { id: 'circle_joined', icon: '🔮', tier: 'silver', title: 'Коло Сили',
    desc: 'Ти приєднався до спільноти.',
    when: (s) => !!s.joinedCircle },
  { id: 'first_practice', icon: '🌱', tier: 'bronze', title: 'Перша практика',
    desc: 'Ти зробив тілесну практику.',
    when: (s) => (s.practiceCompletions || []).length >= 1 },
  { id: 'practice_master', icon: '🌿', tier: 'gold', title: 'Майстер практик',
    desc: '50 практик виконано.',
    when: (s) => (s.practiceCompletions || []).length >= 50 },
  { id: 'streak_persistence', icon: '◆', tier: 'silver', title: 'Постійність',
    desc: '7 днів поспіль ритуалу.',
    when: (s) => streakCount(s) >= 7 },
  { id: 'streak_depth', icon: '✦', tier: 'gold', title: 'Глибина',
    desc: '30 днів поспіль.',
    when: (s) => streakCount(s) >= 30 },
  { id: 'streak_master', icon: '◉', tier: 'platinum', title: 'Майстер ритму',
    desc: '108 днів — священне число.',
    when: (s) => streakCount(s) >= 108 },
];

const TIER_COLORS = {
  bronze:   '#c89849',
  silver:   '#c0b6c8',
  gold:     '#f0c574',
  platinum: '#ffe7a8',
  special:  '#d89098',
};

export function tierColor(tier) {
  return TIER_COLORS[tier] || '#c0b6a8';
}

// Унікальні дні з dailyCheckIns (ранкові + вечірні)
function streakCount(s) {
  const dates = new Set();
  for (const c of s.dailyCheckIns || []) if (c.date) dates.add(c.date);
  if (dates.size === 0) return 0;
  let n = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) n++;
    else if (i > 0) break;
  }
  return n;
}
