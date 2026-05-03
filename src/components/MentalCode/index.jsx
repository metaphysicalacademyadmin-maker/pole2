import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import { MENTAL_CODE_CATEGORIES } from '../../data/mental-code.js';
import MentalCodeRunner from './Runner.jsx';
import MentalCodeResult from './Result.jsx';
import './styles.css';

// Ментальний Код — діагностика 7 категорій кодів свідомості.
// Гравець проходить серію питань → отримує радар-діаграму + рекомендації.
//
// 3 стани: intro → runner → result
export default function MentalCode({ onClose }) {
  const trackUsage = useGameStore((s) => s.trackToolUsage);
  const existing = useGameStore((s) => s.mentalCode);
  const saveMentalCode = useGameStore((s) => s.saveMentalCode);
  const [stage, setStage] = useState(existing ? 'result' : 'intro');

  useOverlayA11y(onClose);

  function handleStart() {
    trackUsage('mental-code');
    setStage('runner');
  }

  function handleComplete(scores) {
    saveMentalCode(scores);
    setStage('result');
  }

  if (stage === 'runner') {
    return <MentalCodeRunner onComplete={handleComplete}
      onCancel={() => setStage(existing ? 'result' : 'intro')} />;
  }

  if (stage === 'result' && existing) {
    return <MentalCodeResult scores={existing}
      onRetake={() => setStage('runner')}
      onClose={onClose} />;
  }

  // Intro
  return (
    <div className="mc-overlay" role="dialog" aria-modal="true">
      <div className="mc-frame">
        <button type="button" className="mc-close" onClick={onClose}>← повернутись</button>

        <div className="mc-intro">
          <div className="mc-eyebrow">діагностика</div>
          <h2 className="mc-title">Ментальний Код</h2>
          <p className="mc-sub">
            7 категорій кодів свідомості що визначають твій спосіб життя.
            Чесна самооцінка → радар твоєї матриці → точки росту.
          </p>

          <div className="mc-categories-preview">
            {MENTAL_CODE_CATEGORIES.map((c) => (
              <div key={c.id} className="mc-cat-mini" style={{ borderColor: `${c.color}55` }}>
                <span className="mc-cat-mini-icon" style={{ color: c.color }}>{c.icon}</span>
                <span className="mc-cat-mini-name">{c.name}</span>
              </div>
            ))}
          </div>

          <div className="mc-note">
            <strong>Важливо:</strong> це не «тест на правильність» — це дзеркало.
            Чим чесніша відповідь, тим точніше дзеркало. Зайве ~7 хвилин.
          </div>

          <button type="button" className="mc-btn mc-btn-primary"
            onClick={handleStart}>
            ✦ почати діагностику
          </button>
        </div>
      </div>
    </div>
  );
}
