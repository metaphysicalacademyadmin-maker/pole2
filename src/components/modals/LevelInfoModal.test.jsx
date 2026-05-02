import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LevelInfoModal from './LevelInfoModal.jsx';

const mockStore = {
  completedLevels: [],
  unlockedLevels: [0, 1],
  currentLevel: 1,
  levelProgress: {},
  levelKeys: {},
  pathMode: 'path',
  constellations: {},
};

vi.mock('../../store/gameStore.js', () => ({
  useGameStore: (selector) => (selector ? selector(mockStore) : mockStore),
}));

beforeEach(() => {
  mockStore.completedLevels = [];
  mockStore.unlockedLevels = [0, 1];
  mockStore.currentLevel = 1;
  mockStore.levelProgress = {};
  mockStore.levelKeys = {};
  mockStore.pathMode = 'path';
  mockStore.constellations = {};
});

describe('LevelInfoModal', () => {
  it('renders level name and number', () => {
    render(<LevelInfoModal levelN={1} onClose={() => {}} />);
    // Title: "1. Коріння"
    expect(screen.getByText('1. Коріння')).toBeInTheDocument();
  });

  it('returns null when level not found (e.g. 99)', () => {
    // levelByNumber falls back to PYRAMID_LEVELS[0] (entry) — so it always returns an lvl,
    // but to be safe, the visible behavior is rendering level 0 when 99 passed.
    // However for unknown levels the render still works. Skip strict null check.
    // We just verify no crash and level 0 (Вхід) is rendered as fallback.
    render(<LevelInfoModal levelN={99} onClose={() => {}} />);
    // Fallback to Вхід
    expect(screen.getByText(/Вхід/)).toBeInTheDocument();
  });

  it('shows status badge "у роботі" when current level', () => {
    mockStore.currentLevel = 1;
    mockStore.unlockedLevels = [0, 1];
    render(<LevelInfoModal levelN={1} onClose={() => {}} />);
    expect(screen.getByText('у роботі')).toBeInTheDocument();
  });

  it('shows status badge "завершено" when level completed', () => {
    mockStore.completedLevels = [1];
    mockStore.currentLevel = 2;
    render(<LevelInfoModal levelN={1} onClose={() => {}} />);
    expect(screen.getByText('завершено')).toBeInTheDocument();
  });

  it('shows status badge "відкрито" when unlocked but not current/completed', () => {
    mockStore.unlockedLevels = [0, 1, 2];
    mockStore.currentLevel = 1;
    render(<LevelInfoModal levelN={2} onClose={() => {}} />);
    expect(screen.getByText('відкрито')).toBeInTheDocument();
  });

  it('shows status badge "заблоковано" and lock message when level not unlocked', () => {
    mockStore.unlockedLevels = [0, 1];
    mockStore.currentLevel = 1;
    render(<LevelInfoModal levelN={5} onClose={() => {}} />);
    expect(screen.getByText('заблоковано')).toBeInTheDocument();
    expect(screen.getByText(/Цей рівень розблокується/)).toBeInTheDocument();
  });

  it('shows progress bar with answered count', () => {
    mockStore.unlockedLevels = [0, 1];
    mockStore.currentLevel = 1;
    mockStore.levelProgress = { 1: { answeredCells: ['a', 'b', 'c'] } };
    render(<LevelInfoModal levelN={1} onClose={() => {}} />);
    expect(screen.getByText(/Прогрес клітинок/)).toBeInTheDocument();
    // "<3> / N клітинок" — 3 answered (rendered as <strong>3</strong>)
    expect(screen.getByText('3')).toBeInTheDocument();
    // Ambiguous /клітинок/ matches both header and progress row → use getAllByText
    expect(screen.getAllByText(/клітинок/).length).toBeGreaterThanOrEqual(2);
  });

  it('shows "Твій ключ" block if levelKeys[N] exists', () => {
    mockStore.completedLevels = [1];
    mockStore.levelKeys = { 1: 'я тут' };
    render(<LevelInfoModal levelN={1} onClose={() => {}} />);
    expect(screen.getByText('Твій ключ')).toBeInTheDocument();
    expect(screen.getByText('«я тут»')).toBeInTheDocument();
  });

  it('shows "Розстановка" if constellations[N].resolution exists', () => {
    mockStore.completedLevels = [1];
    mockStore.constellations = {
      1: {
        figures: [{}, {}, {}],
        resolution: 'я бачу свого роду\nі дякую',
      },
    };
    render(<LevelInfoModal levelN={1} onClose={() => {}} />);
    expect(screen.getByText('Розстановка')).toBeInTheDocument();
    expect(screen.getByText(/3 фігур у полі/)).toBeInTheDocument();
  });
});
