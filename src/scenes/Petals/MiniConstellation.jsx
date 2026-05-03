import { useState, useRef } from 'react';

// Міні-розстановка для пелюстки: 3 фігури — Я, Це, Поле.
// Гравець перетягує їх по полю (300×300 SVG). Координати зберігаються
// у petalAnswers як constellation: [{ label, x, y }, ...].
// Дальність = смисл: близько = злиплий, далеко = розрив, центр = ресурс.

const FIGURES_INIT = [
  { id: 'me',    label: 'Я',         color: '#f0c574', x: 150, y: 220 },
  { id: 'it',    label: 'Це',        color: '#a890b0', x:  90, y: 100 },
  { id: 'field', label: 'Поле',      color: '#74c5b5', x: 210, y: 100 },
];

export default function MiniConstellation({ petalColor, onSubmit, onSkip }) {
  const [figs, setFigs] = useState(FIGURES_INIT);
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef(null);

  function pointerPos(e) {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX ?? e.touches?.[0]?.clientX) - rect.left) * (300 / rect.width);
    const y = ((e.clientY ?? e.touches?.[0]?.clientY) - rect.top) * (300 / rect.height);
    return { x, y };
  }

  function handleDown(e, id) {
    e.preventDefault();
    setDragging(id);
  }
  function handleMove(e) {
    if (!dragging) return;
    const p = pointerPos(e);
    if (!p) return;
    const x = Math.max(20, Math.min(280, p.x));
    const y = Math.max(20, Math.min(280, p.y));
    setFigs((prev) => prev.map((f) => f.id === dragging ? { ...f, x, y } : f));
  }
  function handleUp() {
    setDragging(null);
  }

  function handleConfirm() {
    onSubmit(figs.map(({ id, label, x, y }) => ({ id, label, x: Math.round(x), y: Math.round(y) })));
  }

  return (
    <div className="petal-cell petal-mini-const">
      <div className="petal-phase-label" style={{ color: petalColor }}>
        фаза 3 · ✦ розстановка
      </div>
      <h3 className="petal-cell-title">Постав фігури де відчуваєш</h3>
      <p className="petal-cell-question">
        Перетягни <b>Я</b>, <b>Це</b> і <b>Поле</b>. Близько — злиплий.
        Далеко — розірвано. Поле — це що тримає тебе у цій сфері.
      </p>

      <svg ref={svgRef}
        className="petal-mini-svg"
        viewBox="0 0 300 300"
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        style={{ touchAction: 'none' }}>
        <defs>
          <radialGradient id="mc-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`${petalColor}22`} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="300" height="300" fill="url(#mc-bg)" />
        <circle cx="150" cy="150" r="6" fill={`${petalColor}66`} />
        <text x="150" y="290" textAnchor="middle" fontSize="9"
          fill="#a8a09b" opacity="0.5">центр поля</text>

        {/* Лінії-зв'язки */}
        {figs.map((a, i) =>
          figs.slice(i + 1).map((b) => (
            <line key={`${a.id}-${b.id}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={petalColor} strokeOpacity="0.18" strokeWidth="1" />
          ))
        )}

        {figs.map((f) => (
          <g key={f.id}
            onPointerDown={(e) => handleDown(e, f.id)}
            style={{ cursor: dragging === f.id ? 'grabbing' : 'grab' }}>
            <circle cx={f.x} cy={f.y} r="22"
              fill={f.color} fillOpacity="0.85"
              stroke={f.color} strokeWidth="2"
              filter="url(#mc-glow)" />
            <text x={f.x} y={f.y + 4} textAnchor="middle"
              fontSize="11" fontWeight="700" fill="#1a0f0a"
              style={{ userSelect: 'none', pointerEvents: 'none' }}>
              {f.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="petal-phase-actions">
        <button type="button" className="petal-skip" onClick={onSkip}>
          пропустити →
        </button>
        <button type="button" className="petal-deepening-go" onClick={handleConfirm}>
          ✦ зберегти розстановку
        </button>
      </div>
    </div>
  );
}
