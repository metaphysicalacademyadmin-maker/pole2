import { useGameStore } from '../../store/gameStore.js';
import { SUBTLE_BODIES } from '../../data/subtle-bodies.js';

// Графік історії вимірювань. Спрощений SVG line chart.
const W = 720, H = 280, PAD_L = 40, PAD_B = 28, PAD_T = 16, PAD_R = 16;

export default function TrendView() {
  const measurements = useGameStore((s) => s.bodyMeasurements);

  if (measurements.length < 2) {
    return (
      <div className="sf-trend">
        <div className="sf-trend-empty">
          Тренд з'явиться коли матимеш ≥2 вимірювання. Виміряй свої тіла у вкладці «Список».
        </div>
      </div>
    );
  }

  // Беремо останні 30 днів
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = measurements.filter((m) => m.ts >= cutoff);
  const tsMin = Math.min(...recent.map((m) => m.ts));
  const tsMax = Math.max(...recent.map((m) => m.ts));
  const tsRange = tsMax - tsMin || 1;

  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  return (
    <div className="sf-trend">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {/* Y axis grid */}
        {[0, 25, 50, 75, 100].map((y) => (
          <g key={y}>
            <line
              x1={PAD_L} y1={PAD_T + chartH * (1 - y / 100)}
              x2={W - PAD_R} y2={PAD_T + chartH * (1 - y / 100)}
              stroke="rgba(232,196,118,0.12)" strokeWidth="0.5" strokeDasharray="2 4"
            />
            <text x={PAD_L - 6} y={PAD_T + chartH * (1 - y / 100) + 4}
              fontSize="10" fill="rgba(220,200,160,0.5)" textAnchor="end" fontFamily="-apple-system">
              {y}
            </text>
          </g>
        ))}

        {/* Line for each body */}
        {SUBTLE_BODIES.map((body) => {
          const points = recent
            .filter((m) => m.bodyId === body.id)
            .sort((a, b) => a.ts - b.ts);
          if (points.length < 2) return null;
          const pathD = points.map((p, i) => {
            const x = PAD_L + ((p.ts - tsMin) / tsRange) * chartW;
            const y = PAD_T + chartH * (1 - p.score / 100);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ');
          return (
            <g key={body.id}>
              <path d={pathD} fill="none" stroke={body.color} strokeWidth="2" opacity="0.85" />
              {points.map((p, i) => {
                const x = PAD_L + ((p.ts - tsMin) / tsRange) * chartW;
                const y = PAD_T + chartH * (1 - p.score / 100);
                return <circle key={i} cx={x} cy={y} r={2.5} fill={body.color} />;
              })}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: '12px', flexWrap: 'wrap',
        marginTop: '12px', justifyContent: 'center',
      }}>
        {SUBTLE_BODIES.map((b) => {
          const has = measurements.some((m) => m.bodyId === b.id);
          if (!has) return null;
          return (
            <div key={b.id} style={{
              display: 'flex', gap: '6px', alignItems: 'center',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '11px', color: '#fff7e0',
            }}>
              <div style={{ width: 14, height: 2, background: b.color }} />
              {b.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
