import { PYRAMID_LEVELS } from '../../data/levels.js';
import SacredGeometry from './SacredGeometry.jsx';

const CENTER = 300;
const PETAL_OUTER_R = 240;
const PETAL_INNER_R = 80;
const RAY_COUNT = 7;     // по одній пелюстці на кожен з 7 рівнів

// Підсумкова мандала на Final-екрані. 7 пелюсток (кожна = рівень).
// Завершені — кольорові, незавершені — приглушені.
// Кожна пелюстка показує номер у центрі.
export default function Mandala({ completedLevels, levelKeys }) {
  const levels = PYRAMID_LEVELS.filter((l) => l.n >= 1);   // 1..7
  return (
    <svg viewBox="0 0 600 600" style={{ width: '100%', maxWidth: 480, height: 'auto' }}>
      <defs>
        {levels.map((lvl) => (
          <radialGradient key={`g-${lvl.n}`} id={`grad-${lvl.n}`}>
            <stop offset="0%" stopColor={chakraColor(lvl)} stopOpacity="0.85" />
            <stop offset="100%" stopColor={chakraColor(lvl)} stopOpacity="0.15" />
          </radialGradient>
        ))}
      </defs>

      {/* зовнішнє коло */}
      <circle cx={CENTER} cy={CENTER} r={PETAL_OUTER_R + 12} fill="none"
        stroke="rgba(232,196,118,0.18)" strokeWidth="0.5" />

      {/* пелюстки */}
      {levels.map((lvl, i) => (
        <Petal
          key={lvl.n}
          index={i}
          level={lvl}
          completed={completedLevels.includes(lvl.n)}
          keyText={levelKeys[lvl.n]}
        />
      ))}

      {/* Sacred Geometry — Меркаба → Куб Метатрона → Квітка Життя */}
      <SacredGeometry keysCount={completedLevels.length} cx={CENTER} cy={CENTER} />

      {/* центральне коло */}
      <circle cx={CENTER} cy={CENTER} r={PETAL_INNER_R - 8} fill="rgba(20, 14, 30, 0.7)"
        stroke="var(--gold)" strokeWidth="1" />
      <text x={CENTER} y={CENTER + 4} textAnchor="middle"
        fontFamily="Cormorant Garamond, serif" fontStyle="italic"
        fontSize="42" fill="var(--gold-light)">∞</text>
    </svg>
  );
}

function Petal({ index, level, completed, keyText }) {
  const angle = (index / RAY_COUNT) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const cx = CENTER + Math.cos(rad) * ((PETAL_OUTER_R + PETAL_INNER_R) / 2);
  const cy = CENTER + Math.sin(rad) * ((PETAL_OUTER_R + PETAL_INNER_R) / 2);
  const halfWidth = 38;

  // Створюємо «лотосну» форму через два дзеркальних квадратичних path
  const startX = CENTER + Math.cos(rad) * PETAL_INNER_R;
  const startY = CENTER + Math.sin(rad) * PETAL_INNER_R;
  const tipX = CENTER + Math.cos(rad) * PETAL_OUTER_R;
  const tipY = CENTER + Math.sin(rad) * PETAL_OUTER_R;
  const perpX = Math.cos(rad + Math.PI / 2);
  const perpY = Math.sin(rad + Math.PI / 2);
  const ctrl1X = cx + perpX * halfWidth;
  const ctrl1Y = cy + perpY * halfWidth;
  const ctrl2X = cx - perpX * halfWidth;
  const ctrl2Y = cy - perpY * halfWidth;

  const pathD = `M ${startX} ${startY}
    Q ${ctrl1X} ${ctrl1Y} ${tipX} ${tipY}
    Q ${ctrl2X} ${ctrl2Y} ${startX} ${startY} Z`;

  return (
    <g opacity={completed ? 1 : 0.25}>
      <path
        d={pathD}
        fill={completed ? `url(#grad-${level.n})` : 'rgba(40, 28, 60, 0.4)'}
        stroke={completed ? chakraColor(level) : 'rgba(232,196,118,0.18)'}
        strokeWidth={completed ? 1.5 : 0.5}
      />
      <text x={cx} y={cy + 4} textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace" fontSize="14"
        fill={completed ? chakraColor(level) : 'rgba(220,200,160,0.32)'}
        style={{ userSelect: 'none' }}>
        {level.n}
      </text>
      {keyText && completed && (
        <title>{keyText}</title>
      )}
    </g>
  );
}

function chakraColor(level) {
  return level.chakra?.color || 'var(--gold)';
}
