// 3 шари аури: ефірне (близько до тіла), астральне (середнє), ментальне (зовнішнє).
// Інтенсивність залежить від стану цих тіл (calcIntegrity).
import { useMemo } from 'react';
import { useGameStore } from '../../../store/gameStore.js';
import { calcIntegrity } from '../../../utils/integrity-calc.js';

export default function Aura({ centerX, centerY }) {
  const state = useGameStore();
  const integrity = useMemo(() => calcIntegrity(state), [state]);

  const layers = [
    { id: 'etheric',  rx: 70,  ry: 175, color: '#9fc8e8', stroke: 0.9 },
    { id: 'astral',   rx: 84,  ry: 195, color: '#f0a8b8', stroke: 0.6 },
    { id: 'mental',   rx: 100, ry: 220, color: '#c9b3e8', stroke: 0.45 },
  ];

  return (
    <g>
      {layers.map((l) => {
        const pct = (integrity[l.id] || 0) / 100;
        return (
          <ellipse key={l.id}
            cx={centerX} cy={centerY}
            rx={l.rx} ry={l.ry}
            fill="none"
            stroke={l.color}
            strokeWidth={l.stroke}
            opacity={0.15 + pct * 0.45}
            strokeDasharray={pct < 0.3 ? '2 6' : pct < 0.7 ? '6 4' : 'none'}
          >
            <animate
              attributeName="rx"
              values={`${l.rx};${l.rx + 4};${l.rx}`}
              dur="6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="ry"
              values={`${l.ry};${l.ry + 8};${l.ry}`}
              dur="6s"
              repeatCount="indefinite"
            />
          </ellipse>
        );
      })}
    </g>
  );
}
