import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { formatCooldownRemaining, COOLDOWN_MS } from '../utils/petal-cooldown.js';
import { useOverlayA11y } from '../hooks/useOverlayA11y.js';

// Модалка-стримуючість після завершення пелюстки.
// Не блокує: «зачекаю» відмовляє, «увійти зараз» зберігає override
// у store (щоб не показувати знов на цій же пелюстці).
export default function PetalCooldownModal({ petalId, petalName, cooldown, onClose, onProceed }) {
  const overrideCooldown = useGameStore((s) => s.overridePetalCooldown);
  const [now, setNow] = useState(Date.now());

  useOverlayA11y(onClose);

  // Лічильник, що оновлюється раз на хвилину
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(tick);
  }, []);

  // Перерахунок remaining під поточний now
  const remainingMs = Math.max(0, COOLDOWN_MS - (now - (cooldown.lastTs || (now - cooldown.elapsedMs))));
  const remainingFmt = formatCooldownRemaining(remainingMs > 0 ? remainingMs : cooldown.remainingMs);

  // Якщо час минув поки модалка відкрита — автоматично продовжуємо
  useEffect(() => {
    if (remainingMs <= 0 && cooldown.elapsedMs >= COOLDOWN_MS) {
      onProceed();
    }
  }, [remainingMs, cooldown.elapsedMs, onProceed]);

  function handleProceed() {
    overrideCooldown(petalId);
    onProceed();
  }

  return (
    <div className="pcd-overlay" role="dialog" aria-modal="true" aria-label="Поле дозріває">
      <div className="pcd-modal">
        <div className="pcd-symbol">⌛</div>
        <h3 className="pcd-title">поле дозріває</h3>
        <p className="pcd-text">
          Ти щойно прожив одну сферу. Поле тепер тримає твою відповідь
          у тілі — не у голові. Дай їй час осісти.
        </p>
        <div className="pcd-meta">
          до природного відкриття «{petalName}» — <strong>{remainingFmt}</strong>
        </div>
        <p className="pcd-hint">
          Це не блок. Це поклик пройти день з тим, що вже відкрилось.
          Помітити як воно живе у твоєму тілі.
        </p>
        <div className="pcd-actions">
          <button type="button" className="pcd-btn pcd-btn-wait" onClick={onClose}>
            ✓ зачекаю — повернусь завтра
          </button>
          <button type="button" className="pcd-btn pcd-btn-go" onClick={handleProceed}>
            я готовий зараз →
          </button>
        </div>
      </div>
    </div>
  );
}
