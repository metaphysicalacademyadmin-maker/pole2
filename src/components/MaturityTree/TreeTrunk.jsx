import { useGameStore } from '../../store/gameStore.js';
import { CHAKRAS } from '../../data/chakras.js';

// Стовбур — канал між небом і землею.
// 7 секцій-чакр знизу вгору. Кожна секція (=чакра) світиться кольором
// якщо рівень пройдений, темно-натомлена якщо ще ні.
//
// Намір гравця м'яко вписаний у стовбур.

export default function TreeTrunk({ centerX, topY, bottomY, intention, onOpen }) {
  const completedLevels = useGameStore((s) => s.completedLevels) || [];

  const levelsCount = completedLevels.length;
  const trunkWidth = 36 + levelsCount * 4;     // 36-64
  const trunkOpacity = 0.55 + (levelsCount / 7) * 0.4;
  const totalH = bottomY - topY;
  const sectionH = totalH / 7;

  return (
    <g className="tr-trunk" onClick={onOpen} style={{ cursor: 'pointer' }}
      role="button" aria-label="Стовбур — канал між небом і землею">
      {/* Базова форма стовбура */}
      <path
        d={`M ${centerX - trunkWidth / 2} ${bottomY}
           C ${centerX - trunkWidth / 2 - 4} ${bottomY - totalH * 0.4},
             ${centerX - trunkWidth / 2.5} ${topY + totalH * 0.2},
             ${centerX - trunkWidth / 3.5} ${topY}
           L ${centerX + trunkWidth / 3.5} ${topY}
           C ${centerX + trunkWidth / 2.5} ${topY + totalH * 0.2},
             ${centerX + trunkWidth / 2 + 4} ${bottomY - totalH * 0.4},
             ${centerX + trunkWidth / 2} ${bottomY} Z`}
        fill="url(#tr-trunk-grad)"
        opacity={trunkOpacity} />

      {/* 7 чакра-секцій знизу-нагору */}
      {CHAKRAS.map((ch, i) => {
        // i=0 → muladhara (низ); i=6 → sahasrara (верх)
        const sectionBottom = bottomY - i * sectionH;
        const sectionTop = sectionBottom - sectionH;
        const cy = (sectionTop + sectionBottom) / 2;
        const completed = completedLevels.includes(ch.levelN);
        // Звуження стовбура догори
        const widthAtCy = trunkWidth * (1 - (i / 7) * 0.55);

        return (
          <g key={ch.id} className="tr-trunk-section">
            {/* Кільце-індикатор чакри */}
            <ellipse cx={centerX} cy={cy} rx={widthAtCy / 2 + 2} ry="3"
              fill="none"
              stroke={completed ? ch.color : 'rgba(74, 50, 30, 0.4)'}
              strokeWidth={completed ? 1.5 : 0.6}
              opacity={completed ? 0.9 : 0.5}
              style={completed ? {
                filter: `drop-shadow(0 0 8px ${ch.color})`,
              } : undefined} />
            {/* Точка-чакра по центру */}
            {completed && (
              <circle cx={centerX} cy={cy} r="5"
                fill={ch.color}
                opacity="0.95"
                style={{ filter: `drop-shadow(0 0 10px ${ch.color})` }}>
                <title>{ch.sub} · ключ {ch.levelN}</title>
              </circle>
            )}
            {/* Номер рівня */}
            {completed && (
              <text x={centerX} y={cy + 3} textAnchor="middle"
                fontSize="9" fontWeight="700" fill="#04020c"
                style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {ch.levelN}
              </text>
            )}
          </g>
        );
      })}

      {/* Намір — м'яко вписаний у середину стовбура */}
      {intention && (
        <text x={centerX} y={topY + totalH * 0.5} textAnchor="middle"
          fontSize="9" fill="rgba(255, 247, 224, 0.5)"
          fontStyle="italic" fontFamily="Georgia, serif"
          style={{ pointerEvents: 'none', letterSpacing: '0.3px' }}>
          «{trim(intention, 22)}»
        </text>
      )}

      {/* Лейбл-натяк */}
      <text x={centerX} y={(topY + bottomY) / 2 - 80} textAnchor="middle"
        fontSize="10" fill="rgba(232, 196, 118, 0.5)"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontStyle="italic"
        style={{ letterSpacing: '2px', textTransform: 'lowercase', pointerEvents: 'none' }}>
        канал
      </text>
    </g>
  );
}

function trim(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
