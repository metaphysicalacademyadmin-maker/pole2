import { useState } from 'react';
import { PATH_MODES } from '../../data/pathmodes.js';

// Wizard 5 питань → рекомендує трек.
// Кожна відповідь дає бал кожному з 5 треків. Сума → recommendation.
const QUESTIONS = [
  {
    id: 'q1',
    text: 'Що зараз відчувається найбільше?',
    options: [
      { text: 'Виснаження, тривога, без ґрунту', scores: { root: 3, heart: 0, voice: 0, shadow: 0, initiate: 0 } },
      { text: 'Самотність, болісні стосунки', scores: { root: 0, heart: 3, voice: 0, shadow: 1, initiate: 0 } },
      { text: 'Безсенс, творчий застій', scores: { root: 0, heart: 0, voice: 3, shadow: 1, initiate: 0 } },
      { text: 'Знаю свою тінь — готовий зустріти', scores: { root: 0, heart: 0, voice: 0, shadow: 3, initiate: 1 } },
      { text: 'Шукаю повне занурення, ціле перетворення', scores: { root: 0, heart: 0, voice: 0, shadow: 0, initiate: 3 } },
    ],
  },
  {
    id: 'q2',
    text: 'Скільки часу ти готовий присвятити цьому шляху?',
    options: [
      { text: 'Кілька годин — спробувати', scores: { root: 3, heart: 0, voice: 0, shadow: 0, initiate: 0 } },
      { text: '2-3 тижні з регулярними сесіями', scores: { root: 1, heart: 2, voice: 2, shadow: 1, initiate: 0 } },
      { text: 'Місяць занурення', scores: { root: 0, heart: 0, voice: 0, shadow: 2, initiate: 3 } },
      { text: 'Не знаю — буду по інтуїції', scores: { root: 2, heart: 1, voice: 1, shadow: 0, initiate: 0 } },
    ],
  },
  {
    id: 'q3',
    text: 'Як ти ставишся до тіньової роботи?',
    options: [
      { text: 'Боюся — хочу спершу опору', scores: { root: 3, heart: 1, voice: 0, shadow: 0, initiate: 0 } },
      { text: 'Готовий обережно — поряд із світлим', scores: { root: 1, heart: 2, voice: 2, shadow: 0, initiate: 1 } },
      { text: 'Працював із психологом — готовий прямо', scores: { root: 0, heart: 1, voice: 0, shadow: 3, initiate: 2 } },
      { text: 'Хочу все відразу — і світло і тінь', scores: { root: 0, heart: 0, voice: 0, shadow: 1, initiate: 3 } },
    ],
  },
  {
    id: 'q4',
    text: 'Чи був досвід з духовними практиками?',
    options: [
      { text: 'Ні, перший раз', scores: { root: 3, heart: 1, voice: 0, shadow: 0, initiate: 0 } },
      { text: 'Так, базові — медитація, йога', scores: { root: 1, heart: 2, voice: 2, shadow: 0, initiate: 1 } },
      { text: 'Глибокий — терапія, ретрити, школи', scores: { root: 0, heart: 1, voice: 1, shadow: 3, initiate: 2 } },
      { text: 'Шукаю космо/енергетичний рівень', scores: { root: 0, heart: 0, voice: 1, shadow: 1, initiate: 3 } },
    ],
  },
  {
    id: 'q5',
    text: 'Що ти найбільше хочеш отримати наприкінці?',
    options: [
      { text: 'Спокій. Опору. Жити у тілі.', scores: { root: 3, heart: 0, voice: 0, shadow: 0, initiate: 0 } },
      { text: 'Любити повніше. Прощати глибше.', scores: { root: 0, heart: 3, voice: 0, shadow: 0, initiate: 0 } },
      { text: 'Знайти свій голос і призначення.', scores: { root: 0, heart: 0, voice: 3, shadow: 0, initiate: 1 } },
      { text: 'Прийняти себе цілком — з усім.', scores: { root: 0, heart: 0, voice: 0, shadow: 3, initiate: 1 } },
      { text: 'Стати провідником, служити.', scores: { root: 0, heart: 0, voice: 0, shadow: 0, initiate: 3 } },
    ],
  },
];

export default function TrackWizard({ onSelect, onClose }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ root: 0, heart: 0, voice: 0, shadow: 0, initiate: 0 });
  const [done, setDone] = useState(false);

  function pick(option) {
    const next = { ...scores };
    Object.keys(option.scores).forEach((k) => { next[k] += option.scores[k]; });
    setScores(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function recommendation() {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = sorted[0][0];
    const second = sorted[1][0];
    return { top, second };
  }

  if (done) {
    const { top, second } = recommendation();
    const topMode = PATH_MODES[top];
    const secondMode = PATH_MODES[second];
    return (
      <div className="tw-overlay">
        <div className="tw-frame">
          <button type="button" className="tw-close" onClick={onClose}>×</button>
          <div className="tw-eyebrow">поле відчуло</div>
          <h2 className="tw-result-title">
            Тобі резонує{' '}
            <span style={{ color: topMode.color }}>{topMode.symbol} {topMode.name}</span>
          </h2>
          <p className="tw-result-quote">{topMode.quote}</p>
          <p className="tw-result-desc">{topMode.description}</p>

          <div className="tw-result-actions">
            <button type="button" className="tw-btn-primary"
              onClick={() => onSelect(top)}
              style={{
                background: `linear-gradient(135deg, ${topMode.color}cc, ${topMode.color}88)`,
              }}>
              {topMode.symbol} обираю {topMode.name}
            </button>
            <button type="button" className="tw-btn-ghost" onClick={() => onSelect(second)}>
              або {secondMode.symbol} {secondMode.name}
            </button>
            <button type="button" className="tw-btn-ghost" onClick={onClose}>
              ↩ передумаю
            </button>
          </div>

          <p className="tw-foot">
            Якщо у фіналі гри захочеш — зможеш перейти у глибший трек.
          </p>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div className="tw-overlay">
      <div className="tw-frame">
        <button type="button" className="tw-close" onClick={onClose}>×</button>

        <div className="tw-progress">
          {QUESTIONS.map((_, i) => (
            <span key={i} className={`tw-dot ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`} />
          ))}
        </div>

        <div className="tw-eyebrow">{step + 1} з {QUESTIONS.length}</div>
        <h2 className="tw-question">{q.text}</h2>
        <div className="tw-options">
          {q.options.map((opt, i) => (
            <button key={i} type="button" className="tw-option" onClick={() => pick(opt)}>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
