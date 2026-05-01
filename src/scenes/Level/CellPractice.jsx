import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { showToast } from '../../components/GlobalToast.jsx';
import { promptForBarometer } from '../../data/cell-key-words.js';

// Практика ключових слів усередині клітинки.
// 3 кроки: виміряти ауру (см) → промовити фразу + 3 слова → виміряти знову.
// Δ записується у state.auraReadings → візуалізується на Aura.jsx.

const MIN_CM = 30;
const MAX_CM = 150;
const DEFAULT_CM = 70;

export default function CellPractice({ cell, levelN, barometer, onDone, onSkip }) {
  const recordAuraReading = useGameStore((s) => s.recordAuraReading);
  const [step, setStep] = useState('before');     // before | practice | after | done
  const [before, setBefore] = useState(DEFAULT_CM);
  const [after, setAfter] = useState(DEFAULT_CM);
  const [words, setWords] = useState(['', '', '']);
  const [chosen, setChosen] = useState(null);

  const prompt = promptForBarometer(barometer);

  function commitReading() {
    const keyword = chosen != null ? words[chosen] : '';
    recordAuraReading({ cellId: cell.id, levelN, before, after, keyword });
    const delta = after - before;
    showToast(`Δ ${delta > 0 ? '+' : ''}${delta} см аури`, delta >= 0 ? 'success' : 'info');
    setStep('done');
    setTimeout(onDone, 1400);
  }

  if (step === 'before') {
    return (
      <PracticeFrame title="1. Виміряй ауру зараз" subtitle="Простягни руки. Відчуй межу свого поля. Введи приблизне значення в см">
        <CmSlider value={before} onChange={setBefore} />
        <div className="cp-actions">
          <button type="button" className="cp-btn-skip" onClick={onSkip}>пропустити практику</button>
          <button type="button" className="cp-btn-primary" onClick={() => setStep('practice')}>далі →</button>
        </div>
      </PracticeFrame>
    );
  }

  if (step === 'practice') {
    const filled = words.filter((w) => w.trim()).length;
    return (
      <PracticeFrame title="2. Ключові слова" subtitle={prompt.hint}>
        <div className="cp-phrase">«{prompt.phrase}»</div>
        <div className="cp-instructions">
          Промов фразу повільно — як мантру. Запиши перші 3 слова що приходять без цензури.
        </div>
        <div className="cp-words">
          {words.map((w, i) => (
            <input key={i} type="text" className="cp-word-input"
              placeholder={`слово ${i + 1}`}
              value={w}
              maxLength={40}
              onChange={(e) => {
                const next = [...words];
                next[i] = e.target.value;
                setWords(next);
              }}
            />
          ))}
        </div>
        {filled >= 2 && (
          <>
            <div className="cp-pick-label">↓ Обери одне — те що відгукується найсильніше у тілі</div>
            <div className="cp-word-picks">
              {words.map((w, i) => w.trim() && (
                <button key={i} type="button"
                  className={`cp-word-pick${chosen === i ? ' chosen' : ''}`}
                  onClick={() => setChosen(i)}>
                  {w}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="cp-actions">
          {filled >= 2 && chosen == null && (
            <span className="cp-hint-pick">↑ обери слово щоб продовжити</span>
          )}
          <button type="button" className="cp-btn-primary"
            disabled={chosen == null}
            onClick={() => setStep('after')}>
            далі →
          </button>
        </div>
      </PracticeFrame>
    );
  }

  if (step === 'after') {
    return (
      <PracticeFrame title="3. Виміряй ауру знову" subtitle="Не аналізуй — просто відчуй межу зараз. Можливо вона змінилась.">
        <CmSlider value={after} onChange={setAfter} />
        <div className="cp-delta-preview">
          {after === before ? '—' : (after - before > 0 ? `+${after - before}` : `${after - before}`)} см
        </div>
        <div className="cp-actions">
          <button type="button" className="cp-btn-primary" onClick={commitReading}>записати</button>
        </div>
      </PracticeFrame>
    );
  }

  // done
  const delta = after - before;
  return (
    <PracticeFrame title={delta > 0 ? '✦ Поле розширилось' : delta < 0 ? '◌ Поле стиснулось — теж відповідь' : '· Поле стале'}
      subtitle={`«${chosen != null ? words[chosen] : ''}» — твій ключ цієї клітинки`}>
      <div className="cp-final">
        <span className="cp-final-cm">{before}</span>
        <span className="cp-final-arrow">→</span>
        <span className="cp-final-cm cp-final-after">{after}</span>
        <span className="cp-final-unit">см</span>
      </div>
    </PracticeFrame>
  );
}

function PracticeFrame({ title, subtitle, children }) {
  return (
    <div className="cell-practice">
      <div className="cp-title">{title}</div>
      {subtitle && <div className="cp-subtitle">{subtitle}</div>}
      {children}
    </div>
  );
}

function CmSlider({ value, onChange }) {
  return (
    <div className="cp-slider-wrap">
      <input type="range" className="cp-slider"
        min={MIN_CM} max={MAX_CM} step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="cp-slider-value">
        <span className="cp-cm">{value}</span><span className="cp-unit"> см</span>
      </div>
    </div>
  );
}
