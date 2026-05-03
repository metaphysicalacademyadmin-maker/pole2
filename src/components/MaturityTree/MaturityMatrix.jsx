import { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import {
  buildMaturityMatrix, maturityScore, FACETS, CHAKRA_LEVELS,
} from '../../utils/maturity-witnesses.js';

// Матриця Зрілості 7×5 — структурне дзеркало гравця.
// Показує що проявилось у тобі через перетин чакр і граней буття.
export default function MaturityMatrix() {
  const state = useGameStore();
  const matrix = useMemo(() => buildMaturityMatrix(state), [state]);
  const score = useMemo(() => maturityScore(matrix), [matrix]);

  return (
    <div className="mx-frame">
      <div className="mx-header">
        <div className="mx-eyebrow">матриця зрілості · корінь дерева</div>
        <div className="mx-score">
          <span className="mx-score-num">{Math.round(score.ratio * 100)}%</span>
          <span className="mx-score-label">проявлено</span>
        </div>
      </div>

      <p className="mx-intro">
        Це не оцінка. Це дзеркало — що зростає у тобі через перетин чакр і граней буття.
        Заповнюється з твоїх відповідей, ключів, практик. Не від кількості —
        від чесності.
      </p>

      <div className="mx-grid" role="table" aria-label="Матриця зрілості">
        {/* Header row — назви граней */}
        <div className="mx-row mx-header-row" role="row">
          <div className="mx-cell mx-corner" role="columnheader" />
          {FACETS.map((f) => (
            <div key={f.id} className="mx-cell mx-facet-h" role="columnheader"
              style={{ borderTopColor: f.color }}>
              <span className="mx-facet-icon" aria-hidden="true">{f.icon}</span>
              <span className="mx-facet-label">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Body rows — чакри */}
        {CHAKRA_LEVELS.map((chakra, ri) => (
          <div key={chakra.id} className="mx-row" role="row">
            <div className="mx-cell mx-chakra-h" role="rowheader">
              <span className="mx-chakra-num">{chakra.n}</span>
              <span className="mx-chakra-name">{chakra.name}</span>
            </div>
            {FACETS.map((facet, ci) => {
              const cell = matrix[ri][ci];
              const isPrimary = facet.id === chakra.primary;
              return (
                <div key={facet.id}
                  className={`mx-cell mx-witness depth-${cell.depth}${isPrimary ? ' is-primary' : ''}`}
                  role="cell"
                  style={isPrimary ? { borderColor: `${facet.color}55` } : undefined}>
                  <span className="mx-witness-text">{cell.text}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mx-legend">
        <span className="mx-legend-item depth-0">— ще не виявлено</span>
        <span className="mx-legend-item depth-1">● зародок</span>
        <span className="mx-legend-item depth-2">●● підтверджено</span>
        <span className="mx-legend-item depth-3">●●● ключ</span>
      </div>
    </div>
  );
}
