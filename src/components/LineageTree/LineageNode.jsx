// Окрема точка-вузол на дереві. Клікова, з статус-кольором.
// Статус → CSS class. Ім'я (якщо вписано) → ініціал у вузлі.
export default function LineageNode({ x, y, r, gen, idx, line, status, name, meta, onClick }) {
  const initial = (name || '').trim().slice(0, 1).toUpperCase();
  const ariaLabel = `${meta?.label || `g${gen}·${idx}`}${name ? ` · ${name}` : ''} · ${status}`;

  return (
    <g
      className={`lin-node lin-node--${line} lin-node--${status}`}
      data-gen={gen}
      data-idx={idx}
      data-status={status}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }
      }}
      aria-label={ariaLabel}
    >
      <circle cx={x} cy={y} r={r} />
      {initial && r >= 7 && (
        <text x={x} y={y + 3} textAnchor="middle" className="lin-node__initial">{initial}</text>
      )}
    </g>
  );
}
