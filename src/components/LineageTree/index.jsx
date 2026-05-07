import { useMemo } from 'react';
import { lineageId, lineageNodeMeta, countAtGen } from '../../data/rodovid-nodes.js';
import LineageNode from './LineageNode.jsx';
import './styles.css';

const GENERATIONS = 6; // gen 0..6 = Я + 6 поколінь предків (1+2+4+8+16+32+64=127 вузлів)

// Варіант A — дерево вгору. «Я» внизу, 6 поколінь предків ростуть вверх.
// Зв'язки-лінії від нащадка до обох батьків.
//
// Презентаційний компонент — приймає `rodovid` (state.rodovid з gameStore),
// і колбек `onClickNode(nodeId)` що батько використає щоб відкрити NodeEditor.
export default function LineageTree({ rodovid = {}, onClickNode }) {
  const layout = useMemo(buildLayout, []);

  return (
    <div className="lin-root">
      <div className="lin-header">
        <div className="lin-eyebrow">родове дерево</div>
        <h2 className="lin-title">Сім поколінь</h2>
        <div className="lin-info">
          ліва половина — материнська лінія · права — батьківська ·
          клік на вузол → ім'я, дар, програма, ритуальні фрази
        </div>
      </div>

      <svg
        viewBox={`0 0 ${layout.W} ${layout.H}`}
        className="lin-svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Родове дерево, 7 поколінь"
      >
        {layout.links.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className="lin-link" />
        ))}

        {layout.nodes.map((n) => {
          const data = rodovid[n.id] || null;
          const status = nodeStatus(n.gen, data);
          return (
            <LineageNode
              key={n.id}
              x={n.x}
              y={n.y}
              r={n.r}
              gen={n.gen}
              idx={n.idx}
              line={n.line}
              status={status}
              name={data?.name || ''}
              meta={n.meta}
              onClick={() => onClickNode?.(n.id)}
            />
          );
        })}

        <text x={20} y={layout.H - 12} className="lin-side lin-side--mat">материнська лінія</text>
        <text x={layout.W - 20} y={layout.H - 12} className="lin-side lin-side--pat" textAnchor="end">батьківська лінія</text>
      </svg>
    </div>
  );
}

// ─── Layout ──────────────────────────────────────────────────────────────

function buildLayout() {
  const W = 980;
  const H = 720;
  const PAD = 30;
  const rowsTotal = GENERATIONS + 1; // 7 поверхів
  const rowH = (H - 2 * PAD) / rowsTotal;
  // «Я» зверху (gen 0 = top), коріння внизу (gen 6 = bottom)
  const yFor = (gen) => PAD + rowH * (gen + 0.5);
  const xFor = (gen, idx) => {
    const n = countAtGen(gen);
    return PAD + (W - 2 * PAD) * (idx + 0.5) / n;
  };
  // Збільшені точки — лінійне зменшення з кожним поколінням,
  // нижній ряд (64 предки) має r=5 щоб точки не злипались.
  const radiusFor = (gen) => Math.max(5, 16 - 2 * gen);

  const nodes = [];
  const links = [];

  // Я зверху
  const meMeta = lineageNodeMeta(0, 0);
  nodes.push({ gen: 0, idx: 0, id: meMeta.id, meta: meMeta, x: W / 2, y: yFor(0), r: 18, line: 'me' });

  for (let gen = 1; gen <= GENERATIONS; gen++) {
    const n = countAtGen(gen);
    const r = radiusFor(gen);
    const half = n / 2;
    for (let i = 0; i < n; i++) {
      const meta = lineageNodeMeta(gen, i);
      const x = xFor(gen, i);
      const y = yFor(gen);
      const line = i < half ? 'maternal' : 'paternal';
      nodes.push({ gen, idx: i, id: meta.id, meta, x, y, r, line });

      const childGen = gen - 1;
      const childIdx = childGen === 0 ? 0 : Math.floor(i / 2);
      const cx = childGen === 0 ? W / 2 : xFor(childGen, childIdx);
      const cy = yFor(childGen);
      links.push({ x1: x, y1: y, x2: cx, y2: cy });
    }
  }

  return { W, H, nodes, links };
}

// ─── Status helper ───────────────────────────────────────────────────────

function nodeStatus(gen, data) {
  if (gen === 0) return 'me';
  if (!data) return 'unknown';
  if (data.alive === false) return 'transitioned';
  if (data.name || data.gift || data.program) return 'known';
  return 'silent';
}

export { lineageId };
