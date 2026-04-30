import { cardForDate } from '../../data/daily-cards.js';
import { currentSeason, moonPhase } from '../../utils/season.js';

const SEASON_NAMES = {
  spring: 'Весна', summer: 'Літо', autumn: 'Осінь', winter: 'Зима',
};

// Картка дня + сезон + фаза місяця
export default function DailyPulse({ onClick }) {
  const card = cardForDate();
  const season = currentSeason();
  const phase = moonPhase();

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
    </div>
  );
}
