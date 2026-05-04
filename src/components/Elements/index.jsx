import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import { ELEMENTS } from '../../data/elements.js';
import ElementSession from './Session.jsx';
import './styles.css';

// Стихії Метатрона — 6 стихій + завершення-Куб.
// Гравець обирає стихію (або проходить усі підряд) → ритуал з 5 кроків
// → інтеграція. Збереження останньої рефлексії per стихія.
export default function Elements({ onClose }) {
  const trackUsage = useGameStore((s) => s.trackToolUsage);
  const elementRituals = useGameStore((s) => s.elementRituals) || {};
  const [activeId, setActiveId] = useState(null);

  useOverlayA11y(onClose);

  function handlePick(id) {
    setActiveId(id);
    trackUsage('elements');
  }

  if (activeId) {
    return <ElementSession elementId={activeId}
      onComplete={() => setActiveId(null)}
      onCancel={() => setActiveId(null)} />;
  }

  const completedCount = Object.keys(elementRituals).length;

  return (
    <div className="el-overlay" role="dialog" aria-modal="true">
      <div className="el-frame">
        <button type="button" className="el-close" onClick={onClose}>← повернутись</button>

        <div className="el-header">
          <div className="el-eyebrow">ритуальна практика</div>
          <h2 className="el-title">🜃 Стихії Метатрона</h2>
          <p className="el-sub">
            Прохід 6 стихій через тіло, душу і простір — з активованою візуалізацією
            Куба Метатрона. Розгортання внутрішньої структури через гармонізацію
            голограми буття.
          </p>
          {completedCount > 0 && (
            <div className="el-progress">
              пройдено стихій: <strong>{completedCount}</strong> з {ELEMENTS.length}
            </div>
          )}
        </div>

        <div className="el-grid">
          {ELEMENTS.map((el) => {
            const ritual = elementRituals[el.id];
            return (
              <button key={el.id} type="button"
                className={`el-card${ritual ? ' is-done' : ''}`}
                style={{ borderColor: `${el.color}66` }}
                onClick={() => handlePick(el.id)}>
                <div className="el-card-icon" style={{ color: el.color }}>{el.icon}</div>
                <div className="el-card-name" style={{ color: el.color }}>{el.name}</div>
                <div className="el-card-essence">{el.essence}</div>
                {ritual && (
                  <div className="el-card-done">✓ пройдено</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="el-safety">
          <strong>Перед практикою:</strong> знайди тиху годину, посідь або стань у тиші,
          вимкни телефон. Це не симуляція — це ритуал. Що щиріше — то глибше.
        </div>
      </div>
    </div>
  );
}
