import { tierStatus } from '../../utils/entitlements.js';

// Один варіант шляху — Дотик / Шлях / Глибина.
// Картка показує: символ, ім'я, тег, цитату, статистику + tier-бейдж + hover-деталі.
export default function PathCard({ mode, onSelect }) {
  const status = tierStatus(mode);
  const className = [
    'pm-card',
    mode.recommended && 'recommended',
    `tier-${status.kind}`,
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={className} onClick={() => onSelect(mode.id)}>
      {mode.recommended && <span className="pm-badge">рекомендовано</span>}
      <span className={`pm-tier pm-tier--${status.kind}`}>
        {status.kind === 'locked' && <span className="pm-tier-icon">🔒</span>}
        {status.kind === 'free' && <span className="pm-tier-icon">✦</span>}
        {status.label}
      </span>
      <span className="pm-symbol">{mode.symbol}</span>
      <span className="pm-name">{mode.name}</span>
      <span className="pm-tag">{mode.tag}</span>
      <span className="pm-quote">{mode.quote}</span>
      <span className="pm-stats">
        <span><span className="pm-num">~{mode.questionsApprox}</span> питань</span>
        <span><span className="pm-num">{mode.durationApprox}</span></span>
      </span>
      {mode.details && (
        <span className="pm-details">
          {mode.details.map((d, i) => (
            <span key={i} className="pm-details-item">· {d}</span>
          ))}
        </span>
      )}
    </button>
  );
}
