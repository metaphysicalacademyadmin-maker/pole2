import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Глобальний toast-канал. Будь-який компонент викликає showToast(msg, severity).
// Уникаємо контексту бо це оверкіл — використовуємо Module-level event bus.

const listeners = new Set();

export function showToast(message, severity = 'info', duration = 1800) {
  for (const fn of listeners) fn({ message, severity, duration });
}

export default function GlobalToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fn = (msg) => setToast({ ...msg, id: Date.now() });
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);

  function handleClose() {
    setToast(null);
  }

  return (
    <Snackbar
      open={!!toast}
      autoHideDuration={toast?.duration || 1800}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleClose}
      key={toast?.id || 'empty'}
    >
      {toast ? (
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={handleClose}
          sx={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          {toast.message}
        </Alert>
      ) : (
        <span />
      )}
    </Snackbar>
  );
}
