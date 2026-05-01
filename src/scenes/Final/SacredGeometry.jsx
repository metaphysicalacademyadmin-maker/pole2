// Sacred Geometry — еволюційний overlay на мандалі.
// 3+ ключі: Меркаба (зірка Давида = 2 тетраедри)
// 6+ ключів: Куб Метатрона (13 кіл + лінії)
// 7 ключів: Квітка Життя (19 переплетених кіл)

export default function SacredGeometry({ keysCount, cx, cy }) {
  return (
    <g className="sacred-geometry">
      {keysCount >= 3 && <Merkaba cx={cx} cy={cy} radius={170} />}
      {keysCount >= 6 && <MetatronsCube cx={cx} cy={cy} radius={150} />}
      {keysCount >= 7 && <FlowerOfLife cx={cx} cy={cy} cellR={28} />}
    </g>
  );
}

function Merkaba({ cx, cy, radius }) {
  // Два трикутники, що утворюють шестикінечну зірку
  const triangle = (rotation) => {
    const pts = [];
    for (let i = 0; i < 3; i++) {
      const a = ((i * 120 + rotation) * Math.PI) / 180;
      pts.push(`${cx + Math.cos(a) * radius},${cy + Math.sin(a) * radius}`);
    }
    return pts.join(' ');
  };
  return (
    <g className="sg-merkaba">
      <polygon points={triangle(-90)} fill="none"
        stroke="#f0c574" strokeWidth="0.7" opacity="0.45">
        <animate attributeName="opacity" values="0;0.45" dur="2s" />
      </polygon>
      <polygon points={triangle(90)} fill="none"
        stroke="#c9b3e8" strokeWidth="0.7" opacity="0.45">
        <animate attributeName="opacity" values="0;0.45" dur="2s" />
      </polygon>
    </g>
  );
}

function MetatronsCube({ cx, cy, radius }) {
  // 13 кругів: 1 центр + 6 внутрішніх + 6 зовнішніх
  // Плюс лінії що з'єднують усі центри
  const points = [{ x: cx, y: cy }];
  const r1 = radius * 0.42;
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 * Math.PI) / 180;
    points.push({ x: cx + Math.cos(a) * r1, y: cy + Math.sin(a) * r1 });
  }
  const r2 = radius * 0.84;
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 * Math.PI) / 180;
    points.push({ x: cx + Math.cos(a) * r2, y: cy + Math.sin(a) * r2 });
  }
  // Зв'язки усіх центрів між собою
  const lines = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      lines.push({ a: points[i], b: points[j], key: `${i}-${j}` });
    }
  }
  return (
    <g className="sg-metatron" opacity="0.6">
      {lines.map(({ a, b, key }) => (
        <line key={key} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
          stroke="#c9b3e8" strokeWidth="0.18" opacity="0.25" />
      ))}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={r1 * 0.32}
          fill="none" stroke="#f0c574" strokeWidth="0.45" opacity="0.5" />
      ))}
    </g>
  );
}

function FlowerOfLife({ cx, cy, cellR }) {
  // Hexagonal grid: 1 + 6 + 12 = 19 кіл
  const points = [{ x: cx, y: cy }];
  const d1 = cellR * 2;
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 * Math.PI) / 180;
    points.push({ x: cx + Math.cos(a) * d1, y: cy + Math.sin(a) * d1 });
  }
  const d2 = cellR * 2 * Math.sqrt(3);
  for (let i = 0; i < 6; i++) {
    const a = ((i * 60 + 30) * Math.PI) / 180;
    points.push({ x: cx + Math.cos(a) * d2, y: cy + Math.sin(a) * d2 });
  }
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 * Math.PI) / 180;
    points.push({ x: cx + Math.cos(a) * cellR * 4, y: cy + Math.sin(a) * cellR * 4 });
  }
  return (
    <g className="sg-flower" opacity="0.55">
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={cellR}
          fill="none" stroke="#ffe7a8" strokeWidth="0.4">
          <animate attributeName="opacity" values="0;0.7" dur="3s" begin={`${i * 0.05}s`} />
        </circle>
      ))}
    </g>
  );
}
