import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { showToast } from '../../components/GlobalToast.jsx';

// Заявка на навчання космоенергетики (рівень 2 → рівень 3).
// Зберігається у state.cosmoApplication. Огляд — через адмін-панель.

export default function Application({ content, state }) {
  const submit = useGameStore((s) => s.submitCosmoApplication);
  const application = state.cosmoApplication;
  const [answers, setAnswers] = useState(
    application?.answers || Object.fromEntries(content.questions.map((q) => [q.id, ''])),
  );

  if (application) {
    return <SubmittedView application={application} />;
  }

  const allFilled = content.questions.every((q) => answers[q.id]?.trim().length >= 10);

  function handleSubmit() {
    if (!allFilled) {
      showToast('розкрий думку детальніше — мінімум 10 символів на питання', 'warning');
      return;
    }
    submit(answers);
    showToast('🔮 Заявку подано', 'success');
  }

  return (
    <div className="cl-application">
      <div className="cl-app-intro">
        Заявка — це не формальність. Це визнання намірів.
        Будь чесним — Поле читає не лише слова.
      </div>
      {content.questions.map((q) => (
        <div key={q.id} className="cl-app-question">
          <label>{q.label}</label>
          <textarea value={answers[q.id]} rows={3}
            placeholder={q.placeholder}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} />
        </div>
      ))}
      <button type="button" className="cl-app-submit"
        disabled={!allFilled} onClick={handleSubmit}>
        🔮 подати заявку
      </button>
    </div>
  );
}

function SubmittedView({ application }) {
  const status = application.status;
  return (
    <div className="cl-application">
      <div className={`cl-app-status status-${status}`}>
        {status === 'submitted' && '⏳ Заявку отримано. Очікує перегляду.'}
        {status === 'approved' && '✦ Заявку прийнято. Готуйся до семінару.'}
        {status === 'rejected' && '◌ Зараз — ще не час. Поверніся пізніше.'}
        {status === 'initiated' && '⚡ Ти ініційований у канали.'}
      </div>
      {application.answers && (
        <details className="cl-app-recap">
          <summary>твоя заявка</summary>
          {Object.entries(application.answers).map(([k, v]) => (
            <div key={k} className="cl-app-recap-item">
              <strong>{k}:</strong> {v}
            </div>
          ))}
        </details>
      )}
    </div>
  );
}
