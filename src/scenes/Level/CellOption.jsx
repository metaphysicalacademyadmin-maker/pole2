import { BAROMETERS } from '../../data/barometers.js';

const BAR_COLOR = Object.fromEntries(BAROMETERS.map((b) => [b.key, b.color]));

// Один варіант відповіді — кнопка. Має лівий accent-bar за барометром,
// тінь зліва (delta < 0) — фіолетова, інакше — золота.
export default function CellOption({ option, selected, onSelect }) {
  const className = `cell-option${selected ? ' selected' : ''}`;
  const facetStyle = option.facetColor ? { color: option.facetColor } : undefined;

  // Колір accent: за барометром, або фіолетовий для shadow
  const isShadow = option.depth === 'shadow' || (typeof option.delta === 'number' && option.delta < 0);
  const accentColor = isShadow ? '#7a5a78' : (BAR_COLOR[option.barometer] || '#f0c574');

  return (
    <button type="button" className={className}
      onClick={() => onSelect(option)}
      style={{ '--accent': accentColor }}>
      <span className="cell-option-accent" aria-hidden="true" />
      <span className="cell-option-body">
        {option.facet && (
          <span className="cell-option-facet" style={facetStyle}>
            {option.facet}
          </span>
        )}
        <span className="cell-option-text">{option.text}</span>
        {option.hint && <span className="cell-option-hint">{option.hint}</span>}
      </span>
    </button>
  );
}
