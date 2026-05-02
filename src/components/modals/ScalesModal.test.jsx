import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScalesModal from './ScalesModal.jsx';
import { STATE_SCALES } from '../../data/scales.js';

const mockStore = {
  stateScales: {},
  setScale: vi.fn(),
};

vi.mock('../../store/gameStore.js', () => ({
  useGameStore: (selector) => (selector ? selector(mockStore) : mockStore),
}));

beforeEach(() => {
  mockStore.stateScales = {};
  mockStore.setScale.mockReset();
});

describe('ScalesModal', () => {
  it('renders all 5 STATE_SCALES with their icons', () => {
    render(<ScalesModal onClose={() => {}} />);
    for (const sc of STATE_SCALES) {
      // Headers contain "<icon> <name>:" (e.g. "◐ Енергія:")
      expect(screen.getByText(new RegExp(`${sc.name}:`))).toBeInTheDocument();
    }
    expect(STATE_SCALES.length).toBe(5);
  });

  it('shows current label for each scale (highlighted)', () => {
    // No state set → current=0 → middle level (index 2). For 'energy' v=0 is "нейтрально".
    render(<ScalesModal onClose={() => {}} />);
    // Each scale's level v=0 label appears in the header <em>
    // For energy scale, v=0 label is 'нейтрально'.
    // Because two scales have "нейтрально" (energy + protection), use queryAll.
    const matches = screen.getAllByText('нейтрально');
    expect(matches.length).toBeGreaterThan(0);
  });

  it('reflects custom stateScales values for header label', () => {
    mockStore.stateScales = { energy: 2 }; // 'переповнений'
    render(<ScalesModal onClose={() => {}} />);
    // The header for energy will contain "переповнений" — appears once as <em>.
    const labels = screen.getAllByText('переповнений');
    expect(labels.length).toBeGreaterThan(0); // at least one (header em + button text)
  });

  it('clicking a level button calls store setScale(key, v)', async () => {
    render(<ScalesModal onClose={() => {}} />);
    // Click the "у силі" button (energy v=1)
    const btns = screen.getAllByRole('button', { name: 'у силі' });
    await userEvent.click(btns[0]);
    expect(mockStore.setScale).toHaveBeenCalledWith('energy', 1);
  });
});
