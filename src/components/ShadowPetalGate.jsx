import { useGameStore } from '../store/gameStore.js';
import { useOverlayA11y } from '../hooks/useOverlayA11y.js';

// Попередження перед першим входом у xi_shadow.
// Показується ОДИН раз — після ack ставимо flag у store і більше не показуємо.
// Гравець може відмовитись (повертається на мандалу) або прийняти.
export default function ShadowPetalGate({ onAccept, onDecline }) {
  const acknowledge = useGameStore((s) => s.acknowledgeShadowPetal);
  useOverlayA11y(onDecline);

  function handleAccept() {
    acknowledge();
    onAccept();
  }

  return (
    <div className="spg-overlay" role="dialog" aria-modal="true" aria-label="Попередження тіні">
      <div className="spg-modal">
        <div className="spg-symbol">☾</div>
        <h3 className="spg-title">ти готовий зустріти тінь?</h3>
        <p className="spg-text">
          Ця пелюстка — не як інші. Тут не «правильні відповіді» — тут
          ти бачиш те, чого не любиш у собі. І це лікує.
        </p>
        <p className="spg-text">
          Питання можуть зачепити. Це нормально. Якщо стане складно —
          зупинись, дихай, повернись завтра. Тінь нікуди не дінеться.
        </p>
        <div className="spg-warning">
          <strong>Це не терапія.</strong> Якщо у тебе зараз гостра криза —
          закрий гру, подзвони близькому або у Лінію Довіри 7333.
        </div>
        <div className="spg-actions">
          <button type="button" className="spg-btn spg-btn-no" onClick={onDecline}>
            не зараз
          </button>
          <button type="button" className="spg-btn spg-btn-yes" onClick={handleAccept}>
            ☾ я готовий зустрітись
          </button>
        </div>
      </div>
    </div>
  );
}
