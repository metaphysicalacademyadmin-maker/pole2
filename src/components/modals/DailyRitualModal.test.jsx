import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DailyRitualModal from './DailyRitualModal.jsx';

const mockStore = {
  setScale: vi.fn(),
  completeDailyCheckIn: vi.fn(),
};

vi.mock('../../store/gameStore.js', () => ({
  useGameStore: (selector) => (selector ? selector(mockStore) : mockStore),
}));

vi.mock('../GlobalToast.jsx', () => ({
  showToast: vi.fn(),
}));

import { showToast } from '../GlobalToast.jsx';

beforeEach(() => {
  mockStore.setScale.mockReset();
  mockStore.completeDailyCheckIn.mockReset();
  showToast.mockReset();
});

describe('DailyRitualModal', () => {
  it('renders card phase first (button «далі — як я зараз»)', () => {
    render(<DailyRitualModal onClose={() => {}} />);
    expect(
      screen.getByRole('button', { name: /далі — як я зараз/ })
    ).toBeInTheDocument();
  });

  it('clicking next advances to scales phase', async () => {
    render(<DailyRitualModal onClose={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /далі — як я зараз/ }));
    // Scales phase shows STATE_SCALES — "Енергія" is first scale
    expect(screen.getByText(/Енергія/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /далі — рефлексія/ })).toBeInTheDocument();
  });

  it('scales phase shows STATE_SCALES and clicking level button calls store setScale', async () => {
    render(<DailyRitualModal onClose={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /далі — як я зараз/ }));

    // STATE_SCALES has 5 scales including: Енергія, Цілісність, Свобода, Ясність, Захист
    expect(screen.getByText(/Енергія/)).toBeInTheDocument();
    expect(screen.getByText(/Цілісність/)).toBeInTheDocument();
    expect(screen.getByText(/Свобода/)).toBeInTheDocument();
    expect(screen.getByText(/Захист/)).toBeInTheDocument();

    // Click some level (e.g. "у силі" — energy +1)
    const btn = screen.getAllByRole('button', { name: 'у силі' })[0];
    await userEvent.click(btn);
    expect(mockStore.setScale).toHaveBeenCalledWith('energy', 1);
  });

  it('clicking «далі — рефлексія» advances to reflection', async () => {
    render(<DailyRitualModal onClose={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /далі — як я зараз/ }));
    await userEvent.click(screen.getByRole('button', { name: /далі — рефлексія/ }));
    expect(screen.getByRole('button', { name: 'зберегти ранок' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/наприклад: з втомою/)).toBeInTheDocument();
  });

  it('clicking «зберегти ранок» calls completeDailyCheckIn + showToast + onClose', async () => {
    const onClose = vi.fn();
    render(<DailyRitualModal onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /далі — як я зараз/ }));
    await userEvent.click(screen.getByRole('button', { name: /далі — рефлексія/ }));
    await userEvent.click(screen.getByRole('button', { name: 'зберегти ранок' }));

    expect(mockStore.completeDailyCheckIn).toHaveBeenCalledTimes(1);
    expect(showToast).toHaveBeenCalledWith(
      expect.stringContaining('ранковий ритуал'),
      'success'
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
