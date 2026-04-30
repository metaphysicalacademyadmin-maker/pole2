import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ARCHETYPES, findArchetype } from '../../data/archetypes.js';

// Сітка 12 архетипів. Зустрінуті — кольорові, інші — приглушені.
export default function Archetypes() {
  const archetypesMet = useGameStore((s) => s.archetypesMet);
  const [hover, setHover] = useState(null);
  const metIds = new Set(archetypesMet.map((a) => a.id));

  return (
    <div className="panel">
      <div className="panel-label">архетипи · {archetypesMet.length}/12</div>
      <div className="panel-content">
        <div className="arch-grid">
          {ARCHETYPES.map((a) => (
            <div key={a.id}
              className={`arch-cell${metIds.has(a.id) ? ' met' : ''}`}
              title={a.name}
              style={metIds.has(a.id) ? { color: a.color, borderColor: a.color } : undefined}
              onMouseEnter={() => setHover(a.id)}
              onMouseLeave={() => setHover(null)}>
              {a.symbol}
            </div>
          ))}
        </div>
        {hover && (
          <div style={{
            marginTop: 8, fontSize: 11, fontStyle: 'italic',
            color: metIds.has(hover) ? '#fff7e0' : '#c8bca8',
            lineHeight: 1.4,
          }}>
            <strong>{findArchetype(hover)?.name}:</strong>{' '}
            {findArchetype(hover)?.description}
          </div>
        )}
      </div>
    </div>
  );
}
