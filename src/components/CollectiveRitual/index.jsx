import { moonPhase } from '../../utils/season.js';
import { collectiveCount } from '../../utils/pseudo-player.js';
import { COLLECTIVE_RITUAL_MESSAGES } from '../../data/social.js';
import './styles.css';

// Banner колективного ритуалу — з'являється тільки у фази молодика і повного місяця.
// Псевдо-лічильник стабільний для дня + фази.

export default function CollectiveRitual() {
  const phase = moonPhase();
  if (phase.id !== 'new' && phase.id !== 'full') return null;

  const today = new Date().toISOString().slice(0, 10);
  const count = collectiveCount(today, phase.id);
  const messages = COLLECTIVE_RITUAL_MESSAGES[phase.id] || [];
  const message = messages[count % messages.length];

  return (
    <div className={`coll-banner phase-${phase.id}`}>
      <div className="coll-symbol">{phase.symbol}</div>
      <div className="coll-content">
        <div className="coll-title">
          {phase.id === 'full' ? '🌕 Повня — колективний ритуал' : '🌑 Молодик — колективна інтенція'}
        </div>
        <div className="coll-message">{message}</div>
        <div className="coll-counter">
          <strong>{count.toLocaleString('uk-UA')}</strong> людей зараз у спільному полі
        </div>
      </div>
    </div>
  );
}
