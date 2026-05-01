import { useGameStore } from '../../store/gameStore.js';
import { cardForDate } from '../../data/daily-cards.js';
import { currentSeason, moonPhase } from '../../utils/season.js';
import { computeStreak, streakBadge } from '../../utils/streak-calc.js';

const SEASON_NAMES = {
  spring: 'Весна', summer: 'Літо', autumn: 'Осінь', winter: 'Зима',
};

// Картка дня + сезон + фаза місяця + streak (якщо є)
export default function DailyPulse({ onClick }) {
  const card = cardForDate();
  const season = currentSeason();
  const phase = moonPhase();
  const checkIns = useGameStore((s) => s.dailyCheckIns);
  const streak = computeStreak(checkIns);
  const badge = streakBadge(streak);

  return (
    <div className={`panel${onClick ? ' panel-clickable' : ''}`} onClick={onClick}>
      <div className="panel-label">картка дня</div>
      <div className="panel-content">
        <div>
          <span className="dp-card-symbol">{card.symbol}</span>
          <span className="dp-card-name">{card.name}</span>
        </div>
        <div className="dp-card-hint">{card.hint}</div>
      </div>
      <div className="dp-meta">
        <span>{SEASON_NAMES[season]}</span>
        <span>{phase.symbol} {phase.name}</span>
      </div>
      {streak > 0 && (
        <div className={`dp-streak${badge ? ` dp-streak-tier-${badge.tier}` : ''}`}
          style={badge ? { color: badge.color } : undefined}>
          {badge ? `${badge.symbol} ${badge.label} · ` : '◌ streak · '}
          <strong>{streak}</strong> {streak === 1 ? 'день' : streak < 5 ? 'дні' : 'днів'}
        </div>
      )}
    </div>
  );
}
