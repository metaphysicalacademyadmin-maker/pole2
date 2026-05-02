import { useGameStore } from '../../store/gameStore.js';
import { getAchievementsState } from '../../utils/achievement-detector.js';
import { tierColor } from '../../data/achievements.js';

// Грати з усіма 25+ досягненнями. Earned/locked стани, групи за tier'ом.

export default function AchievementsTab() {
  const state = useGameStore();
  const all = getAchievementsState(state);
  const earned = all.filter((a) => a.earned);
  const locked = all.filter((a) => !a.earned);

  return (
    <div className="cab-ach">
      <div className="cab-ach-summary">
        <div className="cab-ach-summary-num">
          <strong>{earned.length}</strong> / {all.length}
        </div>
        <div className="cab-ach-summary-label">досягнень розкрито</div>
        <div className="cab-ach-progress">
          <div className="cab-ach-progress-fill"
            style={{ width: `${(earned.length / all.length) * 100}%` }} />
        </div>
      </div>

      {earned.length > 0 && (
        <>
          <div className="cab-block-label">здобуто</div>
          <div className="cab-ach-grid">
            {earned.map((a) => <AchCard key={a.id} ach={a} />)}
          </div>
        </>
      )}

      <div className="cab-block-label">наступні</div>
      <div className="cab-ach-grid">
        {locked.map((a) => <AchCard key={a.id} ach={a} />)}
      </div>
    </div>
  );
}

function AchCard({ ach }) {
  const color = tierColor(ach.tier);
  const date = ach.earnedAt
    ? new Date(ach.earnedAt).toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' })
    : null;
  return (
    <div className={`cab-ach-card${ach.earned ? ' earned' : ''}`}
      style={{ '--ach-color': color }}>
      <div className="cab-ach-icon">{ach.earned ? ach.icon : '🔒'}</div>
      <div className="cab-ach-content">
        <div className="cab-ach-title">{ach.title}</div>
        <div className="cab-ach-desc">{ach.desc}</div>
        {date && <div className="cab-ach-date">{date}</div>}
      </div>
      {ach.earned && <div className="cab-ach-tier-bar" style={{ background: color }} />}
    </div>
  );
}
