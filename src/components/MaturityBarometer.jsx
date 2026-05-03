import { useGameStore } from '../store/gameStore.js';
import { computeMaturity, maturityStage } from '../utils/maturity-score.js';

// 9-й «барометр» — Зрілість. Не натискається відповідями (як інші 8),
// а похідний з прогресу гри. Показує стадію + полоску 0-10.
export default function MaturityBarometer({ size = 'normal' }) {
  const state = useGameStore();
  const score = computeMaturity(state);
  const stage = maturityStage(score);
  const pct = Math.round(score * 10);

  return (
    <div className={`mb-card mb-${size}`} style={{ borderColor: `${stage.color}55` }}>
      <div className="mb-header">
        <span className="mb-icon" style={{ color: stage.color }}>{stage.icon}</span>
        <span className="mb-label">зрілість</span>
        <span className="mb-stage" style={{ color: stage.color }}>{stage.label}</span>
      </div>
      <div className="mb-bar-track">
        <div className="mb-bar-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${stage.color}66, ${stage.color})`,
            boxShadow: `0 0 8px ${stage.color}88`,
          }} />
      </div>
      <div className="mb-meta">
        <span>{score.toFixed(1)} / 10</span>
      </div>
    </div>
  );
}
