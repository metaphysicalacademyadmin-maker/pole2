import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { RODOVID_NODES, RODOVID_LINES, findNode } from '../../data/rodovid-nodes.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import RodovidNodeEditor from './NodeEditor.jsx';
import ExcludedSection from './ExcludedSection.jsx';
import HistoricalContext from './HistoricalContext.jsx';
import EntanglementCheck from './EntanglementCheck.jsx';
import JoinGroupButton from '../JoinGroupButton.jsx';
import './styles.css';

// Інтерактивний родовід — 3 покоління (я + батьки + 4 дідусі-бабусі).
// Кожен вузол: ім'я (опційно), 1 «дар» (що передали), 1 «програма»
// (що повторюю/відмовляюсь повторювати), статус alive/transitioned.
export default function Rodovid({ onClose }) {
  const rodovid = useGameStore((s) => s.rodovid) || {};
  const filledCount = Object.keys(rodovid).length;
  const [editing, setEditing] = useState(null);   // nodeId | null

  useOverlayA11y(onClose);

  return (
    <div className="rod-overlay" role="dialog" aria-modal="true" aria-label="Родовід">
      <div className="rod-frame">
        <button type="button" className="rod-close" onClick={onClose}
          aria-label="Закрити родовід">← повернутись</button>

        <div className="rod-header">
          <div className="rod-eyebrow">робота з родом</div>
          <h2 className="rod-title">Родове Дерево</h2>
          <p className="rod-sub">
            7 фігур. Не «правильно» — твоя версія. Те що ти знаєш, відчуваєш,
            пам'ятаєш. Клікни вузол — назви.
          </p>
          <div className="rod-progress">
            заповнено <strong>{filledCount}</strong> з {RODOVID_NODES.length}
          </div>
        </div>

        <svg viewBox="0 0 600 500" className="rod-svg">
          {/* Лінії */}
          {RODOVID_LINES.map(({ from, to }) => {
            const a = findNode(from);
            const b = findNode(to);
            if (!a || !b) return null;
            const aFilled = !!rodovid[from];
            const bFilled = !!rodovid[to];
            const both = aFilled && bFilled;
            return (
              <line key={`${from}-${to}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={both ? '#f0c574' : '#3a2f48'}
                strokeWidth={both ? 1.5 : 1}
                strokeDasharray={both ? 'none' : '4 3'}
                opacity={both ? 0.55 : 0.3} />
            );
          })}

          {/* Вузли */}
          {RODOVID_NODES.map((node) => (
            <RodovidNode key={node.id} node={node}
              filled={rodovid[node.id]}
              onClick={() => setEditing(node.id)} />
          ))}
        </svg>

        <ExcludedSection />
        <HistoricalContext />
        <EntanglementCheck />

        {filledCount >= 3 && (
          <div className="rod-summary">
            <div className="rod-summary-label">що передається крізь рід</div>
            <RodSummaryGifts data={rodovid} />
          </div>
        )}

        <div className="rod-funnel">
          <div className="rod-funnel-text">
            Хочеш глибше? У академії є системний цикл «Розстановки роду» —
            5 групових сесій, кожна — окрема лінія предків.
          </div>
          <JoinGroupButton variant="soft"
            label="✦ дізнатись про Розстановки роду" />
        </div>
      </div>

      {editing && (
        <RodovidNodeEditor nodeId={editing}
          onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function RodovidNode({ node, filled, onClick }) {
  const isMe = node.id === 'me';
  const r = isMe ? 32 : 26;
  const fillColor = filled ? node.color : '#1a1228';

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}
      className={`rod-node${filled ? ' is-filled' : ''}`}>
      <circle cx={node.x} cy={node.y} r={r + 4}
        fill="none" stroke={node.color}
        strokeWidth={filled ? 2 : 1}
        opacity={filled ? 0.6 : 0.3} />
      <circle cx={node.x} cy={node.y} r={r}
        fill={fillColor}
        stroke={node.color} strokeWidth="2"
        opacity={filled ? 0.85 : 0.4}
        style={{
          filter: filled ? `drop-shadow(0 0 12px ${node.color}aa)` : 'none',
          transition: 'all 0.3s',
        }} />
      <text x={node.x} y={node.y + 5} textAnchor="middle"
        fontSize={isMe ? 14 : 11} fontWeight="700"
        fill={filled ? '#1a0f0a' : '#a8a09b'}
        style={{ userSelect: 'none', pointerEvents: 'none' }}>
        {filled?.name || node.label.split(' ')[0]}
      </text>
      <text x={node.x} y={node.y + r + 18} textAnchor="middle"
        fontSize="9" fill="#a8a09b"
        style={{ userSelect: 'none', pointerEvents: 'none' }}>
        {node.label.includes('(') ? node.label.match(/\(([^)]+)\)/)?.[1] : ''}
      </text>
      {!filled && (
        <text x={node.x} y={node.y + 4} textAnchor="middle"
          fontSize="20" fill={node.color} opacity="0.8"
          style={{ userSelect: 'none', pointerEvents: 'none' }}>+</text>
      )}
    </g>
  );
}

function RodSummaryGifts({ data }) {
  const gifts = Object.entries(data)
    .filter(([_, v]) => v?.gift)
    .map(([id, v]) => ({ id, gift: v.gift, name: v.name || findNode(id)?.label }));
  const programs = Object.entries(data)
    .filter(([_, v]) => v?.program)
    .map(([id, v]) => ({ id, program: v.program, name: v.name || findNode(id)?.label }));

  return (
    <div className="rod-summary-grid">
      <div className="rod-summary-col">
        <div className="rod-col-label">дар, що передається</div>
        {gifts.length === 0
          ? <div className="rod-col-empty">— назви хоч одне</div>
          : gifts.slice(0, 6).map((g) => (
            <div key={g.id} className="rod-summary-row">
              <span className="rod-summary-from">{g.name}</span>
              <span>«{g.gift}»</span>
            </div>
          ))}
      </div>
      <div className="rod-summary-col">
        <div className="rod-col-label">програма, що повторюється</div>
        {programs.length === 0
          ? <div className="rod-col-empty">— що тобі знайоме?</div>
          : programs.slice(0, 6).map((p) => (
            <div key={p.id} className="rod-summary-row">
              <span className="rod-summary-from">{p.name}</span>
              <span>«{p.program}»</span>
            </div>
          ))}
      </div>
    </div>
  );
}
