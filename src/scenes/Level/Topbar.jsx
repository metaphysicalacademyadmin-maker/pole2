import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import { PATH_MODES } from '../../data/pathmodes.js';
import FieldNow from '../../components/panels/FieldNow.jsx';
import HelpButton from '../../components/panels/HelpButton.jsx';
import PresenceButton from '../../components/FieldPresence/PresenceButton.jsx';
import PresenceModal from '../../components/FieldPresence/PresenceModal.jsx';
import ChakraPassage from '../../components/ChakraPassage/index.jsx';
import { passageForLevel } from '../../data/methodichka-chakras.js';
import '../../components/panels/panels.css';

// Топбар — лого, режим, FieldNow (інтегральне поле), лічильники, присутність, медитації.
export default function Topbar({ onOpenSoulField, onOpenCabinet, onOpenMeditations }) {
  const [presenceOpen, setPresenceOpen] = useState(false);
  const [passageOpen, setPassageOpen] = useState(false);
  const pathMode = useGameStore((s) => s.pathMode);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const keys = useGameStore((s) => s.keys);
  const firstName = useProfileStore((s) => s.profile?.firstName);
  const mode = pathMode ? PATH_MODES[pathMode] : null;
  const hasPassage = !!passageForLevel(currentLevel);

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
      <PresenceButton onClick={() => setPresenceOpen(true)} />
      {hasPassage && (
        <button type="button" className="lvl-tb-cab-btn"
          onClick={() => setPassageOpen(true)}
          title="з методички академії — про цю чакру"
          aria-label="З методички академії">
          📖
        </button>
      )}
      {onOpenMeditations && (
        <button type="button" className="lvl-tb-cab-btn" onClick={onOpenMeditations}
          title="медитації з академії" aria-label="Відкрити медитації з академії">
          🎧
        </button>
      )}
      {onOpenCabinet && (
        <button type="button" className="lvl-tb-cab-btn" onClick={onOpenCabinet}
          title="особистий кабінет" aria-label="Відкрити особистий кабінет">
          👤
        </button>
      )}
      <HelpButton />
      <div className="lvl-tb-stats">
        <span>
          <span className="lvl-tb-stat-num">{completedLevels.length}</span>/7
        </span>
        <span>
          <span className="lvl-tb-stat-num">{keys.length}</span> ключі
        </span>
      </div>
      {presenceOpen && <PresenceModal onClose={() => setPresenceOpen(false)} />}
      {passageOpen && (
        <ChakraPassage levelN={currentLevel}
          onClose={() => setPassageOpen(false)} />
      )}
    </div>
  );
}
