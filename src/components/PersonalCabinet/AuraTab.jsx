import { useGameStore } from '../../store/gameStore.js';
import { BAROMETERS } from '../../data/barometers.js';

// Аура та зростання — sparkline останніх вимірів + барометри.

export default function AuraTab() {
  const readings = useGameStore((s) => s.auraReadings) || [];
  const resources = useGameStore((s) => s.resources) || {};

  const last30 = readings.slice(-30);
  const auraStats = computeAuraStats(last30);
  const trend = auraStats.firstAvg && auraStats.lastAvg
    ? auraStats.lastAvg - auraStats.firstAvg : 0;

  return (
    <div className="cab-aura">
      <div className="cab-block-label">аура — останні {last30.length} вимірювань</div>

      {last30.length === 0 ? (
        <div className="cab-empty">
          ще немає вимірювань · зайди в клітинку → 🔑 поглибити → виміряй ауру
        </div>
      ) : (
        <>
          <div className="cab-aura-sparkline">
            <Sparkline data={last30.map((r) => r.after || 0)} />
          </div>
          <div className="cab-aura-stats">
            <div className="cab-aura-stat">
              <div className="cab-aura-stat-num">{auraStats.lastValue}<span>см</span></div>
              <div className="cab-aura-stat-label">останнє</div>
            </div>
            <div className="cab-aura-stat">
              <div className="cab-aura-stat-num">{auraStats.avg}<span>см</span></div>
              <div className="cab-aura-stat-label">середнє</div>
            </div>
            <div className="cab-aura-stat">
              <div className="cab-aura-stat-num">{auraStats.maxDelta > 0 ? '+' : ''}{auraStats.maxDelta}<span>см</span></div>
              <div className="cab-aura-stat-label">найбільший приріст</div>
            </div>
            <div className="cab-aura-stat">
              <div className={`cab-aura-stat-num trend-${trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'}`}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {trend > 0 ? '+' : ''}{trend}
              </div>
              <div className="cab-aura-stat-label">тренд</div>
            </div>
          </div>
        </>
      )}

      <div className="cab-block-label">барометри (-10 ÷ +10)</div>
      <div className="cab-bars">
        {BAROMETERS.map((b) => {
          const v = resources[b.key] || 0;
          const pct = ((v + 10) / 20) * 100;
          return (
            <div key={b.key} className="cab-bar-row">
              <div className="cab-bar-name" style={{ color: b.color }}>{b.name}</div>
              <div className="cab-bar-track">
                <div className="cab-bar-axis" />
                <div className="cab-bar-fill"
                  style={{
                    left: v >= 0 ? '50%' : `${pct}%`,
                    width: `${Math.abs(v) * 5}%`,
                    background: v >= 0 ? b.color : '#d89098',
                  }} />
              </div>
              <div className="cab-bar-val" style={{ color: v < -3 ? '#d89098' : v >= 5 ? b.color : '#c0b6a8' }}>
                {v > 0 ? `+${v}` : v}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sparkline({ data, width = 600, height = 80 }) {
  if (data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - ((v - min) / range) * (height - 10) - 5;
    return `${x},${y}`;
  }).join(' ');
  const lastX = width;
  const lastY = height - ((data[data.length - 1] - min) / range) * (height - 10) - 5;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="cab-sparkline-svg">
      <polyline points={points} fill="none" stroke="#f0c574" strokeWidth="2" />
      <circle cx={lastX} cy={lastY} r="4" fill="#f0c574">
        <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function computeAuraStats(readings) {
  if (readings.length === 0) return { lastValue: 0, avg: 0, maxDelta: 0, firstAvg: 0, lastAvg: 0 };
  const values = readings.map((r) => r.after || 0);
  const lastValue = values[values.length - 1];
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const maxDelta = Math.max(0, ...readings.map((r) => r.delta || 0));
  const firstHalf = values.slice(0, Math.ceil(values.length / 2));
  const lastHalf = values.slice(-Math.ceil(values.length / 2));
  const firstAvg = Math.round(firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length);
  const lastAvg = Math.round(lastHalf.reduce((a, b) => a + b, 0) / lastHalf.length);
  return { lastValue, avg, maxDelta, firstAvg, lastAvg };
}
