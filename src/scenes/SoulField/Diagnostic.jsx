import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { findBody, questionsForBody } from '../../data/subtle-bodies.js';
import { showToast } from '../../components/GlobalToast.jsx';

// Модальне вікно діагностики — 5 питань на одне тіло.
// Сума балів / max * 100 → integrity score → recordBodyMeasurement.
export default function Diagnostic({ bodyId, onClose }) {
  const recordBodyMeasurement = useGameStore((s) => s.recordBodyMeasurement);
  const body = findBody(bodyId);
  const questions = questionsForBody(bodyId);
  const [step, setStep] = useState(0);
  const [collected, setCollected] = useState(0);

  if (!body || questions.length === 0) return null;

  function handleSelect(score) {
    const newCollected = collected + score;
    if (step < questions.length - 1) {
      setCollected(newCollected);
      setStep(step + 1);
    } else {
      // Фініш: max = questions.length * 10
      const maxScore = questions.length * 10;
      const integrity = Math.round((newCollected / maxScore) * 100);
      recordBodyMeasurement(bodyId, integrity);
      showToast(`${body.name}: ${integrity}/100`, integrity >= 60 ? 'success' : 'info', 2400);
      onClose();
    }
  }

  const q = questions[step];

  return (
    <div className="sf-diag-overlay" onClick={onClose}>
      <div className="sf-diag-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sf-diag-eyebrow" style={{ color: body.color }}>
          діагностика · {body.name}
        </div>
        <div className="sf-diag-question">{q.q}</div>
        <div className="sf-diag-options">
          {q.options.map((opt, i) => (
            <button key={i} className="sf-diag-option"
              onClick={() => handleSelect(opt.score)}>
              {opt.text}
            </button>
          ))}
        </div>
        <div className="sf-diag-progress">
          {step + 1} / {questions.length}
        </div>
      </div>
    </div>
  );
}
