import { useState, useEffect } from 'react';

const HISTORY_KEY = 'pole_game_history_v1';

// Сесії · історія — всі завершені/перервані сесії з localStorage history.

export default function SessionsTab() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setHistory([...list].reverse());
    } catch (_) { setHistory([]); }
  }, []);

  if (history.length === 0) {
    return (
      <div className="cab-sessions">
        <div className="cab-empty">
          історія порожня · перша сесія з'явиться тут після завершення (рівень 7) або скидання
        </div>
      </div>
    );
  }

  return (
    <div className="cab-sessions">
      <div className="cab-block-label">архів сесій · {history.length}</div>
      <div className="cab-sessions-list">
        {history.map((s) => (
          <SessionRow key={s.sessionId} session={s} />
        ))}
      </div>
    </div>
  );
}

function SessionRow({ session }) {
  const start = session.startedAt ? new Date(session.startedAt) : null;
  const end = session.finishedAt ? new Date(session.finishedAt) : null;
  const days = start && end
    ? Math.max(1, Math.round((end - start) / 86400000))
    : null;
  const reason = session.reason || 'completed';
  const keys = Object.keys(session.keys || {}).length;
  const cells = Object.keys(session.cellAnswers || {}).length;

  return (
    <div className={`cab-session-row reason-${reason}`}>
      <div className="cab-session-header">
        <div className="cab-session-date">
          {start?.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long', year: 'numeric' }) || 'без дати'}
        </div>
        <div className={`cab-session-tag tag-${reason}`}>
          {reason === 'completed' ? '✓ завершено' : reason === 'abandoned' ? '◌ перервано' : reason}
        </div>
      </div>
      {session.intention && (
        <div className="cab-session-intention">«{session.intention}»</div>
      )}
      <div className="cab-session-meta">
        <span><strong>{session.levelsCompleted || 0}</strong>/7 рівнів</span>
        <span><strong>{keys}</strong> ключів</span>
        <span><strong>{cells}</strong> клітинок</span>
        {days && <span>{days} {days === 1 ? 'день' : days < 5 ? 'дні' : 'днів'}</span>}
        {session.pathMode && <span>{session.pathMode}</span>}
      </div>
    </div>
  );
}
