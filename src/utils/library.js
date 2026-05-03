// Бібліотека Академії — пошук і читання матеріалів.
//
// Стратегія: JSON-файли імпортуються динамічно через import() —
// у full-build vite їх інлайнить у chunk; у lite-build alias підмінює
// на порожні стаби (без матеріалів).
//
// Контракт парент-сторінки (для майбутнього AI-search):
//   window.__POLE_LIBRARY__ = {
//     search: async (query) => [{id, book, title, snippet, score}],
//     getSection: async (id) => {id, book, title, body, chapter?},
//   };
// Якщо є — використовуємо парент. Інакше локальний пошук по index.json.

let _index = null;
let _bookCache = {};

export function isAcademyAvailable() {
  return typeof window !== 'undefined' && !!window.__POLE_LIBRARY__;
}

export async function loadIndex() {
  if (_index) return _index;
  try {
    const mod = await import('../data/library/index.json');
    _index = mod.default || mod;
    return _index;
  } catch (e) {
    return { entries: [], books: {}, totalEntries: 0 };
  }
}

export async function loadBook(bookId) {
  if (_bookCache[bookId]) return _bookCache[bookId];
  try {
    let mod;
    if (bookId === 'cosmo')      mod = await import('../data/library/cosmo.json');
    else if (bookId === 'meth')  mod = await import('../data/library/methodichka.json');
    else if (bookId === 'united') mod = await import('../data/library/united.json');
    else return null;
    _bookCache[bookId] = mod.default || mod;
    return _bookCache[bookId];
  } catch (e) {
    return null;
  }
}

export async function getSection(sectionId) {
  // Якщо є парент-API — використовуємо
  if (isAcademyAvailable() && window.__POLE_LIBRARY__.getSection) {
    try { return await window.__POLE_LIBRARY__.getSection(sectionId); }
    catch (e) { /* fall through */ }
  }
  // Локальний пошук — спершу знаходимо у якій книзі
  const idx = await loadIndex();
  const meta = (idx.entries || []).find((e) => e.id === sectionId);
  if (!meta) return null;
  const book = await loadBook(meta.book);
  if (!book) return null;
  return book.sections.find((s) => s.id === sectionId) || null;
}

export async function searchLibrary(query, limit = 30) {
  if (!query?.trim()) return [];

  // Якщо є AI-search — делегуємо
  if (isAcademyAvailable() && window.__POLE_LIBRARY__.search) {
    try {
      const res = await window.__POLE_LIBRARY__.search(query);
      return Array.isArray(res) ? res.slice(0, limit) : [];
    } catch (e) { /* fall through */ }
  }

  // Локальний пошук — спершу по titles, потім по body
  const q = query.trim().toLowerCase();
  const idx = await loadIndex();
  const entries = idx.entries || [];

  // 1. Швидкий пошук по titles
  const titleHits = entries.filter((e) => e.title.toLowerCase().includes(q));
  if (titleHits.length >= limit) return titleHits.slice(0, limit);

  // 2. Глибокий пошук по body — лиш якщо потрібно
  const titleIds = new Set(titleHits.map((e) => e.id));
  const remaining = limit - titleHits.length;
  const books = ['cosmo', 'meth', 'united'];
  const bodyHits = [];

  for (const bookId of books) {
    if (bodyHits.length >= remaining) break;
    const book = await loadBook(bookId);
    if (!book) continue;
    for (const section of book.sections) {
      if (titleIds.has(section.id)) continue;
      if (section.body?.toLowerCase().includes(q)) {
        const idx2 = section.body.toLowerCase().indexOf(q);
        const start = Math.max(0, idx2 - 60);
        const end = Math.min(section.body.length, idx2 + q.length + 80);
        const snippet = (start > 0 ? '…' : '') + section.body.slice(start, end) + (end < section.body.length ? '…' : '');
        bodyHits.push({
          id: section.id,
          book: bookId,
          title: section.title,
          snippet,
        });
        if (bodyHits.length >= remaining) break;
      }
    }
  }

  return [...titleHits, ...bodyHits];
}

export const LIBRARY_BOOKS = {
  cosmo:  { label: 'Космоенергетика', icon: '🔮', color: '#c9b3e8' },
  meth:   { label: 'Методичка Академії', icon: '📖', color: '#f0c574' },
  united: { label: 'Об\'єднана база', icon: '📚', color: '#74c5b5' },
};

export function bookMeta(id) {
  return LIBRARY_BOOKS[id] || { label: id, icon: '·', color: '#a8a09b' };
}
