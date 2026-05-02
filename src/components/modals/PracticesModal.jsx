import { useState, useEffect, useRef } from 'react';
import GameModal from '../GameModal.jsx';
import BreathCircle from '../Ritual/BreathCircle.jsx';
import { useGameStore } from '../../store/gameStore.js';
import { practicesForLevel } from '../../data/practices.js';
import { showToast } from '../GlobalToast.jsx';
import { playChime, isSoundOn, setSoundOn } from '../../utils/chimes.js';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export default function PracticesModal({ onClose, autoLaunch }) {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const completePractice = useGameStore((s) => s.completePractice);
  const [running, setRunning] = useState(autoLaunch || null);

  const list = practicesForLevel(Math.max(1, currentLevel));

  return (
    <GameModal open onClose={onClose} title={running ? running.name : `Практики · доступні (${list.length} з 25)`}>
      {running ? (
        <PracticeRunner practice={running}
          onDone={(reflection) => {
            completePractice(running.id, currentLevel, running.duration * 60, reflection);
            showToast(`практика ${running.name} · ${running.barometer} +1`, 'success');
            setRunning(null);
          }}
          onCancel={() => setRunning(null)}
        />
      ) : (
        <PracticesList list={list} onPick={setRunning} />
      )}
    </GameModal>
  );
}

