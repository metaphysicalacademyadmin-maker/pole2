import { useState } from 'react';

// Текстова відповідь у клітинці — для тих хто не бачить себе у готових варіантах.
// 30 символів мінімум — щоб відповідь була чесною, не «.».
const MIN_LEN = 30;
const MAX_LEN = 1500;

export default function CustomAnswer({ onSubmit, onCancel }) {
  const [text, setText] = useState('');
  const trimmed = text.trim();
  const canSubmit = trimmed.length >= MIN_LEN;

  return (
    <div className="cell-custom">
      <div className="cell-custom-eyebrow">своя відповідь · бонус +3</div>
      <textarea
        className="cell-custom-input"
        placeholder="опиши що бачиш у тілі / у житті своїми словами…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX_LEN}
        autoFocus
        rows={5}
      />
      <div className="cell-custom-meta">
        {trimmed.length < MIN_LEN
          ? `ще ${MIN_LEN - trimmed.length} символів`
          : `${trimmed.length} символів`}
      </div>
      <div className="cell-custom-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          ↩ повернутись до варіантів
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canSubmit}
          onClick={() => onSubmit(trimmed)}
        >
          зберегти
        </button>
      </div>
    </div>
  );
}
