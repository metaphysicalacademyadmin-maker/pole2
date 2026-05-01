// 3 шари аури: ефірне (близько до тіла), астральне (середнє), ментальне (зовнішнє).
// Інтенсивність залежить від стану цих тіл (calcIntegrity).
// Розмір кільця реактивно масштабується від останніх auraReadings (см → коефіцієнт).
import { useMemo } from 'react';
import { useGameStore } from '../../../store/gameStore.js';
import { calcIntegrity } from '../../../utils/integrity-calc.js';

const BASELINE_CM = 70;
const RECENT_WINDOW_MS = 60 * 1000;   // підсвітка останнього виміру 60 сек

export default function Aura({ centerX, centerY }) {
  const state = useGameStore();
  const integrity = useMemo(() => calcIntegrity(state), [state]);
  const auraInfo = useMemo(() => computeAura(state.auraReadings), [state.auraReadings]);

  const layers = [
    { id: 'etheric',  rx: 70,  ry: 175, color: '#9fc8e8', stroke: 0.9 },
    { id: 'astral',   rx: 84,  ry: 195, color: '#f0a8b8', stroke: 0.6 },
    { id: 'mental',   rx: 100, ry: 220, color: '#c9b3e8', stroke: 0.45 },
  ];

  return (
    <g>
      {layers.map((l) => {
        const pct = (integrity[l.id] || 0) / 100;
        const rx = l.rx * auraInfo.scale;
        const ry = l.ry * auraInfo.scale;
        const animDur = auraInfo.recent ? '2.5s' : '6s';
        const animAmpX = auraInfo.recent ? 8 : 4;
        const animAmpY = auraInfo.recent ? 14 : 8;
        return (
          <ellipse key={l.id}
            cx={centerX} cy={centerY}
            rx={rx} ry={ry}
            fill="none"
            stroke={l.color}
            strokeWidth={l.stroke}
            opacity={0.15 + pct * 0.45 + (auraInfo.recent ? 0.12 : 0)}
            strokeDasharray={pct < 0.3 ? '2 6' : pct < 0.7 ? '6 4' : 'none'}
          >
            <animate attributeName="rx"
              values={`${rx};${rx + animAmpX};${rx}`}
              dur={animDur} repeatCount="indefinite" />
            <animate attributeName="ry"
              values={`${ry};${ry + animAmpY};${ry}`}
              dur={animDur} repeatCount="indefinite" />
          </ellipse>
        );
      })}
      {auraInfo.lastCm > 0 && (
        <text x={centerX} y={centerY + 240}
          textAnchor="middle"
          fontSize="11"
          fill={auraInfo.recent ? '#e8c476' : '#9fc8e8'}
          opacity={0.85}>
          {auraInfo.lastCm} см
          {auraInfo.recent && auraInfo.lastDelta !== 0 && (
            <tspan dx="6" fill={auraInfo.lastDelta > 0 ? '#a8d896' : '#e8a0a0'}>
              ({auraInfo.lastDelta > 0 ? '+' : ''}{auraInfo.lastDelta})
            </tspan>
          )}
        </text>
      )}
    </g>
  );
}

// З масиву auraReadings обчислює: середнє "after" з останніх 5,
// масштаб (відносно baseline 70см), чи є щойно зроблений вимір.
function computeAura(readings) {
  if (!readings || readings.length === 0) {
    return { scale: 1, recent: false, lastCm: 0, lastDelta: 0 };
  }
  const recent5 = readings.slice(-5);
  const avg = recent5.reduce((a, r) => a + (r.after || 0), 0) / recent5.length;
  const last = readings[readings.length - 1];
  const recent = last.ts && (Date.now() - last.ts) < RECENT_WINDOW_MS;
  const scale = clamp(0.75 + (avg - BASELINE_CM) / 200, 0.75, 1.45);
  return {
    scale,
    recent,
    lastCm: last.after || 0,
    lastDelta: last.delta || 0,
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