function PracticesList({ list, onPick }) {
  const [filter, setFilter] = useState('all');     // 'all' | 'short' | barometer-key

  const barometers = [...new Set(list.map((p) => p.barometer).filter(Boolean))];
  const visible = filter === 'all' ? list
    : filter === 'short' ? list.filter((p) => p.duration <= 5)
    : list.filter((p) => p.barometer === filter);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>усі</Chip>
        <Chip active={filter === 'short'} onClick={() => setFilter('short')}>≤ 5 хв</Chip>
        {barometers.map((b) => (
          <Chip key={b} active={filter === b} onClick={() => setFilter(b)}>+{b}</Chip>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {visible.length === 0 ? (
          <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', opacity: 0.6, textAlign: 'center', padding: '20px 0' }}>
            нічого не знайшлось — спробуй інший фільтр
          </p>
        ) : (
          visible.map((p) => (
            <button key={p.id} type="button" onClick={() => onPick(p)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px',
                background: 'rgba(20, 14, 30, 0.7)',
                border: '1.5px solid rgba(232,196,118,0.3)',
                borderRadius: '10px', color: '#fff7e0',
                fontFamily: SYS, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
              }}>
              <span style={{ fontSize: '24px', minWidth: '32px', textAlign: 'center' }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{p.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  рівень {p.level} · {p.duration < 60 ? `${p.duration} хв` : `${p.duration / 60} год`} · +{p.barometer}
                </div>
              </div>
              <span style={{ fontSize: '14px', opacity: 0.5 }}>▸</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        padding: '5px 10px', borderRadius: '999px',
        background: active ? 'rgba(232,196,118,0.2)' : 'rgba(20,14,30,0.5)',
        border: `1px solid ${active ? '#f0c574' : 'rgba(232,196,118,0.2)'}`,
        color: '#fff7e0', fontFamily: SYS, fontSize: '11px', fontWeight: 600,
        letterSpacing: '0.5px', cursor: 'pointer', whiteSpace: 'nowrap',
      }}>
      {children}
    </button>
  );
}

function PracticeRunner({ practice, onDone, onCancel }) {
  const [phase, setPhase] = useState('intro');
  const total = practice.duration * 60;
  const [secondsLeft, setSecondsLeft] = useState(total);
  const [reflection, setReflection] = useState('');
  const [soundOn, setSoundOnState] = useState(() => isSoundOn());
  const firedRef = useRef({ half: false, end: false });

  useEffect(() => {
    if (phase !== 'running') return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Два ніжні дзвони: половина і завершення.
  useEffect(() => {
    if (phase !== 'running') return;
    const fired = firedRef.current;
    const half = Math.floor(total / 2);
    if (!fired.half && total >= 60 && secondsLeft <= half && secondsLeft > half - 2) {
      playChime('half'); fired.half = true;
    }
    if (!fired.end && secondsLeft === 0) {
      playChime('end'); fired.end = true;
    }
  }, [phase, secondsLeft, total]);

  useEffect(() => {
    if (phase === 'running' && secondsLeft === 0) setPhase('reflection');
  }, [phase, secondsLeft]);

  function toggleSound() {
    const v = !soundOn;
    setSoundOnState(v);
    setSoundOn(v);
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = total > 0 ? 1 - secondsLeft / total : 0;

  if (phase === 'intro') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <BreathCircle size={64} hue="gold" />
        </div>
        <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', fontSize: '15px', lineHeight: 1.6, marginBottom: '14px', textAlign: 'center', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
          {practice.instruction}
        </p>
        <SoundToggleHint soundOn={soundOn} onToggle={toggleSound} duration={practice.duration} />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '14px' }}>
          <button className="btn btn-ghost" onClick={onCancel}>відмінити</button>
          <button className="btn btn-primary" onClick={() => setPhase('running')}>
            {practice.duration < 60 ? `почати · ${practice.duration} хв` : 'почати'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'running') {
    return (
      <div style={{ textAlign: 'center', padding: '14px 0 4px', position: 'relative' }}>
        <button type="button" onClick={toggleSound} aria-label={soundOn ? 'вимкнути сигнали' : 'увімкнути сигнали'}
          style={{
            position: 'absolute', top: 0, right: 0,
            background: 'transparent', border: '1px solid rgba(232,196,118,0.3)',
            borderRadius: '999px', padding: '4px 10px', cursor: 'pointer',
            fontSize: '14px', color: '#fff7e0', opacity: 0.7,
          }}>
          {soundOn ? '🔔' : '🔕'}
        </button>
        <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 18px' }}>
          <ProgressRing size={220} progress={progress} />
          <BreathCircle size={220} hue="gold" />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', pointerEvents: 'none',
          }}>
            <div style={{ fontFamily: SYS, fontSize: '40px', fontWeight: 700, color: '#fff7e0', letterSpacing: '1px' }}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
            <div style={{ fontFamily: SYS, fontSize: '10px', letterSpacing: '4px', opacity: 0.65, color: '#fff7e0', textTransform: 'uppercase', marginTop: '4px' }}>
              вдих · видих
            </div>
          </div>
        </div>
        <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', fontSize: '13px', maxWidth: '420px', margin: '0 auto', opacity: 0.85, lineHeight: 1.55 }}>
          {practice.instruction}
        </p>
        <button className="btn btn-ghost" onClick={() => setPhase('reflection')} style={{ marginTop: '20px' }}>
          закрити раніше →
        </button>
      </div>
    );
  }

  // reflection
  return (
    <div>
      <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', marginBottom: '12px', textAlign: 'center', opacity: 0.85 }}>
        Що відчулось у тілі після практики? (необов'язково)
      </p>
      <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} rows={3}
        style={{
          width: '100%', padding: '12px',
          background: '#1e1828', border: '2px solid #c89849',
          borderRadius: '8px', color: '#fff7e0', fontFamily: SYS,
          fontStyle: 'italic', fontSize: '14px', boxSizing: 'border-box',
          lineHeight: 1.5,
        }} />
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button className="btn btn-primary" onClick={() => onDone(reflection.trim())}>
          зберегти і закрити
        </button>
      </div>
    </div>
  );
}

// Тонке кільце прогресу під breath circle. Показує periphery — гравець не мусить
// читати таймер, бачить рух краєм ока.
function ProgressRing({ size, progress }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}
      style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)', pointerEvents: 'none' }}
      viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(232,196,118,0.1)" strokeWidth="2" />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(232,196,118,0.6)" strokeWidth="2"
        strokeDasharray={c} strokeDashoffset={c * (1 - progress)}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }} />
    </svg>
  );
}

function SoundToggleHint({ soundOn, onToggle, duration }) {
  const showHalf = duration >= 1;
  const cues = [showHalf && 'на середині', 'на завершенні'].filter(Boolean).join(' · ');
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
      padding: '8px 12px',
      background: 'rgba(20,14,30,0.4)',
      border: '1px solid rgba(232,196,118,0.15)',
      borderRadius: '8px',
      maxWidth: '440px', margin: '0 auto',
    }}>
      <button type="button" onClick={onToggle}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: '18px', padding: 0, lineHeight: 1,
        }}
        aria-label={soundOn ? 'вимкнути сигнали' : 'увімкнути сигнали'}>
        {soundOn ? '🔔' : '🔕'}
      </button>
      <span style={{ fontFamily: SYS, fontSize: '11px', color: '#fff7e0', opacity: 0.75, letterSpacing: '0.3px' }}>
        {soundOn ? `ніжний сигнал — ${cues}` : 'без звуку'}
      </span>
    </div>
  );
}
