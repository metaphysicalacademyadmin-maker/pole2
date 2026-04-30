import { useGameStore } from '../../store/gameStore.js';

// Тема: dark (космос) / soft (м'якший фіолетовий)
export default function ThemeToggle() {
  const themeMode = useGameStore((s) => s.themeMode);
  const setThemeMode = useGameStore((s) => s.setThemeMode);
  const isSoft = themeMode === 'soft';
  return (
    <button type="button"
      onClick={() => setThemeMode(isSoft ? 'dark' : 'soft')}
      title={isSoft ? 'м\'який режим — клікни щоб перейти у космос' : 'космічний режим — клікни щоб перейти у м\'який'}
      style={{
        padding: '4px 12px',
        background: 'rgba(20, 14, 30, 0.7)',
        border: '1px solid rgba(232, 196, 118, 0.3)',
        borderRadius: 999,
        color: '#c8bca8',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 1,
        cursor: 'pointer',
      }}>
      {isSoft ? '☾ м\'який' : '✦ космос'}
    </button>
  );
}
