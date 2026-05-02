import { useState, useEffect } from 'react';
import GameModal from '../GameModal.jsx';
import { useGameStore } from '../../store/gameStore.js';
import { practicesForLevel } from '../../data/practices.js';
import { showToast } from '../GlobalToast.jsx';

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {list.map((p) => (
        <button key={p.id} type="button"
          onClick={() => onPick(p)}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 14px',
            background: 'rgba(20, 14, 30, 0.7)',
            border: '1.5px solid rgba(232,196,118,0.3)',
            borderRadius: '10px',
            color: '#fff7e0',
            fontFamily: SYS,
            cursor: 'pointer',
            textAlign: 'left',
          }}>
          <span style={{ fontSize: '24px', minWidth: '32px', textAlign: 'center' }}>{p.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{p.name}</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              рівень {p.level} · {p.duration < 60 ? `${p.duration} хв` : `${p.duration / 60} год`} · +{p.barometer}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function PracticeRunner({ practice, onDone, onCancel }) {
  const [phase, setPhase] = useState('intro');           // intro | running | reflection
  const [secondsLeft, setSecondsLeft] = useState(practice.duration * 60);
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    if (phase !== 'running') return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && secondsLeft === 0) setPhase('reflection');
  }, [phase, secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  if (phase === 'intro') {
    return (
      <div>
        <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
          {practice.instruction}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
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
      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <div style={{ fontFamily: SYS, fontSize: '48px', fontWeight: 700, color: '#f0c574' }}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', marginTop: '20px', fontSize: '14px' }}>
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
      <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', marginBottom: '12px' }}>
        Що відчулось у тілі після практики? (необов'язково)
      </p>
      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        rows={3}
        style={{
          width: '100%',
          padding: '12px',
          background: '#1e1828',
          border: '2px solid #c89849',
          borderRadius: '8px',
          color: '#fff7e0',
          fontFamily: SYS,
          fontStyle: 'italic',
          fontSize: '14px',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button className="btn btn-primary" onClick={() => onDone(reflection.trim())}>
          зберегти і закрити
        </button>
      </div>
    </div>
  );
}
