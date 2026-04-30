import { useGameStore } from '../../store/gameStore.js';
import { PATH_MODES } from '../../data/pathmodes.js';
import FieldNow from '../../components/panels/FieldNow.jsx';
import '../../components/panels/panels.css';

// Топбар — лого, режим, FieldNow (інтегральне поле), лічильники.
export default function Topbar({ onOpenSoulField }) {
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
      <FieldNow onOpen={onOpenSoulField} />
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
