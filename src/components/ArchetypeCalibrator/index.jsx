import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ARCHETYPES, findArchetype } from '../../data/archetypes.js';
import './styles.css';

// Модалка калібровки архетипу — з'являється після 3-ї відповіді.
// 2 вʼюхи: (1) пропозиція "Бачу — ти X. Так?" (2) сітка з 12 архетипів.

export default function ArchetypeCalibrator() {
  const cal = useGameStore((s) => s.archetypeCalibration);
  const activeModal = useGameStore((s) => s.activeModal);
  const confirmArchetype = useGameStore((s) => s.confirmArchetype);
  const skip = useGameStore((s) => s.skipArchetypeCalibration);
  const [view, setView] = useState('suggested');

  if (cal?.status !== 'pending') return null;
  if (activeModal?.id !== 'archetype-calibration') return null;

  const suggested = findArchetype(cal.suggested);

  return (
    <div className="arc-cal-overlay" onClick={skip}>
      <div className="arc-cal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="arc-cal-eyebrow">калібровка архетипу</div>
        <div className="arc-cal-subtitle">
          Поле бачить тебе. Хто ти зараз — у цей момент шляху?
        </div>

        {view === 'suggested' && suggested ? (
          <SuggestedView
            archetype={suggested}
            onConfirm={() => confirmArchetype(suggested.id)}
            onPickOther={() => setView('grid')}
            onSkip={skip}
          />
        ) : (
          <GridView onPick={(id) => confirmArchetype(id)} onBack={() => setView('suggested')} />
        )}
      </div>
    </div>
  );
}

function SuggestedView({ archetype, onConfirm, onPickOther, onSkip }) {
  return (
    <>
      <div className="arc-cal-suggestion">
        <div className="arc-cal-symbol" style={{ color: archetype.color }}>{archetype.symbol}</div>
        <div className="arc-cal-name">{archetype.name}</div>
        <div className="arc-cal-desc">{archetype.description}</div>
      </div>
      <div className="arc-cal-q">Бачу — ти {archetype.name}. Так?</div>
      <div className="arc-cal-actions">
        <button type="button" className="arc-cal-btn arc-cal-btn-skip" onClick={onSkip}>
          поки що пропустити
        </button>
        <button type="button" className="arc-cal-btn arc-cal-btn-other" onClick={onPickOther}>
          ні, я інший
        </button>
        <button type="button" className="arc-cal-btn arc-cal-btn-confirm" onClick={onConfirm}>
          так, це я
        </button>
      </div>
    </>
  );
}

function GridView({ onPick, onBack }) {
  return (
    <>
      <div className="arc-cal-grid-label">Обери того, хто зараз твій:</div>
      <div className="arc-cal-grid">
        {ARCHETYPES.map((a) => (
          <button key={a.id} type="button" className="arc-cal-tile"
            onClick={() => onPick(a.id)}>
            <div className="arc-cal-tile-symbol" style={{ color: a.color }}>{a.symbol}</div>
            <div className="arc-cal-tile-name">{a.name}</div>
            <div className="arc-cal-tile-desc">{a.description}</div>
          </button>
        ))}
      </div>
      <div className="arc-cal-actions">
        <button type="button" className="arc-cal-btn arc-cal-btn-skip" onClick={onBack}>
          ← назад
        </button>
      </div>
    </>
  );
}
