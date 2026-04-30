import './mirror.css';

// Дзеркало — м'яка модалка з твоєю фразою як питанням.
// Гравець читає, дозволяє резонувати, закриває.
export default function MirrorModal({ reflection, onClose }) {
  if (!reflection) return null;
  return (
    <div className="mir-overlay" onClick={onClose}>
      <div className="mir-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mir-symbol">◯</div>
        <div className="mir-name">дзеркало</div>
        <div className="mir-text">{reflection.text}</div>
        <button type="button" className="mir-btn" onClick={onClose}>
          подивлюсь
        </button>
      </div>
    </div>
  );
}
