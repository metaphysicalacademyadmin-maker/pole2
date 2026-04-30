import { useMemo, useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { FIGURE_TYPES, REQUIRED_FIGURES, OPTIONAL_FIGURES, INITIAL_POSITIONS } from '../../data/constellation/figures.js';
import { readField } from '../../data/constellation/readings.js';
import { buildResolution } from '../../data/constellation/resolutions.js';
import { showToast } from '../../components/GlobalToast.jsx';
import Field from './Field.jsx';
import './styles.css';

const LEVEL = 3;

// Сцена Розстановки — викликається у App.jsx коли currentLevel===3 і awaitingKey
// АЛЕ без resolution. Після resolution — стандартний Key екран.
export default function Constellation() {
  const stored = useGameStore((s) => s.constellations[LEVEL]) || { figures: [] };
  const placeFigure = useGameStore((s) => s.placeFigure);
  const removeFigure = useGameStore((s) => s.removeFigure);
  const saveResolution = useGameStore((s) => s.saveConstellationResolution);
  const claimKey = useGameStore((s) => s.claimKey);

  const [phase, setPhase] = useState(stored.figures.length >= 3 ? 'reading' : 'placing');
  const figures = stored.figures;

  const placedTypes = useMemo(() => new Set(figures.map((f) => f.type)), [figures]);
  const readings = useMemo(() => figures.length >= 3 ? readField(figures) : [], [figures]);
  const resolution = useMemo(() => buildResolution(figures), [figures]);

  function handleAdd(type) {
    if (placedTypes.has(type)) return;
    const init = INITIAL_POSITIONS[type] || { x: 300, y: 300, rotation: 0 };
    placeFigure(LEVEL, { id: `${type}-${Date.now()}`, type, ...init });
  }

  function handleChangeFigures(updated) {
    // Зберігаємо тільки змінені координати — actions placeFigure заміщає за id
    for (const f of updated) placeFigure(LEVEL, f);
  }

  function handleRemove(figureId) {
    removeFigure(LEVEL, figureId);
  }

  function handleProceedToReading() {
    if (figures.length < 3) {
      showToast('розмісти Я + батько + мама', 'warning');
      return;
    }
    setPhase('reading');
  }

  function handleAcceptResolution() {
    saveResolution(LEVEL, resolution);
    showToast('розстановку закрито · ключ готовий', 'success');
    setTimeout(() => {
      const lvl = { keyText: 'Я не герой свого роду. І це звільняє.' };
      claimKey(LEVEL, lvl.keyText);
    }, 1200);
  }

  return (
    <main className="scene">
      <div className="const-frame">
        <div className="const-eyebrow">рівень 3 · розстановка</div>
        <h1 className="const-title">Поле твого роду</h1>
        <p className="const-subtitle">
          Розмісти фігури там, де відчуваєш — не де «правильно». Поле читає
          відстань і поворот. Подвійний клік на фігурі — повернути.
        </p>

        <Toolbar placedTypes={placedTypes} onAdd={handleAdd} onRemove={handleRemove} figures={figures} />

        <div className="const-field-wrap">
          <Field figures={figures} onChange={handleChangeFigures} />
        </div>

        {phase === 'placing' && (
          <div className="const-actions">
            <button className="btn btn-primary"
              onClick={handleProceedToReading}
              disabled={figures.length < 3}>
              далі — слухати поле →
            </button>
          </div>
        )}

        {phase === 'reading' && (
          <>
            <Readings list={readings} />
            <ResolutionBlock text={resolution} onAccept={handleAcceptResolution} />
          </>
        )}
      </div>
    </main>
  );
}

function Toolbar({ placedTypes, onAdd, onRemove, figures }) {
  const all = [...REQUIRED_FIGURES, ...OPTIONAL_FIGURES];
  return (
    <div className="const-toolbar">
      {all.map((type) => {
        const def = FIGURE_TYPES[type];
        const placed = placedTypes.has(type);
        const figure = figures.find((f) => f.type === type);
        return (
          <button
            key={type}
            type="button"
            className={`const-fig-btn${placed ? ' placed' : ''}`}
            onClick={() => placed && figure ? onRemove(figure.id) : onAdd(type)}
            style={{ borderColor: def.color, color: def.color }}
            title={def.description}
          >
            <span style={{ fontSize: '16px' }}>{def.symbol}</span>
            <span>{def.name}</span>
            <span style={{ opacity: 0.5, fontSize: '11px' }}>{placed ? '×' : '+'}</span>
          </button>
        );
      })}
    </div>
  );
}

function Readings({ list }) {
  if (list.length === 0) return null;
  return (
    <div className="const-readings">
      {list.map((r) => (
        <div key={r.id} className="const-reading">
          <span className="const-reading-tag">{r.tag}</span>
          {r.message}
        </div>
      ))}
    </div>
  );
}

function ResolutionBlock({ text, onAccept }) {
  if (!text) return null;
  return (
    <div className="const-resolution-box">
      <div className="const-resolution-label">вирішальна фраза</div>
      <div className="const-resolution-text">{text}</div>
      <div className="const-actions">
        <button className="btn btn-primary" onClick={onAccept}>
          прокажи це повільно і прийми ключ →
        </button>
      </div>
    </div>
  );
}
