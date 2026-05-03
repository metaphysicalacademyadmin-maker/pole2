import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import './arbiter.css';

// Арбітр — лаконічна модалка свідчення.
// Не вимагає вибору. Гравець читає, натискає «почув» — і йде далі.
export default function ArbiterModal({ line, onClose }) {
  useOverlayA11y(onClose);
  if (!line) return null;
  return (
    <div className="arb-overlay" onClick={onClose}
      role="dialog" aria-modal="true" aria-label="Свідчення Арбітра">
      <div className="arb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="arb-symbol" aria-hidden="true">▲</div>
        <div className="arb-name">арбітр-свідок</div>
        <div className="arb-text">{line.text}</div>
        <button type="button" className="arb-btn" onClick={onClose}>почув</button>
      </div>
    </div>
  );
}
