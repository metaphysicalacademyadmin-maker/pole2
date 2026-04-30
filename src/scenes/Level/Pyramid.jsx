import { useGameStore } from '../../store/gameStore.js';
import { PYRAMID_LEVELS } from '../../data/levels.js';

// Піраміда — 8 рівнів зверху вниз. Поточний — горить, пройдені — золоті,
// заблоковані — приглушені.
export default function Pyramid() {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const unlockedLevels = useGameStore((s) => s.unlockedLevels);

  const ordered = [...PYRAMID_LEVELS].reverse();

  return (
    <div>
      <div className="lvl-col-label">піраміда</div>
      <div className="pyr-stack">
        {ordered.map((lvl) => {
          const status = stateForLevel(lvl.n, currentLevel, completedLevels, unlockedLevels);
          return (
            <div
              key={lvl.n}
              className={`pyr-row ${status}`}
              style={{ width: `${lvl.cellWidth}%`, color: status === 'current' ? lvl.color : undefined }}
              title={lvl.sub}
            >
              {lvl.n}. {lvl.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function stateForLevel(n, current, completed, unlocked) {
  if (completed.includes(n)) return 'completed';
  if (n === current) return 'current';
  if (unlocked.includes(n)) return '';
  return 'locked';
}
