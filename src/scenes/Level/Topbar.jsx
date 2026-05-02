import { useGameStore } from '../../store/gameStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import { PATH_MODES } from '../../data/pathmodes.js';
import FieldNow from '../../components/panels/FieldNow.jsx';
import ThemeToggle from '../../components/panels/ThemeToggle.jsx';
import HelpButton from '../../components/panels/HelpButton.jsx';
import '../../components/panels/panels.css';

// Топбар — лого, режим, FieldNow (інтегральне поле), лічильники.
export default function Topbar({ onOpenSoulField }) {
  const pathMode = useGameStore((s) => s.pathMode);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const keys = useGameStore((s) => s.keys);
  const firstName = useProfileStore((s) => s.profile?.firstName);
  const mode = pathMode ? PATH_MODES[pathMode] : null;

  return (
    <div className="lvl-tb">
      <div className="lvl-tb-logo">
        Поле · Втілення
        {firstName && (
          <span style={{ marginLeft: 10, opacity: 0.65, fontWeight: 400 }}>
            ✦ {firstName}
          </span>
        )}
      </div>
      {mode && (
        <div className="lvl-tb-mode">
          {mode.symbol} {mode.name}
        </div>
      )}
      <FieldNow onOpen={onOpenSoulField} />
      <ThemeToggle />
      <HelpButton />
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
