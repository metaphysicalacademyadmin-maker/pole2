import { useGameStore } from '../../store/gameStore.js';
import { findScenario } from '../../data/constellation/scenarios.js';

// Історія розстановок — список збережених сесій
export default function ConstellationHistory({ onClose }) {
  const items = useGameStore((s) => s.toolConstellations) || [];
  const remove = useGameStore((s) => s.removeToolConstellation);

  return (
    <div className="ct-overlay" role="dialog" aria-modal="true">
      <div className="ct-frame">
        <button type="button" className="ct-close" onClick={onClose}>
          ← до сценаріїв
        </button>
        <h2 className="ct-title">Історія розстановок</h2>

        {items.length === 0 ? (
          <p className="ct-empty">Поки нічого. Зроби першу — і вона з'явиться тут.</p>
        ) : (
          <div className="ct-history-list">
            {[...items].reverse().map((it) => {
              const sc = findScenario(it.scenario);
              const date = new Date(it.ts);
              const dateLabel = `${String(date.getDate()).padStart(2,'0')}.${String(date.getMonth()+1).padStart(2,'0')}.${date.getFullYear()}`;
              return (
                <div key={it.id} className="ct-history-item"
                  style={{ borderColor: sc ? `${sc.color}55` : '#444' }}>
                  <span className="ct-history-icon" style={{ color: sc?.color }}>
                    {sc?.icon || '◯'}
                  </span>
                  <div className="ct-history-body">
                    <div className="ct-history-name">{sc?.name || it.scenario}</div>
                    <div className="ct-history-meta">
                      {dateLabel} · {it.figures?.length || 0} фігур
                    </div>
                    {it.reflection && (
                      <div className="ct-history-refl">«{it.reflection}»</div>
                    )}
                  </div>
                  <button type="button" className="ct-history-del"
                    onClick={() => remove(it.id)}
                    title="Видалити">×</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
