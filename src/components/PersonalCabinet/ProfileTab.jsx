import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import { findArchetype } from '../../data/archetypes.js';
import { findSpecialization } from '../../data/specializations.js';
import { COSMO_LEVELS, currentCosmoLevel } from '../../data/cosmo-levels.js';
import { computeStreak, streakBadge } from '../../utils/streak-calc.js';
import JoinGroupButton from '../JoinGroupButton.jsx';
import MaturityBarometer from '../MaturityBarometer.jsx';
import ArchetypeDialog from '../ArchetypeDialog/index.jsx';
import Rodovid from '../Rodovid/index.jsx';
import '../MaturityBarometer.css';

// Профіль — все що знає Поле про гравця в одному місці.

export default function ProfileTab() {
  const state = useGameStore();
  const firstName = useProfileStore((s) => s.profile?.firstName);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rodovidOpen, setRodovidOpen] = useState(false);
  const rodovid = state.rodovid || {};
  const rodovidFilled = Object.keys(rodovid).length;

  const archetype = state.archetypeCalibration?.confirmed
    ? findArchetype(state.archetypeCalibration.confirmed) : null;
  const spec = state.specialization
    ? findSpecialization(state.specialization.id) : null;
  const cosmoLevel = currentCosmoLevel(state);
  const streak = computeStreak(state.dailyCheckIns);
  const badge = streakBadge(streak);

  const totalDays = state.startedAt
    ? Math.max(1, Math.floor((Date.now() - state.startedAt) / 86400000))
    : 0;
  const customCount = Object.values(state.cellAnswers || {}).filter((a) => a.customText).length;
  const certifiedCount = Object.values(state.channelProgress || {}).filter((p) => p.completed).length;
  const petalsCount = Object.values(state.petalProgress || {}).filter((p) => p.completed).length;

  return (
    <div className="cab-profile">
      {/* Аватар + ім'я */}
      <div className="cab-avatar-block">
        <div className="cab-avatar"
          style={{ '--av-color': archetype?.color || '#f0c574' }}>
          {firstName?.[0] || '?'}
        </div>
        <div className="cab-avatar-name">
          {firstName || 'Гравець'}
        </div>
        {archetype && (
          <>
            <div className="cab-avatar-arc" style={{ color: archetype.color }}>
              {archetype.symbol} {archetype.name}
            </div>
            <button type="button" className="cab-archetype-talk"
              onClick={() => setDialogOpen(true)}
              style={{ borderColor: `${archetype.color}66`, color: archetype.color }}>
              ▸ поговорити з {archetype.name.toLowerCase()}
            </button>
          </>
        )}
      </div>

      {dialogOpen && <ArchetypeDialog onClose={() => setDialogOpen(false)} />}
      {rodovidOpen && <Rodovid onClose={() => setRodovidOpen(false)} />}

      {/* 4 ключові факти — bento-grid */}
      <div className="cab-bento">
        {spec && (
          <div className="cab-bento-card" style={{ borderColor: spec.color }}>
            <div className="cab-bento-icon" style={{ color: spec.color }}>{spec.symbol}</div>
            <div className="cab-bento-label">спеціалізація</div>
            <div className="cab-bento-value">{spec.name}</div>
            <div className="cab-bento-hint">{spec.focus}</div>
          </div>
        )}

        <div className="cab-bento-card" style={{ borderColor: COSMO_LEVELS[cosmoLevel].color }}>
          <div className="cab-bento-icon" style={{ color: COSMO_LEVELS[cosmoLevel].color }}>
            {COSMO_LEVELS[cosmoLevel].symbol}
          </div>
          <div className="cab-bento-label">рівень КАЕ</div>
          <div className="cab-bento-value">{COSMO_LEVELS[cosmoLevel].name}</div>
          <div className="cab-bento-hint">{cosmoLevel}/4</div>
        </div>

        {streak > 0 && (
          <div className="cab-bento-card" style={badge ? { borderColor: badge.color } : undefined}>
            <div className="cab-bento-icon" style={badge ? { color: badge.color } : undefined}>
              {badge?.symbol || '◌'}
            </div>
            <div className="cab-bento-label">streak</div>
            <div className="cab-bento-value">{streak} {streak === 1 ? 'день' : streak < 5 ? 'дні' : 'днів'}</div>
            <div className="cab-bento-hint">{badge?.label || 'початок'}</div>
          </div>
        )}

        <div className="cab-bento-card">
          <div className="cab-bento-icon">🎯</div>
          <div className="cab-bento-label">шлях</div>
          <div className="cab-bento-value">{totalDays} {totalDays === 1 ? 'день' : totalDays < 5 ? 'дні' : 'днів'}</div>
          <div className="cab-bento-hint">з тобою</div>
        </div>
      </div>

      {/* 9-й барометр — Зрілість (derived) */}
      <div style={{ margin: '16px 0 8px' }}>
        <MaturityBarometer />
      </div>

      {/* Намір */}
      {state.intention && (
        <div className="cab-intention">
          <div className="cab-block-label">намір цієї сесії</div>
          <div className="cab-intention-text">«{state.intention}»</div>
        </div>
      )}

      {/* Stats line */}
      <div className="cab-stats-line">
        <div className="cab-stat"><strong>{(state.completedLevels || []).length}</strong>/7 рівнів</div>
        <div className="cab-stat"><strong>{petalsCount}</strong>/12 пелюсток</div>
        <div className="cab-stat"><strong>{certifiedCount}</strong>/11 каналів</div>
        <div className="cab-stat"><strong>{customCount}</strong> своїх відповідей</div>
        <div className="cab-stat"><strong>{(state.practiceCompletions || []).length}</strong> практик</div>
        <div className="cab-stat"><strong>{(state.shadowMirrorHistory || []).length}</strong> зустрічей з тінню</div>
      </div>

      {/* Blessing якщо є spec */}
      {spec && (
        <div className="cab-blessing" style={{ borderColor: spec.color }}>
          <div className="cab-block-label" style={{ color: spec.color }}>благословення спеціалізації</div>
          <div className="cab-blessing-text">«{spec.blessing}»</div>
        </div>
      )}

      <button type="button" className="cab-rod-cta"
        onClick={() => setRodovidOpen(true)}>
        🌳 Родове Дерево
        {rodovidFilled > 0 && <span className="cab-rod-count">{rodovidFilled}/7</span>}
      </button>

      <JoinGroupButton variant="inline"
        label="✦ Заявка на навчальну групу" />
    </div>
  );
}
