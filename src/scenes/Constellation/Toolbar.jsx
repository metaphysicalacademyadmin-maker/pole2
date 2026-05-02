import { useState } from 'react';
import { FIGURE_TYPES, FIGURE_GROUPS, REQUIRED_FIGURES, OPTIONAL_FIGURES, getFiguresByGroup } from '../../data/constellation/figures.js';

// Згрупований toolbar для 35 фігур.
// На старті — лише "рід" розгорнута (там обов'язкові Я+тато+мама),
// решта — collapsed щоб не перевантажувати першим враженням.
// Required-фігури не видаляються (показується крапкою `·`).

const DEFAULT_OPEN = ['family'];

export default function Toolbar({ placedTypes, onAdd, onRemove, figures }) {
  const allowed = new Set([...REQUIRED_FIGURES, ...OPTIONAL_FIGURES]);
  const [openGroups, setOpenGroups] = useState(() => new Set(DEFAULT_OPEN));

  function toggle(groupId) {
    setOpenGroups((s) => {
      const next = new Set(s);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  return (
    <div className="const-toolbar-groups">
      {FIGURE_GROUPS.map((group) => {
        const groupFigures = getFiguresByGroup(group.id).filter((f) => allowed.has(f.id));
        if (groupFigures.length === 0) return null;
        const isOpen = openGroups.has(group.id);
        const placedCount = groupFigures.filter((f) => placedTypes.has(f.id)).length;
        return (
          <ToolbarGroup
            key={group.id}
            group={group}
            figures={groupFigures}
            placedTypes={placedTypes}
            placed={figures}
            placedCount={placedCount}
            isOpen={isOpen}
            onToggle={() => toggle(group.id)}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
}

function ToolbarGroup({ group, figures, placedTypes, placed, placedCount, isOpen, onToggle, onAdd, onRemove }) {
  return (
    <div className={`const-toolbar-group${isOpen ? ' open' : ''}`}>
      <button type="button" className="const-toolbar-group-header"
        onClick={onToggle}
        style={{ color: group.color }}>
        <span className="const-toolbar-group-arrow">{isOpen ? '▾' : '▸'}</span>
        <span className="const-toolbar-group-label">{group.label}</span>
        <span className="const-toolbar-group-count">{figures.length}</span>
        {placedCount > 0 && (
          <span className="const-toolbar-group-badge" style={{ background: group.color }}>
            {placedCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="const-toolbar">
          {figures.map((def) => {
            const isPlaced = placedTypes.has(def.id);
            const figure = placed.find((f) => f.type === def.id);
            const isRequired = REQUIRED_FIGURES.includes(def.id);
            return (
              <button
                key={def.id}
                type="button"
                className={`const-fig-btn${isPlaced ? ' placed' : ''}${isRequired ? ' required' : ''}`}
                onClick={() => isPlaced && figure && !isRequired ? onRemove(figure.id) : onAdd(def.id)}
                style={{ borderColor: def.color, color: def.color }}
                title={def.description}
              >
                <span style={{ fontSize: '15px' }}>{def.symbol}</span>
                <span>{def.name}</span>
                <span style={{ opacity: 0.5, fontSize: '11px' }}>
                  {isPlaced ? (isRequired ? '·' : '×') : '+'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
