import { useRef, useState } from 'react';

const VIEW = { w: 200, h: 380 };

// Маленька SVG-фігура. Гравець клікає → точка кладеться у відповідне місце.
// Точки кольоровані за depth (deep/mid/shadow).
// onPlace(point: {x, y, depth}) — викликається при кліку.
export default function BodyMapPicker({ existingPoints = [], depth = 'mid', onPlace }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);

  function svgPoint(evt) {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function handleClick(e) {
    const pt = svgPoint(e);
    if (!pt) return;
    onPlace?.({ x: pt.x, y: pt.y, depth });
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      onClick={handleClick}
      onMouseMove={(e) => {
        const pt = svgPoint(e);
        if (pt) setHover({ x: pt.x, y: pt.y });
      }}
      onMouseLeave={() => setHover(null)}
      style={{ width: '100%', maxWidth: 200, height: 'auto', cursor: 'crosshair' }}
    >
      {/* Силует тіла — спрощено */}
      <ellipse cx={100} cy={50} rx={26} ry={32} fill="none" stroke="rgba(232,196,118,0.35)" strokeWidth="1" />
      <path
        d="M 100 82 L 100 320 M 60 110 L 100 110 L 140 110 M 60 110 Q 50 170 55 220 M 140 110 Q 150 170 145 220 M 75 320 L 70 370 M 125 320 L 130 370"
        fill="none" stroke="rgba(232,196,118,0.35)" strokeWidth="1.5" strokeLinecap="round"
      />

      {/* Існуючі точки */}
      {existingPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5}
          fill={pointColor(p.depth)}
          opacity="0.85"
        />
      ))}

      {/* Hover-індикатор */}
      {hover && (
        <circle cx={hover.x} cy={hover.y} r={6} fill={pointColor(depth)} opacity="0.4" pointerEvents="none" />
      )}
    </svg>
  );
}

function pointColor(depth) {
  if (depth === 'deep')   return '#a8c898';
  if (depth === 'shadow') return '#d89098';
  return '#f0c574';
}
