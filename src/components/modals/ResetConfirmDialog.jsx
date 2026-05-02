import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useGameStore } from '../../store/gameStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import { showToast } from '../GlobalToast.jsx';

// Confirm-діалог для archiveAndReset. Текст пояснює: твій прогрес НЕ зникне —
// він збережеться в історії як abandoned-сесія.
export default function ResetConfirmDialog({ onClose }) {
  const archiveAndReset = useGameStore((s) => s.archiveAndReset);
  const firstName = useProfileStore((s) => s.profile?.firstName);

  function handleReset() {
    archiveAndReset('abandoned');
    showToast('сесію збережено в історії · новий шлях', 'info', 2400);
    onClose();
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: 'primary.main' }}>
        {firstName ? `${firstName}, почати новий шлях?` : 'Почати новий шлях?'}
      </DialogTitle>
      <DialogContent dividers>
        <p
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontStyle: 'italic',
            color: 'var(--ink-secondary)',
            lineHeight: 1.55,
          }}
        >
          Поточну сесію буде збережено в історії — але закінчити її більше
          не зможеш. Обери це лише якщо відчуваєш що цей шлях не твій.
        </p>
      </DialogContent>
      <DialogActions sx={{ padding: '0.75rem 1.25rem', gap: '0.5rem' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          ні, продовжити
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleReset}
          style={{ borderColor: 'rgba(216,144,152,0.6)', color: '#d89098' }}
        >
          так, новий шлях
        </button>
      </DialogActions>
    </Dialog>
  );
}
