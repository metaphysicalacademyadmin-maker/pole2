import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { showToast } from '../../components/GlobalToast.jsx';
import CellOption from './CellOption.jsx';
import ProgressDots from './ProgressDots.jsx';
import CustomAnswer from './CustomAnswer.jsx';

// Один екран клітинки. Універсальний для kind: undefined | 'meeting' | 'experiment'.
// Кожна клітинка дає або вибір з готових варіантів, або власну довшу
// відповідь (CustomAnswer) — глибше переживання → +3 до барометра.
const CUSTOM_DELTA = 3;

export default function CellView({ cell, levelN, totalCells, currentIdx }) {
  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const advanceCell = useGameStore((s) => s.advanceCell);
  const [selectedKey, setSelectedKey] = useState(null);
  const [customMode, setCustomMode] = useState(false);

  function handleSelect(option) {
    setSelectedKey(option.text);
    recordAnswer(levelN, cell.id, {
      choice: option.text,
      facet: option.facet || null,
      barometer: option.barometer,
      delta: option.delta,
      depth: option.depth,
      shadow: option.shadow || null,
    });
    showToast(`+${option.delta} ${option.barometer}`, 'success');
    setTimeout(() => {
      setSelectedKey(null);
      advanceCell(totalCells);
    }, 600);
  }

  function handleCustom(text) {
    const barometer = inferBarometer(cell);
    recordAnswer(levelN, cell.id, {
      choice: '(свій варіант)',
      customText: text,
      barometer,
      delta: CUSTOM_DELTA,
      depth: 'deep',
    });
    showToast(`+${CUSTOM_DELTA} ${barometer} · своя відповідь`, 'success');
    setCustomMode(false);
    setTimeout(() => advanceCell(totalCells), 600);
  }

  const isExperiment = cell.kind === 'experiment';
  const promptText = isExperiment ? cell.afterQuestion : cell.question;

  return (
    <div className="lvl-center">
      <div className="cell-eyebrow">
        рівень {levelN} · клітинка {currentIdx + 1} з {totalCells}
      </div>
      <ProgressDots total={totalCells} current={currentIdx} />

      <h2 className="cell-title">{cell.title}</h2>
      <div className="cell-sub">{cell.sub}</div>

      {cell.prologue && <p className="cell-prologue">{cell.prologue}</p>}

      {isExperiment && cell.instruction && (
        <div className="cell-instruction">
          <strong>Спробуй:</strong> {cell.instruction}
        </div>
      )}

      {promptText && <p className="cell-question">{promptText}</p>}
      {cell.note && <p className="cell-note">{cell.note}</p>}

      {customMode ? (
        <CustomAnswer onSubmit={handleCustom} onCancel={() => setCustomMode(false)} />
      ) : (
        <>
          <div className="cell-options">
            {cell.options.map((opt, i) => (
              <CellOption
                key={i}
                option={opt}
                selected={selectedKey === opt.text}
                onSelect={handleSelect}
              />
            ))}
          </div>
          <button
            type="button"
            className="cell-custom-trigger"
            onClick={() => setCustomMode(true)}
          >
            ✎ свій варіант відповіді
          </button>
        </>
      )}
    </div>
  );
}

// Визначаємо барометр для своєї відповіді — беремо найчастіший з опцій клітинки.
function inferBarometer(cell) {
  const counts = {};
  for (const o of cell.options) {
    if (o.barometer) counts[o.barometer] = (counts[o.barometer] || 0) + 1;
  }
  let best = 'root';
  let max = 0;
  for (const [k, v] of Object.entries(counts)) {
    if (v > max) { max = v; best = k; }
  }
  return best;
}
