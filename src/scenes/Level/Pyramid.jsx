import { useState, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PYRAMID_LEVELS } from '../../data/levels.js';
import { CHAKRAS } from '../../data/chakras.js';
import { getCellsForLevel } from '../../data/cells/index.js';
import LevelInfoModal from '../../components/modals/LevelInfoModal.jsx';

// Піраміда — 7 ярусів (від атмічного на вершині до муладхари знизу).
// Кожний ярус — трапеція з кольором чакри. Клікабельна.
const VIEW_W = 220;
const VIEW_H = 320;
const TIERS = 7;

export default function Pyramid() {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const unlockedLevels = useGameStore((s) => s.unlockedLevels);
  const levelProgress = useGameStore((s) => s.levelProgress);
  const pathMode = useGameStore((s) => s.pathMode);
  const [openLevel, setOpenLevel] = useState(null);

  // Зменшення ширини зверху → знизу: рівень 7 — найвужчий
  const tiers = useMemo(() => {
    return PYRAMID_LEVELS.filter((l) => l.n >= 1).map((lvl, i) => {
      const idx = i;                            // 0..6
      const fromTop = TIERS - 1 - idx;          // 6..0 (топ-вершина = idx 6 → fromTop 0)
      // Ярус n рахуємо від основи: i=0 → основа (Коріння)
      const tierIdx = idx;                      // 0 = найширший = level 1 (Коріння)
      const widthRatio = 0.4 + (tierIdx / (TIERS - 1)) * 0.6;   // 0.4..1.0
      const wTop = VIEW_W * widthRatio;
      const widthRatioBottom = 0.4 + ((tierIdx + 1) / TIERS) * 0.6;
      const wBottom = VIEW_W * widthRatioBottom;
      const tierH = (VIEW_H - 24) / TIERS;
      const yTop = 12 + tierH * (TIERS - 1 - tierIdx);
      const yBottom = yTop + tierH;
      const cx = VIEW_W / 2;
      const points = [
        [cx - wTop / 2, yTop],
        [cx + wTop / 2, yTop],
        [cx + wBottom / 2, yBottom],
        [cx - wBottom / 2, yBottom],
      ];
      const chakra = CHAKRAS.find((c) => c.levelN === lvl.n);
      const cells = getCellsForLevel(lvl.n, pathMode);
      const answered = (levelProgress[lvl.n]?.answeredCells || []).length;
      return {
        level: lvl,
        chakra,
        points,
        yCenter: (yTop + yBottom) / 2,
        cellsTotal: cells.length,
        cellsAnswered: answered,
      };
    });
  }, [levelProgress, pathMode]);

  return (
    <>
      <div>
        <div className="lvl-col-label">піраміда · 7 рівнів</div>
        <div className="pyr-stack">
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ width: '100%', height: 'auto' }}>
            <defs>
              {tiers.map((t) => (
                <linearGradient key={t.level.n} id={`pyr-grad-${t.level.n}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.chakra?.color || '#fff'} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={t.chakra?.colorDeep || '#888'} stopOpacity="0.4" />
                </linearGradient>
              ))}
            </defs>

            {tiers.map((t) => {
              const completed = completedLevels.includes(t.level.n);
              const current = currentLevel === t.level.n;
              const unlocked = unlockedLevels.includes(t.level.n) || completed;
              const path = `M ${t.points.map((p) => p.join(',')).join(' L ')} Z`;

              return (
                <g key={t.level.n} style={{ cursor: 'pointer' }}
                  onClick={() => setOpenLevel(t.level.n)}>
                  {/* Зовнішнє свічення поточного */}
                  {current && (
                    <path d={path}
                      fill="none"
                      stroke={t.chakra?.color}
                      strokeWidth="3"
                      opacity="0.5">
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
                    </path>
                  )}
                  <path d={path}
                    fill={completed ? `url(#pyr-grad-${t.level.n})` : current ? `url(#pyr-grad-${t.level.n})` : 'rgba(20, 14, 30, 0.6)'}
                    stroke={completed ? t.chakra?.color : current ? t.chakra?.color : 'rgba(232,196,118,0.25)'}
                    strokeWidth={current ? 2 : 1}
                    opacity={unlocked ? 1 : 0.4}
                  />

                  {/* Лейбл */}
                  <text x={VIEW_W / 2} y={t.yCenter - 1} textAnchor="middle"
                    fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                    fontSize="11" fontWeight="700"
                    fill={unlocked ? '#fff7e0' : '#968a7c'}
                    style={{ userSelect: 'none', pointerEvents: 'none' }}>
                    {t.level.n}. {t.level.name}
                  </text>
                  {/* Прогрес */}
                  {t.cellsTotal > 0 && unlocked && (
                    <text x={VIEW_W / 2} y={t.yCenter + 11} textAnchor="middle"
                      fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                      fontSize="8.5" fontWeight="600"
                      fill={completed ? '#a8c898' : current ? '#f0c574' : 'rgba(220,200,160,0.65)'}
                      style={{ pointerEvents: 'none', letterSpacing: '0.5px' }}>
                      {completed ? '✓ ключ' : `${t.cellsAnswered}/${t.cellsTotal}`}
                    </text>
                  )}
                  {/* Lock-іконка */}
                  {!unlocked && (
                    <text x={VIEW_W / 2} y={t.yCenter + 11} textAnchor="middle"
                      fontSize="11" fill="#968a7c" style={{ pointerEvents: 'none' }}>
                      🔒
                    </text>
                  )}
                </g>
              );
            })}

            {/* Вершина — символ Самості */}
            <text x={VIEW_W / 2} y={8} textAnchor="middle"
              fontSize="14" fill="#ffe7a8" fontWeight="700"
              style={{ pointerEvents: 'none' }}>∞</text>
          </svg>
        </div>
      </div>
      {openLevel != null && (
        <LevelInfoModal levelN={openLevel} onClose={() => setOpenLevel(null)} />
      )}
    </>
  );
}
