import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { BAROMETERS } from '../../data/barometers.js';
import { showToast } from '../../components/GlobalToast.jsx';

const BAR_COLOR = Object.fromEntries(BAROMETERS.map((b) => [b.key, b.color]));

// Перегляд однієї пелюстки — клітинки розкриваються по черзі.
// Після останньої — святковий стан "пелюстка завершена" + кнопка повернутись.
export default function PetalView({ petal }) {
  const exitPetal = useGameStore((s) => s.exitPetal);
  const recordAnswer = useGameStore((s) => s.recordPetalAnswer);
  const progress = useGameStore((s) => s.petalProgress[petal.id]) || { answeredIds: [], completed: false };

  const total = petal.cells.length;
  const answered = progress.answeredIds || [];
  const nextIdx = petal.cells.findIndex((c) => !answered.includes(c.id));
  const allDone = nextIdx === -1 || progress.completed;
  const cell = !allDone ? petal.cells[nextIdx] : null;
  const [pickedKey, setPickedKey] = useState(null);

  function handlePick(opt) {
    if (!cell) return;
    setPickedKey(opt.text);
    recordAnswer(petal.id, cell.id, total, {
      choice: opt.text, barometer: opt.barometer, delta: opt.delta,
      depth: opt.depth, shadow: opt.shadow || null,
    });
    const sign = opt.delta >= 0 ? '+' : '';
    showToast(`${sign}${opt.delta} ${opt.barometer}`, opt.delta >= 0 ? 'success' : 'info');
    setTimeout(() => setPickedKey(null), 600);
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
          <div className="petal-completed">
            <div className="petal-completed-symbol" style={{ color: petal.color }}>✦</div>
            <div className="petal-completed-title">пелюстка завершена</div>
            <div className="petal-completed-text">
              Сфера «{petal.name}» — пройдена. Поле прийняло.
            </div>
            <button type="button" className="petal-btn-return" onClick={exitPetal}>
              повернутись на мандалу →
            </button>
          </div>
        ) : (
          <div className="petal-cell">
            <h3 className="petal-cell-title">{cell.title}</h3>
            <p className="petal-cell-question">{cell.question}</p>
            <div className="petal-options">
              {cell.options.map((opt, i) => {
                const isShadow = opt.depth === 'shadow' || (typeof opt.delta === 'number' && opt.delta < 0);
                const accent = isShadow ? '#7a5a78' : (BAR_COLOR[opt.barometer] || '#f0c574');
                return (
                  <button key={i} type="button"
                    className={`petal-option${pickedKey === opt.text ? ' picked' : ''}`}
                    onClick={() => handlePick(opt)}
                    disabled={pickedKey != null}
                    style={{ '--accent': accent }}>
                    <span className="petal-option-accent" />
                    <span className="petal-option-body">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
