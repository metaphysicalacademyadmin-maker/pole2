import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { CHAKRAS } from '../../data/chakras.js';
import ChakraInfoModal from '../../components/modals/ChakraInfoModal.jsx';
import Silhouette from './body/Silhouette.jsx';
import Aura from './body/Aura.jsx';
import IdaPingala from './body/IdaPingala.jsx';
import ChakraSphere from './body/ChakraSphere.jsx';

const VIEW_W = 240;
const VIEW_H = 460;
const CENTER_X = VIEW_W / 2;
const TOP_Y = 18;
const BOTTOM_Y = 410;

function shouldGlowHands(state) {
  // Долоні світяться коли активний хоч один канал АБО зроблена практика hands_power.
  if ((state.channelsActive || []).length > 0) return true;
  return (state.practiceCompletions || []).some((p) => p.id === 'hands_power');
}

// Аватар тіла з 7 чакрами, лотосними пелюстками, аурою, Іда+Пінгала.
// Все клікабельне → показує ChakraInfoModal.
export default function BodyHologram() {
  const state = useGameStore();
  const { completedLevels, currentLevel, resources } = state;
  const [openChakra, setOpenChakra] = useState(null);
  const glowHands = shouldGlowHands(state);

  return (
    <>
      <div className="holo-wrap">
        <div className="lvl-col-label">тіло · 7 чакр</div>
        <svg className="holo-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
          <defs>
            {CHAKRAS.map((ch) => (
              <radialGradient key={ch.id} id={`chakra-${ch.id}`}>
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="30%" stopColor={ch.color} stopOpacity="0.85" />
                <stop offset="70%" stopColor={ch.colorDeep} stopOpacity="0.5" />
                <stop offset="100%" stopColor={ch.colorDeep} stopOpacity="0" />
              </radialGradient>
            ))}
            <filter id="chakra-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Aura (3 шари — найзовнішнє) */}
          <Aura centerX={CENTER_X} centerY={VIEW_H / 2} />

          {/* Тіло-силует — долоні світяться якщо є активний канал
              або виконано практику «Сила долонь» */}
          <g className="holo-body-breath">
            <Silhouette glowHands={glowHands} />
          </g>

          {/* Сушумна — центральний золотий канал */}
          <line x1={CENTER_X} y1={TOP_Y} x2={CENTER_X} y2={BOTTOM_Y}
            stroke="rgba(232,196,118,0.4)" strokeWidth="1" strokeDasharray="2 4" />

          {/* Іда + Пінгала — змії-канали обвивають сушумну */}
          <IdaPingala centerX={CENTER_X} topY={TOP_Y} bottomY={BOTTOM_Y} />

          {/* 7 чакр-сфер з пелюстками */}
          {CHAKRAS.map((ch) => {
            const active = completedLevels.includes(ch.levelN);
            const current = currentLevel === ch.levelN;
            const resourceLevel = resources[ch.barometers[0]] || 0;
            const intensity = active
              ? 1
              : current
                ? 0.85
                : Math.min(0.55, resourceLevel / 18);
            const cy = TOP_Y + ((BOTTOM_Y - TOP_Y) * ch.yPercent) / 100;
            return (
              <ChakraSphere key={ch.id}
                chakra={ch}
                cx={CENTER_X}
                cy={cy}
                active={active}
                current={current}
                intensity={intensity}
                onClick={() => setOpenChakra(ch.id)} />
            );
          })}
        </svg>
        <div className="holo-caption">
          {completedLevels.length === 0
            ? '✦ клікни на чакру щоб дізнатись'
            : `${completedLevels.length} з 7 чакр запалено`}
        </div>
      </div>
      {openChakra && (
        <ChakraInfoModal chakraId={openChakra} onClose={() => setOpenChakra(null)} />
      )}
    </>
  );
}
