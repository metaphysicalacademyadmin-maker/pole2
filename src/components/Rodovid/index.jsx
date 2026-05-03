import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { RODOVID_NODES, allNodes, allLines, findNode } from '../../data/rodovid-nodes.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import RodovidNodeEditor from './NodeEditor.jsx';
import ExcludedSection from './ExcludedSection.jsx';
import ExcludedCeremony from './ExcludedCeremony.jsx';
import HistoricalContext from './HistoricalContext.jsx';
import EntanglementCheck from './EntanglementCheck.jsx';
import ParentRitual from './ParentRitual.jsx';
import JoinGroupButton from '../JoinGroupButton.jsx';
import './styles.css';

// Інтерактивний родовід — 3 покоління (я + батьки + 4 дідусі-бабусі).
// Кожен вузол: ім'я (опційно), 1 «дар» (що передали), 1 «програма»
// (що повторюю/відмовляюсь повторювати), статус alive/transitioned.
export default function Rodovid({ onClose }) {
  const rodovid = useGameStore((s) => s.rodovid) || {};
  const showFourth = useGameStore((s) => s.rodovidFourthGenShown);
  const toggleFourth = useGameStore((s) => s.toggleRodovidFourthGen);
  const filledCount = Object.keys(rodovid).length;
  const [editing, setEditing] = useState(null);   // nodeId | null
  const [ceremonyId, setCeremonyId] = useState(null);   // excluded.id | null
  const [parentRitualOpen, setParentRitualOpen] = useState(null);   // 'mother'|'father'|null
  const motherFilled = !!rodovid.mother;
  const fatherFilled = !!rodovid.father;
  const ritualState = useGameStore((s) => s.rodovidParentRitual) || {};

  const nodes = allNodes(showFourth);
  const lines = allLines(showFourth);
  const viewBox = showFourth ? '0 0 800 620' : '0 0 800 620';

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
            заповнено <strong>{filledCount}</strong> з {nodes.length}
          </div>
          <button type="button" className="rod-fourth-toggle"
            onClick={toggleFourth}>
            {showFourth ? '↓ сховати прадідів' : '↑ показати 4-те покоління (прадіди)'}
          </button>
        </div>

        <svg viewBox={viewBox} className="rod-svg">
          {/* Лінії */}
          {lines.map(({ from, to }) => {
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
          {nodes.map((node) => (
            <RodovidNode key={node.id} node={node}
              filled={rodovid[node.id]}
              onClick={() => setEditing(node.id)} />
          ))}
        </svg>

        {(motherFilled || fatherFilled) && (
          <div className="rod-parent-rituals">
            <h3>Ритуал з батьками</h3>
            <p className="rod-parent-rituals-hint">
              Annehmen — прийняти і повернути. Можна для одного, можна для обох.
            </p>
            <div className="rod-parent-rituals-grid">
              {fatherFilled && (
                <ParentRitualCard parent="father" name={rodovid.father.name}
                  state={ritualState.father}
                  onOpen={() => setParentRitualOpen('father')} />
              )}
              {motherFilled && (
                <ParentRitualCard parent="mother" name={rodovid.mother.name}
                  state={ritualState.mother}
                  onOpen={() => setParentRitualOpen('mother')} />
              )}
            </div>
          </div>
        )}

        <ExcludedSection onCeremonyOpen={setCeremonyId} />
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
      {ceremonyId && (
        <ExcludedCeremony excludedId={ceremonyId}
          onClose={() => setCeremonyId(null)} />
      )}
      {parentRitualOpen && (
        <ParentRitual parent={parentRitualOpen}
          onClose={() => setParentRitualOpen(null)} />
      )}
    </div>
  );
}

function ParentRitualCard({ parent, name, state, onOpen }) {
  const accDone = !!state?.acceptance;
  const relDone = !!state?.release;
  const fullDone = accDone && relDone;
  const color = parent === 'mother' ? '#f0a8b8' : '#9fc8e8';
  const label = parent === 'mother' ? 'Мама' : 'Тато';

  return (
    <button type="button"
      className={`rod-parent-card${fullDone ? ' is-done' : ''}`}
      style={{ borderColor: `${color}66` }}
      onClick={onOpen}>
      <div className="rod-parent-card-icon" style={{ color }}>
        {parent === 'mother' ? '◈' : '◇'}
      </div>
      <div className="rod-parent-card-body">
        <div className="rod-parent-card-name" style={{ color }}>{name || label}</div>
        <div className="rod-parent-card-state">
          <span className={accDone ? 'is-done' : ''}>
            {accDone ? '✓' : '○'} беру
          </span>
          <span className={relDone ? 'is-done' : ''}>
            {relDone ? '✓' : '○'} залишаю
          </span>
        </div>
      </div>
    </button>
  );
}

function RodovidNode({ node, filled, onClick }) {
  const isMe = node.id === 'me';
  const isGreatGen = node.generation === 3;
  const r = isMe ? 32 : isGreatGen ? 18 : 26;
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
        fontSize={isMe ? 14 : isGreatGen ? 8 : 11} fontWeight="700"
        fill={filled ? '#1a0f0a' : '#a8a09b'}
        style={{ userSelect: 'none', pointerEvents: 'none' }}>
        {filled?.name?.slice(0, isGreatGen ? 5 : 12) || (isGreatGen ? '+' : node.label.split(' ')[0])}
      </text>
      {!isGreatGen && (
        <text x={node.x} y={node.y + r + 18} textAnchor="middle"
          fontSize="9" fill="#a8a09b"
          style={{ userSelect: 'none', pointerEvents: 'none' }}>
          {node.label.includes('(') ? node.label.match(/\(([^)]+)\)/)?.[1] : ''}
        </text>
      )}
      {!filled && !isGreatGen && (
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
