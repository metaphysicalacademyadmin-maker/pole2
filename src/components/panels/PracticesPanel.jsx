import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PRACTICES } from '../../data/practices.js';

// Sidebar блок: всі 25 практик, групування за рівнем,
// фільтр доступні/пройдено/всі, клік → відкриває PracticesModal
// з конкретною практикою (через onLaunch callback).
export default function PracticesPanel({ onLaunch }) {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const completions = useGameStore((s) => s.practiceCompletions);
  const [filter, setFilter] = useState('available');

  const completedIds = new Set(completions.map((c) => c.id));
  const list = filterList(PRACTICES, filter, currentLevel, completedIds);

  return (
    <div className="panel pp-panel">
      <div className="pp-header">
        <span className="panel-label">
          практики · {completions.length}/{PRACTICES.length}
        </span>
        <div className="pp-bar">
          <div className="pp-bar-fill"
            style={{ width: `${(completions.length / PRACTICES.length) * 100}%` }} />
        </div>
      </div>

      <div className="pp-tabs">
        <FilterBtn id="available" filter={filter} onSet={setFilter}>доступні</FilterBtn>
        <FilterBtn id="done" filter={filter} onSet={setFilter}>пройдено</FilterBtn>
        <FilterBtn id="all" filter={filter} onSet={setFilter}>всі</FilterBtn>
      </div>

      <div className="pp-list">
        {list.length === 0 && (
          <div className="pp-empty">
            {filter === 'done' ? 'ще жодної не пройшов' : 'нема у цій категорії'}
          </div>
        )}
        {list.map((p) => (
          <PracticeRow key={p.id}
            p={p}
            done={completedIds.has(p.id)}
            onClick={() => onLaunch?.(p)} />
        ))}
      </div>
    </div>
  );
}

function FilterBtn({ id, filter, onSet, children }) {
  return (
    <button type="button"
      className={`pp-tab${filter === id ? ' active' : ''}`}
      onClick={() => onSet(id)}>
      {children}
    </button>
  );
}

function PracticeRow({ p, done, onClick }) {
  return (
    <button type="button" className={`pp-row${done ? ' done' : ''}`} onClick={onClick}
      title={p.instruction}>
      <span className="pp-icon">{p.icon}</span>
      <span className="pp-row-info">
        <span className="pp-name">{p.name}</span>
        <span className="pp-meta">
          ур.{p.level} · {p.duration < 60 ? `${p.duration}хв` : `${p.duration / 60}г`} · +{p.barometer}
        </span>
      </span>
      {done && <span className="pp-tick">✓</span>}
    </button>
  );
}

function filterList(all, filter, currentLevel, doneSet) {
  if (filter === 'all') return all;
  if (filter === 'done') return all.filter((p) => doneSet.has(p.id));
  // available — рівень <= currentLevel + не виконано
  return all.filter((p) => p.level <= Math.max(1, currentLevel) && !doneSet.has(p.id));
}
