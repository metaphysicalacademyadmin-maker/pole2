import { FIGURE_TYPES, FIGURE_GROUPS, REQUIRED_FIGURES, OPTIONAL_FIGURES, getFiguresByGroup } from '../../data/constellation/figures.js';

// Згрупований toolbar для 18 фігур.
// 4 секції: внутрішні / рід / трикутник / системні.
// Required-фігури (self, father, mother) — у "рід", обовʼязкові і не видаляються.

export default function Toolbar({ placedTypes, onAdd, onRemove, figures }) {
  const allowed = new Set([...REQUIRED_FIGURES, ...OPTIONAL_FIGURES]);

  return (
    <div className="const-toolbar-groups">
      {FIGURE_GROUPS.map((group) => {
        const groupFigures = getFiguresByGroup(group.id).filter((f) => allowed.has(f.id));
        if (groupFigures.length === 0) return null;
        return (
          <ToolbarGroup
            key={group.id}
            group={group}
            figures={groupFigures}
            placedTypes={placedTypes}
            placed={figures}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
}

function ToolbarGroup({ group, figures, placedTypes, placed, onAdd, onRemove }) {
  return (
    <div className="const-toolbar-group">
      <div className="const-toolbar-group-label" style={{ color: group.color }}>
        {group.label}
      </div>
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
    </div>
  );
}
