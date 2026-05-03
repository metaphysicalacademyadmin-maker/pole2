import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PETALS } from '../../data/petals.js';
import { shouldShowCooldown } from '../../utils/petal-cooldown.js';
import PetalCooldownModal from '../../components/PetalCooldownModal.jsx';
import SacredGeometry from '../Final/SacredGeometry.jsx';
import '../../components/PetalCooldownModal.css';

const VIEW = 600;
const CENTER = 300;
const PETAL_R = 220;
const PETAL_INNER = 90;

// Кінематографічна мандала з 12 пелюсток.
// Шари (від фону до переду):
//   1. Атмосферний radial nebula
//   2. Декоративні концентричні кола (3 рівні)
//   3. Sun rays — 12 тонких градієнтних променів від центру
//   4. SacredGeometry (Меркаба/Куб Метатрона/Квітка Життя)
//   5. Пелюстки — radial gradient fill, drop-shadow glow, bloom-anim
//   6. Центральне ядро — концентричні кола з повільним поворотом
//   7. Лейбли — серифні римські цифри з glow
export default function Mandala12() {
  const enterPetal = useGameStore((s) => s.enterPetal);
  const exitPetals = useGameStore((s) => s.exitPetals);
  const progress = useGameStore((s) => s.petalProgress);
  const overrides = useGameStore((s) => s.petalCooldownOverrides);
  const total = PETALS.length;
  const allDone = PETALS.every((p) => progress[p.id]?.completed);
  const completedCount = PETALS.filter((p) => progress[p.id]?.completed).length;
  const [hoveredId, setHoveredId] = useState(null);
  const [pendingCooldown, setPendingCooldown] = useState(null);  // { petalId, name, cooldown }

  function handleEnter(petalId) {
    const cooldown = shouldShowCooldown(petalId, progress, overrides);
    if (cooldown) {
      const petal = PETALS.find((p) => p.id === petalId);
      setPendingCooldown({ petalId, name: petal?.name || petalId, cooldown });
      return;
    }
    enterPetal(petalId);
  }

  return (
    <main className="scene petals-scene petals-cinematic">
      <div className="petals-frame">
        <button type="button" className="petals-exit" onClick={exitPetals}
          aria-label="Повернутись на Карту Втілення">
          ← на головний
        </button>
        <div className="petals-eyebrow">розширений шлях</div>
        <h1 className="petals-title">12 сфер життя</h1>
        <p className="petals-subtitle">
          Ти пройшов вертикаль чакр. Тепер — 12 горизонтальних сфер. Обери свою — будь-яку.
          Мандала не лінійна.
        </p>

        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="petals-mandala-svg">
          <defs>
            {/* Радіальні градієнти для кожної пелюстки — кольорове ядро → прозорі краї */}
            {PETALS.map((p) => (
              <radialGradient key={p.id} id={`petal-grad-${p.id}`} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor={p.color} stopOpacity="0.95" />
                <stop offset="55%" stopColor={p.color} stopOpacity="0.75" />
                <stop offset="100%" stopColor={p.color} stopOpacity="0.35" />
              </radialGradient>
            ))}
            {/* Атмосферний фон — золото-фіолетова nebula */}
            <radialGradient id="petals-nebula" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="rgba(60, 40, 90, 0.45)" />
              <stop offset="50%" stopColor="rgba(40, 28, 70, 0.25)" />
              <stop offset="100%" stopColor="rgba(20, 14, 30, 0)" />
            </radialGradient>
            {/* Sun ray — gradient який згасає від центру до кінчика */}
            <linearGradient id="petals-ray" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(232, 196, 118, 0.5)" />
              <stop offset="100%" stopColor="rgba(232, 196, 118, 0)" />
            </linearGradient>
            {/* Центральне ядро — пульсуюче золото */}
            <radialGradient id="petals-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe7a8" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#f0c574" stopOpacity="0.55" />
              <stop offset="100%" stopColor="rgba(20, 14, 30, 0.95)" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Шар 1: атмосфера */}
          <circle cx={CENTER} cy={CENTER} r={CENTER} fill="url(#petals-nebula)" />

          {/* Шар 2: декоративні кільця */}
          <circle cx={CENTER} cy={CENTER} r={PETAL_R + 32} fill="none"
            stroke="rgba(232,196,118,0.08)" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx={CENTER} cy={CENTER} r={PETAL_R + 18} fill="none"
            stroke="rgba(232,196,118,0.18)" strokeWidth="0.6" />
          <circle cx={CENTER} cy={CENTER} r={PETAL_R - 8} fill="none"
            stroke="rgba(232,196,118,0.10)" strokeWidth="0.4" />

          {/* Шар 3: 12 sun-rays від центру */}
          <g className="m12-rays">
            {PETALS.map((_, i) => {
              const angle = (i / total) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const tipX = CENTER + Math.cos(rad) * (PETAL_R + 30);
              const tipY = CENTER + Math.sin(rad) * (PETAL_R + 30);
              return (
                <line key={i}
                  x1={CENTER} y1={CENTER}
                  x2={tipX} y2={tipY}
                  stroke="url(#petals-ray)"
                  strokeWidth="0.8"
                  opacity="0.55" />
              );
            })}
          </g>

          {/* Шар 4: Sacred Geometry (Меркаба/Куб/Квітка) */}
          <SacredGeometry keysCount={completedCount} cx={CENTER} cy={CENTER} />

          {/* Шар 5: пелюстки */}
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
            const isHovered = hoveredId === petal.id;
            const opacity = prog.completed ? 1 : (0.95 + (answered / Math.max(1, cells)) * 0.05);
            const glowR = isHovered ? 22 : (prog.completed ? 18 : 10);

            return (
              <g key={petal.id}
                onClick={() => handleEnter(petal.id)}
                onMouseEnter={() => setHoveredId(petal.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`m12-petal${isHovered ? ' hover' : ''}${prog.completed ? ' done' : ''}`}
                style={{ cursor: 'pointer', animationDelay: `${i * 0.08}s` }}>
                <path d={path}
                  fill={`url(#petal-grad-${petal.id})`}
                  stroke={petal.color}
                  strokeWidth={prog.completed ? 2 : isHovered ? 1.8 : 1.4}
                  opacity={opacity}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: `drop-shadow(0 0 ${glowR}px ${petal.color})`,
                  }}>
                  <title>{petal.name}{cells > 0 ? ` · ${answered}/${cells}` : ''}</title>
                </path>
                <text x={px} y={py - 4} textAnchor="middle"
                  fontSize={isHovered ? '17' : '14'} fontWeight="700"
                  fill="#fff7e0"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  style={{
                    userSelect: 'none', pointerEvents: 'none',
                    transition: 'font-size 0.25s',
                    textShadow: `0 0 8px ${petal.color}, 0 1px 4px rgba(0,0,0,0.7)`,
                  }}>
                  {petal.symbol}
                </text>
                <text x={px} y={py + 13} textAnchor="middle"
                  fontSize="10" fontWeight="600" fill="#fff7e0"
                  style={{
                    userSelect: 'none', pointerEvents: 'none',
                    textShadow: '0 1px 4px rgba(0,0,0,0.85)',
                    letterSpacing: '0.3px',
                  }}>
                  {petal.name}
                </text>
                {prog.completed && (
                  <text x={px} y={py + 28} textAnchor="middle"
                    fontSize="14" fill="#ffe7a8"
                    style={{
                      pointerEvents: 'none',
                      textShadow: '0 0 6px #ffe7a8',
                    }}>✓</text>
                )}
              </g>
            );
          })}

          {/* Шар 6: центральне ядро — багатошарове, пульсуюче */}
          <g className="m12-core">
            <circle cx={CENTER} cy={CENTER} r={PETAL_INNER + 4}
              fill="none" stroke="rgba(232,196,118,0.25)" strokeWidth="0.6"
              strokeDasharray="3 3" />
            <circle cx={CENTER} cy={CENTER} r={PETAL_INNER - 6}
              fill="url(#petals-core)" />
            <circle cx={CENTER} cy={CENTER} r={PETAL_INNER - 12}
              fill="none" stroke="#f0c574" strokeWidth="0.8" opacity="0.6" />
            <circle cx={CENTER} cy={CENTER} r={PETAL_INNER - 6}
              fill="none" stroke="#f0c574" strokeWidth="1.4"
              style={{ filter: 'drop-shadow(0 0 12px rgba(232,196,118,0.6))' }} />
          </g>
          <text x={CENTER} y={CENTER + 14} textAnchor="middle"
            fontSize="42" fill="#04020c"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="700"
            style={{
              pointerEvents: 'none',
              filter: 'drop-shadow(0 0 4px rgba(255, 231, 168, 0.9))',
            }}>
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

      {pendingCooldown && (
        <PetalCooldownModal
          petalId={pendingCooldown.petalId}
          petalName={pendingCooldown.name}
          cooldown={pendingCooldown.cooldown}
          onClose={() => setPendingCooldown(null)}
          onProceed={() => {
            const id = pendingCooldown.petalId;
            setPendingCooldown(null);
            enterPetal(id);
          }} />
      )}
    </main>
  );
}
