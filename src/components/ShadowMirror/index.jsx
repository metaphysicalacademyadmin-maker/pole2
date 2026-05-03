import { useGameStore } from '../../store/gameStore.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import './styles.css';

// Дзеркало Тіні — м'яка модалка яка з'являється через 0.8с після custom-відповіді
// якщо AI-евристика знайшла тіньовий тригер у тексті.
// Тон НЕ звинувачує — запрошує до глибшого погляду.
// Для категорії "Морок" — додатково показує helpline.

export default function ShadowMirror() {
  const mirror = useGameStore((s) => s.currentShadowMirror);
  const activeModal = useGameStore((s) => s.activeModal);
  const resolve = useGameStore((s) => s.resolveShadowMirror);

  const open = !!mirror && activeModal?.id === 'shadow-mirror';
  useOverlayA11y(open ? () => resolve('skipped') : null);

  if (!open) return null;

  const isHelpline = mirror.helpline;

  return (
    <div className="shadow-mirror-overlay" role="dialog" aria-modal="true"
      aria-label={isHelpline ? 'Дзеркало тіні з helpline' : 'Дзеркало тіні'}>
      <div className={`shadow-mirror-modal${isHelpline ? ' helpline' : ''}`}>
        <div className="sm-eyebrow">🪞 дзеркало тіні</div>
        <div className="sm-category">{mirror.label}</div>

        <div className="sm-quote">
          <span className="sm-quote-mark">«</span>
          <span className="sm-keyword">{mirror.keyword}</span>
          <span className="sm-quote-mark">»</span>
        </div>

        <div className="sm-reflection">{mirror.reflection}</div>

        {!isHelpline && (
          <div className="sm-actions">
            <button type="button" className="sm-btn sm-btn-not-mine"
              onClick={() => resolve('not_mine')}>
              ні, це не моє
            </button>
            <button type="button" className="sm-btn sm-btn-seen"
              onClick={() => resolve('seen')}>
              побачив це у собі
            </button>
          </div>
        )}

        {isHelpline && (
          <div className="sm-actions sm-actions-helpline">
            <a href="tel:+380800212121" className="sm-btn sm-btn-call">
              ☎ зателефонувати +380 800 21 21 21
            </a>
            <button type="button" className="sm-btn sm-btn-seen"
              onClick={() => resolve('seen')}>
              я зрозумів — закрити
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
