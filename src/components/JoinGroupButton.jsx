import { openJoinForm, getFallbackContact } from '../utils/group-application.js';
import './JoinGroupButton.css';

// Кнопка «Заявка на навчальну групу».
// Variant:
//   • primary  — золотий gradient, велика (Final)
//   • soft     — тонший border (LivingAcademy)
//   • inline   — мінімалістичний текст-link (Cabinet)
export default function JoinGroupButton({
  variant = 'soft',
  label = '💬 Заявка на навчальну групу',
  hint,
  className = '',
}) {
  return (
    <div className={`jgb-wrap jgb-wrap--${variant} ${className}`}>
      <button type="button"
        className={`jgb-btn jgb-btn--${variant}`}
        onClick={openJoinForm}>
        {label}
      </button>
      {hint && <p className="jgb-hint">{hint}</p>}
      <p className="jgb-fallback">
        або напиши{' '}
        <a href={getFallbackContact()} target="_blank" rel="noopener noreferrer">
          @dr_Zayats
        </a>
        {' '}у Telegram
      </p>
    </div>
  );
}
