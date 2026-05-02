import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PracticesModal from './PracticesModal.jsx';
import { practicesForLevel } from '../../data/practices.js';

const mockStore = {
  currentLevel: 1,
  completePractice: vi.fn(),
};

vi.mock('../../store/gameStore.js', () => ({
  useGameStore: (selector) => (selector ? selector(mockStore) : mockStore),
}));

vi.mock('../GlobalToast.jsx', () => ({
  showToast: vi.fn(),
}));

beforeEach(() => {
  mockStore.currentLevel = 1;
  mockStore.completePractice.mockReset();
});

describe('PracticesModal', () => {
  it('renders practice list when no autoLaunch', () => {
    render(<PracticesModal onClose={() => {}} />);
    // Title contains "Практики · доступні"
    expect(screen.getByText(/Практики · доступні/)).toBeInTheDocument();
    // First practice for level 1 — "Заземлення"
    expect(screen.getByText('Заземлення')).toBeInTheDocument();
  });

  it('clicking a practice opens runner intro', async () => {
    render(<PracticesModal onClose={() => {}} />);
    const groundingBtn = screen.getByText('Заземлення').closest('button');
    await userEvent.click(groundingBtn);

    // intro phase: «відмінити» and «почати» buttons
    expect(screen.getByRole('button', { name: 'відмінити' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /почати/ })).toBeInTheDocument();
  });

  it('intro phase «відмінити» returns to list', async () => {
    render(<PracticesModal onClose={() => {}} />);
    await userEvent.click(screen.getByText('Заземлення').closest('button'));
    await userEvent.click(screen.getByRole('button', { name: 'відмінити' }));
    // Back to list — title should mention "Практики · доступні"
    expect(screen.getByText(/Практики · доступні/)).toBeInTheDocument();
  });

  it('clicking «почати» moves to running phase with timer', async () => {
    render(<PracticesModal onClose={() => {}} />);
    await userEvent.click(screen.getByText('Заземлення').closest('button'));
    await userEvent.click(screen.getByRole('button', { name: /почати/ }));

    // Timer format MM:SS — Заземлення is 3 minutes → "03:00"
    expect(screen.getByText('03:00')).toBeInTheDocument();
    // "закрити раніше →" button visible during running
    expect(screen.getByRole('button', { name: /закрити раніше/ })).toBeInTheDocument();
  });

  it('autoLaunch=practice opens runner directly (skips list)', () => {
    const list = practicesForLevel(1);
    const autoLaunch = list[0]; // grounding
    render(<PracticesModal onClose={() => {}} autoLaunch={autoLaunch} />);

    // Title should be the practice's name (not "Практики · доступні")
    expect(screen.queryByText(/Практики · доступні/)).not.toBeInTheDocument();
    // The intro buttons are visible
    expect(screen.getByRole('button', { name: 'відмінити' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /почати/ })).toBeInTheDocument();
  });
});
