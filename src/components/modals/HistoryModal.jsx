import GameModal from '../GameModal.jsx';
import { HISTORY_KEY } from '../../store/defaultState.js';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// Історія всіх минулих сесій з localStorage[HISTORY_KEY].
// Timeline: коли почав, скільки рівнів, які ключі, які архетипи.
export default function HistoryModal({ onClose }) {
  let history = [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    history = raw ? JSON.parse(raw) : [];
  } catch (_) {}

  const sortedHistory = [...history].sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));

  return (
    <GameModal open onClose={onClose} maxWidth="md" title="Твої сесії — пам'ять Поля">
      {sortedHistory.length === 0 && (
        <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#c8bca8', textAlign: 'center', padding: 32 }}>
          Це твоя перша сесія. Поле тебе тільки впізнає.
        </p>
      )}
      {sortedHistory.length > 0 && (
        <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', opacity: 0.85, marginBottom: 20 }}>
          Ти {ordinal(sortedHistory.length + 1)} прийшов сюди.
          {sortedHistory[0]?.intention && ` Раніше ти приходив з наміром: «${sortedHistory[0].intention}».`}
        </p>
      )}
      {sortedHistory.map((s, i) => (
        <SessionRow key={s.sessionId || i} session={s} index={sortedHistory.length - i} />
      ))}
    </GameModal>
  );
}

function SessionRow({ session, index }) {
  const startDate = session.startedAt ? new Date(session.startedAt) : null;
  const finishDate = session.finishedAt ? new Date(session.finishedAt) : null;
  const days = startDate && finishDate
    ? Math.max(1, Math.round((finishDate - startDate) / (1000 * 60 * 60 * 24)))
    : null;
  const keysCount = Object.keys(session.keys || {}).length;
  const reasonColor = session.reason === 'completed' ? '#a8c898' : '#d89098';
  return (
    <div style={{
      padding: '14px 18px', marginBottom: 10,
      background: 'rgba(20, 14, 30, 0.7)',
      border: `1px solid ${reasonColor}`,
      borderRadius: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontFamily: SYS, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: reasonColor, textTransform: 'uppercase' }}>
          сесія №{index} · {session.reason === 'completed' ? '✓ завершено' : '◌ закинуто'}
        </div>
        <div style={{ fontFamily: SYS, fontSize: 11, color: '#c8bca8' }}>
          {startDate?.toLocaleDateString('uk-UA') || '—'}{days ? ` · ${days}д` : ''}
        </div>
      </div>
      {session.intention && (
        <div style={{ fontFamily: SYS, fontStyle: 'italic', fontSize: 14, color: '#fff7e0', marginBottom: 6 }}>
          «{session.intention}»
        </div>
      )}
      <div style={{ fontFamily: SYS, fontSize: 12, color: '#c8bca8' }}>
        {session.levelsCompleted || 0}/7 рівнів · {keysCount} ключі · {session.pathMode || '—'}
      </div>
    </div>
  );
}

function ordinal(n) {
  if (n === 1) return 'вперше';
  if (n === 2) return 'удруге';
  if (n === 3) return 'втретє';
  if (n === 4) return 'учетверте';
  return `${n}-й раз`;
}
