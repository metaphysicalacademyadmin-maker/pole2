import { useRef, useState } from 'react';
import { FIGURE_TYPES } from '../../data/constellation/figures.js';
import { useProfileStore } from '../../store/profileStore.js';

const VIEWBOX = { w: 600, h: 600 };

// SVG-поле — кругле «поле роду». Drag-and-drop фігур + поворот.
// onChange(figures) — викликається після кожної зміни.
export default function Field({ figures, onChange, onSelect }) {
  const firstName = useProfileStore((s) => s.profile?.firstName);
  const svgRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  function svgPoint(evt) {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function startDrag(figureId, e) {
    e.preventDefault();
    setDraggingId(figureId);
    onSelect?.(figureId);
  }

  function onMove(e) {
    if (!draggingId) return;
    const pt = svgPoint(e);
    if (!pt) return;
    // Кламп у межах поля (круг радіус 280)
    const cx = VIEWBOX.w / 2, cy = VIEWBOX.h / 2;
    const dx = pt.x - cx, dy = pt.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let x = pt.x, y = pt.y;
    if (dist > 270) {
      x = cx + (dx / dist) * 270;
      y = cy + (dy / dist) * 270;
    }
    const updated = figures.map((f) => (f.id === draggingId ? { ...f, x, y } : f));
    onChange(updated);
  }

  function endDrag() {
    setDraggingId(null);
  }

  function handleRotate(figureId, dir) {
    const updated = figures.map((f) =>
      f.id === figureId ? { ...f, rotation: ((f.rotation || 0) + dir * 30) % 360 } : f
    );
    onChange(updated);
  }

  return (
    <svg
      ref={svgRef}
      className={`const-field${draggingId ? ' dragging' : ''}`}
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      onPointerMove={onMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      {/* Внутрішнє коло — символ "центру" */}
      <circle cx={VIEWBOX.w / 2} cy={VIEWBOX.h / 2} r={36}
        fill="none" stroke="rgba(232,196,118,0.25)" strokeWidth="0.8" strokeDasharray="3 4" />
      <circle cx={VIEWBOX.w / 2} cy={VIEWBOX.h / 2} r={140}
        fill="none" stroke="rgba(232,196,118,0.18)" strokeWidth="0.8" strokeDasharray="2 6" />

      {figures.map((f) => {
        const def = FIGURE_TYPES[f.type];
        if (!def) return null;
        return (
          <g
            key={f.id}
            transform={`translate(${f.x} ${f.y})`}
            onPointerDown={(e) => startDrag(f.id, e)}
            onDoubleClick={() => handleRotate(f.id, 1)}
            className={`const-figure-circle${draggingId === f.id ? ' dragging' : ''}`}
            style={{ color: def.color }}
          >
            {/* Орієнтація — стрілочка наперед */}
            <g transform={`rotate(${f.rotation || 0})`}>
              <path d="M 0 -38 L 6 -28 L -6 -28 Z"
                fill={def.color} opacity="0.6" />
            </g>

            <circle r={28} fill="rgba(20,14,30,0.85)"
              stroke={def.color} strokeWidth={2.5} />
            <text textAnchor="middle" y="-2"
              fontSize="22" fill={def.color} fontWeight="700"
              style={{ userSelect: 'none', pointerEvents: 'none' }}>
              {def.symbol}
            </text>
            <text textAnchor="middle" y="14"
              fontSize="9" fill={def.color} opacity="0.85" fontWeight="600"
              style={{ userSelect: 'none', pointerEvents: 'none', letterSpacing: '1px' }}>
              {f.type === 'self' && firstName
                ? firstName.toUpperCase()
                : def.name.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
