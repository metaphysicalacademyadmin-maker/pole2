import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useGameStore } from '../../store/gameStore.js';
import { showToast } from '../GlobalToast.jsx';
import { computeStreak, streakBadge } from '../../utils/streak-calc.js';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const TA_STYLE = {
  width: '100%', padding: '12px',
  background: '#1e1828', border: '1.5px solid #5a4060',
  borderRadius: '8px', color: '#fff7e0', fontFamily: SYS,
  fontSize: '14px', boxSizing: 'border-box',
  resize: 'vertical', lineHeight: 1.5,
};
const LABEL_STYLE = { fontFamily: SYS, fontSize: '13px', fontWeight: 600, marginBottom: '6px' };

export default function EveningRitualModal({ onClose }) {
  const completeEveningRitual = useGameStore((s) => s.completeEveningRitual);
  const checkIns = useGameStore((s) => s.dailyCheckIns);
  const [shadow, setShadow] = useState('');
  const [light, setLight] = useState('');
  const [gratitude, setGratitude] = useState('');

  function handleSubmit() {
    if (!gratitude.trim()) {
      showToast('хоча б одна подяка — обов\'язково', 'warning');
      return;
    }
    completeEveningRitual({ shadow, light, gratitude });
    const newStreak = computeStreak([...checkIns, { date: new Date().toISOString().slice(0, 10) }]);
    const badge = streakBadge(newStreak);
    showToast(
      badge ? `вечірній ритуал · ${newStreak} днів — ${badge.label}` : `вечірній ритуал · streak ${newStreak} днів`,
      'success',
    );
    onClose();
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { background: 'linear-gradient(180deg, #1a0e24, #2a0f30)', border: '1px solid rgba(122, 90, 120, 0.5)' } }}>
      <DialogTitle sx={{ fontFamily: SYS, fontWeight: 700, color: '#c9b3e8', textAlign: 'center' }}>
        🌙 Вечірній ритуал
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: 'rgba(122,90,120,0.3)' }}>
        <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#d8c8d8', fontSize: '14px', textAlign: 'center', marginBottom: '20px', lineHeight: 1.55 }}>
          Закрий день у трьох питаннях. Без напруги. Що приходить — те правда.
        </p>

        <div style={{ ...LABEL_STYLE, color: '#a890b0' }}>🌑 Що було Тінь сьогодні?</div>
        <textarea value={shadow} onChange={(e) => setShadow(e.target.value)}
          placeholder="злість, вигоряння, страх, втома..."
          rows={2} style={{ ...TA_STYLE, marginBottom: '14px' }} />

        <div style={{ ...LABEL_STYLE, color: '#f0c574' }}>✦ Що було Світло?</div>
        <textarea value={light} onChange={(e) => setLight(e.target.value)}
          placeholder="радість, контакт, прозріння, спокій..."
          rows={2} style={{ ...TA_STYLE, marginBottom: '14px' }} />

        <div style={{ ...LABEL_STYLE, color: '#ffe7a8' }}>🙏 За що дякую</div>
        <textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)}
          placeholder="хоч одна річ, навіть дрібна"
          rows={2} style={{ ...TA_STYLE, marginBottom: '18px' }} />

        <button className="btn btn-primary" onClick={handleSubmit} style={{ width: '100%' }}>
          закрити день
        </button>
      </DialogContent>
    </Dialog>
  );
}
