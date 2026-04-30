import { SUBTLE_BODIES } from '../../data/subtle-bodies.js';

const VIEW = 600;
const CENTER = VIEW / 2;
const MIN_R = 30;
const MAX_R = 270;

// Концентрична мандала: 7 кілець, кожне = тіло. Товщина = integrity score.
// Клік на кільце → починає діагностику для цього тіла.
export default function MandalaView({ integrity, onMeasure }) {
  const sortedBodies = SUBTLE_BODIES.slice();
  // sourceLevel визначає радіус — від центру (фізичне) до зовні (атмічне)
  return (
    <svg viewBox={`0 0 ${VIEW} ${VIEW}`}
      style={{ width: '100%', maxWidth: 480, height: 'auto', cursor: 'default' }}>

      {/* Центр — символ Я */}
      <circle cx={CENTER} cy={CENTER} r={MIN_R - 6}
        fill="rgba(20, 14, 30, 0.9)"
        stroke="#f0c574" strokeWidth="2" />
      <text x={CENTER} y={CENTER + 8} textAnchor="middle"
        fontFamily="-apple-system" fontSize="32" fill="#f0c574"
        fontWeight="700" style={{ userSelect: 'none' }}>∞</text>

      {/* 7 кілець */}
      {sortedBodies.map((body, i) => {
        const baseR = MIN_R + (i + 1) * ((MAX_R - MIN_R) / 7);
        const score = integrity[body.id] || 0;
        const thickness = 4 + (score / 100) * 16;       // 4-20px
        const opacity = 0.3 + (score / 100) * 0.7;
        return (
          <g key={body.id} className="sf-ring-g" onClick={() => onMeasure(body.id)} style={{ cursor: 'pointer' }}>
            <circle cx={CENTER} cy={CENTER} r={baseR}
              fill="none"
              stroke={body.color}
              strokeWidth={thickness}
              opacity={opacity}
              className="sf-ring"
            />
            {/* Невидиме коло для кліку */}
            <circle cx={CENTER} cy={CENTER} r={baseR}
              fill="none" stroke="transparent" strokeWidth={Math.max(20, thickness)} />
            {/* Лейбл */}
            <text
              x={CENTER + baseR + 6}
              y={CENTER + 4}
              fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
              fontSize="11"
              fontWeight="700"
              fill={body.color}
              style={{ letterSpacing: '2px', userSelect: 'none', pointerEvents: 'none', textTransform: 'uppercase' }}
            >
              {body.name} {score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
