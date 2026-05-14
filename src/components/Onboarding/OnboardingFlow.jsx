import { useEffect, useRef, useState } from 'react';
import { useProfileStore } from '../../store/profileStore.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import JourneyPreview from './JourneyPreview.jsx';
import { STEPS } from './onboarding-steps.js';
import './onboarding.css';


export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const overlayRef = useRef(null);
  const firstName = useProfileStore((s) => s.profile?.firstName);

  // Блокуємо фоновий скрол через спільний стек overlay-ів. Без цього
  // ручне керування overflow конфліктувало з іншими модалками: якщо
  // ще одна модалка відкривалась поверх онбордингу і закривалась,
  // спільний хук розблоковував скрол хоча онбординг ще лишався відкритим.
  // escapable: false — ESC не закриває онбординг (юзер має пройти всі кроки).
  useOverlayA11y(null, { escapable: false });

  // На зміну слайда — скрол overlay у початок (не плавно, миттєво,
  // щоб збігалось з новою blur-анімацією).
  useEffect(() => {
    overlayRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);
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
    <div className="onb-overlay" ref={overlayRef}>
      <div className="onb-modal">
        <div className="onb-progress">
          {stepsLocalized.map((_, i) => (
            <span key={i} className={`onb-dot${i === step ? ' active' : ''}${i < step ? ' done' : ''}`} />
          ))}
        </div>

        <div key={step} className="onb-slide">
          {step === 0 && (
            <div className="onb-breath-orb" aria-hidden="true">
              <span className="onb-breath-inner" />
            </div>
          )}

          <div className="onb-icon">{cur.icon}</div>
          <h2 className="onb-title">{cur.title}</h2>
          {cur.showJourney && <JourneyPreview />}
          <div className="onb-text" dangerouslySetInnerHTML={{ __html: format(cur.text) }} />
        </div>

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
