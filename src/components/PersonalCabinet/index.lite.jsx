// LITE-варіант — простий профіль без 5 вкладок.
// Показує лише ключові факти: ім'я, архетип, рівні, барометри.

import { useGameStore } from '../../store/gameStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import { findArchetype } from '../../data/archetypes.js';
import { BAROMETERS } from '../../data/barometers.js';
import './styles.css';

export default function PersonalCabinet({ onClose }) {
  const state = useGameStore();
  const firstName = useProfileStore((s) => s.profile?.firstName);
  const archetype = state.archetypeCalibration?.confirmed
    ? findArchetype(state.archetypeCalibration.confirmed) : null;

  return (
    <div className="cab-overlay">
      <div className="cab-frame">
        <div className="cab-header">
          <button type="button" className="cab-close" onClick={onClose}>← повернутись</button>
          <div className="cab-title">профіль</div>
        </div>

        <div className="cab-avatar-block">
          <div className="cab-avatar"
            style={{ '--av-color': archetype?.color || '#f0c574' }}>
            {firstName?.[0] || '?'}
          </div>
          <div className="cab-avatar-name">{firstName || 'Гравець'}</div>
          {archetype && (
            <div className="cab-avatar-arc" style={{ color: archetype.color }}>
              {archetype.symbol} {archetype.name}
            </div>
          )}
        </div>

        <div className="cab-stats-line">
          <div className="cab-stat"><strong>{(state.completedLevels || []).length}</strong>/7 рівнів</div>
          <div className="cab-stat"><strong>{Object.keys(state.cellAnswers || {}).length}</strong> клітинок</div>
          <div className="cab-stat"><strong>{(state.practiceCompletions || []).length}</strong> практик</div>
        </div>

        {state.intention && (
          <div className="cab-intention">
            <div className="cab-block-label">намір</div>
            <div className="cab-intention-text">«{state.intention}»</div>
          </div>
        )}

        <div className="cab-block-label">барометри</div>
        <div className="cab-bars">
          {BAROMETERS.map((b) => {
            const v = state.resources?.[b.key] || 0;
            return (
              <div key={b.key} className="cab-bar-row">
                <div className="cab-bar-name" style={{ color: b.color }}>{b.name}</div>
                <div className="cab-bar-track">
                  <div className="cab-bar-axis" />
                  <div className="cab-bar-fill"
                    style={{
                      left: v >= 0 ? '50%' : `${((v + 10) / 20) * 100}%`,
                      width: `${Math.abs(v) * 5}%`,
                      background: v >= 0 ? b.color : '#d89098',
                    }} />
                </div>
                <div className="cab-bar-val">{v > 0 ? `+${v}` : v}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
