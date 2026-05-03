import { useGameStore } from '../../store/gameStore.js';

// Корені дерева — родова основа.
// Живлення йде з родоводу (rodovid + Хеллінгер):
//   • заповнений вузол rodovid → товстіший корінь у відповідній лінії
//   • визнаний виключений → світла точка на корені
//   • переплетіння-released → загальне glow коренів
//   • історичні події визнані → темніший фундамент-ґрунт
//
// 5 коренів: центральний (Я), 2 батьківські, 4 дідівсько-бабусині (8 малих).
// При кліку — відкриває модалку Rodovid.

export default function TreeRoots({ centerX, baseY, onOpen }) {
  const rodovid = useGameStore((s) => s.rodovid) || {};
  const excluded = useGameStore((s) => s.rodovidExcluded) || [];
  const ent = useGameStore((s) => s.rodovidEntanglement);
  const history = useGameStore((s) => s.rodovidHistory) || {};
  const ritual = useGameStore((s) => s.rodovidParentRitual) || {};

  const meFilled = !!rodovid.me;
  const fatherFilled = !!rodovid.father;
  const motherFilled = !!rodovid.mother;
  const grandparentsFilled = ['gf-paternal','gm-paternal','gf-maternal','gm-maternal']
    .filter((id) => !!rodovid[id]).length;
  const acknowledgedExcluded = excluded.filter((e) => e.acknowledged).length;
  const released = !!ent?.released;
  const historyEvents = Object.values(history).filter((v) => v === true).length;
  const motherDone = !!(ritual.mother?.acceptance && ritual.mother?.release);
  const fatherDone = !!(ritual.father?.acceptance && ritual.father?.release);

  // Загальна сила коренів — від 0 до 1
  const rootStrength = Math.min(1,
    (meFilled ? 0.1 : 0) +
    (fatherFilled ? 0.15 : 0) +
    (motherFilled ? 0.15 : 0) +
    (grandparentsFilled / 4) * 0.2 +
    (acknowledgedExcluded > 0 ? 0.1 : 0) +
    (released ? 0.1 : 0) +
    (historyEvents > 0 ? 0.1 : 0) +
    ((motherDone ? 1 : 0) + (fatherDone ? 1 : 0)) * 0.05
  );

  return (
    <g className="tr-roots" onClick={onOpen}
      style={{ cursor: 'pointer' }}
      role="button" aria-label="Корені — родова основа">
      {/* Підземний glow — посилюється з родовою роботою */}
      <ellipse cx={centerX} cy={baseY + 70} rx="240" ry="80"
        fill="url(#tr-root-soil)"
        opacity={0.3 + rootStrength * 0.5} />

      {/* Якщо переплетіння-released — додатковий glow */}
      {released && (
        <ellipse cx={centerX} cy={baseY + 50} rx="200" ry="60"
          fill="rgba(116, 197, 181, 0.15)">
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="6s" repeatCount="indefinite" />
        </ellipse>
      )}

      {/* Центральний корінь — Я */}
      <Root cx={centerX} cy={baseY} angle={90} length={120}
        thickness={meFilled ? 4 : 2}
        color={meFilled ? '#f0c574' : 'rgba(122, 90, 138, 0.4)'}
        glow={meFilled} />

      {/* Лівий батьківський (тато) */}
      <Root cx={centerX} cy={baseY} angle={108} length={140}
        thickness={fatherFilled ? 3.5 : 1.6}
        color={fatherFilled ? '#9fc8e8' : 'rgba(122, 90, 138, 0.4)'}
        glow={fatherFilled}
        ritual={fatherDone} />

      {/* Правий батьківський (мама) */}
      <Root cx={centerX} cy={baseY} angle={72} length={140}
        thickness={motherFilled ? 3.5 : 1.6}
        color={motherFilled ? '#f0a8b8' : 'rgba(122, 90, 138, 0.4)'}
        glow={motherFilled}
        ritual={motherDone} />

      {/* 4 дідівсько-бабусині — менші, на флангах */}
      {[
        { id: 'gf-paternal', angle: 130, color: '#a8c898' },
        { id: 'gm-paternal', angle: 118, color: '#c9b3e8' },
        { id: 'gf-maternal', angle: 62,  color: '#a8c898' },
        { id: 'gm-maternal', angle: 50,  color: '#c9b3e8' },
      ].map((g) => {
        const filled = !!rodovid[g.id];
        return (
          <Root key={g.id} cx={centerX} cy={baseY}
            angle={g.angle} length={130}
            thickness={filled ? 2.5 : 1.2}
            color={filled ? g.color : 'rgba(122, 90, 138, 0.3)'}
            glow={filled} />
        );
      })}

      {/* Точки-виключені — світла на крайніх коренях коли визнані */}
      {Array.from({ length: Math.min(acknowledgedExcluded, 6) }).map((_, i) => {
        const angle = 35 + i * 22;
        const rad = (angle * Math.PI) / 180;
        const dist = 110;
        const x = centerX + Math.cos(rad) * dist;
        const y = baseY + Math.sin(rad) * dist;
        return (
          <circle key={i} cx={x} cy={y} r="3"
            fill="#b89bd0" opacity="0.85"
            style={{ filter: 'drop-shadow(0 0 6px #b89bd0)' }}>
            <title>визнаний виключений у роді</title>
          </circle>
        );
      })}

      {/* Лейбл-натяк */}
      <text x={centerX} y={baseY + 130} textAnchor="middle"
        fontSize="11" fill="rgba(232, 196, 118, 0.6)"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontStyle="italic"
        style={{ letterSpacing: '2px', textTransform: 'lowercase', pointerEvents: 'none' }}>
        корені · рід
      </text>
      <text x={centerX} y={baseY + 148} textAnchor="middle"
        fontSize="9" fill="rgba(168, 160, 155, 0.6)"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        style={{ pointerEvents: 'none' }}>
        {rootStrength < 0.2 ? 'натисни щоб назвати свій рід'
          : rootStrength < 0.5 ? 'рід проростає'
          : rootStrength < 0.8 ? 'коріння міцнішає'
          : 'рід тримає тебе'}
      </text>
    </g>
  );
}

function Root({ cx, cy, angle, length, thickness, color, glow, ritual }) {
  const rad = (angle * Math.PI) / 180;
  const tipX = cx + Math.cos(rad) * length;
  const tipY = cy + Math.sin(rad) * length;
  const midX = cx + Math.cos(rad) * length * 0.55;
  const midY = cy + Math.sin(rad) * length * 0.55 + 8;

  return (
    <g>
      <path d={`M ${cx} ${cy} Q ${midX} ${midY} ${tipX} ${tipY}`}
        fill="none" stroke={color} strokeWidth={thickness}
        strokeLinecap="round"
        opacity={glow ? 0.85 : 0.55}
        style={glow ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined} />
      {ritual && (
        <circle cx={tipX} cy={tipY} r="5" fill={color} opacity="0.95"
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}>
          <title>ритуал annehmen завершено</title>
        </circle>
      )}
    </g>
  );
}
