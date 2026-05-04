import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ELEMENTS, RITUAL_STEPS } from '../../data/elements.js';

// Сесія однієї стихії: 5 кроків ритуалу + завершення з рефлексією.
export default function ElementSession({ elementId, onComplete, onCancel }) {
  const element = ELEMENTS.find((e) => e.id === elementId);
  const saveRitual = useGameStore((s) => s.saveElementRitual);
  const [stepIdx, setStepIdx] = useState(0);
  const [reflection, setReflection] = useState('');

  if (!element) return null;

  const isLastStep = stepIdx === RITUAL_STEPS.length - 1;
  const step = RITUAL_STEPS[stepIdx];

  function handleNext() {
    if (isLastStep) {
      saveRitual(elementId, reflection.trim());
      onComplete();
    } else {
      setStepIdx(stepIdx + 1);
    }
  }

  return (
    <div className="el-overlay" role="dialog" aria-modal="true">
      <div className="el-frame el-session" style={{ '--el-color': element.color }}>
        <button type="button" className="el-close" onClick={onCancel}>← інші стихії</button>

        <div className="el-session-head">
          <div className="el-session-icon" style={{ color: element.color }}>{element.icon}</div>
          <h2 style={{ color: element.color }}>{element.name}</h2>
          <div className="el-session-essence">{element.essence}</div>
        </div>

        <div className="el-step-progress">
          {RITUAL_STEPS.map((s, i) => (
            <span key={s.id}
              className={`el-step-dot${i === stepIdx ? ' active' : ''}${i < stepIdx ? ' done' : ''}`} />
          ))}
        </div>

        <div className="el-step">
          <h3 className="el-step-title">{step.title}</h3>
          <p className="el-step-text">{step.text}</p>

          {step.id === 'intent' && (
            <div className="el-quote" style={{ borderLeftColor: element.color, color: element.color }}>
              «{element.intent}»
            </div>
          )}

          {step.id === 'visualization' && (
            <div className="el-visualization">
              <p className="el-vis-text">{element.visualization}</p>
              <div className="el-vis-circle" style={{ background: `radial-gradient(circle, ${element.color}55, transparent 70%)` }}>
                <span className="el-vis-icon" style={{ color: element.color }}>{element.icon}</span>
              </div>
              <p className="el-vis-hint">Дай 30-60 секунд тиші. Дай тілу часу.</p>
            </div>
          )}

          {step.id === 'observation' && (
            <textarea value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="що відчулось? (одне-два речення, можна пропустити)"
              rows={3} maxLength={300}
              className="el-reflection" />
          )}

          {step.id === 'integration' && (
            <div className="el-quote" style={{ borderLeftColor: element.color, color: element.color }}>
              «{element.integration}»
            </div>
          )}
        </div>

        <div className="el-shadow-note">
          <strong>Тінь стихії:</strong> {element.shadow}
        </div>

        <button type="button" className="el-btn-primary"
          onClick={handleNext}
          style={{ background: element.color }}>
          {isLastStep ? '✓ зберегти і завершити' : 'далі →'}
        </button>
      </div>
    </div>
  );
}
