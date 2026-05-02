// LITE — 15 ключових досягнень замість 27.

export const ACHIEVEMENTS = [
  { id: 'first_key',          icon: '🗝',  tier: 'bronze',   title: 'Перший ключ',
    desc: 'Ти отримав свою першу формулу-ключ.',
    when: (s) => (s.completedLevels || []).length >= 1 },
  { id: 'three_keys',         icon: '🔑',  tier: 'silver',   title: 'Троїстість',
    desc: '3 ключі — твоя нижня тріада тримає.',
    when: (s) => (s.completedLevels || []).length >= 3 },
  { id: 'all_seven',          icon: '✦',   tier: 'gold',     title: 'Сім ключів',
    desc: 'Усі 7 рівнів свідомості пройдено.',
    when: (s) => (s.completedLevels || []).length >= 7 },
  { id: 'first_snake',        icon: '🐍',  tier: 'silver',   title: 'Перша зустріч з тінню',
    desc: 'Ти зайшов у Snake-клітинку.',
    when: (s) => (s.snakePenalties || []).length >= 1 },
  { id: 'shadow_seen',        icon: '🪞',  tier: 'silver',   title: 'Я побачив',
    desc: 'Дзеркало Тіні — ти визнав хоч одну тінь у собі.',
    when: (s) => (s.shadowMirrorHistory || []).filter((m) => m.response === 'seen').length >= 1 },
  { id: 'crisis_passed',      icon: '⚡',  tier: 'gold',     title: 'Точка Перевороту',
    desc: 'Ти пройшов через Кризу Системи.',
    when: (s) => !!s.crisisAcknowledgedTs },
  { id: 'helpline_used',      icon: '☎',   tier: 'special',  title: 'Підтримку запрошено',
    desc: 'Ти прийняв допомогу — це сила.',
    when: (s) => (s.shadowMirrorHistory || []).some((m) => m.helpline) },
  { id: 'first_custom',       icon: '✎',   tier: 'bronze',   title: 'Своє слово',
    desc: 'Перша custom-відповідь — найцінніше.',
    when: (s) => Object.values(s.cellAnswers || {}).filter((a) => a.customText).length >= 1 },
  { id: 'archetype_calibrated', icon: '◉', tier: 'silver',   title: 'Я впізнав себе',
    desc: 'Архетип підтверджено.',
    when: (s) => s.archetypeCalibration?.status === 'confirmed' },
  { id: 'archetype_transformed', icon: '✦', tier: 'gold',    title: 'Я вже інший',
    desc: 'Архетип трансформувався.',
    when: (s) => (s.archetypeTransformations || []).some((t) => t.response === 'accepted') },
  { id: 'first_aura_growth',  icon: '🌬', tier: 'bronze',   title: 'Поле розширилось',
    desc: 'Перше позитивне Δ ауру після практики.',
    when: (s) => (s.auraReadings || []).some((r) => r.delta > 0) },
  { id: 'first_practice',     icon: '🌱', tier: 'bronze',   title: 'Перша практика',
    desc: 'Ти зробив тілесну практику.',
    when: (s) => (s.practiceCompletions || []).length >= 1 },
  { id: 'streak_persistence', icon: '◆',  tier: 'silver',   title: 'Постійність',
    desc: '7 днів поспіль ритуалу.',
    when: (s) => streakCount(s) >= 7 },
  { id: 'streak_depth',       icon: '✦',  tier: 'gold',     title: 'Глибина',
    desc: '30 днів поспіль.',
    when: (s) => streakCount(s) >= 30 },
  { id: 'first_partnership',  icon: '👯', tier: 'silver',   title: 'Поряд',
    desc: 'Партнерство активовано.',
    when: (s) => !!s.partnership?.partnerCode },
];

const TIER_COLORS = {
  bronze: '#c89849', silver: '#c0b6c8', gold: '#f0c574',
  platinum: '#ffe7a8', special: '#d89098',
};

export function tierColor(tier) {
  return TIER_COLORS[tier] || '#c0b6a8';
}

function streakCount(s) {
  const dates = new Set();
  for (const c of s.dailyCheckIns || []) if (c.date) dates.add(c.date);
  if (dates.size === 0) return 0;
  let n = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    if (dates.has(d.toISOString().slice(0, 10))) n++;
    else if (i > 0) break;
  }
  return n;
}
