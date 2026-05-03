import { MENTAL_CODE_CATEGORIES, RECOMMENDATIONS, findCategory } from '../../data/mental-code.js';

const RADAR_R = 130;
const VIEW = 320;

// Радар-діаграма + список з рекомендаціями для слабких категорій.
export default function MentalCodeResult({ scores, onRetake, onClose }) {
  const cats = MENTAL_CODE_CATEGORIES;
  const center = VIEW / 2;

  // Точки на радарі
  const points = cats.map((c, i) => {
    const angle = (i / cats.length) * 2 * Math.PI - Math.PI / 2;
    const score = scores[c.id] || 3;
    const r = (score / 5) * RADAR_R;
    return {
      ...c,
      score,
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
      labelX: center + Math.cos(angle) * (RADAR_R + 28),
      labelY: center + Math.sin(angle) * (RADAR_R + 28),
    };
  });

  const polygon = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Слабкі категорії (< 3)
  const weak = cats
    .filter((c) => (scores[c.id] || 3) < 3)
    .sort((a, b) => (scores[a.id] || 3) - (scores[b.id] || 3));

  const overall = cats.reduce((sum, c) => sum + (scores[c.id] || 3), 0) / cats.length;

  return (
    <div className="mc-overlay" role="dialog" aria-modal="true">
      <div className="mc-frame">
        <button type="button" className="mc-close" onClick={onClose}>← повернутись</button>

        <div className="mc-result-header">
          <div className="mc-eyebrow">твій ментальний код</div>
          <h2 className="mc-title">Радар Свідомості</h2>
          <div className="mc-overall">
            середнє: <strong>{overall.toFixed(1)}</strong> / 5.0
          </div>
        </div>

        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="mc-radar">
          {/* Концентричні кола */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
            <circle key={scale} cx={center} cy={center}
              r={RADAR_R * scale}
              fill="none" stroke="rgba(232, 196, 118, 0.15)"
              strokeDasharray={scale === 1 ? 'none' : '2 4'} />
          ))}

          {/* Осі */}
          {points.map((p, i) => {
            const angle = (i / cats.length) * 2 * Math.PI - Math.PI / 2;
            const ex = center + Math.cos(angle) * RADAR_R;
            const ey = center + Math.sin(angle) * RADAR_R;
            return (
              <line key={`axis-${i}`}
                x1={center} y1={center} x2={ex} y2={ey}
                stroke="rgba(232, 196, 118, 0.18)" strokeWidth="1" />
            );
          })}

          {/* Полігон-результат */}
          <polygon points={polygon}
            fill="rgba(232, 196, 118, 0.18)"
            stroke="#f0c574" strokeWidth="1.5" />

          {/* Точки */}
          {points.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r="5"
                fill={p.color}
                style={{ filter: `drop-shadow(0 0 8px ${p.color})` }} />
            </g>
          ))}

          {/* Лейбли */}
          {points.map((p) => (
            <g key={`label-${p.id}`}>
              <text x={p.labelX} y={p.labelY} textAnchor="middle"
                fontSize="14" fill={p.color}
                style={{ filter: `drop-shadow(0 0 4px ${p.color})` }}>
                {p.icon}
              </text>
              <text x={p.labelX} y={p.labelY + 14} textAnchor="middle"
                fontSize="9" fill="#c8b9a0">
                {p.score.toFixed(1)}
              </text>
            </g>
          ))}
        </svg>

        <div className="mc-categories-list">
          {points.map((p) => (
            <div key={p.id} className="mc-cat-row" style={{ borderColor: `${p.color}33` }}>
              <span className="mc-cat-row-icon" style={{ color: p.color }}>{p.icon}</span>
              <span className="mc-cat-row-name">{p.name}</span>
              <span className="mc-cat-row-score" style={{ color: p.color }}>
                {p.score.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        {weak.length > 0 && (
          <div className="mc-weak">
            <h3>Точки росту</h3>
            {weak.map((c) => (
              <div key={c.id} className="mc-weak-item" style={{ borderColor: `${c.color}55` }}>
                <div className="mc-weak-name" style={{ color: c.color }}>
                  {c.icon} {c.name}
                </div>
                <div className="mc-weak-rec">{RECOMMENDATIONS[c.id]}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mc-actions">
          <button type="button" className="mc-btn" onClick={onRetake}>
            ↻ пройти знов
          </button>
          <button type="button" className="mc-btn mc-btn-primary" onClick={onClose}>
            ✓ закрити
          </button>
        </div>
      </div>
    </div>
  );
}
