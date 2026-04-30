import { useMemo, useState, useEffect } from 'react';
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
  const [holdTimer, setHoldTimer] = useState(null);   // секунд що залишилось
  const figures = stored.figures;

  // Таймер 3 хв (180 сек) у фазі reading — гравець повинен побути у позиції.
  useEffect(() => {
    if (phase !== 'reading' || holdTimer != null) return;
    setHoldTimer(180);
    const start = Date.now();
    const intv = setInterval(() => {
      const left = Math.max(0, 180 - Math.floor((Date.now() - start) / 1000));
      setHoldTimer(left);
      if (left === 0) clearInterval(intv);
    }, 1000);
    return () => clearInterval(intv);
  }, [phase]);

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
            {holdTimer > 0 && <HoldTimer seconds={holdTimer} />}
            <ResolutionBlock
              text={resolution}
              onAccept={handleAcceptResolution}
              locked={holdTimer > 0}
              secondsLeft={holdTimer}
            />
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

function ResolutionBlock({ text, onAccept, locked, secondsLeft }) {
  if (!text) return null;
  return (
    <div className="const-resolution-box">
      <div className="const-resolution-label">вирішальна фраза</div>
      <div className="const-resolution-text">{text}</div>
      <div className="const-actions">
        <button className="btn btn-primary" onClick={onAccept} disabled={locked}>
          {locked ? `залишись у полі ще ${secondsLeft}с` : 'прокажи це повільно і прийми ключ →'}
        </button>
      </div>
    </div>
  );
}

function HoldTimer({ seconds }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <div style={{
      maxWidth: 600, margin: '24px auto 0', padding: '20px',
      background: 'rgba(20, 14, 30, 0.7)',
      border: '1.5px solid rgba(232, 196, 118, 0.35)',
      borderRadius: 12, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 11, fontWeight: 700, letterSpacing: '4px',
        color: '#f0c574', textTransform: 'uppercase', marginBottom: 8,
      }}>
        тримай позицію
      </div>
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 36, fontWeight: 700, color: '#fff7e0',
      }}>
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </div>
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontStyle: 'italic', fontSize: 13, color: '#c8bca8',
        marginTop: 8, lineHeight: 1.5,
      }}>
        Подихай. Подивись ще раз. Що тіло каже про цю позицію?
        <br />Що змінюється у дисфорті/сповнені від того що ти тут стоїш?
      </div>
    </div>
  );
}
