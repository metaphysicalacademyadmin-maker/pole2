import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import BreathCircle from '../Ritual/BreathCircle.jsx';
import PhaseDots from '../Ritual/PhaseDots.jsx';
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
const PHASES = ['тінь', 'світло', 'подяка', 'закриття'];
const PHASE_KEYS = ['shadow', 'light', 'gratitude', 'close'];

export default function EveningRitualModal({ onClose }) {
  const completeEveningRitual = useGameStore((s) => s.completeEveningRitual);
  const checkIns = useGameStore((s) => s.dailyCheckIns);
  const [phase, setPhase] = useState('shadow');
  const [shadow, setShadow] = useState('');
  const [light, setLight] = useState('');
  const [gratitude, setGratitude] = useState('');

  const phaseIdx = PHASE_KEYS.indexOf(phase);
  const next = () => setPhase(PHASE_KEYS[phaseIdx + 1]);
  const back = () => setPhase(PHASE_KEYS[phaseIdx - 1]);

  function handleSubmit() {
    if (!gratitude.trim()) {
      showToast('хоча б одна подяка — обов\'язково', 'warning');
      setPhase('gratitude');
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
      <DialogTitle sx={{ fontFamily: SYS, fontWeight: 700, color: '#c9b3e8', textAlign: 'center', fontSize: '17px' }}>
        🌙 Вечірній ритуал
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: 'rgba(122,90,120,0.3)' }}>
        <PhaseDots phases={PHASES} current={phaseIdx} />
        {phase === 'shadow' && (
          <ShadowPhase value={shadow} setValue={setShadow} onNext={next} />
        )}
        {phase === 'light' && (
          <LightPhase value={light} setValue={setLight} onBack={back} onNext={next} />
        )}
        {phase === 'gratitude' && (
          <GratitudePhase value={gratitude} setValue={setGratitude} onBack={back} onNext={next} />
        )}
        {phase === 'close' && (
          <ClosePhase onBack={back} onSubmit={handleSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
}

const labelStyle = (color) => ({ fontFamily: SYS, fontSize: '13px', fontWeight: 600, marginBottom: '6px', color });
const introStyle = { fontFamily: SYS, fontStyle: 'italic', color: '#d8c8d8', fontSize: '13px', textAlign: 'center', marginBottom: '14px', lineHeight: 1.55, opacity: 0.85 };

function ShadowPhase({ value, setValue, onNext }) {
  return (
    <div>
      <p style={introStyle}>Не борись із тінню. Просто визнач — і відпусти.</p>
      <div style={labelStyle('#a890b0')}>🌑 Що було Тінь сьогодні?</div>
      <textarea value={value} onChange={(e) => setValue(e.target.value)}
        placeholder="злість, вигоряння, страх, втома..."
        rows={3} style={{ ...TA_STYLE, marginBottom: '14px' }} />
      <button className="btn btn-primary" onClick={onNext} style={{ width: '100%' }}>далі →</button>
    </div>
  );
}

function LightPhase({ value, setValue, onBack, onNext }) {
  return (
    <div>
      <p style={introStyle}>Що сьогодні нагріло. Без скромності.</p>
      <div style={labelStyle('#f0c574')}>✦ Що було Світло?</div>
      <textarea value={value} onChange={(e) => setValue(e.target.value)}
        placeholder="радість, контакт, прозріння, спокій..."
        rows={3} style={{ ...TA_STYLE, marginBottom: '14px' }} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ flex: '0 0 auto' }}>← назад</button>
        <button className="btn btn-primary" onClick={onNext} style={{ flex: 1 }}>далі →</button>
      </div>
    </div>
  );
}

function GratitudePhase({ value, setValue, onBack, onNext }) {
  const ready = value.trim().length > 0;
  return (
    <div>
      <p style={introStyle}>Подяка — не ввічливість. Це визнання, що щось трапилось.</p>
      <div style={labelStyle('#ffe7a8')}>🙏 За що дякую</div>
      <textarea value={value} onChange={(e) => setValue(e.target.value)}
        placeholder="хоч одна річ, навіть дрібна"
        rows={3} style={{ ...TA_STYLE, marginBottom: '14px' }} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ flex: '0 0 auto' }}>← назад</button>
        <button className="btn btn-primary" onClick={onNext} disabled={!ready}
          style={{ flex: 1, opacity: ready ? 1 : 0.5, cursor: ready ? 'pointer' : 'not-allowed' }}>
          далі — закриття →
        </button>
      </div>
    </div>
  );
}

function ClosePhase({ onBack, onSubmit }) {
  return (
    <div style={{ textAlign: 'center', padding: '14px 0 6px' }}>
      <p style={{ ...introStyle, marginBottom: '22px', fontSize: '14px' }}>
        Один глибокий видих. День — закритий.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '34px' }}>
        <BreathCircle size={88} hue="violet" label="видих" />
      </div>
      <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#c9b3e8', fontSize: '13px', marginBottom: '20px', opacity: 0.85 }}>
        Те що було — лишається у Полі. Завтра — нова форма.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ flex: '0 0 auto' }}>← назад</button>
        <button className="btn btn-primary" onClick={onSubmit} style={{ flex: 1 }}>
          закрити день
        </button>
      </div>
    </div>
  );
}
