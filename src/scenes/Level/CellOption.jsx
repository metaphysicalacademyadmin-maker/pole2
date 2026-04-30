// Один варіант відповіді — кнопка. Підтримує "звичайну" і "meeting"
// (з фасетом-кольором) опції.
export default function CellOption({ option, selected, onSelect }) {
  const className = `cell-option${selected ? ' selected' : ''}`;
  const facetStyle = option.facetColor ? { color: option.facetColor } : undefined;

  return (
    <button type="button" className={className} onClick={() => onSelect(option)}>
      {option.facet && (
        <span className="cell-option-facet" style={facetStyle}>
          {option.facet}
        </span>
      )}
      <span className="cell-option-text">{option.text}</span>
      {option.hint && <span className="cell-option-hint">{option.hint}</span>}
    </button>
  );
}
