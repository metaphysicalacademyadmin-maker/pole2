import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import HistoryModal from './HistoryModal.jsx';
import { HISTORY_KEY as KEY } from '../../store/defaultState.js';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('HistoryModal', () => {
  it('renders empty state «це твоя перша сесія» when localStorage empty', () => {
    render(<HistoryModal onClose={() => {}} />);
    expect(screen.getByText(/Це твоя перша сесія/)).toBeInTheDocument();
  });

  it('renders sessions when localStorage has entries', () => {
    const sessions = [
      {
        sessionId: 's1',
        startedAt: Date.now() - 86_400_000 * 3,
        finishedAt: Date.now() - 86_400_000,
        intention: 'знайти опору',
        levelsCompleted: 5,
        keys: { 1: 'я тут', 2: 'хочу' },
        reason: 'completed',
        pathMode: 'path',
      },
    ];
    localStorage.setItem(KEY, JSON.stringify(sessions));

    render(<HistoryModal onClose={() => {}} />);
    // Empty-state should NOT appear
    expect(screen.queryByText(/Це твоя перша сесія/)).not.toBeInTheDocument();
    // Intention rendered (appears in header summary AND session row → use getAllByText)
    expect(screen.getAllByText(/знайти опору/).length).toBeGreaterThan(0);
    // Levels count
    expect(screen.getByText(/5\/7 рівнів/)).toBeInTheDocument();
    // Reason badge — completed
    expect(screen.getByText(/✓ завершено/)).toBeInTheDocument();
  });

  it('shows abandoned reason badge for abandoned sessions', () => {
    const sessions = [
      {
        sessionId: 's2',
        startedAt: Date.now() - 86_400_000 * 5,
        intention: 'спроба перша',
        levelsCompleted: 2,
        keys: {},
        reason: 'abandoned',
        pathMode: 'touch',
      },
    ];
    localStorage.setItem(KEY, JSON.stringify(sessions));

    render(<HistoryModal onClose={() => {}} />);
    expect(screen.getByText(/◌ закинуто/)).toBeInTheDocument();
    expect(screen.getAllByText(/спроба перша/).length).toBeGreaterThan(0);
  });
});
