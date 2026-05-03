import { useState } from 'react';
import { MENTAL_CODE_CATEGORIES, SCORE_LABELS } from '../../data/mental-code.js';

// Послідовне проходження по 7 категоріях × 3-4 питання = 21-28 кроків.
// На кожному — slider/buttons 1-5. Авто-перехід після вибору.
export default function MentalCodeRunner({ onComplete, onCancel }) {
  const [catIdx, setCatIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  const cat = MENTAL_CODE_CATEGORIES[catIdx];
  const question = cat.questions[qIdx];
  const totalQuestions = MENTAL_CODE_CATEGORIES.reduce((sum, c) => sum + c.questions.length, 0);
  const answeredCount = Object.values(answers).reduce((sum, a) => sum + Object.keys(a).length, 0);

  function handleAnswer(value) {
    const next = {
      ...answers,
      [cat.id]: { ...(answers[cat.id] || {}), [qIdx]: value },
    };
    setAnswers(next);

    // Перехід далі
    if (qIdx < cat.questions.length - 1) {
      setQIdx(qIdx + 1);
    } else if (catIdx < MENTAL_CODE_CATEGORIES.length - 1) {
      setCatIdx(catIdx + 1);
      setQIdx(0);
    } else {
      // Завершення — рахуємо середні
      const result = {};
      for (const c of MENTAL_CODE_CATEGORIES) {
        const catAns = next[c.id] || {};
        const vals = Object.values(catAns);
        result[c.id] = vals.length > 0
          ? vals.reduce((s, v) => s + v, 0) / vals.length
          : 3;
      }
      onComplete(result);
    }
  }

  return (
    <div className="mc-overlay" role="dialog" aria-modal="true">
      <div className="mc-frame mc-runner">
        <button type="button" className="mc-close" onClick={onCancel}>← скасувати</button>

        <div className="mc-runner-progress">
          <div className="mc-progress-bar">
            <div className="mc-progress-fill"
              style={{
                width: `${(answeredCount / totalQuestions) * 100}%`,
                background: cat.color,
              }} />
          </div>
          <div className="mc-progress-text">
            {answeredCount + 1} / {totalQuestions}
          </div>
        </div>

        <div className="mc-cat-header" style={{ borderColor: `${cat.color}66` }}>
          <span className="mc-cat-icon" style={{ color: cat.color }}>{cat.icon}</span>
          <div className="mc-cat-text">
            <div className="mc-cat-name" style={{ color: cat.color }}>{cat.name}</div>
            <div className="mc-cat-short">{cat.short}</div>
          </div>
        </div>

        <div className="mc-question">{question}</div>

        <div className="mc-scale">
          {SCORE_LABELS.map((s) => (
            <button key={s.value} type="button"
              className="mc-scale-btn"
              onClick={() => handleAnswer(s.value)}
              style={{ '--accent': cat.color }}>
              <span className="mc-scale-dot">{s.short}</span>
              <span className="mc-scale-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
