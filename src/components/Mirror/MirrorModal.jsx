import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import './mirror.css';

// Дзеркало — м'яка модалка з твоєю фразою як питанням.
// Гравець читає, дозволяє резонувати, закриває.
export default function MirrorModal({ reflection, onClose }) {
  useOverlayA11y(onClose);
  if (!reflection) return null;
  return (
    <div className="mir-overlay" onClick={onClose}
      role="dialog" aria-modal="true" aria-label="Дзеркало повертає твою фразу">
      <div className="mir-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mir-symbol" aria-hidden="true">◯</div>
        <div className="mir-name">дзеркало</div>
        <div className="mir-text">{reflection.text}</div>
        <button type="button" className="mir-btn" onClick={onClose}>
          подивлюсь
        </button>
      </div>
    </div>
  );
}
