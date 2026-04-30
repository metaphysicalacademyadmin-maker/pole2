import { useGameStore } from '../../store/gameStore.js';
import { PYRAMID_LEVELS } from '../../data/levels.js';

// Спрощена голограма тіла: контур + точки чакр, що активуються коли
// гравець завершує відповідний рівень. Хвиля 2 додасть live-вимірювання
// з тілесних експериментів.
export default function BodyHologram() {
  const completedLevels = useGameStore((s) => s.completedLevels);
  const currentLevel = useGameStore((s) => s.currentLevel);

  return (
    <div className="holo-wrap">
      <div className="lvl-col-label">тіло</div>
      <svg className="holo-svg" viewBox="0 0 130 240">
        {/* Контур силуета */}
        <ellipse cx="65" cy="40" rx="14" ry="18" fill="none" stroke="var(--border-mid)" strokeWidth="0.6" />
        <path
          d="M65 58 L65 200 M40 80 L65 80 L90 80 M40 80 Q35 110 38 140 M90 80 Q95 110 92 140 M50 200 L48 230 M80 200 L82 230"
          fill="none"
          stroke="var(--border-mid)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* Чакри */}
        {PYRAMID_LEVELS.filter((l) => l.chakra).map((l) => {
          const active = completedLevels.includes(l.n);
          const isCurrent = l.n === currentLevel;
          return (
            <circle
              key={l.chakra.id}
              cx="65"
              cy={l.chakra.y}
              r={isCurrent ? 5 : 3.5}
              fill={active ? l.chakra.color : 'transparent'}
              stroke={l.chakra.color}
              strokeWidth="1"
              opacity={active ? 1 : isCurrent ? 0.7 : 0.4}
            >
              {isCurrent && (
                <animate attributeName="r" values="3.5;5;3.5" dur="3s" repeatCount="indefinite" />
              )}
            </circle>
          );
        })}
      </svg>
      <div className="holo-caption">
        {completedLevels.length === 0
          ? 'шлях тільки починається'
          : `${completedLevels.length} з 7 чакр запалено`}
      </div>
    </div>
  );
}
