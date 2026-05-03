import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { showToast } from '../../components/GlobalToast.jsx';
import { chakraForLevel } from '../../data/chakras.js';
import { detectShadow } from '../../utils/shadow-detector.js';
import { isLlmWitnessAvailable } from '../../utils/llm-witness.js';
import LlmWitness from '../../components/LlmWitness/index.jsx';
import CellOption from './CellOption.jsx';
import ProgressDots from './ProgressDots.jsx';
import CustomAnswer from './CustomAnswer.jsx';
import CellPractice from './CellPractice.jsx';

// Один екран клітинки. Універсальний для kind: undefined | 'meeting' | 'experiment'.
// Після відповіді гравець може поглибити через практику ключових слів —
// з виміром аури до/після (см) → записується у auraReadings → візуалізується на Aura.jsx.
const CUSTOM_DELTA = 3;

export default function CellView({ cell, levelN, totalCells, currentIdx, lockedCells }) {
  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const advanceCell = useGameStore((s) => s.advanceCell);
  const applySnakeBite = useGameStore((s) => s.applySnakeBite);
  const triggerChakraFlash = useGameStore((s) => s.triggerChakraFlash);
  const triggerChakraDim = useGameStore((s) => s.triggerChakraDim);
  const triggerShadowMirror = useGameStore((s) => s.triggerShadowMirror);
  const [selectedKey, setSelectedKey] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  const [phase, setPhase] = useState('answer');     // answer | offer | practice
  const [answeredBarometer, setAnsweredBarometer] = useState(null);
  const [witnessPayload, setWitnessPayload] = useState(null);
  const intention = useGameStore((s) => s.intention);

  // Чакра рівня — вона спалахує коли гравець відповідає.
  const chakra = chakraForLevel(levelN);
  const isSnake = cell.kind === 'snake';

  function afterAnswer(barometer) {
    setAnsweredBarometer(barometer);
    setPhase('offer');
  }

  function skipPractice() {
    advanceCell(totalCells);
    setPhase('answer');
    setAnsweredBarometer(null);
    setSelectedKey(null);
  }

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
    if (chakra && option.delta > 0) triggerChakraFlash(chakra.id);
    if (chakra && option.delta < 0) triggerChakraDim(chakra.id);
    const sign = option.delta >= 0 ? '+' : '';
    showToast(`${sign}${option.delta} ${option.barometer}`, option.delta >= 0 ? 'success' : 'info');
    // Snake-bite — гравець обрав тінь на тіньовій клітинці. Подвійне падіння.
    if (isSnake && option.snakeBite) {
      setTimeout(() => {
        applySnakeBite({ cellId: cell.id, levelN, barometer: option.barometer });
        showToast('🐍 Тінь зростає. Повертаюсь на 2 клітинки.', 'info');
        setSelectedKey(null);
        setPhase('answer');
      }, 800);
      return;
    }
    setTimeout(() => afterAnswer(option.barometer), 600);
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
    if (chakra) triggerChakraFlash(chakra.id);
    showToast(`+${CUSTOM_DELTA} ${barometer} · своя відповідь`, 'success');
    setCustomMode(false);
    // 🪞 Дзеркало Тіні має пріоритет над LLM-арбітром.
    // Якщо є shadow-тригер — показуємо ShadowMirror; інакше — LLM-witness (якщо доступний).
    const shadow = detectShadow(text);
    if (shadow) {
      setTimeout(() => triggerShadowMirror({ ...shadow, cellId: cell.id, customText: text }), 800);
    } else if (isLlmWitnessAvailable() && text.trim().length >= 20) {
      setTimeout(() => setWitnessPayload({
        text, levelN, chakra: chakra?.id || null, intention,
      }), 800);
    }
    setTimeout(() => afterAnswer(barometer), 600);
  }

  const isExperiment = cell.kind === 'experiment';
  const promptText = isExperiment ? cell.afterQuestion : cell.question;

  return (
    <div className={`lvl-center${isSnake ? ' snake-cell' : ''}`}>
      <div className="cell-eyebrow">
        рівень {levelN} · клітинка {currentIdx + 1} з {totalCells}
      </div>
      <ProgressDots total={totalCells} current={currentIdx} locked={lockedCells} />

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

      {phase === 'practice' ? (
        <CellPractice cell={cell} levelN={levelN} barometer={answeredBarometer}
          onDone={skipPractice} onSkip={skipPractice} />
      ) : phase === 'offer' ? (
        <PracticeOffer onSkip={skipPractice} onGo={() => setPhase('practice')} />
      ) : customMode ? (
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
            <span className="cct-icon">✎</span>
            <span className="cct-content">
              <span className="cct-title">написати своє</span>
              <span className="cct-hint">найглибше йде сюди · +3 до барометра</span>
            </span>
          </button>
        </>
      )}
      {witnessPayload && (
        <LlmWitness payload={witnessPayload} onClose={() => setWitnessPayload(null)} />
      )}
    </div>
  );
}

function inferBarometer(cell) {
  const counts = {};
  for (const o of cell.options) {
    if (o.barometer) counts[o.barometer] = (counts[o.barometer] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'root';
}

function PracticeOffer({ onSkip, onGo }) {
  return (
    <div className="cell-practice-offer">
      <div className="cpo-title">Відповідь записано. Поглибити через практику?</div>
      <div className="cpo-hint">Ключові слова + вимір аури в см. ~2 хв. Δ збережеться на колі аури.</div>
      <div className="cpo-actions">
        <button type="button" className="cpo-btn-skip" onClick={onSkip}>пропустити</button>
        <button type="button" className="cpo-btn-go" onClick={onGo}>🔑 поглибити</button>
      </div>
    </div>
  );
}
