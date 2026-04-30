import { useGameStore } from '../../store/gameStore.js';
import { levelByNumber } from '../../data/levels.js';
import VoiceRecorder from '../../components/VoiceRecorder.jsx';
import './styles.css';

// Сцена Key — церемоніальний перехід між рівнями.
// Гравець бачить світлову кулю, цитату Арбітра, фразу-ключ → клікає «йти далі»
// → claimKey → currentLevel++.
export default function Key() {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const claimKey = useGameStore((s) => s.claimKey);
  const lvl = levelByNumber(currentLevel);
  const isFinal = currentLevel === 7;

  function handleClaim() {
    claimKey(currentLevel, lvl.keyText);
  }

  return (
    <main className="scene">
      <div className="key-frame">
        <div className="key-eyebrow">
          рівень {currentLevel} · ключ
        </div>

        <h1 className="key-title">{lvl.name}</h1>
        <div className="key-sub">{lvl.sub}</div>

        <div className="key-orb-wrap">
          <div className="key-orb" />
        </div>

        <p className="key-arbiter">
          Ти зібрав усі елементи цього рівня. Поле дає тобі ключ —
          слова, які залишаться у тілі.
        </p>

        <p className="key-text">«{lvl.keyText}»</p>

        <VoiceRecorder keyN={`level-${currentLevel}`}
          label="голос душі — необов'язково" />

        <div className="key-actions">
          <button type="button" className="btn btn-primary" onClick={handleClaim}>
            {isFinal ? 'до Карти Втілення →' : 'йти далі →'}
          </button>
        </div>
      </div>
    </main>
  );
}
