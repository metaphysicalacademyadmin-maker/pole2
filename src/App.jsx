import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore.js';
import PathMode from './scenes/PathMode/index.jsx';
import Entry from './scenes/Entry/index.jsx';
import Level from './scenes/Level/index.jsx';
import Key from './scenes/Key/index.jsx';
import Constellation from './scenes/Constellation/index.jsx';
import SoulField from './scenes/SoulField/index.jsx';
import Final from './scenes/Final/index.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import GlobalToast from './components/GlobalToast.jsx';
import KaiBubble from './components/Kai/KaiBubble.jsx';
import ArbiterModal from './components/Arbiter/ArbiterModal.jsx';
import AntypModal from './components/Antyp/AntypModal.jsx';
import { detectCharacter } from './utils/character-detector.js';

// Роутер + персонажі (Кай / Антип / Арбітр) як overlay-шар.
export default function App() {
  const pathMode = useGameStore((s) => s.pathMode);
  const intention = useGameStore((s) => s.intention);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const awaitingKey = useGameStore((s) => s.awaitingKey);
  const constellations = useGameStore((s) => s.constellations);
  const cellAnswers = useGameStore((s) => s.cellAnswers);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const recordArbiterAppearance = useGameStore((s) => s.recordArbiterAppearance);
  const recordAntypChallenge = useGameStore((s) => s.recordAntypChallenge);

  const [soulFieldOpen, setSoulFieldOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);

  // Стежимо за змінами cellAnswers/completedLevels — викликаємо персонажа.
  useEffect(() => {
    if (!pathMode || !intention || activeCharacter) return;
    const state = useGameStore.getState();
    const result = detectCharacter(state, { type: 'auto' });
    if (result) setActiveCharacter(result);
  }, [cellAnswers, completedLevels, constellations, pathMode, intention, activeCharacter]);

  function handleArbiterClose() {
    if (activeCharacter?.character === 'arbiter') {
      recordArbiterAppearance(activeCharacter.payload.id);
    }
    setActiveCharacter(null);
  }

  function handleAntypChoice(opt) {
    if (activeCharacter?.character === 'antyp') {
      recordAntypChallenge(activeCharacter.payload.id, opt.id, opt);
      // Якщо обрано «прийняти» — після Антипа з'являється Арбітр
      if (opt.arbiterTrigger) {
        setTimeout(() => {
          const state = useGameStore.getState();
          const result = detectCharacter(state, { type: 'antyp_accepted' });
          if (result) setActiveCharacter(result);
        }, 800);
        return;
      }
    }
    setActiveCharacter(null);
  }

  return (
    <div className="app">
      <div className="cosmos-bg" />
      <div className="cosmos-stars" />
      <ErrorBoundary>
        {soulFieldOpen
          ? <SoulField onClose={() => setSoulFieldOpen(false)} />
          : pickScene({ pathMode, intention, currentLevel, awaitingKey, constellations, openSoulField: () => setSoulFieldOpen(true) })}
      </ErrorBoundary>
      <GlobalToast />
      {pathMode && intention && !soulFieldOpen && !activeCharacter && <KaiBubble />}

      {activeCharacter?.character === 'arbiter' && (
        <ArbiterModal line={activeCharacter.payload} onClose={handleArbiterClose} />
      )}
      {activeCharacter?.character === 'antyp' && (
        <AntypModal provocation={activeCharacter.payload}
          onChoice={handleAntypChoice}
          onClose={() => setActiveCharacter(null)} />
      )}
    </div>
  );
}

function pickScene({ pathMode, intention, currentLevel, awaitingKey, constellations, openSoulField }) {
  if (!pathMode) return <PathMode />;
  if (!intention) return <Entry />;
  if (currentLevel > 7) return <Final />;
  if (awaitingKey) {
    if (currentLevel === 3 && !(constellations[3]?.resolution)) {
      return <Constellation />;
    }
    return <Key />;
  }
  return <Level openSoulField={openSoulField} />;
}
