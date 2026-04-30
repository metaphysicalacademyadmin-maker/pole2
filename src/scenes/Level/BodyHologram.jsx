import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { CHAKRAS } from '../../data/chakras.js';
import ChakraInfoModal from '../../components/modals/ChakraInfoModal.jsx';

const VIEW_W = 200;
const VIEW_H = 420;

// Аватар тіла з 7 чакрами. Кожна чакра — клікабельна.
// Активність чакри (інтенсивність свічення) залежить від:
//   - чи завершено рівень піраміди
//   - чи поточний рівень
//   - стан барометра
export default function BodyHologram() {
  const completedLevels = useGameStore((s) => s.completedLevels);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const resources = useGameStore((s) => s.resources);
  const [openChakra, setOpenChakra] = useState(null);

  return (
    <>
      <div className="holo-wrap">
        <div className="lvl-col-label">тіло · 7 чакр</div>
        <svg className="holo-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
          <defs>
            {CHAKRAS.map((ch) => (
              <radialGradient key={ch.id} id={`chakra-${ch.id}`}>
                <stop offset="0%" stopColor={ch.color} stopOpacity="0.95" />
                <stop offset="50%" stopColor={ch.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={ch.colorDeep} stopOpacity="0.1" />
              </radialGradient>
            ))}
            <linearGradient id="aura-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe7a8" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#9fc8e8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#a8c898" stopOpacity="0.18" />
            </linearGradient>
          </defs>

          <Aura />
          <BodyOutline />
          <CentralChannel />

          {CHAKRAS.map((ch) => {
            const active = completedLevels.includes(ch.levelN);
            const current = currentLevel === ch.levelN;
            const resourceLevel = resources[ch.barometers[0]] || 0;
            const intensity = active ? 1 : current ? 0.85 : Math.min(0.5, resourceLevel / 20);
            return (
              <ChakraSphere key={ch.id}
                chakra={ch}
                active={active}
                current={current}
                intensity={intensity}
                onClick={() => setOpenChakra(ch.id)} />
            );
          })}
        </svg>
        <div className="holo-caption">
          {completedLevels.length === 0
            ? 'клікни на чакру щоб дізнатись'
            : `${completedLevels.length} з 7 чакр запалено`}
        </div>
      </div>
      {openChakra && (
        <ChakraInfoModal chakraId={openChakra} onClose={() => setOpenChakra(null)} />
      )}
    </>
  );
}

function Aura() {
  return (
    <ellipse cx={VIEW_W / 2} cy={VIEW_H / 2}
      rx={92} ry={200}
      fill="url(#aura-grad)" opacity="0.55"
    />
  );
}

function BodyOutline() {
  return (
    <g stroke="rgba(232,196,118,0.55)" fill="rgba(20,14,30,0.4)" strokeWidth="1.2">
      {/* Голова */}
      <ellipse cx={100} cy={32} rx={22} ry={28} />
      {/* Шия */}
      <rect x={92} y={56} width={16} height={14} rx={4} />
      {/* Плечі і груди */}
      <path d="
        M 60 78 C 70 72, 130 72, 140 78
        L 138 130
        Q 138 160, 130 180
        L 130 240
        Q 128 270, 120 290
        L 118 380
        Q 116 405, 108 415
        L 92 415
        Q 84 405, 82 380
        L 82 290
        Q 72 270, 70 240
        L 70 180
        Q 62 160, 62 130 Z
      " fill="rgba(40,28,60,0.4)" />
      {/* Руки */}
      <path d="M 62 90 Q 38 130, 36 200 L 42 250 Q 38 270, 32 290" fill="none" />
      <path d="M 138 90 Q 162 130, 164 200 L 158 250 Q 162 270, 168 290" fill="none" />
    </g>
  );
}

function CentralChannel() {
  // Сушумна — центральний канал, тонка золота лінія
  return (
    <line x1={VIEW_W / 2} y1={20} x2={VIEW_W / 2} y2={400}
      stroke="rgba(232,196,118,0.35)" strokeWidth="0.8" strokeDasharray="2 4" />
  );
}

function ChakraSphere({ chakra, active, current, intensity, onClick }) {
  const cy = (chakra.yPercent / 100) * VIEW_H;
  const r = 14 + intensity * 4;

  return (
    <g
      style={{ cursor: 'pointer' }}
      onClick={onClick}
      transform={`translate(${VIEW_W / 2} ${cy})`}
    >
      {/* Зовнішнє свічення */}
      {(active || current) && (
        <circle r={r + 8}
          fill={chakra.color}
          opacity={current ? 0.35 : 0.2}>
          {current && (
            <animate attributeName="r" values={`${r + 8};${r + 14};${r + 8}`} dur="3s" repeatCount="indefinite" />
          )}
        </circle>
      )}

      {/* Основна сфера */}
      <circle r={r}
        fill={`url(#chakra-${chakra.id})`}
        stroke={active || current ? chakra.color : 'rgba(232,196,118,0.3)'}
        strokeWidth={active || current ? 1.5 : 0.8}
        opacity={0.4 + intensity * 0.6}>
        {current && (
          <animate attributeName="opacity" values={`${0.4 + intensity * 0.6};1;${0.4 + intensity * 0.6}`} dur="2.5s" repeatCount="indefinite" />
        )}
      </circle>

      {/* Bija-літера всередині */}
      {(active || current) && (
        <text textAnchor="middle" y={5}
          fontSize={r > 14 ? 12 : 10} fontWeight="700"
          fontFamily="Georgia, serif"
          fill={chakra.colorDeep} pointerEvents="none">
          {chakra.bija}
        </text>
      )}

      {/* Прозоре hover-коло (більше — легше клікнути) */}
      <circle r={26} fill="transparent" />
    </g>
  );
}
