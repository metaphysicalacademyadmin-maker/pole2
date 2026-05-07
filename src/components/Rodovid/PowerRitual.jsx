import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { findNode, lineageNodeMeta } from '../../data/rodovid-nodes.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import './PowerRitual.css';

// Ритуал «Яку силу несе цей предок?» — повільний flow з 4 кроків.
// Запускається з RodovidNodeEditor для обраного предка.
// Зберігається у state.rodovid[nodeId].power = { word, why, ts }.
export default function PowerRitual({ nodeId, onClose }) {
  // Метадані вузла — спочатку legacy, потім обчислені для 4-6 поколінь
  const node = findNode(nodeId) || guessFromLineageId(nodeId);
  const existing = useGameStore((s) => s.rodovid?.[nodeId]);
  const savePower = useGameStore((s) => s.saveRodovidPower);

  const [step, setStep] = useState(0);              // 0=intro, 1=сила, 2=чому, 3=завершення
  const [word, setWord] = useState(existing?.power?.word || '');
  const [why, setWhy]   = useState(existing?.power?.why || '');

  useOverlayA11y(onClose);

  // Slow pacing — невелика затримка перед автофокусом на input
  useEffect(() => {
    if (step !== 1 && step !== 2) return;
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-pr-step="${step}"] input, [data-pr-step="${step}"] textarea`);
      el?.focus();
    }, 600);
    return () => clearTimeout(t);
  }, [step]);

  function next() {
    if (step === 1 && !word.trim()) return;
    if (step === 2) {
      savePower(nodeId, { word, why });
    }
    setStep((s) => s + 1);
  }

  if (!node) return null;
  const personLabel = (existing?.name?.trim()) || node.label || 'предок';

  return (
    <div className="pr-overlay" role="dialog" aria-modal="true"
      aria-label={`Практика сили: ${personLabel}`}>
      <button type="button" className="pr-close" onClick={onClose}
        aria-label="Закрити ритуал">×</button>

      <div className="pr-stage">
        {step === 0 && (
          <section className="pr-step pr-step--intro" data-pr-step="0">
            <div className="pr-eyebrow">практика сили</div>
            <h2 className="pr-title"><em>{personLabel}</em></h2>
            <p className="pr-instruction">
              Сядь зручно. Зроби три повільні вдихи.<br />
              Уяви цю людину перед собою.
            </p>
            <button type="button" className="pr-btn pr-btn--soft" onClick={next}>
              готовий
            </button>
          </section>
        )}

        {step === 1 && (
          <section className="pr-step pr-step--ask" data-pr-step="1">
            <div className="pr-question">Яку силу несе цей предок?</div>
            <div className="pr-hint">одне слово або коротка фраза</div>
            <input
              type="text"
              className="pr-input"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && word.trim()) next(); }}
              maxLength={60}
              placeholder="терпіння · сміх · опора · мовчання…"
              aria-label="сила цього предка"
            />
            <button type="button" className="pr-btn pr-btn--soft"
              onClick={next} disabled={!word.trim()}>
              далі
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="pr-step pr-step--ask" data-pr-step="2">
            <div className="pr-quiet">{personLabel} · <em>{word}</em></div>
            <div className="pr-question">Чому ти кажеш саме так?</div>
            <div className="pr-hint">спогад, образ, ситуація — де ти бачиш цю силу</div>
            <textarea
              className="pr-textarea"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              maxLength={500}
              rows={5}
              placeholder="згадай момент, коли це було видно…"
              aria-label="чому саме ця сила"
            />
            <button type="button" className="pr-btn pr-btn--soft" onClick={next}>
              завершити
            </button>
          </section>
        )}

        {step === 3 && (
          <section className="pr-step pr-step--final" data-pr-step="3">
            <div className="pr-eyebrow">прийняв</div>
            <p className="pr-final-line">У <em>{personLabel}</em> — сила</p>
            <div className="pr-power-word">{word}</div>
            <p className="pr-final-line pr-final-line--soft">
              Ти бачиш її. Вона у тобі теж.
            </p>
            <button type="button" className="pr-btn pr-btn--gold" onClick={onClose}>
              закрити
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

// Fallback meta для нових IDs g{N}-{idx} коли findNode() не знаходить.
function guessFromLineageId(id) {
  const m = id.match(/^g(\d)-(\d+)$/);
  if (!m) return null;
  return lineageNodeMeta(Number(m[1]), Number(m[2]));
}
