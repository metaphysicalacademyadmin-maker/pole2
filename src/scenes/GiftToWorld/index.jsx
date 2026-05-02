import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { GIFT_KINDS, communityCount, publishGift } from '../../utils/community.js';
import { showToast } from '../../components/GlobalToast.jsx';
import GiftForm from './GiftForm.jsx';
import './styles.css';

// Четверта спіраль — гравець залишає анонімний дар у Поле для тих, хто йде слідом.
export default function GiftToWorld({ onClose }) {
  const gifts = useGameStore((s) => s.gifts || []);
  const submitGift = useGameStore((s) => s.submitGift);
  const removeGift = useGameStore((s) => s.removeGift);
  const acknowledge = useGameStore((s) => s.acknowledgeFourthSpiral);
  const acknowledged = useGameStore((s) => s.fourthSpiralAcknowledged);
  const [activeKind, setActiveKind] = useState(null);
  const totalInField = communityCount();

  // Acknowledge у useEffect — не у render (інакше React warning + потенційно
  // блок рендеру).
  useEffect(() => {
    if (!acknowledged) acknowledge();
  }, [acknowledged, acknowledge]);

  async function handleSubmit({ text, kind, forLevelN }) {
    const gift = submitGift({ text, kind, forLevelN });
    if (!gift) {
      showToast('додай хоч кілька слів', 'warning');
      return;
    }
    const synced = await publishGift(gift);
    showToast(
      synced ? '✨ дар у Полі — інші його побачать' : '✨ дар збережено локально',
      'success',
    );
    setActiveKind(null);
  }

  if (activeKind) {
    return (
      <div className="gtw-overlay">
        <GiftForm kind={activeKind}
          onSubmit={handleSubmit}
          onCancel={() => setActiveKind(null)} />
      </div>
    );
  }

  return (
    <div className="gtw-overlay">
      <div className="gtw-frame">
        <button type="button" className="gtw-close" onClick={onClose}>← повернутись</button>
        <div className="gtw-eyebrow">четверта спіраль</div>
        <h1 className="gtw-title">Дар у <em>Світ</em></h1>
        <p className="gtw-sub">
          Ти отримав. Тепер — час віддавати. Залиш дар анонімно — у Полі він з'явиться
          тим, хто щойно зайшов і ще не знайшов опори.
        </p>

        <div className="gtw-stats">
          {totalInField !== null && (
            <div className="gtw-stat">
              <strong>{totalInField}</strong> дарів від інших гравців у Полі
            </div>
          )}
          <div className="gtw-stat">
            <strong>{gifts.length}</strong> {plural(gifts.length, 'твій дар', 'твоїх дари', 'твоїх дарів')}
          </div>
        </div>

        <div className="gtw-eyebrow gtw-section-tag">що подаруєш</div>
        <div className="gtw-kinds">
          {GIFT_KINDS.map((k) => (
            <button key={k.id} type="button" className="gtw-kind" onClick={() => setActiveKind(k)}>
              <span className="gtw-kind__icon">{k.icon}</span>
              <span className="gtw-kind__body">
                <span className="gtw-kind__title">{k.title}</span>
                <span className="gtw-kind__hint">{k.hint}</span>
              </span>
              <span className="gtw-kind__arrow">→</span>
            </button>
          ))}
        </div>

        {gifts.length > 0 && (
          <>
            <div className="gtw-eyebrow gtw-section-tag">твої дари</div>
            <div className="gtw-mygifts">
              {gifts.map((g) => {
                const kind = GIFT_KINDS.find((k) => k.id === g.kind);
                return (
                  <div key={g.id} className="gtw-mygift">
                    <span className="gtw-mygift__icon">{kind?.icon || '✨'}</span>
                    <span className="gtw-mygift__text">«{g.text}»</span>
                    <button type="button" className="gtw-mygift__remove" onClick={() => removeGift(g.id)}
                      title="прибрати дар">×</button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p className="gtw-foot">
          Усі дари анонімні — без імен, без контактів. Те, що ти даси,
          побачать ті, для кого це зараз потрібно.
        </p>
      </div>
    </div>
  );
}

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
