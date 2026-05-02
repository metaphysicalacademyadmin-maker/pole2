import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useGameStore } from '../../store/gameStore.js';
import { cardForDate } from '../../data/daily-cards.js';
import { STATE_SCALES } from '../../data/scales.js';
import { showToast } from '../GlobalToast.jsx';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export default function DailyRitualModal({ onClose }) {
  const completeDailyCheckIn = useGameStore((s) => s.completeDailyCheckIn);
  const setScale = useGameStore((s) => s.setScale);
  const card = cardForDate();
  const [phase, setPhase] = useState('card');     // card | scales | reflection
  const [scales, setScales] = useState({});
  const [morning, setMorning] = useState('');
  const [dream, setDream] = useState('');

  function handleScale(key, v) {
    setScales((s) => ({ ...s, [key]: v }));
    setScale(key, v);
  }

  function handleSubmit() {
    completeDailyCheckIn({ scales, morning, dream });
    showToast('ранковий ритуал збережено', 'success');
    onClose();
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        fontFamily: SYS, fontWeight: 700, color: '#f0c574',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1,
      }}>
        <span>Ранковий ритуал · картка дня</span>
        <IconButton onClick={onClose} size="small" aria-label="закрити" sx={{ color: '#f0c574' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {phase === 'card' && (
          <CardPhase card={card} onNext={() => setPhase('scales')} />
        )}
        {phase === 'scales' && (
          <ScalesPhase scales={scales} onSet={handleScale} onNext={() => setPhase('reflection')} />
        )}
        {phase === 'reflection' && (
          <ReflectionPhase morning={morning} setMorning={setMorning}
            dream={dream} setDream={setDream}
            onSubmit={handleSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CardPhase({ card, onNext }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>{card.symbol}</div>
      <div style={{ fontFamily: SYS, fontSize: '28px', fontWeight: 700, color: '#fff7e0', marginBottom: '8px' }}>
        {card.name}
      </div>
      <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', opacity: 0.9, fontSize: '16px', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.55 }}>
        {card.hint}
      </p>
      <button className="btn btn-primary" onClick={onNext}>далі — як я зараз →</button>
    </div>
  );
}

function ScalesPhase({ scales, onSet, onNext }) {
  return (
    <div>
      <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', marginBottom: '16px' }}>
        Постав себе по 5 шкалах. Швидко, без думання.
      </p>
      {STATE_SCALES.map((sc) => (
        <div key={sc.key} style={{ marginBottom: '12px' }}>
          <div style={{ fontFamily: SYS, fontSize: '13px', color: '#f0c574', marginBottom: '4px', fontWeight: 600 }}>
            {sc.icon} {sc.name}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {sc.levels.map((l) => (
              <button key={l.v}
                onClick={() => onSet(sc.key, l.v)}
                style={{
                  flex: 1, padding: '6px 4px',
                  background: scales[sc.key] === l.v ? 'rgba(232,196,118,0.25)' : 'rgba(20,14,30,0.5)',
                  border: `1px solid ${scales[sc.key] === l.v ? '#f0c574' : 'rgba(232,196,118,0.2)'}`,
                  borderRadius: '6px',
                  color: '#fff7e0',
                  fontFamily: SYS, fontSize: '11px',
                  cursor: 'pointer',
                }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-primary" onClick={onNext} style={{ marginTop: '16px', width: '100%' }}>
        далі — рефлексія →
      </button>
    </div>
  );
}

function ReflectionPhase({ morning, setMorning, dream, setDream, onSubmit }) {
  const ta = (val, set, ph) => (
    <textarea value={val} onChange={(e) => set(e.target.value)} placeholder={ph} rows={2}
      style={{
        width: '100%', padding: '10px',
        background: '#1e1828', border: '1.5px solid #c89849',
        borderRadius: '8px', color: '#fff7e0', fontFamily: SYS,
        fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px',
        resize: 'vertical',
      }} />
  );
  return (
    <div>
      <div style={{ fontFamily: SYS, fontSize: '13px', color: '#f0c574', fontWeight: 600, marginBottom: '6px' }}>
        З чим прокинувся (одне речення):
      </div>
      {ta(morning, setMorning, 'наприклад: з втомою, з натхненням, з тривогою...')}
      <div style={{ fontFamily: SYS, fontSize: '13px', color: '#f0c574', fontWeight: 600, marginBottom: '6px' }}>
        Сон, якщо запам'ятав:
      </div>
      {ta(dream, setDream, '')}
      <button className="btn btn-primary" onClick={onSubmit} style={{ width: '100%' }}>
        зберегти ранок
      </button>
    </div>
  );
}
