import { useGameStore } from '../../store/gameStore.js';
import './styles.css';

// Резонансне дзеркало — модалка що з'являється після ключа.
// Псевдо-гравець (детермінований з хешу) "написав" коротку рефлексію.
// Гравець обирає: побачив / це не моє / далі.

export default function ResonanceMirror() {
  const r = useGameStore((s) => s.currentResonance);
  const activeModal = useGameStore((s) => s.activeModal);
  const resolve = useGameStore((s) => s.resolveResonance);

  if (!r) return null;
  if (activeModal?.id !== 'resonance') return null;
  const { pseudoPlayer, message, levelN } = r;

  return (
    <div className="reson-overlay">
      <div className="reson-modal">
        <div className="reson-eyebrow">💫 резонанс поля</div>
        <div className="reson-subtitle">
          Поле знайшло того, хто зараз у тій самій точці що й ти
        </div>

        <div className="reson-player">
          <div className="reson-avatar">
            {pseudoPlayer.name[0]}
          </div>
          <div className="reson-player-name">{pseudoPlayer.name}</div>
          <div className="reson-player-meta">
            {pseudoPlayer.age} · {pseudoPlayer.city}
          </div>
          <div className="reson-player-state">
            пройшов рівень {levelN} · сьогодні
          </div>
        </div>

        <blockquote className="reson-message">
          «{message}»
        </blockquote>

        <div className="reson-note">
          Анонімно · ім'я і місто змінено · щоб ти знав що ти не сам
        </div>

        <div className="reson-actions">
          <button type="button" className="reson-btn reson-btn-skip"
            onClick={() => resolve('skipped')}>
            пройти повз
          </button>
          <button type="button" className="reson-btn reson-btn-touched"
            onClick={() => resolve('touched')}>
            торкнуло мене
          </button>
        </div>
      </div>
    </div>
  );
}
