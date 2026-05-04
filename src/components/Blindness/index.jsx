import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import { SHADOWS, encouragementFor } from '../../data/blindness.js';
import './styles.css';

// «Ніч Я» — діагностика 7 затемнень.
// Гравець обирає що зараз активне (multi-select), отримує опис фаз +
// шлях для кожної. Збереження у store. Тон підтримки — це фаза,
// не діагноз.
export default function Blindness({ onClose }) {
  const trackUsage = useGameStore((s) => s.trackToolUsage);
  const previous = useGameStore((s) => s.blindnessCheck);
  const save = useGameStore((s) => s.saveBlindnessCheck);

  const [selectedIds, setSelectedIds] = useState(previous?.activeShadows || []);
  const [reflection, setReflection] = useState(previous?.reflection || '');
  const [stage, setStage] = useState(previous ? 'review' : 'select');

  useOverlayA11y(onClose);

  function toggle(id) {
    if (stage !== 'select') return;
    setSelectedIds((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  function handleSave() {
    trackUsage('blindness');
    save({ activeShadows: selectedIds, reflection: reflection.trim() });
    setStage('review');
  }

  const activeShadows = SHADOWS.filter((s) => selectedIds.includes(s.id));
  const isReview = stage === 'review';

  return (
    <div className="bl-overlay" role="dialog" aria-modal="true">
      <div className="bl-frame">
        <button type="button" className="bl-close" onClick={onClose}>← повернутись</button>

        <div className="bl-header">
          <div className="bl-eyebrow">метафізична карта станів</div>
          <h2 className="bl-title">Ніч Я</h2>
          <p className="bl-sub">
            7 затемнень — це не помилка, а фази еволюції. Старе відмирає,
            нове ще не проявлене. Назвати — почати рухатись.
          </p>
        </div>

        {!isReview && (
          <div className="bl-instruction">
            Що зараз у тобі активне? Постав ✓ де відчуваєш що це <em>зараз</em> у тебе.
            Можна обрати декілька. Можна жодного — це теж відповідь.
          </div>
        )}

        <div className="bl-list">
          {SHADOWS.map((shadow) => {
            const isSelected = selectedIds.includes(shadow.id);
            return (
              <div key={shadow.id}
                className={`bl-card${isSelected ? ' is-active' : ''}${!isReview ? ' is-clickable' : ''}`}
                style={{ borderColor: isSelected ? shadow.color : 'rgba(232, 196, 118, 0.18)' }}
                onClick={() => toggle(shadow.id)}>
                <div className="bl-card-head">
                  <span className="bl-card-icon" style={{ color: shadow.color }}>{shadow.icon}</span>
                  <div className="bl-card-text">
                    <div className="bl-card-name" style={{ color: shadow.color }}>{shadow.name}</div>
                    <div className="bl-card-short">{shadow.short}</div>
                  </div>
                  {!isReview && (
                    <span className="bl-card-mark">{isSelected ? '✓' : '○'}</span>
                  )}
                </div>

                {(isSelected || isReview) && (
                  <div className="bl-card-detail">
                    <div className="bl-detail-label">Прояви</div>
                    <ul className="bl-aspects">
                      {shadow.aspects.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>

                    <div className="bl-detail-label">Глибший сенс</div>
                    <p className="bl-deeper">{shadow.deeperMeaning}</p>

                    <div className="bl-detail-label">Шлях</div>
                    <p className="bl-way">{shadow.way}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!isReview && (
          <>
            <div className="bl-reflection-block">
              <label>Що ти хочеш сказати собі про цей момент?</label>
              <textarea value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="одне-два речення (можна пропустити)"
                rows={3} maxLength={300} />
            </div>

            <div className="bl-encourage">
              {encouragementFor(selectedIds.length)}
            </div>

            <button type="button" className="bl-btn-primary"
              onClick={handleSave}>
              ✓ зберегти
            </button>
          </>
        )}

        {isReview && (
          <>
            {previous?.reflection && (
              <div className="bl-prev-reflection">
                <div className="bl-detail-label">що ти писав собі</div>
                <p className="bl-prev-text">«{previous.reflection}»</p>
              </div>
            )}

            <div className="bl-encourage">
              {encouragementFor(selectedIds.length)}
            </div>

            <button type="button" className="bl-btn"
              onClick={() => setStage('select')}>
              ↻ оновити стан
            </button>
          </>
        )}
      </div>
    </div>
  );
}
