// Деталізована долоня — палм з пальцями і свіченням енергії.
// side: 'left' | 'right' — ліва/права (mirror).
// glow: чи показувати золоте свічення (після відповіді в клітинці типу expriment).

const PALM_W = 14;
const PALM_H = 16;

export default function Hand({ cx, cy, side = 'right', glow = false }) {
  const flip = side === 'left' ? -1 : 1;

  // Координати пальців відносно центру палма (y від'ємні = вверх).
  // 4 пальці + 1 великий (thumb збоку).
  const fingers = [
    { x: -5,  y: -PALM_H / 2 - 5,  len: 9,  w: 2.4, name: 'pinky' },
    { x: -1.5,y: -PALM_H / 2 - 7,  len: 11, w: 2.6, name: 'ring' },
    { x:  2,  y: -PALM_H / 2 - 8,  len: 12, w: 2.7, name: 'middle' },
    { x:  5,  y: -PALM_H / 2 - 6,  len: 10, w: 2.5, name: 'index' },
  ];
  const thumb = { x: 7, y: -2, len: 8, w: 2.6 };

  return (
    <g transform={`translate(${cx} ${cy}) scale(${flip} 1)`}>
      {/* Свічення енергії — за долонею */}
      {glow && (
        <circle r={PALM_W + 8} fill="#f0c574" opacity="0.18">
          <animate attributeName="opacity" values="0.18;0.35;0.18" dur="3s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Пальці */}
      {fingers.map((f, i) => (
        <rect
          key={f.name}
          x={f.x - f.w / 2}
          y={f.y}
          width={f.w}
          height={f.len}
          rx={f.w / 2}
          fill="rgba(232,196,118,0.18)"
          stroke="rgba(232,196,118,0.65)"
          strokeWidth="0.7"
        />
      ))}

      {/* Великий палець — під кутом */}
      <g transform={`translate(${thumb.x} ${thumb.y}) rotate(40)`}>
        <rect
          x={-thumb.w / 2}
          y={0}
          width={thumb.w}
          height={thumb.len}
          rx={thumb.w / 2}
          fill="rgba(232,196,118,0.18)"
          stroke="rgba(232,196,118,0.65)"
          strokeWidth="0.7"
        />
      </g>

      {/* Палм */}
      <rect
        x={-PALM_W / 2}
        y={-PALM_H / 2}
        width={PALM_W}
        height={PALM_H}
        rx={5}
        fill="rgba(232,196,118,0.22)"
        stroke="rgba(232,196,118,0.7)"
        strokeWidth="0.9"
      />

      {/* Лінії на долоні (натяк, легка деталь) */}
      <path
        d={`M -${PALM_W / 4} -2 Q 0 0, ${PALM_W / 4} -2`}
        fill="none"
        stroke="rgba(232,196,118,0.4)"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d={`M -${PALM_W / 4} 3 Q 0 5, ${PALM_W / 4} 3`}
        fill="none"
        stroke="rgba(232,196,118,0.4)"
        strokeWidth="0.5"
        strokeLinecap="round"
      />

      {/* Точка центру долоні (Лао Гун - точка меридіану) */}
      <circle r={1.2} fill="#f0c574" opacity={glow ? 1 : 0.7}>
        {glow && (
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        )}
      </circle>
    </g>
  );
}
