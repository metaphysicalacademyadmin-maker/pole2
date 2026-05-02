import { useState } from 'react';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export default function GiftForm({ kind, onSubmit, onCancel }) {
  const [text, setText] = useState('');
  const [forLevelN, setForLevelN] = useState(1);

  const ready = text.trim().length >= 5;

  function handleSubmit() {
    if (!ready) return;
    onSubmit({
      text: text.trim(),
      kind: kind.id,
      forLevelN: kind.needsLevel ? forLevelN : null,
    });
  }

  return (
    <div className="gtw-frame gtw-form">
      <button type="button" className="gtw-close" onClick={onCancel}>← інші типи дарів</button>
      <div className="gtw-eyebrow">дар · {kind.title.toLowerCase()}</div>
      <div className="gtw-form__icon">{kind.icon}</div>
      <h2 className="gtw-form__title">{kind.title}</h2>
      <p className="gtw-form__hint">{kind.hint}</p>

      {kind.needsLevel && (
        <div className="gtw-form__level">
          <span style={{ fontFamily: SYS, fontSize: '12px', color: '#c8bca8', marginRight: '8px' }}>
            для рівня:
          </span>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <button key={n} type="button"
              className={`gtw-form__level-btn ${forLevelN === n ? 'is-active' : ''}`}
              onClick={() => setForLevelN(n)}>
              {n}
            </button>
          ))}
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={kind.placeholder}
        rows={5}
        maxLength={400}
        className="gtw-form__textarea"
      />
      <div className="gtw-form__counter">{text.length} / 400</div>

      <div className="gtw-form__actions">
        <button type="button" className="gtw-btn-ghost" onClick={onCancel}>
          відмінити
        </button>
        <button type="button" className="gtw-btn-primary" onClick={handleSubmit}
          disabled={!ready}
          style={{ opacity: ready ? 1 : 0.5, cursor: ready ? 'pointer' : 'not-allowed' }}>
          ↗ подарувати у Поле
        </button>
      </div>

      <p className="gtw-foot">
        Анонімно. Без імен. Без редагування після — тому пиши лише те,
        що готовий залишити у Полі назавжди.
      </p>
    </div>
  );
}
