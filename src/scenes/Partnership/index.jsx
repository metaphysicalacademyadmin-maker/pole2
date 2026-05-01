import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { generateCode, normalizeCode, partnerFromCode } from '../../utils/partnership.js';
import { showToast } from '../../components/GlobalToast.jsx';
import PartnerView from './PartnerView.jsx';
import './styles.css';

// Партнерство — двоє гравців підключаються по коду.
// Без бекенду: партнер генерується детерміновано з хешу коду.
//
// Стани сцени:
//  1. start   — обираємо «створити код» або «ввести код партнера»
//  2. created — показуємо мій код для надсилання
//  3. paired  — обидва коди є → активна сесія партнерства

export default function Partnership({ onClose }) {
  const partnership = useGameStore((s) => s.partnership);
  const sessionId = useGameStore((s) => s.sessionId);
  const generateMy = useGameStore((s) => s.generateMyPartnershipCode);
  const enterPartner = useGameStore((s) => s.enterPartnerCode);
  const exitP = useGameStore((s) => s.exitPartnership);

  const [phase, setPhase] = useState(() =>
    partnership?.partnerCode ? 'paired'
      : partnership?.myCode ? 'created'
      : 'start',
  );
  const [partnerInput, setPartnerInput] = useState('');

  function handleGenerate() {
    const code = generateCode(`${sessionId}-${Date.now()}`);
    generateMy(code);
    setPhase('created');
    showToast('код створено · скопіюй і надішли партнеру', 'success');
  }

  function handleEnter() {
    const norm = normalizeCode(partnerInput);
    if (!norm) {
      showToast('код некоректний · має бути 6 символів', 'warning');
      return;
    }
    if (norm === partnership?.myCode) {
      showToast('це твій код · введи код партнера', 'warning');
      return;
    }
    const partnerData = partnerFromCode(norm);
    if (!partnership?.myCode) {
      // Створюємо свій теж — щоб обидва були
      generateMy(generateCode(`${sessionId}-${Date.now()}-mine`));
    }
    enterPartner(norm, partnerData);
    setPhase('paired');
    showToast(`партнерство активоване з ${partnerData.name}`, 'success');
  }

  function handleExit() {
    if (!window.confirm('Завершити партнерство? Спільні відповіді залишаться у журналі.')) return;
    exitP();
    setPhase('start');
    showToast('партнерство завершено', 'info');
  }

  function copyMyCode() {
    if (!partnership?.myCode) return;
    navigator.clipboard?.writeText(partnership.myCode).catch(() => {});
    showToast('код скопійовано', 'success');
  }

  return (
    <main className="part-overlay">
      <div className="part-frame">
        <button type="button" className="part-close" onClick={onClose}>← повернутись</button>
        <div className="part-eyebrow">👯 партнерство</div>
        <h1 className="part-title">Двоє у полі</h1>
        <p className="part-subtitle">
          Не для романтики — для глибокої роботи поряд. Партнери, друзі, мати-донька.
          Підключіться по коду — і пройдіть 7 спільних питань разом.
        </p>

        {phase === 'start' && (
          <StartView
            onGenerate={handleGenerate}
            partnerInput={partnerInput}
            setPartnerInput={setPartnerInput}
            onEnter={handleEnter}
          />
        )}

        {phase === 'created' && (
          <CreatedView
            myCode={partnership?.myCode}
            onCopy={copyMyCode}
            partnerInput={partnerInput}
            setPartnerInput={setPartnerInput}
            onEnter={handleEnter}
          />
        )}

        {phase === 'paired' && (
          <PartnerView
            partnership={partnership}
            onExit={handleExit}
          />
        )}
      </div>
    </main>
  );
}

function StartView({ onGenerate, partnerInput, setPartnerInput, onEnter }) {
  return (
    <div className="part-start">
      <div className="part-option">
        <div className="part-option-symbol">⊕</div>
        <h3>створити код для партнера</h3>
        <p>Згенеруй унікальний код. Надішли його партнеру у месенджері.</p>
        <button type="button" className="part-btn part-btn-primary" onClick={onGenerate}>
          створити мій код
        </button>
      </div>

      <div className="part-divider"><span>або</span></div>

      <div className="part-option">
        <div className="part-option-symbol">⊙</div>
        <h3>ввести код партнера</h3>
        <p>Якщо партнер уже надіслав тобі код — введи його сюди.</p>
        <div className="part-code-input-wrap">
          <input type="text" className="part-code-input"
            placeholder="ABC-123"
            value={partnerInput}
            onChange={(e) => setPartnerInput(e.target.value.toUpperCase())}
            maxLength={7} />
          <button type="button" className="part-btn part-btn-primary" onClick={onEnter}
            disabled={!partnerInput}>
            підключитись →
          </button>
        </div>
      </div>
    </div>
  );
}

function CreatedView({ myCode, onCopy, partnerInput, setPartnerInput, onEnter }) {
  return (
    <div className="part-created">
      <div className="part-mycode-block">
        <div className="part-label">твій код</div>
        <div className="part-mycode" onClick={onCopy} title="клікни щоб скопіювати">
          {myCode}
        </div>
        <div className="part-mycode-hint">клікни щоб скопіювати · надішли партнеру</div>
      </div>

      <div className="part-waiting">
        ⏳ <em>чекаємо на код партнера…</em>
      </div>

      <div className="part-option">
        <h3>або введи код партнера сюди</h3>
        <div className="part-code-input-wrap">
          <input type="text" className="part-code-input"
            placeholder="ABC-123"
            value={partnerInput}
            onChange={(e) => setPartnerInput(e.target.value.toUpperCase())}
            maxLength={7} />
          <button type="button" className="part-btn part-btn-primary" onClick={onEnter}
            disabled={!partnerInput}>
            підключитись →
          </button>
        </div>
      </div>
    </div>
  );
}
