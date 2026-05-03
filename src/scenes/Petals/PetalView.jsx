import { useState, useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { BAROMETERS } from '../../data/barometers.js';
import { showToast } from '../../components/GlobalToast.jsx';
import DeepeningPhase from './DeepeningPhase.jsx';
import PetalComplete from './PetalComplete.jsx';
import BodyPhase from './BodyPhase.jsx';

const BAR_COLOR = Object.fromEntries(BAROMETERS.map((b) => [b.key, b.color]));

// Перегляд однієї пелюстки — клітинка має 3 фази замість 1:
//   1. ІНСТИНКТ — 3 опції + свій варіант (швидко)
//   2. ПОГЛИБЛЕННЯ — «а тепер чесніше: що ти приховав?» (custom)
//   3. ТІЛО — «де у тілі це зараз?» (одне слово)
// Це робить мандалу глибшою за піраміду — інстинкт+рефлексія+тіло.
//
// Phase 2 і 3 можна пропустити — вони НЕ блокують прогрес.
// Записуються у petalAnswers[cellId] як deepening + bodyMark.
export default function PetalView({ petal }) {
  const exitPetal = useGameStore((s) => s.exitPetal);
  const recordAnswer = useGameStore((s) => s.recordPetalAnswer);
  const progress = useGameStore((s) => s.petalProgress[petal.id]) || { answeredIds: [], completed: false };

  const total = petal.cells.length;
  const answered = progress.answeredIds || [];
  const nextIdx = petal.cells.findIndex((c) => !answered.includes(c.id));
  const allDone = nextIdx === -1 || progress.completed;
  const cell = !allDone ? petal.cells[nextIdx] : null;

  // Остання відповідь у пелюстці — для свідчення Арбітра
  const petalAnswers = useGameStore((s) => s.petalAnswers) || {};
  const lastAnswer = useMemo(() => {
    if (!allDone || !answered.length) return null;
    let latest = null;
    let latestTs = 0;
    for (const cId of answered) {
      const a = petalAnswers[`${petal.id}-${cId}`];
      if (a && (a.ts || 0) > latestTs) {
        latestTs = a.ts || 0;
        latest = a;
      }
    }
    return latest;
  }, [allDone, answered, petalAnswers, petal.id]);

  // Фази однієї клітинки
  const [phase, setPhase] = useState('instinct');
  const [instinct, setInstinct] = useState(null);   // { choice, barometer, delta, depth, customText }
  const [deepening, setDeepening] = useState('');
  const [bodyMark, setBodyMark] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState('');
  const [bodyMode, setBodyMode] = useState('word');     // 'word' | 'constellation'
  const [constellation, setConstellation] = useState(null);

  // Reset фази при переході на нову клітинку
  const cellId = cell?.id;
  const prevCellRef = useRef(cellId);
  useEffect(() => {
    if (prevCellRef.current !== cellId) {
      prevCellRef.current = cellId;
      resetPhase();
    }
  }, [cellId]);

  function resetPhase() {
    setPhase('instinct');
    setInstinct(null);
    setDeepening('');
    setBodyMark('');
    setCustomMode(false);
    setCustomText('');
    setBodyMode('word');
    setConstellation(null);
  }

  function handlePickOption(opt) {
    setInstinct({
      choice: opt.text,
      barometer: opt.barometer,
      delta: opt.delta,
      depth: opt.depth,
      shadow: opt.shadow || null,
      customText: null,
    });
    const sign = opt.delta >= 0 ? '+' : '';
    showToast(`${sign}${opt.delta} ${opt.barometer}`, opt.delta >= 0 ? 'success' : 'info');
    setTimeout(() => setPhase('deepening'), 700);
  }

  function handleCustomInstinct() {
    if (customText.trim().length < 5) {
      showToast('додай хоч кілька слів', 'warning');
      return;
    }
    // Custom = автоматично + до основного барометра пелюстки
    const fallbackBar = inferBarometer(petal);
    setInstinct({
      choice: '(свій варіант)',
      barometer: fallbackBar,
      delta: 3,
      depth: 'deep',
      customText: customText.trim(),
    });
    setCustomMode(false);
    showToast(`+3 ${fallbackBar} · своя відповідь`, 'success');
    setTimeout(() => setPhase('deepening'), 700);
  }

  function handleSaveAndAdvance(extra = {}) {
    if (!cell || !instinct) return;
    recordAnswer(petal.id, cell.id, total, {
      ...instinct,
      deepening: deepening.trim() || null,
      bodyMark: bodyMark.trim() || null,
      constellation: constellation || null,
      ...extra,
    });
    resetPhase();
  }

  return (
    <main className="scene petal-view">
      <div className="petal-frame">
        <button type="button" className="petal-back" onClick={exitPetal}>
          ← до мандали
        </button>

        <div className="petal-header" style={{
          background: `radial-gradient(ellipse at 50% 30%, ${petal.color}22, transparent 70%)`,
        }}>
          <div className="petal-roman" style={{
            color: petal.color,
            textShadow: `0 0 24px ${petal.color}, 0 0 48px ${petal.color}88`,
          }}>{petal.symbol}</div>
          <h2 className="petal-name" style={{
            color: petal.color,
            textShadow: `0 0 18px ${petal.color}66`,
          }}>{petal.name}</h2>
          <div className="petal-domain">{petal.domain}</div>
          <div className="petal-desc">{petal.description}</div>
        </div>

        <div className="petal-progress">
          {petal.cells.map((c, i) => {
            const done = answered.includes(c.id);
            const isCurrent = nextIdx === i;
            return (
              <span key={c.id}
                className={`petal-dot${done ? ' done' : ''}${isCurrent ? ' current' : ''}`}
                style={done ? { background: petal.color } : undefined} />
            );
          })}
          <span className="petal-progress-label">
            {answered.length} / {total}
          </span>
        </div>

        {allDone ? (
          <PetalComplete petal={petal} lastAnswer={lastAnswer} onExit={exitPetal} />
        ) : (
          <>
            <PhaseDots current={phase} />

            {phase === 'instinct' && (
              <div className="petal-cell">
                <div className="petal-phase-label">фаза 1 · інстинкт</div>
                <h3 className="petal-cell-title">{cell.title}</h3>
                <p className="petal-cell-question">{cell.question}</p>

                {customMode ? (
                  <CustomInput value={customText} setValue={setCustomText}
                    onSubmit={handleCustomInstinct}
                    onCancel={() => { setCustomMode(false); setCustomText(''); }}
                    placeholder="напиши своїми словами..."
                    submitLabel="↗ це і є моя відповідь"
                    color={petal.color} />
                ) : (
                  <>
                    <div className="petal-options">
                      {cell.options.map((opt, i) => {
                        const isShadow = opt.depth === 'shadow' || (typeof opt.delta === 'number' && opt.delta < 0);
                        const accent = isShadow ? '#7a5a78' : (BAR_COLOR[opt.barometer] || '#f0c574');
                        return (
                          <button key={i} type="button"
                            className={`petal-option${instinct?.choice === opt.text ? ' picked' : ''}`}
                            onClick={() => handlePickOption(opt)}
                            disabled={instinct != null}
                            style={{ '--accent': accent }}>
                            <span className="petal-option-accent" />
                            <span className="petal-option-body">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button type="button" className="petal-custom-trigger"
                      onClick={() => setCustomMode(true)} disabled={instinct != null}>
                      ✎ написати своє · 80% цінності
                    </button>
                  </>
                )}
              </div>
            )}

            {phase === 'deepening' && (
              <DeepeningPhase
                instinct={instinct}
                deepening={deepening}
                setDeepening={setDeepening}
                onNext={() => setPhase('body')}
              />
            )}

            {phase === 'body' && (
              <BodyPhase
                petalColor={petal.color}
                bodyMark={bodyMark} setBodyMark={setBodyMark}
                bodyMode={bodyMode} setBodyMode={setBodyMode}
                onSave={() => handleSaveAndAdvance()}
                onConstellationSave={(figs) => {
                  setConstellation(figs);
                  handleSaveAndAdvance({ constellation: figs });
                }}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

function PhaseDots({ current }) {
  const phases = ['instinct', 'deepening', 'body'];
  return (
    <div className="petal-phase-dots" role="status" aria-label={`фаза: ${current}`}>
      {phases.map((p) => (
        <span key={p} className={`petal-phase-dot ${current === p ? 'is-active' : ''} ${
          phases.indexOf(current) > phases.indexOf(p) ? 'is-done' : ''
        }`} />
      ))}
    </div>
  );
}

function CustomInput({ value, setValue, onSubmit, onCancel, placeholder, submitLabel, color }) {
  return (
    <div className="petal-custom-form">
      <textarea value={value} onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder} rows={4} maxLength={400}
        autoFocus
        style={{ borderColor: `${color}66` }} />
      <div className="petal-phase-actions">
        <button type="button" className="petal-skip" onClick={onCancel}>
          ← готові варіанти
        </button>
        <button type="button" className="petal-deepening-go"
          onClick={onSubmit}
          disabled={value.trim().length < 5}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

function trim(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function inferBarometer(petal) {
  // Беремо найчастіший барометр серед options пелюстки
  const counts = {};
  for (const cell of petal.cells || []) {
    for (const opt of (cell.options || [])) {
      if (opt.barometer) counts[opt.barometer] = (counts[opt.barometer] || 0) + 1;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'flow';
}
