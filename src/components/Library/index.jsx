import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { loadIndex, searchLibrary, getSection, bookMeta, isAcademyAvailable } from '../../utils/library.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import LibraryReader from './Reader.jsx';
import './styles.css';

// Бібліотека Академії — інструмент-довідник.
// 3 джерела: космо PDF, методичка Академії, об'єднана база.
// Лазі-завантаження JSON через import() — у full-build один файл.
// Локальний пошук + опціональний AI-пошук через парент-сторінку.
export default function Library({ onClose }) {
  const trackUsage = useGameStore((s) => s.trackToolUsage);
  const [index, setIndex] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [filterBook, setFilterBook] = useState('all');

  useOverlayA11y(onClose);

  useEffect(() => {
    trackUsage('library');
    loadIndex().then(setIndex);
  }, [trackUsage]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const timer = setTimeout(async () => {
      const r = await searchLibrary(query, 50);
      if (!cancelled) {
        setResults(r);
        setSearching(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  async function handleOpen(entryId) {
    const section = await getSection(entryId);
    if (section) setOpenSection(section);
  }

  if (openSection) {
    return <LibraryReader section={openSection}
      onClose={() => setOpenSection(null)} />;
  }

  const items = results || (index?.entries || []);
  const filtered = filterBook === 'all'
    ? items
    : items.filter((e) => e.book === filterBook);

  const totalEntries = index?.totalEntries || 0;
  const aiAvailable = isAcademyAvailable();

  return (
    <div className="lib-overlay" role="dialog" aria-modal="true"
      aria-label="Бібліотека Академії">
      <div className="lib-frame">
        <button type="button" className="lib-close" onClick={onClose}
          aria-label="Закрити бібліотеку">← повернутись</button>

        <div className="lib-header">
          <div className="lib-eyebrow">матеріали академії</div>
          <h2 className="lib-title">📚 Бібліотека</h2>
          <p className="lib-sub">
            Космоенергетика, методичка, об'єднана база.
            {totalEntries > 0 && <> {totalEntries} статей.</>}
            {aiAvailable && <> ✦ AI-пошук активний.</>}
          </p>
        </div>

        <div className="lib-search">
          <input type="search" value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="шукай — канал, тема, питання..."
            className="lib-search-input" />
          {searching && <span className="lib-search-state">шукаю...</span>}
        </div>

        {totalEntries > 0 && (
          <div className="lib-filters">
            <button type="button"
              className={`lib-filter${filterBook === 'all' ? ' active' : ''}`}
              onClick={() => setFilterBook('all')}>усі</button>
            {Object.keys(index?.books || {}).map((id) => {
              const meta = bookMeta(id);
              return (
                <button key={id} type="button"
                  className={`lib-filter${filterBook === id ? ' active' : ''}`}
                  onClick={() => setFilterBook(id)}
                  style={filterBook === id ? { borderColor: meta.color, color: meta.color } : undefined}>
                  {meta.icon} {meta.label}
                </button>
              );
            })}
          </div>
        )}

        {totalEntries === 0 ? (
          <div className="lib-empty">
            <p>Поки що бібліотека порожня — це LITE-версія.</p>
            <p>Повна версія містить 660+ статей з матеріалів академії.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="lib-empty">
            <p>Нічого не знайдено за запитом «{query}».</p>
          </div>
        ) : (
          <div className="lib-list">
            {filtered.slice(0, 100).map((entry) => (
              <button key={entry.id} type="button"
                className="lib-item"
                onClick={() => handleOpen(entry.id)}>
                <span className="lib-item-icon" style={{ color: bookMeta(entry.book).color }}>
                  {bookMeta(entry.book).icon}
                </span>
                <span className="lib-item-body">
                  <span className="lib-item-title">{entry.title}</span>
                  {entry.snippet && (
                    <span className="lib-item-snippet">{entry.snippet}</span>
                  )}
                  <span className="lib-item-meta">
                    {bookMeta(entry.book).label}
                    {entry.chars && <> · {Math.round(entry.chars / 100) / 10}K симв.</>}
                  </span>
                </span>
              </button>
            ))}
            {filtered.length > 100 && (
              <div className="lib-more">
                ще {filtered.length - 100} результатів — уточни запит
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
