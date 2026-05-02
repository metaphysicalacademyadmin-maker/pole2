import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useGameStore } from '../../store/gameStore.js';
import { ARCHETYPES, findArchetype } from '../../data/archetypes.js';

// Сітка 12 архетипів. Зустрінуті — кольорові, інші — приглушені.
//
// Desktop (hover-capable): опис у MUI Tooltip над кнопкою — миттєво, не
// займає місця у layout.
// Mobile (без hover): tooltip приглушено, опис показуємо у блоці під сіткою
// після тапу — поточна поведінка, яка вже працює пальцями.
export default function Archetypes() {
  const archetypesMet = useGameStore((s) => s.archetypesMet);
  const [tapped, setTapped] = useState(null);
  const metIds = new Set(archetypesMet.map((a) => a.id));
  const hasHover = useMediaQuery('(hover: hover)');

  return (
    <div className="panel">
      <div className="panel-label">архетипи · {archetypesMet.length}/12</div>
      <div className="panel-content">
        <div className="arch-grid">
          {ARCHETYPES.map((a) => {
            const isMet = metIds.has(a.id);
            const cell = (
              <div key={a.id}
                className={`arch-cell${isMet ? ' met' : ''}`}
                style={isMet ? { color: a.color, borderColor: a.color } : undefined}
                onClick={() => setTapped((cur) => (cur === a.id ? null : a.id))}>
                {a.symbol}
              </div>
            );
            // На desktop — обгортаємо у Tooltip. На mobile — голий cell, опис
            // буде видно у блоці нижче після onClick (звичний touch-патерн).
            if (hasHover) {
              return (
                <Tooltip
                  key={a.id}
                  arrow
                  placement="top"
                  enterDelay={200}
                  leaveDelay={0}
                  title={
                    <span style={{ fontSize: 12, lineHeight: 1.45 }}>
                      <strong style={{ color: a.color }}>{a.name}:</strong>{' '}
                      {a.description}
                    </span>
                  }
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'rgba(20,14,30,0.97)',
                        border: '1px solid',
                        borderColor: isMet ? a.color : 'rgba(232,196,118,0.35)',
                        color: '#fff7e0',
                        maxWidth: 280,
                        px: 1.25,
                        py: 0.75,
                      },
                    },
                    arrow: {
                      sx: { color: 'rgba(20,14,30,0.97)' },
                    },
                  }}
                >
                  {cell}
                </Tooltip>
              );
            }
            return cell;
          })}
        </div>
        {!hasHover && tapped && (
          <div style={{
            marginTop: 8, fontSize: 11, fontStyle: 'italic',
            color: metIds.has(tapped) ? '#fff7e0' : '#c8bca8',
            lineHeight: 1.4,
          }}>
            <strong>{findArchetype(tapped)?.name}:</strong>{' '}
            {findArchetype(tapped)?.description}
          </div>
        )}
      </div>
    </div>
  );
}
