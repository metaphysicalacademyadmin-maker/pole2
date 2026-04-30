import { useGameStore } from '../../store/gameStore.js';

const TAG_COLORS = {
  шлях: 'var(--lvl-6)',
  намір: 'var(--gold-warm)',
  ключ: 'var(--gold)',
};

// Останні 3 записи журналу справа у сайдбарі. Клік → повна модалка.
export default function JournalMini({ onOpen }) {
  const journal = useGameStore((s) => s.journal);
  const last = journal.slice(-3).reverse();

  return (
    <div className="state-section">
      <div className="state-label">журнал</div>
      <div
        className="journal-mini"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpen();
        }}
      >
        {last.length === 0 ? (
          <div className="journal-mini-empty">журнал порожній</div>
        ) : (
          <>
            {last.map((e, i) => (
              <div key={`${e.ts}-${i}`} className="journal-mini-entry">
                {e.tag && (
                  <div
                    className="journal-mini-tag"
                    style={TAG_COLORS[e.tag] ? { color: TAG_COLORS[e.tag] } : undefined}
                  >
                    {e.tag}
                  </div>
                )}
                <div className="journal-mini-text">{truncate(e.text, 80)}</div>
              </div>
            ))}
            {journal.length > 3 && (
              <div className="journal-mini-more">всі {journal.length} →</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function truncate(s, len) {
  if (!s || s.length <= len) return s;
  return s.slice(0, len - 1) + '…';
}
