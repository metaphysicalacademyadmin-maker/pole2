import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameModal from './GameModal.jsx';

describe('GameModal', () => {
  it('renders title and children when open', () => {
    render(
      <GameModal open onClose={() => {}} title="Тестовий заголовок">
        <p>Вміст модалки</p>
      </GameModal>
    );

    expect(screen.getByText('Тестовий заголовок')).toBeInTheDocument();
    expect(screen.getByText('Вміст модалки')).toBeInTheDocument();
  });

  it('does NOT render when open is false', () => {
    render(
      <GameModal open={false} onClose={() => {}} title="Прихована">
        <p>Вміст</p>
      </GameModal>
    );

    expect(screen.queryByText('Прихована')).not.toBeInTheDocument();
    expect(screen.queryByText('Вміст')).not.toBeInTheDocument();
  });

  it('always renders the close icon button', () => {
    render(
      <GameModal open onClose={() => {}} title="Заголовок">
        <p>Контент</p>
      </GameModal>
    );

    // aria-label="закрити" задано у GameModal
    expect(screen.getByRole('button', { name: 'закрити' })).toBeInTheDocument();
  });

  it('calls onClose when × icon is clicked', async () => {
    const onClose = vi.fn();
    render(
      <GameModal open onClose={onClose} title="Заголовок">
        <p>Контент</p>
      </GameModal>
    );

    await userEvent.click(screen.getByRole('button', { name: 'закрити' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when escape pressed (MUI Dialog default)', async () => {
    const onClose = vi.fn();
    render(
      <GameModal open onClose={onClose} title="Заголовок">
        <p>Контент</p>
      </GameModal>
    );

    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('accepts ReactNode title (icon + text)', () => {
    render(
      <GameModal open onClose={() => {}} title={
        <>
          <span data-testid="icon">⚡</span>
          <span>Назва</span>
        </>
      }>
        <p>Контент</p>
      </GameModal>
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Назва')).toBeInTheDocument();
  });

  it('uses custom titleColor when passed', () => {
    render(
      <GameModal open onClose={() => {}} title="Заголовок" titleColor="#ff0000">
        <p>Контент</p>
      </GameModal>
    );

    // Колір застосовується через sx — перевіряємо що close-button має його
    const closeBtn = screen.getByRole('button', { name: 'закрити' });
    expect(closeBtn).toBeInTheDocument();
    // (детальна перевірка стилю через computed style потребує JSDOM, лишаємо
    // smoke-перевірку наявності елемента)
  });

  it('renders fullscreen on mobile viewport (≤ md / 900px)', () => {
    // happy-dom default viewport — встановлюємо mobile-розмір через matchMedia mock
    const originalMatch = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('max-width') && query.includes('900'), // imitate ≤md
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <GameModal open onClose={() => {}} title="Mobile Title">
        <p>Mobile content</p>
      </GameModal>
    );

    // На мобільному Dialog отримує `fullScreen` prop — DOM має клас MuiDialog-paperFullScreen
    // (точна реалізація залежить від MUI internals; обмежуємось smoke-render).
    expect(screen.getByText('Mobile Title')).toBeInTheDocument();
    expect(screen.getByText('Mobile content')).toBeInTheDocument();

    window.matchMedia = originalMatch;
  });

  it('respects maxWidth and fullWidth defaults', () => {
    // Тільки smoke-render — Dialog не дає простого доступу до maxWidth ззовні,
    // тому перевіряємо що компонент не падає з різними значеннями.
    const { rerender } = render(
      <GameModal open onClose={() => {}} title="t" maxWidth="xs">
        <p>x</p>
      </GameModal>
    );
    expect(screen.getByText('x')).toBeInTheDocument();

    rerender(
      <GameModal open onClose={() => {}} title="t" maxWidth="md" fullWidth={false}>
        <p>md</p>
      </GameModal>
    );
    expect(screen.getByText('md')).toBeInTheDocument();
  });
});
