import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { findNode, lineageNodeMeta } from '../../data/rodovid-nodes.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import RodovidNodeEditor from './NodeEditor.jsx';
import ExcludedSection from './ExcludedSection.jsx';
import ExcludedCeremony from './ExcludedCeremony.jsx';
import HistoricalContext from './HistoricalContext.jsx';
import EntanglementCheck from './EntanglementCheck.jsx';
import ParentRitual from './ParentRitual.jsx';
import LineageTree from '../LineageTree/index.jsx';
import JoinGroupButton from '../JoinGroupButton.jsx';
import './styles.css';

// Rodovid Hub — об'єднана робота з родом.
// Головна візуалізація: LineageTree (7 поколінь, gen-graph дерево).
// Клік на вузол → RodovidNodeEditor (ім'я, дар, програма, alive,
// ритуальні фрази Хеллінгера + кнопка PowerRitual).
// Знизу — supplementary блоки: ParentRituals / Excluded / HistoricalContext /
// EntanglementCheck / Summary дарів + програм.
export default function Rodovid({ onClose }) {
  const rodovid = useGameStore((s) => s.rodovid) || {};
  const filledCount = Object.keys(rodovid).length;
  const [editing, setEditing] = useState(null);   // nodeId | null
  const [ceremonyId, setCeremonyId] = useState(null);   // excluded.id | null
  const [parentRitualOpen, setParentRitualOpen] = useState(null);   // 'mother'|'father'|null
  const motherFilled = !!rodovid.mother;
  const fatherFilled = !!rodovid.father;
  const ritualState = useGameStore((s) => s.rodovidParentRitual) || {};

  useOverlayA11y(onClose);

  return (
    <div className="rod-overlay" role="dialog" aria-modal="true" aria-label="Родовід">
      <div className="rod-frame">
        <button type="button" className="rod-close" onClick={onClose}
          aria-label="Закрити родовід">← повернутись</button>

        <div className="rod-header">
          <div className="rod-eyebrow">робота з родом</div>
          <h2 className="rod-title">Родове Дерево · 7 поколінь</h2>
          <p className="rod-sub">
            Не «правильно» — твоя версія. Те що ти знаєш, відчуваєш, пам'ятаєш.
            Клікни вузол → ім'я, дар, програма, ритуальні фрази, практика сили.
          </p>
          <div className="rod-progress">
            заповнено <strong>{filledCount}</strong> вузлів
          </div>
        </div>

        <LineageTree rodovid={rodovid} onClickNode={setEditing} />

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

function RodSummaryGifts({ data }) {
  const labelFor = (id) => findNode(id)?.label
    || guessLineageLabel(id)
    || id;
  const gifts = Object.entries(data)
    .filter(([_, v]) => v?.gift)
    .map(([id, v]) => ({ id, gift: v.gift, name: v.name || labelFor(id) }));
  const programs = Object.entries(data)
    .filter(([_, v]) => v?.program)
    .map(([id, v]) => ({ id, program: v.program, name: v.name || labelFor(id) }));

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

// Fallback для нових IDs g{N}-{idx} коли findNode() не знаходить (4-6 покоління).
function guessLineageLabel(id) {
  const m = id.match(/^g(\d)-(\d+)$/);
  if (!m) return null;
  return lineageNodeMeta(Number(m[1]), Number(m[2])).label;
}
