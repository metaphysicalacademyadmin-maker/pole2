import MiniConstellation from './MiniConstellation.jsx';

// Фаза 3 — тіло. Two modes: одне слово (default) або міні-розстановка.
export default function BodyPhase({
  petalColor, bodyMark, setBodyMark, bodyMode, setBodyMode,
  onSave, onConstellationSave,
}) {
  if (bodyMode === 'constellation') {
    return (
      <>
        <button type="button" className="petal-mode-back"
          onClick={() => setBodyMode('word')}>
          ← назад до слова
        </button>
        <MiniConstellation
          petalColor={petalColor}
          onSubmit={onConstellationSave}
          onSkip={onSave}
        />
      </>
    );
  }

  return (
    <div className="petal-cell petal-body-phase">
      <div className="petal-phase-label">фаза 3 · тіло</div>
      <h3 className="petal-cell-title">Де у тілі це зараз?</h3>
      <p className="petal-cell-question">
        Одне слово — груди / живіт / горло / стопи / спина / руки / ціле тіло.
        Не шукай «правильне» — пиши перше що відчув.
      </p>
      <input type="text" value={bodyMark}
        onChange={(e) => setBodyMark(e.target.value)}
        placeholder="одне слово..."
        maxLength={40}
        className="petal-body-input" />
      <button type="button" className="petal-mode-switch"
        onClick={() => setBodyMode('constellation')}>
        ✦ а ще — постав фігури на полі
      </button>
      <div className="petal-phase-actions">
        <button type="button" className="petal-skip" onClick={onSave}>
          пропустити та зберегти
        </button>
        <button type="button" className="petal-deepening-go" onClick={onSave}>
          ✦ зберегти та далі
        </button>
      </div>
    </div>
  );
}
