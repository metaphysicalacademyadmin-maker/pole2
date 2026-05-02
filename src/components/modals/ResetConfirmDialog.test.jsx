import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetConfirmDialog from './ResetConfirmDialog.jsx';

const gameStore = {
  archiveAndReset: vi.fn(),
};

const profileStore = {
  profile: null,
};

vi.mock('../../store/gameStore.js', () => ({
  useGameStore: (selector) => (selector ? selector(gameStore) : gameStore),
}));

vi.mock('../../store/profileStore.js', () => ({
  useProfileStore: (selector) => (selector ? selector(profileStore) : profileStore),
}));

vi.mock('../GlobalToast.jsx', () => ({
  showToast: vi.fn(),
}));

import { showToast } from '../GlobalToast.jsx';

beforeEach(() => {
  gameStore.archiveAndReset.mockReset();
  profileStore.profile = null;
  showToast.mockReset();
});

describe('ResetConfirmDialog', () => {
  it('renders «Почати новий шлях?» title without firstName', () => {
    render(<ResetConfirmDialog onClose={() => {}} />);
    expect(screen.getByText('Почати новий шлях?')).toBeInTheDocument();
  });

  it('renders title with firstName when profile loaded', () => {
    profileStore.profile = { firstName: 'Назар' };
    render(<ResetConfirmDialog onClose={() => {}} />);
    expect(screen.getByText('Назар, почати новий шлях?')).toBeInTheDocument();
  });

  it('has «ні, продовжити» and «так, новий шлях» buttons', () => {
    render(<ResetConfirmDialog onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'ні, продовжити' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'так, новий шлях' })).toBeInTheDocument();
  });

  it('clicking confirm calls archiveAndReset + showToast + onClose', async () => {
    const onClose = vi.fn();
    render(<ResetConfirmDialog onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'так, новий шлях' }));
    expect(gameStore.archiveAndReset).toHaveBeenCalledWith('abandoned');
    expect(showToast).toHaveBeenCalledWith(
      expect.stringContaining('сесію збережено'),
      'info',
      2400
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking cancel calls onClose only', async () => {
    const onClose = vi.fn();
    render(<ResetConfirmDialog onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'ні, продовжити' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(gameStore.archiveAndReset).not.toHaveBeenCalled();
    expect(showToast).not.toHaveBeenCalled();
  });
});
