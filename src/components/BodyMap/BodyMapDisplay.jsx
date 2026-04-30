// Показ карти тіла з усіма зібраними точками. Не клікабельний — readonly.
import { useGameStore } from '../../store/gameStore.js';

const VIEW = { w: 200, h: 380 };

export default function BodyMapDisplay({ size = 200 }) {
  const bodyMap = useGameStore((s) => s.bodyMap);
  const allPoints = Object.values(bodyMap).flat();

  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} style={{ width: size, height: 'auto' }}>
      <ellipse cx={100} cy={50} rx={26} ry={32} fill="none" stroke="rgba(232,196,118,0.35)" strokeWidth="1" />
      <path
        d="M 100 82 L 100 320 M 60 110 L 100 110 L 140 110 M 60 110 Q 50 170 55 220 M 140 110 Q 150 170 145 220 M 75 320 L 70 370 M 125 320 L 130 370"
        fill="none" stroke="rgba(232,196,118,0.35)" strokeWidth="1.5" strokeLinecap="round"
      />
      {allPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4}
          fill={p.depth === 'deep' ? '#a8c898' : p.depth === 'shadow' ? '#d89098' : '#f0c574'}
          opacity="0.75"
        />
      ))}
    </svg>
  );
}
