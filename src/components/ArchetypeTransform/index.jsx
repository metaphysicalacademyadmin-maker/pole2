import { useGameStore } from '../../store/gameStore.js';
import { findArchetype } from '../../data/archetypes.js';
import './styles.css';

// Модалка трансформації архетипу — після рівня 5/6/7 якщо новий кандидат
// «світліший» за попередній. Тон м'який, святковий — це визнання росту.

export default function ArchetypeTransform() {
  const t = useGameStore((s) => s.currentArchetypeTransformation);
  const activeModal = useGameStore((s) => s.activeModal);
  const accept = useGameStore((s) => s.acceptArchetypeTransformation);
  const reject = useGameStore((s) => s.rejectArchetypeTransformation);

  if (!t) return null;
  if (activeModal?.id !== 'archetype-transform') return null;
  const from = findArchetype(t.fromId);
  const to = findArchetype(t.toId);
  if (!from || !to) return null;

  return (
    <div className="atrans-overlay">
      <div className="atrans-modal">
        <div className="atrans-eyebrow">✦ трансформація архетипу</div>
        <div className="atrans-subtitle">
          Поле бачить — ти змінився після рівня {t.eligibleLevel}
        </div>

        <div className="atrans-arrow-block">
          <ArchetypeCard archetype={from} faded />
          <div className="atrans-arrow">
            <span className="atrans-arrow-line"></span>
            <span className="atrans-arrow-tip">→</span>
          </div>
          <ArchetypeCard archetype={to} />
        </div>

        <div className="atrans-question">
          Бачу — ти більше не <strong>{from.name}</strong>.<br />
          Ти став{from.name.endsWith('а') || to.name.endsWith('а') ? 'а' : ''} <strong style={{ color: to.color }}>{to.name}</strong>.<br />
          Прийняти?
        </div>

        <div className="atrans-actions">
          <button type="button" className="atrans-btn atrans-btn-reject" onClick={reject}>
            ні, ще ні
          </button>
          <button type="button" className="atrans-btn atrans-btn-accept" onClick={accept}>
            приймаю · я вже інший
          </button>
        </div>
      </div>
    </div>
  );
}

function ArchetypeCard({ archetype, faded }) {
  return (
    <div className={`atrans-card${faded ? ' faded' : ''}`}>
      <div className="atrans-card-symbol" style={{ color: archetype.color }}>
        {archetype.symbol}
      </div>
      <div className="atrans-card-name">{archetype.name}</div>
      <div className="atrans-card-desc">{archetype.description}</div>
    </div>
  );
}
