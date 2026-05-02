import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChannelsModal from './ChannelsModal.jsx';

const mockStore = {
  channelsUnlocked: [],
  channelsActive: [],
  resources: {},
  activateChannel: vi.fn(),
  deactivateChannel: vi.fn(),
};

vi.mock('../../store/gameStore.js', () => ({
  useGameStore: (selector) => (selector ? selector(mockStore) : mockStore),
}));

vi.mock('../GlobalToast.jsx', () => ({
  showToast: vi.fn(),
}));

import { showToast } from '../GlobalToast.jsx';

beforeEach(() => {
  mockStore.channelsUnlocked = [];
  mockStore.channelsActive = [];
  mockStore.resources = {};
  mockStore.activateChannel.mockReset();
  mockStore.deactivateChannel.mockReset();
  showToast.mockReset();
});

describe('ChannelsModal', () => {
  it('renders without crashing', () => {
    render(<ChannelsModal onClose={() => {}} />);
    expect(screen.getByText('Космоенергетичні канали')).toBeInTheDocument();
  });

  it('shows locked channel with 🔒 + threshold when neither unlocked nor canUnlock', () => {
    // No resources, nothing unlocked → first channel (Фарун-Будда, root threshold 4) locked
    render(<ChannelsModal onClose={() => {}} />);
    expect(screen.getByText(/🔒 Фарун-Будда/)).toBeInTheDocument();
    expect(screen.getByText(/root: 0\/4/)).toBeInTheDocument();
  });

  it('shows unlocked channel with «увімкнути» button', () => {
    mockStore.channelsUnlocked = ['farun_budda'];
    render(<ChannelsModal onClose={() => {}} />);
    // At least one «увімкнути» visible
    expect(screen.getAllByRole('button', { name: 'увімкнути' }).length).toBeGreaterThan(0);
  });

  it('clicking «увімкнути» calls store activate + showToast', async () => {
    mockStore.channelsUnlocked = ['farun_budda'];
    render(<ChannelsModal onClose={() => {}} />);
    const buttons = screen.getAllByRole('button', { name: 'увімкнути' });
    await userEvent.click(buttons[0]);
    expect(mockStore.activateChannel).toHaveBeenCalledWith('farun_budda');
    expect(showToast).toHaveBeenCalledWith(
      expect.stringContaining('Фарун-Будда'),
      'success'
    );
  });

  it('clicking «вимкнути» on active channel calls deactivate', async () => {
    mockStore.channelsUnlocked = ['farun_budda'];
    mockStore.channelsActive = ['farun_budda'];
    render(<ChannelsModal onClose={() => {}} />);
    const offBtn = screen.getByRole('button', { name: 'вимкнути' });
    await userEvent.click(offBtn);
    expect(mockStore.deactivateChannel).toHaveBeenCalledWith('farun_budda');
  });

  it('toggle "як налаштуватись" shows/hides practice text', async () => {
    mockStore.channelsUnlocked = ['farun_budda'];
    render(<ChannelsModal onClose={() => {}} />);
    const toggles = screen.getAllByRole('button', { name: /↓ як налаштуватись/ });
    expect(toggles.length).toBeGreaterThan(0);

    // Practice text initially hidden (Фарун-Будда practice text contains "теплий потік")
    expect(screen.queryByText(/теплий потік/)).not.toBeInTheDocument();

    await userEvent.click(toggles[0]);
    expect(screen.getByText(/теплий потік/)).toBeInTheDocument();

    // Now button label shows "сховати"
    const hideBtn = screen.getAllByRole('button', { name: /↑ сховати/ })[0];
    await userEvent.click(hideBtn);
    expect(screen.queryByText(/теплий потік/)).not.toBeInTheDocument();
  });
});
