import { useState } from 'react';
import { isLlmWitnessAvailable } from '../../utils/llm-witness.js';
import LlmWitness from '../../components/LlmWitness/index.jsx';

// Екран завершення пелюстки + опційне свідчення Арбітра.
// Активується якщо парент-сторінка інжектила window.__POLE_LLM__.
export default function PetalComplete({ petal, lastAnswer, onExit }) {
  const [witnessOpen, setWitnessOpen] = useState(false);

  const llmAvailable = isLlmWitnessAvailable();
  const witnessText = lastAnswer ? composeWitnessPayload(lastAnswer, petal) : null;

  return (
    <>
      <div className="petal-completed">
        <div className="petal-completed-symbol" style={{ color: petal.color }}>✦</div>
        <div className="petal-completed-title">пелюстка завершена</div>
        <div className="petal-completed-text">
          Сфера «{petal.name}» — пройдена. Поле прийняло інстинкт, поглиблення, тіло.
        </div>
        {llmAvailable && witnessText && (
          <button type="button" className="petal-witness-btn"
            onClick={() => setWitnessOpen(true)}>
            ▲ почути арбітра
          </button>
        )}
        <button type="button" className="petal-btn-return" onClick={onExit}>
          повернутись на мандалу →
        </button>
      </div>
      {witnessOpen && witnessText && (
        <LlmWitness payload={witnessText}
          onClose={() => setWitnessOpen(false)} />
      )}
    </>
  );
}

function composeWitnessPayload(ans, petal) {
  const parts = [];
  if (ans.customText) parts.push(`Інстинкт: «${ans.customText}»`);
  else if (ans.choice) parts.push(`Інстинкт: ${ans.choice}`);
  if (ans.deepening) parts.push(`Поглиблення: «${ans.deepening}»`);
  if (ans.bodyMark) parts.push(`У тілі: ${ans.bodyMark}`);
  return {
    text: parts.join('. '),
    levelN: petal.n,
    chakra: petal.id,
    intention: petal.name,
  };
}
