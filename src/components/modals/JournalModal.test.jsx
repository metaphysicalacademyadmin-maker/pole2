import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import JournalModal from './JournalModal.jsx';

const mockStore = {
  journal: [],
};

vi.mock('../../store/gameStore.js', () => ({
  useGameStore: (selector) => (selector ? selector(mockStore) : mockStore),
}));

beforeEach(() => {
  mockStore.journal = [];
});

describe('JournalModal', () => {
  it('renders empty state when journal empty', () => {
    render(<JournalModal onClose={() => {}} />);
    expect(screen.getByText(/Поки порожньо/)).toBeInTheDocument();
  });

  it('renders entries with tag + text', () => {
    mockStore.journal = [
      { tag: 'намір', text: 'хочу знайти опору', ts: Date.now() },
      { tag: 'ключ', text: 'я тут', ts: Date.now() },
    ];
    render(<JournalModal onClose={() => {}} />);
    expect(screen.getByText('хочу знайти опору')).toBeInTheDocument();
    expect(screen.getByText('я тут')).toBeInTheDocument();
    // Tag labels (uppercase via CSS, but text in DOM is original)
    expect(screen.getByText(/намір ·/)).toBeInTheDocument();
    expect(screen.getByText(/ключ ·/)).toBeInTheDocument();
  });

  it('applies TAG_COLORS for known tags', () => {
    mockStore.journal = [
      { tag: 'шлях', text: 'крок', ts: Date.now() },
      { tag: 'ключ', text: 'слово', ts: Date.now() },
      { tag: 'unknown_tag', text: 'інше', ts: Date.now() },
    ];
    render(<JournalModal onClose={() => {}} />);

    const shliahTag = screen.getByText(/шлях ·/);
    const keyTag = screen.getByText(/ключ ·/);
    const unknownTag = screen.getByText(/unknown_tag ·/);

    // TAG_COLORS: шлях #c9b3e8, ключ #e8c476, default #c8bca8
    // happy-dom preserves the hex value as written.
    const norm = (c) => c.toLowerCase().replace(/\s/g, '');
    expect(norm(shliahTag.style.color)).toMatch(/#c9b3e8|rgb\(201,179,232\)/);
    expect(norm(keyTag.style.color)).toMatch(/#e8c476|rgb\(232,196,118\)/);
    expect(norm(unknownTag.style.color)).toMatch(/#c8bca8|rgb\(200,188,168\)/);
  });
});
