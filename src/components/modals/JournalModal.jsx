import { useState } from 'react';
import GameModal from '../GameModal.jsx';
import { useGameStore } from '../../store/gameStore.js';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const TAG_COLORS = {
  шлях: '#c9b3e8',
  намір: '#ffe7a8',
  ключ: '#e8c476',
  ритуал: '#a8d8e8',
  практика: '#a8e8c4',
  тінь: '#9890a8',
  'тінь-дзеркало': '#a890b0',
  розстановка: '#d8c8e8',
  архетип: '#e8c4a8',
  досягнення: '#ffe7a8',
  канал: '#c4e8e8',
  поле: '#c9b3e8',
  аура: '#ffe7a8',
  арбітр: '#e8d8a8',
  антип: '#e8a8a8',
  default: '#c8bca8',
};

export default function JournalModal({ onClose }) {
  const journal = useGameStore((s) => s.journal);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('all');

  const isEmpty = journal.length === 0;
  const allTags = [...new Set(journal.map((e) => e.tag).filter(Boolean))];

  const filtered = journal.filter((e) => {
    if (tagFilter !== 'all' && e.tag !== tagFilter) return false;
    if (search && !(e.text || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const title = isEmpty ? 'Журнал шляху'
    : `Журнал шляху · ${filtered.length}${filtered.length !== journal.length ? ` з ${journal.length}` : ''}`;

  return (
    <GameModal open onClose={onClose} title={title}>
      {isEmpty ? (
        <p style={{ color: '#c8bca8', fontStyle: 'italic', fontFamily: SYS }}>
          Поки порожньо. Журнал заповнюється з твоїх кроків.
        </p>
      ) : (
        <>
          <Filters search={search} setSearch={setSearch}
            tagFilter={tagFilter} setTagFilter={setTagFilter}
            allTags={allTags} />
          {filtered.length === 0 ? (
            <p style={{ color: '#c8bca8', fontStyle: 'italic', fontFamily: SYS, textAlign: 'center', padding: '20px 0', opacity: 0.7 }}>
              нічого не знайшлось — спробуй інший фільтр
            </p>
          ) : (
            <EntryList entries={filtered} />
          )}
        </>
      )}
    </GameModal>
  );
}

function Filters({ search, setSearch, tagFilter, setTagFilter, allTags }) {
  return (
    <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 пошук по запису..."
        style={{
          width: '100%', padding: '8px 12px',
          background: 'rgba(20,14,30,0.7)',
          border: '1px solid rgba(232,196,118,0.25)',
          borderRadius: '8px', color: '#fff7e0',
          fontFamily: SYS, fontSize: '13px', boxSizing: 'border-box',
        }} />
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        <TagChip active={tagFilter === 'all'} onClick={() => setTagFilter('all')} color="#fff7e0">усі</TagChip>
        {allTags.map((t) => (
          <TagChip key={t} active={tagFilter === t} onClick={() => setTagFilter(t)}
            color={TAG_COLORS[t] || TAG_COLORS.default}>
            {t}
          </TagChip>
        ))}
      </div>
    </div>
  );
}

function TagChip({ active, color, children, onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        padding: '4px 10px', borderRadius: '999px',
        background: active ? `${color}33` : 'rgba(20,14,30,0.5)',
        border: `1px solid ${active ? color : 'rgba(232,196,118,0.18)'}`,
        color: active ? color : 'rgba(255,247,224,0.75)',
        fontFamily: SYS, fontSize: '11px', fontWeight: 600,
        letterSpacing: '0.5px', cursor: 'pointer', whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
      {children}
    </button>
  );
}

function EntryList({ entries }) {
  let lastDay = null;
  return (
    <div>
      {entries.map((entry, i) => {
        const day = formatDay(entry.ts);
        const showDay = day && day !== lastDay;
        lastDay = day;
        return (
          <div key={i}>
            {showDay && (
              <div style={{ fontFamily: SYS, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(232,196,118,0.5)', margin: '14px 0 6px', fontWeight: 700 }}>
                — {day} —
              </div>
            )}
            <Entry entry={entry} />
          </div>
        );
      })}
    </div>
  );
}

function Entry({ entry }) {
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(232, 196, 118, 0.18)' }}>
      <div style={{
        fontFamily: SYS, fontSize: '11px', fontWeight: 700,
        letterSpacing: '3px', textTransform: 'uppercase',
        color: TAG_COLORS[entry.tag] || TAG_COLORS.default,
        marginBottom: '4px',
      }}>
        {entry.tag || 'запис'} · {formatTime(entry.ts)}
      </div>
      <div style={{
        fontFamily: SYS, fontStyle: 'italic',
        color: '#fff7e0', lineHeight: 1.45, fontSize: '15px',
      }}>
        {entry.text}
      </div>
    </div>
  );
}

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDay(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return 'сьогодні';
  const yesterday = new Date(today.getTime() - 86_400_000);
  if (d.toDateString() === yesterday.toDateString()) return 'учора';
  return d.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long' });
}
