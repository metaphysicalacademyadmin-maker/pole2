import { useState, useRef } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { FIGURE_TYPES } from '../../data/constellation/figures.js';

const VW = 600, VH = 500;

// Сесія розстановки — drag-drop SVG поле + ритуальні фрази + рефлексія.
export default function ConstellationSession({ scenario, onEnd, onCancel }) {
  const save = useGameStore((s) => s.saveToolConstellation);
  const [figures, setFigures] = useState(scenario.starterFigures);
  const [draggingId, setDraggingId] = useState(null);
  const [phrasesSpoken, setPhrasesSpoken] = useState({});
  const [reflection, setReflection] = useState('');
  const [phase, setPhase] = useState('place');     // 'place' | 'ritual' | 'reflect'
  const svgRef = useRef(null);

  function svgPoint(e) {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX ?? e.touches?.[0]?.clientX;
    pt.y = e.clientY ?? e.touches?.[0]?.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function startDrag(figId, e) {
    e.preventDefault();
    setDraggingId(figId);
  }
  function onMove(e) {
    if (!draggingId) return;
    const p = svgPoint(e);
    if (!p) return;
    const x = Math.max(30, Math.min(VW - 30, p.x));
    const y = Math.max(30, Math.min(VH - 30, p.y));
    setFigures((figs) => figs.map((f) => f.id === draggingId ? { ...f, x, y } : f));
  }
  function onEnd2() { setDraggingId(null); }

  function addFigure(typeKey) {
    const type = FIGURE_TYPES[typeKey];
    if (!type) return;
    const id = `${typeKey}-${Date.now()}`;
    setFigures((figs) => [...figs, {
      id, type: typeKey, x: VW / 2, y: VH / 2,
      label: type.name, color: type.color, notes: '',
    }]);
  }

  function handleSave() {
    save({
      scenario: scenario.id,
      figures,
      reflection: reflection.trim() || null,
    });
    onEnd();
  }

  return (
    <div className="ct-overlay" role="dialog" aria-modal="true">
      <div className="ct-frame ct-session" style={{ '--sc-color': scenario.color }}>
        <button type="button" className="ct-close" onClick={onCancel}>
          ← інші сценарії
        </button>

        <div className="ct-session-head">
          <span className="ct-session-icon" style={{ color: scenario.color }}>{scenario.icon}</span>
          <h2>{scenario.name}</h2>
        </div>

        {phase === 'place' && (
          <>
            <p className="ct-intro">{scenario.intro}</p>

            <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} className="ct-field"
              onPointerMove={onMove} onPointerUp={onEnd2} onPointerLeave={onEnd2}>
              <defs>
                <radialGradient id="ct-field-bg">
                  <stop offset="0%" stopColor={`${scenario.color}22`} />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width={VW} height={VH} fill="url(#ct-field-bg)" />
              <circle cx={VW / 2} cy={VH / 2} r="220"
                fill="none" stroke={`${scenario.color}33`}
                strokeDasharray="4 6" />

              {/* Лінії-зв'язки */}
              {figures.map((a, i) =>
                figures.slice(i + 1).map((b) => (
                  <line key={`${a.id}-${b.id}`}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={scenario.color} strokeOpacity="0.18" strokeWidth="1" />
                ))
              )}

              {figures.map((f) => (
                <g key={f.id}
                  onPointerDown={(e) => startDrag(f.id, e)}
                  style={{ cursor: draggingId === f.id ? 'grabbing' : 'grab', touchAction: 'none' }}>
                  <circle cx={f.x} cy={f.y} r="26"
                    fill={f.color} fillOpacity="0.85"
                    stroke={f.color} strokeWidth="2" />
                  <text x={f.x} y={f.y + 4} textAnchor="middle"
                    fontSize="11" fontWeight="700" fill="#1a0f0a"
                    style={{ userSelect: 'none', pointerEvents: 'none' }}>
                    {f.label}
                  </text>
                </g>
              ))}
            </svg>

            <div className="ct-add-figures">
              <span>+ додати:</span>
              {['ancestor', 'shadow', 'soul', 'body', 'excluded'].map((t) => {
                const ft = FIGURE_TYPES[t];
                if (!ft) return null;
                return (
                  <button key={t} type="button" className="ct-add-btn"
                    onClick={() => addFigure(t)}>
                    {ft.symbol} {ft.name}
                  </button>
                );
              })}
            </div>

            <div className="ct-phase-actions">
              <button type="button" className="ct-btn ct-btn-primary"
                onClick={() => setPhase('ritual')}
                style={{ background: scenario.color }}>
                далі — ритуал →
              </button>
            </div>
          </>
        )}

        {phase === 'ritual' && (
          <>
            <p className="ct-intro">Прочитай вголос. Дивись на свою розстановку.</p>
            <div className="ct-ritual-list">
              {scenario.ritual.map((r, i) => (
                <button key={i} type="button"
                  className={`ct-ritual${phrasesSpoken[i] ? ' is-spoken' : ''}`}
                  onClick={() => setPhrasesSpoken((p) => ({ ...p, [i]: true }))}
                  style={phrasesSpoken[i] ? { borderColor: scenario.color, color: scenario.color } : undefined}>
                  <span className="ct-ritual-mark">{phrasesSpoken[i] ? '✓' : '○'}</span>
                  <span>«{r}»</span>
                </button>
              ))}
            </div>
            <div className="ct-phase-actions">
              <button type="button" className="ct-btn"
                onClick={() => setPhase('place')}>← назад</button>
              <button type="button" className="ct-btn ct-btn-primary"
                onClick={() => setPhase('reflect')}
                style={{ background: scenario.color }}>
                далі — рефлексія →
              </button>
            </div>
          </>
        )}

        {phase === 'reflect' && (
          <>
            <p className="ct-intro">{scenario.closing}</p>
            <textarea value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="що ти відчув/відчула? що відкрилось?"
              rows={4} maxLength={400}
              className="ct-reflection" />
            <div className="ct-phase-actions">
              <button type="button" className="ct-btn"
                onClick={() => setPhase('ritual')}>← назад</button>
              <button type="button" className="ct-btn ct-btn-primary"
                onClick={handleSave}
                style={{ background: scenario.color }}>
                ⊹ зберегти розстановку
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
