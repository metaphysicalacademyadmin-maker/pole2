import { useGameStore } from '../../store/gameStore.js';
import { CHAKRAS } from '../../data/chakras.js';
import { PETALS } from '../../data/petals.js';
import { currentSeason } from '../../utils/season.js';

// Дерево Зрілості — SVG композиція 600×800.
//   Корінь  — y 700-790  (матриця, прихована основа)
//   Стовбур — y 320-700  (твоя вертикаль, товщає від completed levels)
//   Гілки   — y 200-320  (12 пелюсток, розкриваються коли completed)
//   Листя   — y 80-200   (7 ключів = 7 чакр, з кольором рівня)
//   Верх    — y 30-80    (Я є — verхівка дерева)
//   Плоди   — на гілках, для дарів
//   Квіти   — рідкісні моменти

const VIEW_W = 600;
const VIEW_H = 820;
const CENTER_X = 300;

export default function MaturityTreeSvg({ onOpenMatrix }) {
  const completedLevels = useGameStore((s) => s.completedLevels) || [];
  const levelKeys = useGameStore((s) => s.levelKeys) || {};
  const petalProgress = useGameStore((s) => s.petalProgress) || {};
  const gifts = useGameStore((s) => s.gifts) || [];
  const practiceCompletions = useGameStore((s) => s.practiceCompletions) || [];
  const season = currentSeason();

  const levelsCount = completedLevels.length;
  const petalsCount = PETALS.filter((p) => petalProgress[p.id]?.completed).length;
  const trunkWidth = 12 + levelsCount * 5;          // 12-47
  const trunkOpacity = 0.55 + (levelsCount / 7) * 0.4;

  // Гілки: 12 пелюсток розподілені 6 ліворуч / 6 праворуч
  const branches = PETALS.map((petal, i) => {
    const isLeft = i % 2 === 0;
    const slot = Math.floor(i / 2);                  // 0..5 на сторону
    const baseY = 320 - slot * 18;                   // знизу-нагору
    const angle = isLeft ? -1 : 1;
    const tipX = CENTER_X + angle * (110 + slot * 18);
    const tipY = baseY - 50 - slot * 12;
    const completed = !!petalProgress[petal.id]?.completed;
    return { petal, isLeft, baseY, tipX, tipY, completed };
  });

  // Листя — 7 ключів. Розставлено на верхівці.
  const leaves = CHAKRAS.map((ch, i) => {
    const angle = -90 + (i - 3) * 14;                 // -132° до -48°
    const r = 110;
    const rad = (angle * Math.PI) / 180;
    const x = CENTER_X + Math.cos(rad) * r;
    const y = 140 + Math.sin(rad) * r;
    const completed = completedLevels.includes(ch.levelN);
    return { ch, x, y, completed };
  });

  return (
    <div className="mt-tree-wrap">
      <div className="mt-stats">
        <Stat n={levelsCount} total={7} icon="🍃" label="ключів" />
        <Stat n={petalsCount} total={12} icon="🌿" label="гілок" />
        <Stat n={gifts.length} total={null} icon="🍎" label="плодів" />
        <Stat n={practiceCompletions.length} total={null} icon="◌" label="практик" />
      </div>

      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="mt-tree-svg"
        role="img" aria-label="Дерево зрілості — SVG візуалізація твого шляху">
        <defs>
          {/* Стовбур — кольоровий gradient знизу-нагору */}
          <linearGradient id="mt-trunk" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#5a4030" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#8b6240" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#c89849" stopOpacity="0.55" />
          </linearGradient>
          {/* Корені — від темно-фіолетового до прозорого */}
          <radialGradient id="mt-root-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(122, 90, 138, 0.35)" />
            <stop offset="100%" stopColor="rgba(20, 14, 30, 0)" />
          </radialGradient>
          {/* Сезонне забарвлення фону */}
          <radialGradient id="mt-season" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor={seasonGlowColor(season)} stopOpacity="0.18" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Сезонний фон */}
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#mt-season)" />

        {/* Корінь — клікабельна область → відкриває Матрицю */}
        <g className="mt-root-group" onClick={onOpenMatrix}
          style={{ cursor: 'pointer' }}>
          <ellipse cx={CENTER_X} cy={760} rx="220" ry="60" fill="url(#mt-root-glow)" />
          {/* 5 кореневих ліній */}
          {[-2, -1, 0, 1, 2].map((i) => {
            const angle = 100 + i * 12;
            const rad = (angle * Math.PI) / 180;
            const len = 90 + Math.abs(i) * 20;
            const tipX = CENTER_X + Math.cos(rad) * len;
            const tipY = 700 + Math.sin(rad) * len;
            return (
              <path key={i}
                d={`M ${CENTER_X} 700 Q ${CENTER_X + Math.cos(rad) * len * 0.5} ${720 + i * 4} ${tipX} ${tipY}`}
                fill="none"
                stroke="rgba(122, 90, 138, 0.55)"
                strokeWidth={2 - Math.abs(i) * 0.3}
                strokeLinecap="round" />
            );
          })}
          <text x={CENTER_X} y={800} textAnchor="middle"
            fontSize="11" fill="rgba(232, 196, 118, 0.6)"
            fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
            fontStyle="italic"
            style={{ letterSpacing: '2px', textTransform: 'lowercase' }}>
            корінь · матриця
          </text>
        </g>

        {/* Стовбур — росте знизу-вгору */}
        <path
          d={`M ${CENTER_X - trunkWidth / 2} 700
             C ${CENTER_X - trunkWidth / 2 - 3} 500, ${CENTER_X - trunkWidth / 3} 320, ${CENTER_X - 6} 200
             L ${CENTER_X + 6} 200
             C ${CENTER_X + trunkWidth / 3} 320, ${CENTER_X + trunkWidth / 2 + 3} 500, ${CENTER_X + trunkWidth / 2} 700 Z`}
          fill="url(#mt-trunk)"
          opacity={trunkOpacity}
        />

        {/* Гілки — 12 пелюсток */}
        {branches.map(({ petal, baseY, tipX, tipY, completed }, i) => (
          <g key={petal.id} className={`mt-branch ${completed ? 'is-bloomed' : ''}`}>
            <path
              d={`M ${CENTER_X} ${baseY} Q ${(CENTER_X + tipX) / 2} ${(baseY + tipY) / 2 - 10} ${tipX} ${tipY}`}
              fill="none"
              stroke={completed ? petal.color : 'rgba(139, 98, 64, 0.45)'}
              strokeWidth={completed ? 2.5 : 1.8}
              strokeLinecap="round"
              opacity={completed ? 0.85 : 0.6}
              style={completed ? {
                filter: `drop-shadow(0 0 6px ${petal.color})`,
              } : undefined}
            />
            {completed && (
              <circle cx={tipX} cy={tipY} r={5}
                fill={petal.color} opacity="0.85"
                style={{ filter: `drop-shadow(0 0 8px ${petal.color})` }}>
                <title>{petal.name}</title>
              </circle>
            )}
          </g>
        ))}

        {/* Плоди — 1 фрукт за кожні 2 дари */}
        {gifts.length > 0 && branches.slice(0, Math.min(6, Math.ceil(gifts.length / 2))).map((br, i) => (
          <circle key={`fruit-${i}`}
            cx={br.tipX + (br.isLeft ? -8 : 8)}
            cy={br.tipY + 14}
            r="6"
            fill="#e8a050"
            opacity="0.85"
            style={{ filter: 'drop-shadow(0 0 8px #e8a050)' }}>
            <title>дар у Світ</title>
          </circle>
        ))}

        {/* Листя — 7 чакр з ключами */}
        {leaves.map(({ ch, x, y, completed }) => (
          <g key={ch.id} className="mt-leaf">
            <circle cx={x} cy={y} r={completed ? 11 : 7}
              fill={completed ? ch.color : 'rgba(139, 98, 64, 0.4)'}
              opacity={completed ? 0.95 : 0.5}
              style={completed ? {
                filter: `drop-shadow(0 0 12px ${ch.color})`,
              } : undefined}>
              <title>{ch.sub}{completed ? ` · ключ ${ch.levelN}` : ''}</title>
            </circle>
            {completed && (
              <text x={x} y={y + 3} textAnchor="middle"
                fontSize="10" fontWeight="700" fill="#04020c"
                style={{ pointerEvents: 'none' }}>
                {ch.levelN}
              </text>
            )}
          </g>
        ))}

        {/* Верхівка — Я є */}
        <g className="mt-crown">
          <circle cx={CENTER_X} cy={50} r="14"
            fill={levelsCount === 7 ? '#ffe7a8' : 'rgba(232, 196, 118, 0.3)'}
            stroke="rgba(232, 196, 118, 0.85)" strokeWidth="1.2"
            opacity={levelsCount === 7 ? 1 : 0.5}
            style={levelsCount === 7 ? {
              filter: 'drop-shadow(0 0 18px #ffe7a8)',
            } : undefined} />
          <text x={CENTER_X} y={55} textAnchor="middle"
            fontSize="14" fontWeight="700"
            fill={levelsCount === 7 ? '#04020c' : 'rgba(232,196,118,0.65)'}
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic">
            ✦
          </text>
          <text x={CENTER_X} y={28} textAnchor="middle"
            fontSize="10" fill="rgba(232,196,118,0.7)"
            style={{ letterSpacing: '3px' }}>
            {levelsCount === 7 ? 'Я Є' : '...'}
          </text>
        </g>
      </svg>

      <p className="mt-tree-foot">
        {`зараз сезон: ${seasonLabel(season)}. твоє дерево росте знизу — ${seasonHint(season)}.`}
      </p>
      <p className="mt-tree-cta">
        клікни на корінь щоб побачити <strong>матрицю зрілості</strong>
      </p>
    </div>
  );
}

function Stat({ n, total, icon, label }) {
  return (
    <div className="mt-stat">
      <span className="mt-stat-icon">{icon}</span>
      <span className="mt-stat-num">
        <strong>{n}</strong>{total != null && `/${total}`}
      </span>
      <span className="mt-stat-label">{label}</span>
    </div>
  );
}

function seasonGlowColor(s) {
  switch (s) {
    case 'winter': return '#9fb8d8';
    case 'spring': return '#a8c898';
    case 'summer': return '#ffe7a8';
    case 'autumn': return '#e8a050';
    default:       return '#c89849';
  }
}

function seasonLabel(s) {
  return ({
    winter: '🌑 зима — Корінь',
    spring: '🌱 весна — Серце',
    summer: '☀ літо — Голос',
    autumn: '🍂 осінь — Тінь',
  })[s] || 'час споглядання';
}

function seasonHint(s) {
  return ({
    winter: 'заземлюється і збирає опору',
    spring: 'розкриває гілки серця',
    summer: 'квітне і кличе голос',
    autumn: 'плодоносить дарами і інтегрує тінь',
  })[s] || 'дихає у свій ритм';
}
