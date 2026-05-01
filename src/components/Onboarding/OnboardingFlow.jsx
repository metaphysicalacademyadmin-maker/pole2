import { useState } from 'react';
import { useProfileStore } from '../../store/profileStore.js';
import './onboarding.css';

const STEPS = [
  {
    icon: '✦',
    title: '__GREETING__',  // підставляється у компоненті з ім'ям юзера
    text: `Це не "просто гра". Це **інструмент для роботи зі собою**.

Тут не виграють і не програють. Тут — **бачать**.

Грай повільно. Чесно. Без поспіху.`,
  },
  {
    icon: '🔻',
    title: '7 рівнів свідомості',
    text: `Ти пройдеш через 7 рівнів — як по піраміді знизу вгору:
**Коріння → Потік → Воля і Рід → Серце → Голос → Видіння → Джерело**

На кожному — питання, які зазвичай не задаєш собі. На третьому — **розстановка з родом** (метод Хеллінгера у браузері).

Один рівень — одна **внутрішня подія**. Не поспішай.`,
  },
  {
    icon: '👥',
    title: '5 внутрішніх фігур',
    text: `Тебе будуть супроводжувати:

🌟 **Кай** — друг, м'який супутник
☾ **Антип** — провокатор тіні (приходить коли імітуєш)
▲ **Арбітр** — свідок справжнього
◯ **Дзеркало** — повертає твою фразу як питання
? **Я (Учитель)** — допоможу коли треба

**Антипа не уникай** — він твій найкращий учитель.`,
  },
  {
    icon: '🌀',
    title: 'Карта Поля + 7 тонких тіл',
    text: `Зверху буде бейдж **«поле X%»** — це твій загальний стан.

Клік на нього → відкривається **Карта Поля**: 7 тонких тіл (фізичне → атмічне) з вимірюваннями.

Кожне тіло можна **виміряти** (5 питань) → отримати % integrity → побачити які практики/канали його лікують.

Тонкі тіла **ростуть** від чесних відповідей у клітинках, виконаних практик, активних каналів.`,
  },
  {
    icon: '🎯',
    title: 'Як грати ефективно',
    text: `**Топ-5 порад:**

✓ **Custom answer** — пиши свою відповідь, не тільки готову. Це 80% цінності.
✓ **Shadow опції** — інколи саме вони твої.
✓ **Slow** — один-два рівні на день, не "все за вечір".
✓ **Тіло слухай** — на кожній клітинці запитай "що відчувається?"
✓ **Повертайся** — гра запам'ятовує тебе. Через місяць ти будеш іншим.

Все. Зайди у поле. ✦`,
  },
  {
    icon: '✈',
    title: 'Метафізична Академія',
    text: `Гра — лише вступ у велику традицію.

🎓 **metaphysical-way.academy** — курси і методики
📷 **Instagram @metaphysical_way** — щоденно
👥 **Спільнота гравців ПОЛЕ** — закрита Telegram-група для тих хто грає
💬 **@dr_Zayats** — прямий контакт автора

Усі посилання знайдеш внизу стартового екрану і у Final після гри.

Тепер — у поле.`,
  },
];

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
