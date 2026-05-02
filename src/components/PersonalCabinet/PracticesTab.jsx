import { useGameStore } from '../../store/gameStore.js';
import { PRACTICES, practicesForLevel } from '../../data/practices.js';

// Практики — список усіх 25+ з прогресом.
// Status: locked (рівень >current) / available / mastered (5+ виконань).

export default function PracticesTab() {
  const state = useGameStore();
  const completions = state.practiceCompletions || [];
  const currentLevel = state.currentLevel || 1;
  const available = new Set(practicesForLevel(currentLevel).map((p) => p.id));

  // Лічим виконання за id
  const counts = {};
  for (const c of completions) counts[c.id] = (counts[c.id] || 0) + 1;

  // Recommendation — за слабшим барометром
  const r = state.resources || {};
  let weakBar = null, minVal = 999;
  for (const [k, v] of Object.entries(r)) {
    if (v < minVal) { minVal = v; weakBar = k; }
  }
  const recommended = available.size > 0 && weakBar
    ? PRACTICES.filter((p) => available.has(p.id) && p.barometer === weakBar)[0]?.id
    : null;

  return (
    <div className="cab-pract">
      <div className="cab-pract-summary">
        <div className="cab-pract-summary-num">
          <strong>{Object.keys(counts).length}</strong> з {PRACTICES.length}
        </div>
        <div className="cab-pract-summary-label">практик розкрито</div>
        <div className="cab-pract-summary-extra">
          всього виконань: <strong>{completions.length}</strong>
        </div>
      </div>

      {recommended && (
        <div className="cab-pract-recommended">
          <div className="cab-block-label">рекомендую сьогодні</div>
          <PracticeRow
            practice={PRACTICES.find((p) => p.id === recommended)}
            count={counts[recommended] || 0}
            available
            isRec
          />
        </div>
      )}

      <div className="cab-block-label">усі практики</div>
      <div className="cab-pract-list">
        {PRACTICES.map((p) => (
          <PracticeRow key={p.id} practice={p}
            count={counts[p.id] || 0}
            available={available.has(p.id)} />
        ))}
      </div>
    </div>
  );
}

function PracticeRow({ practice, count, available, isRec }) {
  const isMastered = count >= 5;
  const status = isMastered ? 'mastered' : count > 0 ? 'practiced' : available ? 'available' : 'locked';
  return (
    <div className={`cab-pract-row status-${status}${isRec ? ' rec' : ''}`}>
      <div className="cab-pract-icon">{practice.icon || '·'}</div>
      <div className="cab-pract-info">
        <div className="cab-pract-name">{practice.name}</div>
        <div className="cab-pract-meta">
          рівень {practice.level} · {practice.duration} хв · {practice.barometer}
        </div>
      </div>
      <div className="cab-pract-status">
        {status === 'mastered' && <span className="cab-pract-badge mastered">💎 майстер</span>}
        {status === 'practiced' && <span className="cab-pract-badge practiced">{count}×</span>}
        {status === 'available' && <span className="cab-pract-badge available">доступна</span>}
        {status === 'locked' && <span className="cab-pract-badge locked">🔒</span>}
      </div>
    </div>
  );
}
