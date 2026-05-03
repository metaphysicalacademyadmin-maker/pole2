import { useState } from 'react';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import './antyp.css';

// Антип — провокативна модалка з 2-3 варіантами відповіді.
// onChoice(option) → батько (Level/store) застосовує ефекти.
export default function AntypModal({ provocation, onChoice, onClose }) {
  const [chosen, setChosen] = useState(null);
  useOverlayA11y(chosen ? null : onClose);
  if (!provocation) return null;

  function handleSelect(opt) {
    setChosen(opt);
    setTimeout(() => {
      onChoice(opt);
    }, 1800);
  }

  return (
    <div className="ant-overlay" onClick={chosen ? null : onClose}
      role="dialog" aria-modal="true" aria-label="Виклик від Антипа">
      <div className="ant-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ant-symbol" aria-hidden="true">☾</div>
        <div className="ant-name">антип · провокатор</div>

        {!chosen ? (
          <>
            <div className="ant-setup">{provocation.setup}</div>
            <div className="ant-challenge">{provocation.challenge}</div>
            <div className="ant-options">
              {provocation.options.map((opt) => (
                <button key={opt.id} type="button"
                  className="ant-option"
                  onClick={() => handleSelect(opt)}>
                  {opt.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="ant-aftermath">
            <div className="ant-aftermath-text">{chosen.text_after}</div>
          </div>
        )}
      </div>
    </div>
  );
}
