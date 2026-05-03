import { useGameStore } from '../../store/gameStore.js';

// Небо — духовне сприйняття.
// Над кроною — космоенергетичні канали як зірки.
// Кожен розблокований канал = світло-зірка.
// Якщо є cosmoApplication.approved → весь верх сяє.

export default function TreeSky({ centerX, topY, bottomY, onOpen }) {
  const channelsUnlocked = useGameStore((s) => s.channelsUnlocked) || [];
  const cosmoApp = useGameStore((s) => s.cosmoApplication);
  const completedLevels = useGameStore((s) => s.completedLevels) || [];

  const channelsCount = channelsUnlocked.length;
  const cosmoActive = cosmoApp?.status === 'approved' || cosmoApp?.status === 'initiated';
  const allChakrasDone = completedLevels.length === 7;
  const skyAwakened = channelsCount > 0 || cosmoActive || allChakrasDone;

  const cy = (topY + bottomY) / 2;

  // Зірки — позиції
  const stars = generateStars(centerX, cy, bottomY - topY, channelsCount, cosmoActive);

  return (
    <g className="tr-sky" onClick={onOpen} style={{ cursor: 'pointer' }}
      role="button" aria-label="Небо — духовне сприйняття">

      {/* Глибинне сяйво коли активний космо */}
      {skyAwakened && (
        <ellipse cx={centerX} cy={cy} rx="280" ry={(bottomY - topY) / 2}
          fill="url(#tr-sky-glow)"
          opacity={cosmoActive ? 0.85 : 0.4 + (channelsCount / 11) * 0.4} />
      )}

      {/* Зірки — кожна = розблокований канал */}
      {stars.map((s, i) => (
        <Star key={i} {...s} />
      ))}

      {/* Якщо космо ініційований — потужний центральний знак */}
      {cosmoActive && (
        <g className="tr-sky-cosmo-center">
          <circle cx={centerX} cy={cy} r="22"
            fill="rgba(255, 231, 168, 0.15)"
            stroke="#ffe7a8" strokeWidth="1.2"
            opacity="0.7"
            style={{ filter: 'drop-shadow(0 0 18px #ffe7a8)' }}>
            <animate attributeName="opacity" values="0.5;0.85;0.5"
              dur="4s" repeatCount="indefinite" />
          </circle>
          <text x={centerX} y={cy + 5} textAnchor="middle"
            fontSize="18" fill="#ffe7a8"
            fontFamily="Georgia, serif"
            style={{ pointerEvents: 'none', userSelect: 'none' }}>
            ✦
          </text>
        </g>
      )}

      {/* Промінчики від центральної зірки якщо все пройдено */}
      {allChakrasDone && (
        <g className="tr-sky-rays">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line key={a}
                x1={centerX + Math.cos(rad) * 30}
                y1={cy + Math.sin(rad) * 30}
                x2={centerX + Math.cos(rad) * 80}
                y2={cy + Math.sin(rad) * 80}
                stroke="#ffe7a8" strokeWidth="0.8"
                opacity="0.4" />
            );
          })}
        </g>
      )}

      {/* Лейбл */}
      <text x={centerX} y={topY + 18} textAnchor="middle"
        fontSize="10" fill="rgba(255, 231, 168, 0.6)"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontStyle="italic"
        style={{ letterSpacing: '2px', textTransform: 'lowercase', pointerEvents: 'none' }}>
        небо · духовне сприйняття
      </text>

      {channelsCount > 0 && (
        <text x={centerX} y={bottomY - 6} textAnchor="middle"
          fontSize="9" fill="rgba(255, 231, 168, 0.5)"
          fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
          style={{ pointerEvents: 'none' }}>
          {channelsCount} {channelsCount === 1 ? 'канал' : channelsCount < 5 ? 'канали' : 'каналів'}
          {cosmoActive ? ' · ініціація' : ''}
        </text>
      )}
    </g>
  );
}

function Star({ x, y, r, opacity, twinkle }) {
  const points = makeStarPoints(x, y, r, r * 0.4, 5);
  return (
    <polygon points={points}
      fill="#ffe7a8" opacity={opacity}
      style={{ filter: `drop-shadow(0 0 ${r * 1.5}px #ffe7a8)` }}>
      {twinkle && (
        <animate attributeName="opacity"
          values={`${opacity};${Math.min(1, opacity + 0.3)};${opacity}`}
          dur={`${3 + (x % 4)}s`}
          repeatCount="indefinite" />
      )}
    </polygon>
  );
}

function makeStarPoints(cx, cy, rOuter, rInner, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const angle = (Math.PI / n) * i - Math.PI / 2;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return pts.join(' ');
}

function generateStars(cx, cy, h, channelsCount, cosmoActive) {
  // 11 каналів максимум — розкидаємо по верхній дузі
  // Перші N зірок — яскраві (за кількістю unlocked), решта — ledve видні
  const stars = [];
  const total = 11;
  for (let i = 0; i < total; i++) {
    const angle = -180 + (i / (total - 1)) * 180;       // -180° до 0° (верхня дуга)
    const rad = (angle * Math.PI) / 180;
    const radius = h * 0.35 + (i % 3) * 12;
    const x = cx + Math.cos(rad) * radius * 0.9;
    const y = cy + Math.sin(rad) * radius * 0.7;
    const isUnlocked = i < channelsCount;
    stars.push({
      x, y,
      r: isUnlocked ? 4 : 1.5,
      opacity: isUnlocked ? 0.85 : 0.25,
      twinkle: isUnlocked,
    });
  }
  // + Кілька випадкових мікро-зірок завжди
  for (let i = 0; i < 8; i++) {
    const seed = (i * 37) % 100;
    stars.push({
      x: cx - 220 + (seed * 4.5),
      y: cy - h * 0.4 + ((seed * 7) % h),
      r: 0.8,
      opacity: cosmoActive ? 0.5 : 0.2,
      twinkle: false,
    });
  }
  return stars;
}
