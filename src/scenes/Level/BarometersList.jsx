import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { BAROMETERS } from '../../data/barometers.js';

// 8 полярних барометрів (-10..+10).
// • +7..+10 — інтегрований (золото, насичений колір)
// • +3..+6 — здоровий (нормальний колір)
// • 0..+2 — нейтральний (сірий)
// • -2..-3 — застій (приглушений)
// • -4..-7 — тінь активна (червоний акцент)
// • -8..-10 — критичний (червоний насичений)

export default function BarometersList() {
  const resources = useGameStore((s) => s.resources);
  const prev = useRef(resources);
  const [pulseKey, setPulseKey] = useState(null);

  useEffect(() => {
    for (const b of BAROMETERS) {
      if (resources[b.key] !== prev.current[b.key]) {
        setPulseKey(b.key);
        const t = setTimeout(() => setPulseKey(null), 1200);
        prev.current = resources;
        return () => clearTimeout(t);
      }
    }
    prev.current = resources;
  }, [resources]);

  return (
    <div className="state-section">
      <div className="state-label">барометри</div>
      {BAROMETERS.map((b) => {
        const v = resources[b.key] || 0;
        const tone = barometerTone(v);
        return (
          <div
            key={b.key}
            className={`barometer-row tone-${tone}${pulseKey === b.key ? ' pulse' : ''}`}
          >
            <span style={{ color: tone === 'shadow' || tone === 'critical' ? '#d89098' : b.color }}>
              {tone === 'critical' ? '◆' : tone === 'shadow' ? '◇' : '●'}
            </span>
            <span className="barometer-name">{b.name}</span>
            <BarometerBar value={v} color={b.color} />
            <span className="barometer-value" style={{ color: barometerColor(v, b.color) }}>
              {v > 0 ? `+${v}` : v}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Шкала від -10 до +10 з нулем посередині.
function BarometerBar({ value, color }) {
  const positive = value > 0;
  const width = Math.abs(value) * 5;   // 5% за одиницю → max 50% вліво або вправо
  return (
    <span className="barometer-bar">
      <span className="barometer-bar-axis" />
      <span
        className="barometer-bar-fill"
        style={{
          width: `${width}%`,
          left: positive ? '50%' : `${50 - width}%`,
          background: positive ? color : '#d89098',
          opacity: value === 0 ? 0 : 0.75,
        }}
      />
    </span>
  );
}

function barometerTone(v) {
  if (v >= 7) return 'integrated';
  if (v >= 3) return 'healthy';
  if (v >= 0) return 'neutral';
  if (v >= -3) return 'stagnant';
  if (v >= -7) return 'shadow';
  return 'critical';
}

function barometerColor(v, baseColor) {
  if (v <= -8) return '#d89098';
  if (v <= -3) return '#c0a0a0';
  if (v <= 0) return '#968a7c';
  return baseColor;
}
