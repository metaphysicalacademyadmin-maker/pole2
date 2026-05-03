import { useMemo, useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PRACTICES, practicesForLevel } from '../../data/practices.js';

// Практики — список усіх з прогресом + клік для запуску.
// Status: locked (рівень >current) / available / practiced (1+) / mastered (5+).
//
// Сортування за замовчуванням: mastered → practiced → available → locked.
// Фільтри: усі / у роботі / освоєні / доступні / закриті.

const FILTERS = [
  { id: 'all',       label: 'усі' },
  { id: 'practiced', label: 'у роботі' },
  { id: 'mastered',  label: 'освоєні' },
  { id: 'available', label: 'доступні' },
];

export default function PracticesTab({ onLaunch }) {
  const state = useGameStore();
  const completions = state.practiceCompletions || [];
  const currentLevel = state.currentLevel || 1;
  const available = useMemo(
    () => new Set(practicesForLevel(currentLevel).map((p) => p.id)),
    [currentLevel],
  );
  const [filter, setFilter] = useState('all');

  // Лічим виконання + остання дата за id
  const stats = useMemo(() => {
    const m = {};
    for (const c of completions) {
      if (!m[c.id]) m[c.id] = { count: 0, lastTs: 0 };
      m[c.id].count += 1;
      if (c.ts > m[c.id].lastTs) m[c.id].lastTs = c.ts;
    }
    return m;
  }, [completions]);

  // Recommendation — за слабшим барометром
  const r = state.resources || {};
  let weakBar = null, minVal = 999;
  for (const [k, v] of Object.entries(r)) {
    if (v < minVal) { minVal = v; weakBar = k; }
  }
  const recommended = available.size > 0 && weakBar
    ? PRACTICES.filter((p) => available.has(p.id) && p.barometer === weakBar)[0]?.id
    : null;

  // Сортуємо: освоєні+практиковані наверху, потім доступні, потім locked
  const sorted = useMemo(() => {
    return [...PRACTICES].sort((a, b) => {
      const ca = stats[a.id]?.count || 0;
      const cb = stats[b.id]?.count || 0;
      const aRank = rankFor(a, ca, available);
      const bRank = rankFor(b, cb, available);
      if (aRank !== bRank) return aRank - bRank;
      // У межах rank — по count desc, потім level asc
      if (cb !== ca) return cb - ca;
      return a.level - b.level;
    });
  }, [stats, available]);

  const filtered = useMemo(() => {
    if (filter === 'all') return sorted;
    return sorted.filter((p) => {
      const c = stats[p.id]?.count || 0;
      if (filter === 'mastered')  return c >= 5;
      if (filter === 'practiced') return c > 0 && c < 5;
      if (filter === 'available') return c === 0 && available.has(p.id);
      return true;
    });
  }, [sorted, filter, stats, available]);

  return (
    <div className="cab-pract">
      <div className="cab-pract-summary">
        <div className="cab-pract-summary-num">
          <strong>{Object.keys(stats).length}</strong> з {PRACTICES.length}
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
            stat={stats[recommended] || { count: 0 }}
            available
            isRec
            onLaunch={onLaunch}
          />
        </div>
      )}

      <div className="cab-pract-filters">
        {FILTERS.map((f) => (
          <button key={f.id} type="button"
            className={`cab-pract-chip ${filter === f.id ? 'is-active' : ''}`}
            onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="cab-pract-list">
        {filtered.length === 0 ? (
          <div className="cab-pract-empty">
            нічого у цій категорії — спробуй іншу
          </div>
        ) : (
          filtered.map((p) => (
            <PracticeRow key={p.id} practice={p}
              stat={stats[p.id] || { count: 0 }}
              available={available.has(p.id)}
              onLaunch={onLaunch} />
          ))
        )}
      </div>
    </div>
  );
}

function rankFor(p, count, available) {
  if (count >= 5) return 0;       // mastered
  if (count > 0)  return 1;       // practiced (у роботі)
  if (available.has(p.id)) return 2;  // available, не пройдена
  return 3;                        // locked
}

function PracticeRow({ practice, stat, available, isRec, onLaunch }) {
  const count = stat.count || 0;
  const isMastered = count >= 5;
  const status = isMastered ? 'mastered'
    : count > 0 ? 'practiced'
    : available ? 'available' : 'locked';

  const canRun = status !== 'locked' && typeof onLaunch === 'function';
  const lastDate = stat.lastTs ? formatDate(stat.lastTs) : null;

  const Tag = canRun ? 'button' : 'div';
  return (
    <Tag type={canRun ? 'button' : undefined}
      className={`cab-pract-row status-${status}${isRec ? ' rec' : ''}${canRun ? ' is-clickable' : ''}`}
      onClick={canRun ? () => onLaunch(practice) : undefined}
      aria-label={canRun ? `Запустити практику ${practice.name}` : undefined}>
      <div className="cab-pract-icon">{practice.icon || '·'}</div>
      <div className="cab-pract-info">
        <div className="cab-pract-name">{practice.name}</div>
        <div className="cab-pract-meta">
          рівень {practice.level} · {practice.duration} хв · +{practice.barometer}
          {lastDate && <span className="cab-pract-last"> · востаннє {lastDate}</span>}
        </div>
      </div>
      <div className="cab-pract-status">
        {status === 'mastered'  && <span className="cab-pract-badge mastered">💎 майстер · {count}×</span>}
        {status === 'practiced' && <span className="cab-pract-badge practiced">{count}×</span>}
        {status === 'available' && <span className="cab-pract-badge available">доступна</span>}
        {status === 'locked'    && <span className="cab-pract-badge locked">🔒 рів. {practice.level}</span>}
        {canRun && <span className="cab-pract-arrow" aria-hidden="true">▶</span>}
      </div>
    </Tag>
  );
}

function formatDate(ts) {
  const d = new Date(ts);
  const today = new Date();
  const diff = Math.floor((today - d) / 86_400_000);
  if (diff === 0) return 'сьогодні';
  if (diff === 1) return 'учора';
  if (diff < 7) return `${diff} дн. тому`;
  if (diff < 30) return `${Math.floor(diff / 7)} тиж. тому`;
  return d.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long' });
}
