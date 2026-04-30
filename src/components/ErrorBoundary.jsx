import { Component } from 'react';

// Захист від crash-у в одній сцені — гра не вмирає, користувачу пропонується
// або скинути сесію (видалити localStorage), або перезавантажити сторінку.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
    this.setState({ info });
  }

  handleReset = () => {
    try {
      localStorage.removeItem('pole_game_state_v1');
    } catch (_) {}
    location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="scene">
        <div
          style={{
            maxWidth: 520,
            margin: '6rem auto',
            padding: '2rem',
            textAlign: 'center',
            background: 'var(--space-surface)',
            border: '0.5px solid var(--gold-deep)',
            borderRadius: 14,
          }}
        >
          <div
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.6875rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'var(--warn-rose, #d89098)',
              marginBottom: '1rem',
            }}
          >
            гра спіткнулась
          </div>
          <h2
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 300,
              color: 'var(--gold-light)',
              fontSize: '1.75rem',
              marginBottom: '1rem',
            }}
          >
            Поле тимчасово зашуміло
          </h2>
          <p
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontStyle: 'italic',
              color: 'var(--ink-secondary)',
              lineHeight: 1.55,
              marginBottom: '1.5rem',
            }}
          >
            Сталась помилка у твоїй сесії. Можеш просто перезавантажити сторінку
            — стан збережений. Або скинути сесію, якщо проблема повторюється.
          </p>
          <pre
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.6875rem',
              color: 'var(--ink-tertiary)',
              background: 'rgba(20,14,30,0.6)',
              padding: '0.75rem',
              borderRadius: 8,
              textAlign: 'left',
              overflow: 'auto',
              maxHeight: 100,
              marginBottom: '1.5rem',
            }}
          >
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => location.reload()}
            >
              перезавантажити
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleReset}
            >
              скинути сесію
            </button>
          </div>
        </div>
      </main>
    );
  }
}
