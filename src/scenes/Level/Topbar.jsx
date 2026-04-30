import { useGameStore } from '../../store/gameStore.js';
import { PATH_MODES } from '../../data/pathmodes.js';

// Топбар — лого, режим шляху, лічильник пройдених рівнів і ключів.
export default function Topbar() {
  const pathMode = useGameStore((s) => s.pathMode);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const keys = useGameStore((s) => s.keys);
  const mode = pathMode ? PATH_MODES[pathMode] : null;

  return (
    <div className="lvl-tb">
      <div className="lvl-tb-logo">Поле · Втілення</div>
      {mode && (
        <div className="lvl-tb-mode">
          {mode.symbol} {mode.name}
        </div>
      )}
      <div className="lvl-tb-stats">
        <span>
          <span className="lvl-tb-stat-num">{completedLevels.length}</span>/7
        </span>
        <span>
          <span className="lvl-tb-stat-num">{keys.length}</span> ключі
        </span>
      </div>
    </div>
  );
}
