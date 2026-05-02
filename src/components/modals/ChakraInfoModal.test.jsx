import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChakraInfoModal from './ChakraInfoModal.jsx';
import { PRACTICES } from '../../data/practices.js';

const mockStore = {
  completedLevels: [],
  resources: {},
};

vi.mock('../../store/gameStore.js', () => ({
  useGameStore: (selector) => (selector ? selector(mockStore) : mockStore),
}));

beforeEach(() => {
  mockStore.completedLevels = [];
  mockStore.resources = {};
});

describe('ChakraInfoModal', () => {
  it('renders chakra name when valid id', () => {
    render(<ChakraInfoModal chakraId="muladhara" onClose={() => {}} />);
    expect(screen.getByText('Муладхара')).toBeInTheDocument();
  });

  it('returns null when invalid id (chakra not found)', () => {
    const { container } = render(<ChakraInfoModal chakraId="not_a_chakra" onClose={() => {}} />);
    // GameModal not rendered → no DialogTitle/close button
    expect(screen.queryByRole('button', { name: 'закрити' })).not.toBeInTheDocument();
    // container should be effectively empty (component returned null)
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('shows "запалена" badge if level completed', () => {
    mockStore.completedLevels = [1]; // muladhara has levelN: 1
    render(<ChakraInfoModal chakraId="muladhara" onClose={() => {}} />);
    expect(screen.getByText(/запалена/)).toBeInTheDocument();
    expect(screen.queryByText(/не активована/)).not.toBeInTheDocument();
  });

  it('shows "не активована" otherwise', () => {
    mockStore.completedLevels = [];
    render(<ChakraInfoModal chakraId="muladhara" onClose={() => {}} />);
    expect(screen.getByText(/не активована/)).toBeInTheDocument();
  });

  it('shows linked practices', () => {
    render(<ChakraInfoModal chakraId="muladhara" onClose={() => {}} />);
    // muladhara.practiceIds: ['grounding', 'sensing_weight', 'pelvis_breath', 'fist_release']
    const myPractices = PRACTICES.filter((p) =>
      ['grounding', 'sensing_weight', 'pelvis_breath', 'fist_release'].includes(p.id)
    );
    expect(myPractices.length).toBeGreaterThan(0);
    // Each practice name should appear
    for (const p of myPractices) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    }
  });
});
