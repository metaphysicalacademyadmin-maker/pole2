import GameModal from '../GameModal.jsx';
import { useGameStore } from '../../store/gameStore.js';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const TAG_COLORS = {
  шлях: '#c9b3e8',
  намір: '#ffe7a8',
  ключ: '#e8c476',
  default: '#c8bca8',
};

// Журнал — список записів зі store, від старіших до нових.
export default function JournalModal({ onClose }) {
  const journal = useGameStore((s) => s.journal);

  return (
    <GameModal open onClose={onClose} title="Журнал шляху">
      {journal.length === 0 && (
        <p style={{ color: '#c8bca8', fontStyle: 'italic', fontFamily: SYS }}>
          Поки порожньо. Журнал заповнюється з твоїх кроків.
        </p>
      )}
      {journal.map((entry, i) => (
        <div
          key={i}
          style={{
            padding: '12px 0',
            borderBottom: '1px solid rgba(232, 196, 118, 0.18)',
          }}
        >
          <div
            style={{
              fontFamily: SYS,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: TAG_COLORS[entry.tag] || TAG_COLORS.default,
              marginBottom: '4px',
            }}
          >
            {entry.tag || 'запис'} · {formatTime(entry.ts)}
          </div>
          <div
            style={{
              fontFamily: SYS,
              fontStyle: 'italic',
              color: '#fff7e0',
              lineHeight: 1.45,
              fontSize: '15px',
            }}
          >
            {entry.text}
          </div>
        </div>
      ))}
    </GameModal>
  );
}

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
