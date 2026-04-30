import { SUBTLE_BODIES } from '../../data/subtle-bodies.js';
import { trendForBody } from '../../utils/integrity-calc.js';
import { useGameStore } from '../../store/gameStore.js';

// Список тіл — детальний вигляд: бар прогресу, тренд, кнопка «виміряти».
export default function ListView({ integrity, onMeasure }) {
  const measurements = useGameStore((s) => s.bodyMeasurements);

  return (
    <div className="sf-body-list">
      {SUBTLE_BODIES.map((body) => {
        const score = integrity[body.id] || 0;
        const trend = trendForBody(body.id, measurements);
        const trendClass = trend > 2 ? 'up' : trend < -2 ? 'down' : 'flat';
        const trendSymbol = trend > 2 ? '↑' : trend < -2 ? '↓' : '→';
        const status = score < 40 ? 'weak' : score >= 70 ? 'strong' : '';

        return (
          <div key={body.id} className={`sf-body-row ${status}`}>
            <div className="sf-body-symbol" style={{ color: body.color }}>
              ◯
            </div>
            <div className="sf-body-info">
              <div className="sf-body-name">{body.name}</div>
              <div className="sf-body-sub">{body.sub}</div>
              <div className="sf-body-bar">
                <div className="sf-body-bar-fill"
                  style={{ width: `${score}%`, background: body.color }} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="sf-body-score" style={{ color: body.color }}>
                {score}
              </div>
              {trend !== 0 && (
                <div className={`sf-body-trend ${trendClass}`}>
                  {trendSymbol} {Math.abs(trend)}
                </div>
              )}
            </div>
            <button className="sf-measure-btn" onClick={() => onMeasure(body.id)}>
              виміряти
            </button>
          </div>
        );
      })}
    </div>
  );
}
