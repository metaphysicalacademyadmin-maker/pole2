import { useGameStore } from '../../store/gameStore.js';
import { FIGURE_TYPES } from '../../data/constellation/figures.js';

// Якщо рівень 3 пройдено — показує які фігури були у полі.
export default function ConstellationFigures() {
  const constellations = useGameStore((s) => s.constellations);

  // Збираємо унікальні типи з усіх розстановок
  const types = new Set();
  for (const c of Object.values(constellations || {})) {
    for (const f of c.figures || []) types.add(f.type);
  }
  if (types.size === 0) return null;

  return (
    <div className="panel">
      <div className="panel-label">розстановки</div>
      <div className="panel-content">
        {[...types].map((t) => {
          const def = FIGURE_TYPES[t];
          if (!def) return null;
          return (
            <div key={t} className="cf-row" style={{ marginTop: 4 }}>
              <div className="cf-symbol" style={{ color: def.color }}>{def.symbol}</div>
              <span style={{ color: '#fff7e0', opacity: 0.9 }}>{def.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
