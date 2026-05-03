import { useMemo } from 'react';
import { pickAntypPrompt } from '../../utils/petal-antyp-prompts.js';

// Фаза 2 пелюстки — Антип-провокація з контекстом instinct.
// Замість generic «що ти приховав?» — вибір під depth/customText гравця.
export default function DeepeningPhase({ instinct, deepening, setDeepening, onNext }) {
  const prompt = useMemo(() => pickAntypPrompt(instinct), [instinct]);

  return (
    <div className="petal-cell petal-deepening">
      <div className="petal-phase-label" style={{ color: '#a890b0' }}>
        фаза 2 · ☾ антип провокує
      </div>
      <h3 className="petal-cell-title">{prompt}</h3>
      <p className="petal-cell-question petal-prev-quote">
        Твоя відповідь: «{trim(instinct?.customText || instinct?.choice, 80)}»
      </p>
      <textarea value={deepening} onChange={(e) => setDeepening(e.target.value)}
        placeholder="без захисту. чесніше..."
        rows={4} maxLength={400}
        className="petal-deepening-input" />
      <div className="petal-phase-actions">
        <button type="button" className="petal-skip" onClick={onNext}>
          пропустити →
        </button>
        <button type="button" className="petal-deepening-go"
          onClick={onNext}
          disabled={deepening.trim().length < 5}>
          далі — у тіло →
        </button>
      </div>
    </div>
  );
}

function trim(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
