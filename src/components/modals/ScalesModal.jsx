import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useGameStore } from '../../store/gameStore.js';
import { STATE_SCALES } from '../../data/scales.js';

// 5 шкал стану — гравець оцінює сам, від -2 до +2.
export default function ScalesModal({ onClose }) {
  const stateScales = useGameStore((s) => s.stateScales);
  const setScale = useGameStore((s) => s.setScale);

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: 'primary.main' }}>
        Шкали стану · самооцінка
      </DialogTitle>
      <DialogContent dividers>
        <p
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontStyle: 'italic',
            color: 'var(--ink-secondary)',
            marginBottom: '1rem',
          }}
        >
          Постав себе по кожній шкалі — там, де відчуваєш себе зараз.
        </p>
        {STATE_SCALES.map((scale) => {
          const current = stateScales[scale.key] || 0;
          const lvl = scale.levels.find((l) => l.v === current) || scale.levels[2];
          return (
            <div
              key={scale.key}
              style={{ padding: '0.75rem 0', borderBottom: '0.5px solid var(--border-soft)' }}
            >
              <div
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '1rem',
                  color: 'var(--ink-primary)',
                  marginBottom: '0.5rem',
                }}
              >
                {scale.icon} {scale.name}: <em style={{ color: 'var(--gold)' }}>{lvl.label}</em>
              </div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {scale.levels.map((l) => (
                  <button
                    key={l.v}
                    type="button"
                    onClick={() => setScale(scale.key, l.v)}
                    className={`btn ${l.v === current ? 'btn-primary' : ''}`}
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </DialogContent>
    </Dialog>
  );
}
