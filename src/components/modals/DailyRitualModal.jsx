import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import GameModal from '../GameModal.jsx';
import BreathCircle from '../Ritual/BreathCircle.jsx';
import PhaseDots from '../Ritual/PhaseDots.jsx';
import { useGameStore } from '../../store/gameStore.js';
import { cardForDate } from '../../data/daily-cards.js';
import { STATE_SCALES } from '../../data/scales.js';
import { showToast } from '../GlobalToast.jsx';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const PHASES = ['картка', 'шкали', 'рефлексія'];

export default function DailyRitualModal({ onClose }) {
  const completeDailyCheckIn = useGameStore((s) => s.completeDailyCheckIn);
  const setScale = useGameStore((s) => s.setScale);
  const card = cardForDate();
  const [phase, setPhase] = useState('card');
  const [scales, setScales] = useState({});
  const [morning, setMorning] = useState('');
  const [dream, setDream] = useState('');

  const phaseIdx = phase === 'card' ? 0 : phase === 'scales' ? 1 : 2;

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
    <GameModal open onClose={onClose} title="Ранковий ритуал · картка дня">
      <PhaseDots phases={PHASES} current={phaseIdx} />
      {phase === 'card' && (
        <CardPhase card={card} onNext={() => setPhase('scales')} />
      )}
      {phase === 'scales' && (
        <ScalesPhase scales={scales} onSet={handleScale}
          onBack={() => setPhase('card')}
          onNext={() => setPhase('reflection')} />
      )}
      {phase === 'reflection' && (
        <ReflectionPhase morning={morning} setMorning={setMorning}
          dream={dream} setDream={setDream}
          onBack={() => setPhase('scales')}
          onSubmit={handleSubmit} />
      )}
    </GameModal>
  );
}

function CardPhase({ card, onNext }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
      <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
        <BreathCircle size={68} hue="gold" />
      </div>
      <div style={{ fontSize: '54px', marginBottom: '10px', lineHeight: 1 }}>{card.symbol}</div>
      <div style={{ fontFamily: SYS, fontSize: '24px', fontWeight: 700, color: '#fff7e0', marginBottom: '8px', letterSpacing: '0.5px' }}>
        {card.name}
      </div>
      <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', opacity: 0.88, fontSize: '15px', maxWidth: '420px', margin: '0 auto 22px', lineHeight: 1.6 }}>
        {card.hint}
      </p>
      <button className="btn btn-primary" onClick={onNext}>далі — як я зараз →</button>
    </div>
  );
}

function ScalesPhase({ scales, onSet, onBack, onNext }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const buttonStyle = isMobile
    ? { flex: '1 1 calc(33.333% - 6px)', minWidth: 0, padding: '12px 8px', fontSize: '13px' }
    : { flex: 1, padding: '6px 4px', fontSize: '11px' };
  const rowStyle = isMobile
    ? { display: 'flex', flexWrap: 'wrap', gap: '6px' }
    : { display: 'flex', gap: '4px' };

  return (
    <div>
      <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', marginBottom: '14px', fontSize: '14px', textAlign: 'center', opacity: 0.85 }}>
        Постав себе по 5 шкалах. Швидко, без думання — перше що відчув.
      </p>
      {STATE_SCALES.map((sc) => (
        <div key={sc.key} style={{ marginBottom: isMobile ? '14px' : '10px' }}>
          <div style={{ fontFamily: SYS, fontSize: isMobile ? '14px' : '13px', color: '#f0c574', marginBottom: '6px', fontWeight: 600 }}>
            {sc.icon} {sc.name}
          </div>
          <div style={rowStyle}>
            {sc.levels.map((l) => (
              <button key={l.v} onClick={() => onSet(sc.key, l.v)}
                style={{
                  ...buttonStyle,
                  background: scales[sc.key] === l.v ? 'rgba(232,196,118,0.25)' : 'rgba(20,14,30,0.5)',
                  border: `1px solid ${scales[sc.key] === l.v ? '#f0c574' : 'rgba(232,196,118,0.2)'}`,
                  borderRadius: '8px', color: '#fff7e0', fontFamily: SYS,
                  fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ flex: '0 0 auto' }}>← назад</button>
        <button className="btn btn-primary" onClick={onNext} style={{ flex: 1 }}>
          далі — рефлексія →
        </button>
      </div>
    </div>
  );
}

function ReflectionPhase({ morning, setMorning, dream, setDream, onBack, onSubmit }) {
  const ta = (val, set, ph, rows = 2) => (
    <textarea value={val} onChange={(e) => set(e.target.value)} placeholder={ph} rows={rows}
      style={{
        width: '100%', padding: '10px',
        background: '#1e1828', border: '1.5px solid #c89849',
        borderRadius: '8px', color: '#fff7e0', fontFamily: SYS,
        fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px',
        resize: 'vertical', lineHeight: 1.5,
      }} />
  );
  return (
    <div>
      <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', textAlign: 'center', fontSize: '13px', marginBottom: '14px', opacity: 0.8 }}>
        Дві короткі нотатки — те що ще не встигло «зашуміти».
      </p>
      <div style={{ fontFamily: SYS, fontSize: '13px', color: '#f0c574', fontWeight: 600, marginBottom: '6px' }}>
        З чим прокинувся (одне речення):
      </div>
      {ta(morning, setMorning, 'наприклад: з втомою, з натхненням, з тривогою...')}
      <div style={{ fontFamily: SYS, fontSize: '13px', color: '#f0c574', fontWeight: 600, marginBottom: '6px' }}>
        Сон, якщо запам'ятав:
      </div>
      {ta(dream, setDream, '')}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ flex: '0 0 auto' }}>← назад</button>
        <button className="btn btn-primary" onClick={onSubmit} style={{ flex: 1 }}>
          зберегти ранок
        </button>
      </div>
    </div>
  );
}
