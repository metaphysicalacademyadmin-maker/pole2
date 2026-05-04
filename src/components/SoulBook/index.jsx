import { useGameStore } from '../../store/gameStore.js';
import { findArchetype } from '../../data/archetypes.js';
import { BAROMETERS } from '../../data/barometers.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import SoulBookSections from './Sections.jsx';
import './styles.css';

// Книга Душі — повноекранний preview після рівня 7. Гравець натискає "роздрукувати"
// → браузер пропонує Save as PDF. Без зовнішніх бібліотек.
// 9 секцій з усіма артефактами сесії гравця.

export default function SoulBook({ onClose }) {
  const state = useGameStore();
  const data = collectBookData(state);

  useOverlayA11y(onClose);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="soulbook-overlay">
      {/* Завжди-видима fixed кнопка close — працює і коли sticky-toolbar заховався */}
      <button type="button" className="sb-fixed-close no-print" onClick={onClose}
        aria-label="Закрити книгу душі"
        title="закрити">
        ←
      </button>

      <div className="soulbook-toolbar no-print">
        <button type="button" className="sb-btn-close" onClick={onClose}>← повернутись</button>
        <div className="sb-toolbar-title">📜 Книга Душі</div>
        <button type="button" className="sb-btn-print" onClick={handlePrint}>
          ⎙ зберегти як PDF
        </button>
      </div>
      <div className="soulbook-page">
        <SoulBookSections data={data} />
      </div>
    </div>
  );
}

function collectBookData(s) {
  const archetype = s.archetypeCalibration?.confirmed
    ? findArchetype(s.archetypeCalibration.confirmed)
    : null;
  const suggested = s.archetypeCalibration?.suggested
    ? findArchetype(s.archetypeCalibration.suggested)
    : null;
  const customAnswers = Object.entries(s.cellAnswers || {})
    .filter(([_, a]) => a.customText && a.customText.trim().length > 20)
    .map(([id, a]) => ({ cellId: id, text: a.customText, barometer: a.barometer, ts: a.ts }));
  const auraBefore = (s.auraReadings || []).reduce((a, r) => a + (r.before || 0), 0);
  const auraAfter = (s.auraReadings || []).reduce((a, r) => a + (r.after || 0), 0);
  const aura = {
    count: (s.auraReadings || []).length,
    avgBefore: auraBefore && s.auraReadings.length ? Math.round(auraBefore / s.auraReadings.length) : 0,
    avgAfter: auraAfter && s.auraReadings.length ? Math.round(auraAfter / s.auraReadings.length) : 0,
    biggestGrowth: Math.max(0, ...(s.auraReadings || []).map((r) => r.delta || 0)),
    keywords: (s.auraReadings || []).map((r) => r.keyword).filter(Boolean),
  };
  const shadowMirrors = s.shadowMirrorHistory || [];
  const shadowSeen = shadowMirrors.filter((m) => m.response === 'seen').length;
  const cellsAnswered = Object.keys(s.cellAnswers || {}).length;
  const shadowAnswers = Object.values(s.cellAnswers || {}).filter((a) => a.depth === 'shadow').length;
  const constellation3 = s.constellations?.[3] || null;

  return {
    intention: s.intention,
    pathMode: s.pathMode,
    sessionId: s.sessionId,
    startedAt: s.startedAt,
    finishedAt: Date.now(),
    completedLevels: s.completedLevels || [],
    levelKeys: s.levelKeys || {},
    cellsAnswered,
    shadowAnswers,
    customCount: customAnswers.length,
    customAnswers: customAnswers.slice(-8),
    resources: s.resources || {},
    barometers: BAROMETERS,
    archetype,
    suggested,
    snakePenalties: s.snakePenalties || [],
    shadowMirrors,
    shadowSeen,
    aura,
    practiceCompletions: s.practiceCompletions || [],
    channelsUnlocked: s.channelsUnlocked || [],
    constellation3,
    evolutionEcho: s.evolutionEcho,
  };
}
