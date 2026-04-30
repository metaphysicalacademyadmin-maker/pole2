// Іда (місячна, ліва) і Пінгала (сонячна, права) — два енергетичні канали
// що обвиваються навколо сушумни як змії, перетинаючи її біля кожної чакри.
//
// Малюються як sin-хвилі від основи до маківки.

const STEPS = 80;

function snakePath(centerX, topY, bottomY, amplitude, frequency, phaseOffset = 0) {
  const points = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const y = bottomY - (bottomY - topY) * t;
    const phase = (t * Math.PI * frequency) + phaseOffset;
    const x = centerX + Math.sin(phase) * amplitude;
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return points.join(' ');
}

export default function IdaPingala({ centerX, topY, bottomY }) {
  // Іда — ліва сторона, починається інверсно
  const idaPath = snakePath(centerX, topY, bottomY, 14, 7, 0);
  // Пінгала — права, у протифазі
  const pingalaPath = snakePath(centerX, topY, bottomY, 14, 7, Math.PI);

  return (
    <g>
      <path d={idaPath}
        fill="none"
        stroke="#9fc8e8"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      >
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="6s" repeatCount="indefinite" />
      </path>
      <path d={pingalaPath}
        fill="none"
        stroke="#f5b870"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      >
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="6s" repeatCount="indefinite" begin="3s" />
      </path>
    </g>
  );
}
