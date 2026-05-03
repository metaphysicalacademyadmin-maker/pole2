import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';

// Двофазний ритуал з батьками за Хеллінгером — annehmen + повернення тягаря.
// Фаза 1 «Беру у тебе» — annehmen, прийняти що батько/мати дав/ла.
// Фаза 2 «Залишаю те що твоє» — повернути не своє назад до них.
//
// Хеллінгер: «Любов яка несе сліпо vs любов яка бачить» —
//  свідома любов = бачу, але не несу.

const ACCEPTANCE_PHRASES = [
  '«Я беру тебе як ти є — без претензій.»',
  '«Я приймаю життя яке ти мені дав/дала.»',
  '«Я приймаю все що ти мав/мала що дати — і навіть те чого не мав/мала.»',
  '«Дякую за все що було добре.»',
  '«Дякую і за те що було важко — це теж зробило мене.»',
];

const RELEASE_PHRASES = [
  '«Я залишаю твою долю — у тебе.»',
  '«Я не несу твої страхи на собі. Вони твої.»',
  '«Я не несу твою провину. Вона твоя.»',
  '«Я не несу твої борги — фінансові, любовні, мрійні. Це твоє.»',
  '«Я живу своє життя — як твій син / твоя дочка. Не як ти.»',
];

export default function ParentRitual({ parent, onClose }) {
  // parent: 'mother' | 'father'
  const node = useGameStore((s) => s.rodovid?.[parent]);
  const ritual = useGameStore((s) => s.rodovidParentRitual?.[parent]) || {};
  const markRitual = useGameStore((s) => s.markParentRitual);

  const [phase, setPhase] = useState(ritual.acceptance ? 'release' : 'acceptance');
  const [spoken, setSpoken] = useState({});

  useOverlayA11y(onClose);

  const phrases = phase === 'acceptance' ? ACCEPTANCE_PHRASES : RELEASE_PHRASES;
  const allSpoken = phrases.every((_, i) => spoken[i]);

  const parentLabel = parent === 'mother' ? 'мама' : 'тато';
  const parentName = node?.name || parentLabel;
  const color = parent === 'mother' ? '#f0a8b8' : '#9fc8e8';

  function handleNext() {
    if (phase === 'acceptance') {
      markRitual(parent, 'acceptance');
      setPhase('release');
      setSpoken({});
    } else {
      markRitual(parent, 'release');
      onClose();
    }
  }

  return (
    <div className="prit-overlay" role="dialog" aria-modal="true"
      aria-label={`Ритуал з ${parentLabel}`}>
      <div className="prit-modal" style={{ borderColor: `${color}66` }}>
        <button type="button" className="exc-close" onClick={onClose}
          aria-label="Закрити ритуал">×</button>

        <div className="prit-header">
          <div className="prit-icon" style={{ color }}>
            {parent === 'mother' ? '◈' : '◇'}
          </div>
          <div className="prit-name" style={{ color }}>{parentName}</div>
          <div className="prit-sub">ритуал {parentLabel === 'мама' ? 'з мамою' : 'з татом'}</div>
        </div>

        <div className="prit-tabs">
          <div className={`prit-tab${phase === 'acceptance' ? ' active' : ''}${ritual.acceptance ? ' done' : ''}`}>
            Фаза 1 · беру
          </div>
          <div className={`prit-tab${phase === 'release' ? ' active' : ''}${ritual.release ? ' done' : ''}`}>
            Фаза 2 · залишаю
          </div>
        </div>

        <div className="prit-phase">
          {phase === 'acceptance' ? (
            <>
              <h3>Прийми те, що {parentLabel} дав/ла</h3>
              <p>За Хеллінгером — annehmen. Без претензій. Без «мав би більше».
              Я приймаю те що було — і це робить мене.</p>
            </>
          ) : (
            <>
              <h3>Залиши те що твоє — у тебе</h3>
              <p>Я несу тільки своє. Твою долю — повертаю тобі. Любов, що бачить
              — звільняє обох.</p>
            </>
          )}

          <div className="prit-list">
            {phrases.map((p, i) => (
              <button key={i} type="button"
                className={`prit-phrase${spoken[i] ? ' is-spoken' : ''}`}
                onClick={() => setSpoken((s) => ({ ...s, [i]: true }))}
                style={spoken[i] ? { borderColor: color, color } : undefined}>
                <span className="prit-phrase-mark">{spoken[i] ? '✓' : '○'}</span>
                <span>{p}</span>
              </button>
            ))}
          </div>

          <p className="prit-instruction">
            Прочитай вголос — кожну. Тіло має почути твій голос.
          </p>

          <button type="button" className="prit-btn-next"
            onClick={handleNext}
            disabled={!allSpoken}
            style={{ background: allSpoken ? color : 'rgba(255,255,255,0.06)', color: allSpoken ? '#1a0f0a' : '#a8a09b' }}>
            {phase === 'acceptance' ? '→ перехід до фази 2' : '⊹ завершити ритуал'}
          </button>
        </div>
      </div>
    </div>
  );
}
