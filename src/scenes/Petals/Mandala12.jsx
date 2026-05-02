import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PETALS } from '../../data/petals.js';
import SacredGeometry from '../Final/SacredGeometry.jsx';

const VIEW = 600;
const CENTER = 300;
const PETAL_R = 220;
const PETAL_INNER = 90;

// Мандала з 12 пелюсток для post-game expansion. Кожну можна обрати.
// Завершені — золотисті, з "✓" у центрі. У роботі — кольорові з прогресом.
// Кут між пелюстками 360°/12 = 30°.
export default function Mandala12() {
  const enterPetal = useGameStore((s) => s.enterPetal);
  const progress = useGameStore((s) => s.petalProgress);
  const total = PETALS.length;
  const allDone = PETALS.every((p) => progress[p.id]?.completed);
  const completedCount = PETALS.filter((p) => progress[p.id]?.completed).length;
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <main className="scene petals-scene">
      <div className="petals-frame">
        <div className="petals-eyebrow">розширений шлях</div>
        <h1 className="petals-title">12 сфер життя</h1>
        <p className="petals-subtitle">
          Ти пройшов вертикаль чакр. Тепер — 12 горизонтальних сфер. Обери свою — будь-яку.
          Мандала не лінійна.
        </p>

        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="petals-mandala-svg">
          <circle cx={CENTER} cy={CENTER} r={PETAL_R + 18} fill="none"
            stroke="rgba(232,196,118,0.18)" strokeWidth="0.5" />

          {PETALS.map((petal, i) => {
            const angle = (i / total) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const px = CENTER + Math.cos(rad) * ((PETAL_R + PETAL_INNER) / 2);
            const py = CENTER + Math.sin(rad) * ((PETAL_R + PETAL_INNER) / 2);
            const startX = CENTER + Math.cos(rad) * PETAL_INNER;
            const startY = CENTER + Math.sin(rad) * PETAL_INNER;
            const tipX = CENTER + Math.cos(rad) * PETAL_R;
            const tipY = CENTER + Math.sin(rad) * PETAL_R;
            const perpX = Math.cos(rad + Math.PI / 2);
            const perpY = Math.sin(rad + Math.PI / 2);
            const halfW = 28;
            const c1x = px + perpX * halfW, c1y = py + perpY * halfW;
            const c2x = px - perpX * halfW, c2y = py - perpY * halfW;
            const path = `M ${startX} ${startY}
              Q ${c1x} ${c1y} ${tipX} ${tipY}
              Q ${c2x} ${c2y} ${startX} ${startY} Z`;
            const prog = progress[petal.id] || { completed: false, answeredIds: [] };
            const cells = petal.cells.length;
            const answered = prog.answeredIds.length;
            const ratio = cells ? answered / cells : 0;
            // Базова opacity 0.75 — щоб пелюстка завжди була виразно видима.
            // Прогрес додає до 0.95. Завершена — 1.
            const opacity = prog.completed ? 1 : (0.75 + ratio * 0.2);

            const isHovered = hoveredId === petal.id;
            return (
              <g key={petal.id} style={{ cursor: 'pointer' }}
                onClick={() => enterPetal(petal.id)}
                onMouseEnter={() => setHoveredId(petal.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`m9-petal${isHovered ? ' hover' : ''}${prog.completed ? ' done' : ''}`}>
                <path d={path}
                  fill={petal.color}
                  fillOpacity={prog.completed ? 0.9 : 0.55}
                  stroke={petal.color}
                  strokeWidth={prog.completed ? 1.8 : isHovered ? 1.6 : 1.2}
                  opacity={isHovered ? 1 : opacity}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: isHovered ? `drop-shadow(0 0 14px ${petal.color})` : 'none',
                  }}>
                  <title>{petal.name}{cells > 0 ? ` · ${answered}/${cells}` : ''}</title>
                </path>
                <text x={px} y={py - 4} textAnchor="middle"
                  fontSize={isHovered ? "15" : "13"} fontWeight="700" fill="#fff7e0"
                  style={{
                    userSelect: 'none', pointerEvents: 'none',
                    transition: 'font-size 0.25s',
                    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                  }}>
                  {petal.symbol}
                </text>
                <text x={px} y={py + 12} textAnchor="middle"
                  fontSize="10" fontWeight="600" fill="#fff7e0"
                  style={{
                    userSelect: 'none', pointerEvents: 'none',
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                  }}>
                  {petal.name}
                </text>
                {prog.completed && (
                  <text x={px} y={py + 26} textAnchor="middle"
                    fontSize="14" fill="#f0c574"
                    style={{ pointerEvents: 'none' }}>✓</text>
                )}
              </g>
            );
          })}

          {/* Sacred Geometry — з'являється з 3+ ключами */}
          <SacredGeometry keysCount={completedCount} cx={CENTER} cy={CENTER} />

          {/* Центральне коло */}
          <circle cx={CENTER} cy={CENTER} r={PETAL_INNER - 6}
            fill="rgba(20, 14, 30, 0.85)"
            stroke="#f0c574" strokeWidth="1.2" />
          <text x={CENTER} y={CENTER + 8} textAnchor="middle"
            fontSize="38" fill="#f0c574"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic">
            {allDone ? '✺' : '∞'}
          </text>
        </svg>

        <div className="petals-progress-line">
          {PETALS.filter((p) => progress[p.id]?.completed).length} з {total} пелюсток завершено
        </div>

        {allDone && (
          <div className="petals-done">
            ✺ <em>Усі 12 пелюсток розкриті. Квітка Життя у тобі.</em> ✺
          </div>
        )}
      </div>
    </main>
  );
}
