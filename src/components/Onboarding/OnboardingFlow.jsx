import { useState } from 'react';
import { useProfileStore } from '../../store/profileStore.js';
import JourneyPreview from './JourneyPreview.jsx';
import { STEPS } from './onboarding-steps.js';
import './onboarding.css';


export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const firstName = useProfileStore((s) => s.profile?.firstName);
  // Перший заголовок персоналізуємо: «Вітаю, Назар, у Полі» — або «Вітаю у Полі» без імені.
  const stepsLocalized = STEPS.map((s, i) =>
    i === 0
      ? { ...s, title: firstName ? `Вітаю, ${firstName}, у Полі` : 'Вітаю у Полі' }
      : s
  );
  const cur = stepsLocalized[step];
  const isLast = step === stepsLocalized.length - 1;

  function next() {
    if (isLast) onComplete();
    else setStep(step + 1);
  }
  function prev() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <div className="onb-overlay">
      <div className="onb-modal">
        <div className="onb-progress">
          {stepsLocalized.map((_, i) => (
            <span key={i} className={`onb-dot${i === step ? ' active' : ''}${i < step ? ' done' : ''}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="onb-breath-orb" aria-hidden="true">
            <span className="onb-breath-inner" />
          </div>
        )}

        <div className="onb-icon">{cur.icon}</div>
        <h2 className="onb-title">{cur.title}</h2>
        {cur.showJourney && <JourneyPreview />}
        <div className="onb-text" dangerouslySetInnerHTML={{ __html: format(cur.text) }} />

        <div className="onb-ritual-note">
          <em>це не пропускається — це ритуал входу</em>
        </div>

        <div className="onb-actions">
          {step > 0 && (
            <button type="button" className="onb-btn-back" onClick={prev}>
              ← назад
            </button>
          )}
          <button type="button" className="onb-btn-next" onClick={next}>
            {isLast ? 'я готовий · у поле ✦' : 'далі →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function format(text) {
  return text
    .split('\n\n')
    .map((p) => `<p>${p
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
    }</p>`)
    .join('');
}
