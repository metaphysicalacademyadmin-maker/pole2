import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { GIFT_KINDS, publishGift } from '../../utils/community.js';
import { showToast } from '../../components/GlobalToast.jsx';

// Inline-блок «Залишити свідчення» — гібрид зі старою логікою GiftToWorld.
// Не overlay, а expandable секція внизу LivingAcademy.
export default function GiftFormPanel() {
  const submitGift = useGameStore((s) => s.submitGift);
  const removeGift = useGameStore((s) => s.removeGift);
  const myGifts = useGameStore((s) => s.gifts || []);
  const [activeKind, setActiveKind] = useState(null);
  const [text, setText] = useState('');
  const [forLevelN, setForLevelN] = useState(1);

  async function handleSubmit() {
    if (!activeKind) return;
    if (text.trim().length < 5) {
      showToast('додай хоч кілька слів', 'warning');
      return;
    }
    const gift = submitGift({
      text: text.trim(),
      kind: activeKind.id,
      forLevelN: activeKind.needsLevel ? forLevelN : null,
    });
    if (!gift) {
      showToast('не вдалось зберегти', 'warning');
      return;
    }
    const synced = await publishGift(gift);
    showToast(synced ? '✨ свідчення у Полі' : '✨ свідчення збережено локально', 'success');
    setText('');
    setActiveKind(null);
  }

  if (activeKind) {
    return (
      <div className="la-gift-form">
        <div className="la-gift-form-header">
          <span className="la-gift-form-icon" aria-hidden="true">{activeKind.icon}</span>
          <span className="la-gift-form-title">{activeKind.title}</span>
          <button type="button" className="la-gift-form-back"
            onClick={() => { setActiveKind(null); setText(''); }}>
            ← інші типи
          </button>
        </div>
        <p className="la-gift-form-hint">{activeKind.hint}</p>

        {activeKind.needsLevel && (
          <div className="la-gift-form-level">
            <span className="la-gift-form-level-label">для рівня:</span>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button key={n} type="button"
                className={`la-gift-form-level-btn ${forLevelN === n ? 'is-active' : ''}`}
                onClick={() => setForLevelN(n)}>{n}</button>
            ))}
          </div>
        )}

        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder={activeKind.placeholder}
          rows={3} maxLength={400}
          className="la-gift-form-textarea" />
        <div className="la-gift-form-counter">{text.length} / 400</div>

        <button type="button" className="la-gift-form-submit"
          onClick={handleSubmit}
          disabled={text.trim().length < 5}>
          ↗ залишити свідчення анонімно
        </button>
        <p className="la-gift-form-foot">
          без імен, без редагування. Те що залишиш — побачать інші у момент,
          коли це їм потрібно.
        </p>
      </div>
    );
  }

  return (
    <div className="la-gift-panel">
      <div className="la-gift-kinds">
        {GIFT_KINDS.map((k) => (
          <button key={k.id} type="button" className="la-gift-kind"
            onClick={() => setActiveKind(k)}>
            <span className="la-gift-kind-icon">{k.icon}</span>
            <span className="la-gift-kind-body">
              <span className="la-gift-kind-title">{k.title}</span>
              <span className="la-gift-kind-hint">{k.hint}</span>
            </span>
            <span className="la-gift-kind-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </div>

      {myGifts.length > 0 && (
        <div className="la-gift-mine">
          <div className="la-gift-mine-label">мої свідчення ({myGifts.length})</div>
          {myGifts.map((g) => {
            const kind = GIFT_KINDS.find((k) => k.id === g.kind);
            return (
              <div key={g.id} className="la-gift-mine-row">
                <span className="la-gift-mine-icon">{kind?.icon || '✨'}</span>
                <span className="la-gift-mine-text">«{g.text}»</span>
                <button type="button" className="la-gift-mine-remove"
                  onClick={() => removeGift(g.id)}
                  aria-label="прибрати свідчення">×</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
