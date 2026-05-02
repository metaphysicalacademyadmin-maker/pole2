import './styles.css';

// Дихальне коло — пульсує 4с (вдих) / 4с (видих).
// label опційний; size — діаметр у px.
export default function BreathCircle({ size = 96, hue = 'gold', label, className = '' }) {
  return (
    <div className={`breath-circle breath-circle--${hue} ${className}`}
      style={{ width: size, height: size }}>
      <div className="breath-circle__ring" />
      <div className="breath-circle__core" />
      {label && <div className="breath-circle__label">{label}</div>}
    </div>
  );
}
