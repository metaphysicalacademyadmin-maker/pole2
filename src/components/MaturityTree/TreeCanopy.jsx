import { useGameStore } from '../../store/gameStore.js';
import { PETALS } from '../../data/petals.js';

// Крона — як людина розкривається у світі.
// 12 пелюсток-сфер життя радіально. completed → квітнуть кольором.
// Не-completed → бруньки/зачатки.
// Плоди (gifts) — фрукти на гілках.

export default function TreeCanopy({ centerX, topY, bottomY, onOpen }) {
  const petalProgress = useGameStore((s) => s.petalProgress) || {};
  const gifts = useGameStore((s) => s.gifts) || [];
  const practiceCompletions = useGameStore((s) => s.practiceCompletions) || [];

  const cy = (topY + bottomY) / 2;
  const radius = (bottomY - topY) / 2;

  // 12 пелюсток радіально по дузі від 200° до 340° (верхня дуга)
  const positions = PETALS.map((petal, i) => {
    // Розкид по 2 «ярусам»: ближче і далі від центру
    const tier = i % 2;        // 0 = ближній; 1 = дальній
    const angle = -90 + (i - 5.5) * 14;          // -167° до -13° (верхній півколо)
    const r = radius * (0.55 + tier * 0.4);
    const rad = (angle * Math.PI) / 180;
    const x = centerX + Math.cos(rad) * r;
    const y = cy + Math.sin(rad) * r * 0.85;     // більше горизонтально
    const completed = !!petalProgress[petal.id]?.completed;
    return { petal, x, y, completed, angle, tier };
  });

  return (
    <g className="tr-canopy" onClick={onOpen} style={{ cursor: 'pointer' }}
      role="button" aria-label="Крона — пелюстки розкриття">

      {/* Гілки — від основи стовбура до кожної пелюстки */}
      {positions.map(({ petal, x, y, completed }) => (
        <path key={`branch-${petal.id}`}
          d={`M ${centerX} ${bottomY - 10}
             Q ${(centerX + x) / 2} ${(bottomY + y) / 2 - 20}
             ${x} ${y}`}
          fill="none"
          stroke={completed ? petal.color : 'rgba(139, 98, 64, 0.35)'}
          strokeWidth={completed ? 1.8 : 1.2}
          strokeLinecap="round"
          opacity={completed ? 0.7 : 0.45} />
      ))}

      {/* Пелюстки — квіти/бруньки */}
      {positions.map(({ petal, x, y, completed }) => (
        <g key={petal.id} className={`tr-canopy-petal${completed ? ' is-bloomed' : ''}`}>
          {completed ? (
            <>
              <circle cx={x} cy={y} r="11"
                fill={petal.color} opacity="0.85"
                style={{ filter: `drop-shadow(0 0 12px ${petal.color})` }} />
              <text x={x} y={y + 4} textAnchor="middle"
                fontSize="11" fontWeight="700" fill="#04020c"
                fontFamily="Georgia, serif"
                style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {petal.symbol}
              </text>
              <title>{petal.name}</title>
            </>
          ) : (
            <circle cx={x} cy={y} r="5"
              fill="rgba(139, 98, 64, 0.5)" opacity="0.5">
              <title>{petal.name} · ще брунька</title>
            </circle>
          )}
        </g>
      ))}

      {/* Плоди — gifts на нижчих гілках */}
      {gifts.length > 0 && positions.slice(0, Math.min(gifts.length, 6)).map((p, i) => (
        <circle key={`fruit-${i}`}
          cx={p.x + (p.x < centerX ? -10 : 10)}
          cy={p.y + 16}
          r="5"
          fill="#e8a050" opacity="0.85"
          style={{ filter: 'drop-shadow(0 0 8px #e8a050)' }}>
          <title>дар у Світ</title>
        </circle>
      ))}

      {/* Практики — листочки навколо квітів */}
      {practiceCompletions.length > 0 && (
        <g className="tr-canopy-leaves">
          {Array.from({ length: Math.min(practiceCompletions.length, 12) }).map((_, i) => {
            const angle = (i / 12) * 360;
            const rad = (angle * Math.PI) / 180;
            const r = radius * 0.7;
            const x = centerX + Math.cos(rad) * r * 0.9;
            const y = cy + Math.sin(rad) * r * 0.55;
            return (
              <ellipse key={i} cx={x} cy={y} rx="3" ry="1.5"
                fill="rgba(168, 200, 152, 0.55)"
                transform={`rotate(${angle} ${x} ${y})`}>
                <title>практика</title>
              </ellipse>
            );
          })}
        </g>
      )}

      {/* Лейбл */}
      <text x={centerX} y={topY + 12} textAnchor="middle"
        fontSize="10" fill="rgba(232, 196, 118, 0.5)"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontStyle="italic"
        style={{ letterSpacing: '2px', textTransform: 'lowercase', pointerEvents: 'none' }}>
        крона · розкриття
      </text>
    </g>
  );
}
