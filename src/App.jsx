import { useGameStore } from './store/gameStore.js';
import PathMode from './scenes/PathMode/index.jsx';
import Entry from './scenes/Entry/index.jsx';
import Level from './scenes/Level/index.jsx';
import Key from './scenes/Key/index.jsx';
import Constellation from './scenes/Constellation/index.jsx';
import Final from './scenes/Final/index.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import GlobalToast from './components/GlobalToast.jsx';
import KaiBubble from './components/Kai/KaiBubble.jsx';

// Роутер сцен — деривативний від state.
//
//  pathMode == null              → PathMode (вибір шляху)
//  intention == ''               → Entry (намір)
//  currentLevel > 7              → Final (карта втілення)
//  awaitingKey == true           → Key (церемонія між рівнями)
//  інакше                        → Level (робочий екран)
export default function App() {
  const pathMode = useGameStore((s) => s.pathMode);
  const intention = useGameStore((s) => s.intention);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const awaitingKey = useGameStore((s) => s.awaitingKey);
  const constellations = useGameStore((s) => s.constellations);

  return (
    <div className="app">
      <div className="cosmos-bg" />
      <div className="cosmos-stars" />
      <ErrorBoundary>
        {pickScene({ pathMode, intention, currentLevel, awaitingKey, constellations })}
      </ErrorBoundary>
      <GlobalToast />
      {pathMode && intention && <KaiBubble />}
    </div>
  );
}

// Логіка перемикання сцен:
//  - на рівні 3 після всіх клітинок → спершу Constellation, далі Key
function pickScene({ pathMode, intention, currentLevel, awaitingKey, constellations }) {
  if (!pathMode) return <PathMode />;
  if (!intention) return <Entry />;
  if (currentLevel > 7) return <Final />;
  if (awaitingKey) {
    if (currentLevel === 3 && !(constellations[3]?.resolution)) {
      return <Constellation />;
    }
    return <Key />;
  }
  return <Level />;
}
