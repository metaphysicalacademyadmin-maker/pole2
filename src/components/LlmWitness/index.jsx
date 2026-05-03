import { useEffect, useState } from 'react';
import { fetchWitness } from '../../utils/llm-witness.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import './styles.css';

// Свідок-Арбітр — модальна плашка зі станом «слухає → свідчить».
// Активується після custom answer. Якщо LLM не доступний / error /
// текст занадто короткий → нічого не показує (graceful).
export default function LlmWitness({ payload, onClose }) {
  const [state, setState] = useState('listening');  // listening | done | hidden
  const [witness, setWitness] = useState(null);

  useOverlayA11y(onClose);

  useEffect(() => {
    let alive = true;
    fetchWitness(payload).then((w) => {
      if (!alive) return;
      if (w) {
        setWitness(w);
        setState('done');
      } else {
        // Нема відповіді — закриваємо без UI
        setState('hidden');
        onClose?.();
      }
    });
    return () => { alive = false; };
  }, [payload, onClose]);

  if (state === 'hidden') return null;

  return (
    <div className="lwit-overlay" role="dialog" aria-modal="true" aria-label="Арбітр свідчить">
      <div className={`lwit-modal lwit-tone-${witness?.tone || 'gentle'}`}>
        <div className="lwit-symbol" aria-hidden="true">▲</div>
        <div className="lwit-name">арбітр-свідок</div>

        {state === 'listening' && (
          <div className="lwit-listening">
            <div className="lwit-dots">
              <span /><span /><span />
            </div>
            <div className="lwit-listening-text">слухає тебе…</div>
          </div>
        )}

        {state === 'done' && witness && (
          <div className="lwit-text-wrap">
            <div className="lwit-quote-mark" aria-hidden="true">«</div>
            <p className="lwit-text">{witness.text}</p>
            <div className="lwit-quote-mark lwit-quote-mark--end" aria-hidden="true">»</div>
          </div>
        )}

        {state === 'done' && (
          <button type="button" className="lwit-btn" onClick={onClose}>
            почув
          </button>
        )}
      </div>
    </div>
  );
}
