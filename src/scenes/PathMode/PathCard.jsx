import { useState } from 'react';
import { tierStatus } from '../../utils/entitlements.js';

// Один варіант шляху — Дотик / Шлях / Глибина.
// Картка показує: символ, ім'я, тег, цитату, статистику + tier-бейдж + hover-деталі.
// На мобільному — info-іконка для явного відкриття overlay з деталями
// (бо :hover на тач-екранах не існує).
export default function PathCard({ mode, onSelect }) {
  const status = tierStatus(mode);
  const [showDetails, setShowDetails] = useState(false);

  const className = [
    'pm-card',
    mode.recommended && 'recommended',
    `tier-${status.kind}`,
    showDetails && 'pm-card--show-details',
  ].filter(Boolean).join(' ');

  function handleCardClick() {
    // Якщо overlay відкритий — закриваємо його замість вибору режиму.
    // Це дає користувачу шанс прочитати, не клікнувши випадково "обрати".
    if (showDetails) {
      setShowDetails(false);
      return;
    }
    onSelect(mode.id);
  }

  function toggleDetails(e) {
    e.stopPropagation();
    setShowDetails((v) => !v);
  }

  return (
    <button type="button" className={className} onClick={handleCardClick}>
      {mode.recommended && <span className="pm-badge">рекомендовано</span>}
      <span className={`pm-tier pm-tier--${status.kind}`}>
        {status.kind === 'locked' && <span className="pm-tier-icon">🔒</span>}
        {status.kind === 'free' && <span className="pm-tier-icon">✦</span>}
        {status.label}
      </span>
      {mode.details && (
        <span
          className="pm-info"
          role="button"
          tabIndex={0}
          aria-label={showDetails ? 'сховати деталі' : 'показати деталі режиму'}
          aria-expanded={showDetails}
          onClick={toggleDetails}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleDetails(e);
            }
          }}
        >
          {showDetails ? '✕' : 'ⓘ'}
        </span>
      )}
      <span className="pm-symbol">{mode.symbol}</span>
      <span className="pm-name">{mode.name}</span>
      <span className="pm-tag">{mode.tag}</span>
      <span className="pm-quote">{mode.quote}</span>
      <span className="pm-stats">
        <span><span className="pm-num">~{mode.questionsApprox}</span> питань</span>
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
