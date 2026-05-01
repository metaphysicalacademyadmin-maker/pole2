import { useState, useEffect, useRef } from 'react';
import { useGameStore } from './store/gameStore.js';
import { useProfileStore } from './store/profileStore.js';
import PathMode from './scenes/PathMode/index.jsx';
import Entry from './scenes/Entry/index.jsx';
import Level from './scenes/Level/index.jsx';
import Key from './scenes/Key/index.jsx';
import Constellation from './scenes/Constellation/index.jsx';
import SoulField from './scenes/SoulField/index.jsx';
import Final from './scenes/Final/index.jsx';
import Petals from './scenes/Petals/index.jsx';
import Cosmo from './scenes/Cosmo/index.jsx';
import Admin from './scenes/Admin/index.jsx';
import Partnership from './scenes/Partnership/index.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import GlobalToast from './components/GlobalToast.jsx';
import KaiBubble from './components/Kai/KaiBubble.jsx';
import ArbiterModal from './components/Arbiter/ArbiterModal.jsx';
import AntypModal from './components/Antyp/AntypModal.jsx';
import MirrorModal from './components/Mirror/MirrorModal.jsx';
import KoanCard from './components/Koan/KoanCard.jsx';
import OnboardingFlow from './components/Onboarding/OnboardingFlow.jsx';
import ResonanceMirror from './components/ResonanceMirror/index.jsx';
import { detectCharacter } from './utils/character-detector.js';
import { pickMirrorReflection } from './data/mirror.js';
import { pickKoan } from './data/koans.js';

// App routing + 4 персонажі (Кай / Антип / Арбітр / Дзеркало) + Коани як overlay.
// Soft / Dark theme через data-theme на root.
export default function App() {
  const pathMode = useGameStore((s) => s.pathMode);
  const intention = useGameStore((s) => s.intention);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const awaitingKey = useGameStore((s) => s.awaitingKey);
  const constellations = useGameStore((s) => s.constellations);
  const cellAnswers = useGameStore((s) => s.cellAnswers);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const petalsActive = useGameStore((s) => s.petalsActive);
  const themeMode = useGameStore((s) => s.themeMode);
  const onboardingDone = useGameStore((s) => s.onboardingDone);
  const completeOnboarding = useGameStore((s) => s.completeOnboarding);
  const recordArbiterAppearance = useGameStore((s) => s.recordArbiterAppearance);
  const recordAntypChallenge = useGameStore((s) => s.recordAntypChallenge);
  const recordMirrorAppearance = useGameStore((s) => s.recordMirrorAppearance);

  const [soulFieldOpen, setSoulFieldOpen] = useState(false);
  const [cosmoOpen, setCosmoOpen] = useState(false);
  const [partnershipOpen, setPartnershipOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(() =>
    typeof window !== 'undefined' && window.location.search.includes('admin=true')
  );
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [mirror, setMirror] = useState(null);
  const [koan, setKoan] = useState(null);
  const lastAnswerCount = useRef(0);

  // Apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode || 'dark');
  }, [themeMode]);

  // Завантажуємо профіль зареєстрованого юзера (з metaphysical-way.academy).
  // Тиха помилка якщо щось не так — гра працює і без імені.
  useEffect(() => {
    useProfileStore.getState().load();
  }, []);

  // Detect Антип/Арбітр
  useEffect(() => {
    if (!pathMode || !intention || activeCharacter || mirror) return;
    const state = useGameStore.getState();
    const result = detectCharacter(state, { type: 'auto' });
    if (result) setActiveCharacter(result);
  }, [cellAnswers, completedLevels, constellations, pathMode, intention, activeCharacter, mirror]);

  // Detect Mirror (~25% chance after custom answer) і Koan (~15% after answer)
  useEffect(() => {
    const count = Object.keys(cellAnswers || {}).length;
    if (count <= lastAnswerCount.current) return;
    lastAnswerCount.current = count;

    const last = Object.values(cellAnswers || {}).reduce(
      (a, b) => (!a || (b.ts > a.ts) ? b : a), null
    );
    if (!last) return;

    // Mirror after custom answer
    if (last.customText && Math.random() < 0.5 && !activeCharacter) {
      const refl = pickMirrorReflection(last.customText, last.ts);
      setTimeout(() => {
        if (!useGameStore.getState().activeCharacter) {
          setMirror(refl);
          recordMirrorAppearance(refl.id, 'shown');
        }
      }, 1500);
      return;
    }

    // Koan as random gift (15% chance, after deep answers)
    if (last.depth === 'deep' && Math.random() < 0.2 && !activeCharacter) {
      setTimeout(() => setKoan(pickKoan(last.ts)), 2000);
    }
  }, [cellAnswers, activeCharacter, recordMirrorAppearance]);

  function handleArbiterClose() {
    if (activeCharacter?.character === 'arbiter') {
      recordArbiterAppearance(activeCharacter.payload.id);
    }
    setActiveCharacter(null);
  }

  function handleAntypChoice(opt) {
    if (activeCharacter?.character === 'antyp') {
      recordAntypChallenge(activeCharacter.payload.id, opt.id, opt);
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
          : pickScene({ pathMode, intention, currentLevel, awaitingKey, constellations, petalsActive,
              openSoulField: () => setSoulFieldOpen(true),
              openCosmo: () => setCosmoOpen(true),
              openAdmin: () => setAdminOpen(true),
              openPartnership: () => setPartnershipOpen(true) })}
      </ErrorBoundary>
      <GlobalToast />
      {pathMode && intention && !soulFieldOpen && !activeCharacter && !mirror && <KaiBubble />}

      {koan && <KoanCard koan={koan} onClose={() => setKoan(null)} />}
      {activeCharacter?.character === 'arbiter' && (
        <ArbiterModal line={activeCharacter.payload} onClose={handleArbiterClose} />
      )}
      {activeCharacter?.character === 'antyp' && (
        <AntypModal provocation={activeCharacter.payload}
          onChoice={handleAntypChoice}
          onClose={() => setActiveCharacter(null)} />
      )}
      {mirror && <MirrorModal reflection={mirror} onClose={() => setMirror(null)} />}
      {!onboardingDone && <OnboardingFlow onComplete={completeOnboarding} />}
      {cosmoOpen && <Cosmo onClose={() => setCosmoOpen(false)} />}
      {adminOpen && <Admin onClose={() => setAdminOpen(false)} />}
      {partnershipOpen && <Partnership onClose={() => setPartnershipOpen(false)} />}
      <ResonanceMirror />
    </div>
  );
}

export function useCosmoOpener() {
  // Helper для дочірніх сцен — щоб відкрити cosmo з будь-якого місця.
  // Поки не використовується, зарезервовано.
  return null;
}

function pickScene({ pathMode, intention, currentLevel, awaitingKey, constellations, petalsActive,
                    openSoulField, openCosmo, openAdmin, openPartnership }) {
  if (!pathMode) return <PathMode />;
  if (!intention) return <Entry />;
  if (currentLevel > 7) {
    if (petalsActive) return <Petals />;
    return <Final openCosmo={openCosmo} openAdmin={openAdmin} openPartnership={openPartnership} />;
  }
  if (awaitingKey) {
    if (currentLevel === 3 && !(constellations[3]?.resolution)) {
      return <Constellation />;
    }
    return <Key />;
  }
  return <Level openSoulField={openSoulField} openCosmo={openCosmo} openPartnership={openPartnership} />;
}
