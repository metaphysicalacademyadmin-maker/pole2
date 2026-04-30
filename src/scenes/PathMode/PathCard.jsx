// Один варіант шляху — Дотик / Шлях / Глибина.
// Кнопка <button> бо клікабельна; стилізована через клас pm-card.
export default function PathCard({ mode, onSelect }) {
  const className = `pm-card${mode.recommended ? ' recommended' : ''}`;

  return (
    <button type="button" className={className} onClick={() => onSelect(mode.id)}>
      {mode.recommended && <span className="pm-badge">рекомендовано</span>}
      <span className="pm-symbol">{mode.symbol}</span>
      <span className="pm-name">{mode.name}</span>
      <span className="pm-tag">{mode.tag}</span>
      <span className="pm-quote">{mode.quote}</span>
      <span className="pm-stats">
        <span><span className="pm-num">~{mode.questionsApprox}</span> питань</span>
        <span><span className="pm-num">{mode.durationApprox}</span></span>
      </span>
    </button>
  );
}
