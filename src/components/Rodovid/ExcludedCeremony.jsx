import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { findExcludedType } from '../../data/rodovid-hellinger.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';

// Коротка церемонія визнання виключеного — за Хеллінгером.
// 3 кроки:
//   1. Я визнаю — ти теж належиш
//   2. Я залишаю те що твоє у тебе
//   3. Я кланяюсь
// Кожен крок — фраза + кнопка «вимовив». Завершення = acknowledged: true
const STEPS = [
  {
    id: 'see',
    title: 'Я бачу тебе',
    text: 'Перш ніж назвати — побачимо. У роді ти був/була. Незалежно від того хто пам\'ятає.',
    phrase: '«Я бачу тебе. Ти теж є у нашому роді.»',
    btn: '✓ я побачив',
  },
  {
    id: 'belong',
    title: 'Ти належиш',
    text: 'Хеллінгер казав: виключений тримає за собою наступні покоління. Поверни його у систему — і вона звільняється.',
    phrase: '«Ти належиш до нашого роду. Я визнаю твоє місце.»',
    btn: '✓ я визнав',
  },
  {
    id: 'release',
    title: 'Я залишаю те що твоє у тебе',
    text: 'Я не несу твою долю на собі. Я несу тільки своє життя.',
    phrase: '«Я залишаю те, що твоє — у тебе. З любов\'ю. Я живу своє.»',
    btn: '✓ я залишив',
  },
];

export default function ExcludedCeremony({ excludedId, onClose }) {
  const item = useGameStore((s) =>
    (s.rodovidExcluded || []).find((e) => e.id === excludedId));
  const update = useGameStore((s) => s.updateExcludedMember);
  const [step, setStep] = useState(0);

  useOverlayA11y(onClose);

  if (!item) return null;
  const type = findExcludedType(item.type);

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      update(excludedId, { acknowledged: true, acknowledgedAt: Date.now() });
      onClose();
    }
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="exc-overlay" role="dialog" aria-modal="true"
      aria-label="Церемонія визнання виключеного">
      <div className="exc-modal" style={{ borderColor: `${type.color}66` }}>
        <button type="button" className="exc-close" onClick={onClose}
          aria-label="Закрити церемонію">×</button>

        <div className="exc-figure">
          <div className="exc-figure-icon" style={{ color: type.color }}>{type.icon}</div>
          <div className="exc-figure-name">
            {item.name || type.label}
          </div>
          {item.story && <div className="exc-figure-story">«{item.story}»</div>}
        </div>

        <div className="exc-progress">
          {STEPS.map((s, i) => (
            <span key={s.id}
              className={`exc-step-dot${i === step ? ' active' : ''}${i < step ? ' done' : ''}`} />
          ))}
        </div>

        <div className="exc-step">
          <div className="exc-step-num">крок {step + 1} з {STEPS.length}</div>
          <h3 className="exc-step-title">{current.title}</h3>
          <p className="exc-step-text">{current.text}</p>
          <div className="exc-phrase">
            {current.phrase}
          </div>
          <p className="exc-instructions">
            Прочитай вголос. Не у голові — голосом. Поки тіло це не вимовить — це не церемонія.
          </p>
          <button type="button" className="exc-btn-next"
            onClick={next}
            style={{ background: type.color }}>
            {isLast ? '⊹ завершити церемонію' : current.btn}
          </button>
        </div>
      </div>
    </div>
  );
}
