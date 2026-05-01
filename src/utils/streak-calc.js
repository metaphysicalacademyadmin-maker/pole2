// Streak — лічильник днів поспіль з виконаним ритуалом (ранок або вечір).
// Тіри: 7 = «Постійність», 30 = «Глибина», 108 = «Майстер ритму».

const MS_DAY = 24 * 60 * 60 * 1000;

export function computeStreak(checkIns) {
  if (!checkIns || checkIns.length === 0) return 0;
  const dates = new Set();
  for (const c of checkIns) {
    if (c.date) dates.add(c.date);
  }
  let streak = 0;
  const today = new Date();
  // Дозволяємо сьогоднішній день бути порожнім (гравець ще не зробив)
  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getTime() - i * MS_DAY);
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export function streakBadge(n) {
  if (n >= 108) return { label: 'Майстер ритму', symbol: '◉', tier: 3, color: '#ffe7a8' };
  if (n >= 30)  return { label: 'Глибина',       symbol: '✦', tier: 2, color: '#f0c574' };
  if (n >= 7)   return { label: 'Постійність',   symbol: '◆', tier: 1, color: '#c9b3e8' };
  return null;
}
