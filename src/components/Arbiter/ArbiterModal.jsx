import './arbiter.css';

// Арбітр — лаконічна модалка свідчення.
// Не вимагає вибору. Гравець читає, натискає «почув» — і йде далі.
export default function ArbiterModal({ line, onClose }) {
  if (!line) return null;
  return (
    <div className="arb-overlay" onClick={onClose}>
      <div className="arb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="arb-symbol">▲</div>
        <div className="arb-name">арбітр-свідок</div>
        <div className="arb-text">{line.text}</div>
        <button type="button" className="arb-btn" onClick={onClose}>почув</button>
      </div>
    </div>
  );
}
