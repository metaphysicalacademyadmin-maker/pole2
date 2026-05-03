import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PETALS } from '../../data/petals.js';
import { currentSeason } from '../../utils/season.js';
import TreeSky from './TreeSky.jsx';
import TreeCanopy from './TreeCanopy.jsx';
import TreeTrunk from './TreeTrunk.jsx';
import TreeRoots from './TreeRoots.jsx';
import Rodovid from '../Rodovid/index.jsx';

// Дерево Зрілості — 4 шари за метафорою:
//   • Небо (y 0-160)        — духовне сприйняття, космо канали як зірки
//   • Крона (y 160-400)     — пелюстки розкриття, гілки, плоди
//   • Стовбур (y 400-700)   — канал між небом і землею, 7 чакр
//   • Корені (y 700-900)    — родова основа, родовід + Хеллінгер
//
// Клік на шар відкриває відповідний модуль:
//   небо → майбутнє: Cosmo (поки клік ігнорується якщо нема)
//   крона → пелюстки (через onOpenCanopy)
//   стовбур → матриця 7×5 (через onOpenMatrix)
//   корені → Rodovid

const VIEW_W = 600;
const VIEW_H = 920;
const CENTER_X = 300;

// Y-діапазони шарів
const SKY = { top: 0, bottom: 180 };
const CANOPY = { top: 180, bottom: 420 };
const TRUNK = { top: 420, bottom: 720 };
const ROOTS = { y: 720 };

export default function MaturityTreeSvg({ onOpenMatrix, onOpenCanopy, onOpenSky }) {
  const completedLevels = useGameStore((s) => s.completedLevels) || [];
  const levelKeys = useGameStore((s) => s.levelKeys) || {};
  const petalProgress = useGameStore((s) => s.petalProgress) || {};
  const channelsUnlocked = useGameStore((s) => s.channelsUnlocked) || [];
  const gifts = useGameStore((s) => s.gifts) || [];
  const practiceCompletions = useGameStore((s) => s.practiceCompletions) || [];
  const intention = useGameStore((s) => s.intention);
  const season = currentSeason();
  const [rodovidOpen, setRodovidOpen] = useState(false);

  const levelsCount = completedLevels.length;
  const petalsCount = PETALS.filter((p) => petalProgress[p.id]?.completed).length;

  return (
    <div className="mt-tree-wrap">
      <div className="mt-stats">
        <Stat n={channelsUnlocked.length} total={11} icon="✦" label="каналів" />
        <Stat n={petalsCount} total={12} icon="🌸" label="пелюсток" />
        <Stat n={levelsCount} total={7} icon="◯" label="чакр" />
        <Stat n={gifts.length} total={null} icon="🍎" label="плодів" />
      </div>

      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="mt-tree-svg"
        role="img" aria-label="Дерево зрілості — 4 шари: небо, крона, стовбур, корені">
        <defs>
          <linearGradient id="tr-trunk-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#5a4030" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#8b6240" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#c89849" stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id="tr-root-soil" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(122, 90, 138, 0.4)" />
            <stop offset="100%" stopColor="rgba(20, 14, 30, 0)" />
          </radialGradient>
          <radialGradient id="tr-sky-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(255, 231, 168, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
          <radialGradient id="tr-season" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor={seasonGlowColor(season)} stopOpacity="0.16" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#tr-season)" />

        {/* Шар 1 — небо */}
        <TreeSky centerX={CENTER_X} topY={SKY.top} bottomY={SKY.bottom}
          onOpen={onOpenSky || (() => {})} />

        {/* Шар 2 — крона */}
        <TreeCanopy centerX={CENTER_X} topY={CANOPY.top} bottomY={CANOPY.bottom}
          onOpen={onOpenCanopy || (() => {})} />

        {/* Шар 3 — стовбур */}
        <TreeTrunk centerX={CENTER_X} topY={TRUNK.top} bottomY={TRUNK.bottom}
          intention={intention}
          onOpen={onOpenMatrix || (() => {})} />

        {/* Шар 4 — корені */}
        <TreeRoots centerX={CENTER_X} baseY={ROOTS.y}
          onOpen={() => setRodovidOpen(true)} />
      </svg>

      <p className="mt-tree-foot">
        {`сезон: ${seasonLabel(season)}. дерево живиться знизу — рід тримає, канал пропускає, крона розкриває.`}
      </p>
      <div className="mt-tree-cta-list">
        <span>↑ небо · клік → космо</span>
        <span>◯ крона · клік → пелюстки</span>
        <span>║ стовбур · клік → матриця</span>
        <span>╲ корені · клік → родовід</span>
      </div>

      {rodovidOpen && <Rodovid onClose={() => setRodovidOpen(false)} />}
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
