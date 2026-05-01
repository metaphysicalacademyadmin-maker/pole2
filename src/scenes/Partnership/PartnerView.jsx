import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PARTNERSHIP_QUESTIONS } from '../../data/partnership-questions.js';
import { partnerAnswerFor } from '../../utils/partnership.js';
import { showToast } from '../../components/GlobalToast.jsx';

// Активна сесія партнерства — 7 спільних питань.
// При відповіді гравця, "відповідь партнера" обчислюється з хешу коду+qId.

export default function PartnerView({ partnership, onExit }) {
  const recordAnswer = useGameStore((s) => s.recordSharedAnswer);
  const sharedAnswers = partnership.sharedAnswers || {};
  const [activeQ, setActiveQ] = useState(null);
  const [draft, setDraft] = useState('');

  const partner = partnership.partnerData;
  const completedCount = Object.keys(sharedAnswers).length;

  function startQuestion(q) {
    setActiveQ(q);
    setDraft(sharedAnswers[q.id]?.mine || '');
  }

  function submit() {
    if (!activeQ || draft.trim().length < 5) {
      showToast('напиши хоча б 5 символів', 'warning');
      return;
    }
    const partnerText = partnerAnswerFor(partnership.partnerCode, activeQ.id, activeQ.barometer);
    recordAnswer(activeQ.id, draft, partnerText);
    showToast('обмін відбувся · подивись що написав партнер', 'success');
    setActiveQ(null);
    setDraft('');
  }

  if (activeQ) {
    return <ActiveQuestion q={activeQ} draft={draft} setDraft={setDraft}
      onSubmit={submit} onBack={() => { setActiveQ(null); setDraft(''); }}
      previous={sharedAnswers[activeQ.id]} />;
  }

  return (
    <div className="part-paired">
      <div className="part-pair-block">
        <div className="part-pair-label">з тобою у партнерстві:</div>
        <div className="part-pair-name">
          {partner?.name} · {partner?.age} · {partner?.city}
        </div>
        {partner?.archetype && (
          <div className="part-pair-archetype" style={{ color: partner.archetype.color }}>
            {partner.archetype.symbol} {partner.archetype.name}
          </div>
        )}
        {partner?.intention && (
          <div className="part-pair-intention">намір: «{partner.intention}»</div>
        )}
      </div>

      <div className="part-q-counter">
        {completedCount} / {PARTNERSHIP_QUESTIONS.length} спільних питань пройдено
      </div>

      <div className="part-questions">
        {PARTNERSHIP_QUESTIONS.map((q) => {
          const done = !!sharedAnswers[q.id];
          return (
            <button key={q.id}
              className={`part-q-card${done ? ' done' : ''}`}
              onClick={() => startQuestion(q)}>
              <div className="part-q-num">
                {done ? '✓' : '○'}
              </div>
              <div className="part-q-content">
                <div className="part-q-title">{q.title}</div>
                <div className="part-q-text">{q.question}</div>
              </div>
            </button>
          );
        })}
      </div>

      <button type="button" className="part-exit-btn" onClick={onExit}>
        завершити партнерство
      </button>
    </div>
  );
}

function ActiveQuestion({ q, draft, setDraft, onSubmit, onBack, previous }) {
  return (
    <div className="part-active-q">
      <button type="button" className="part-q-back" onClick={onBack}>← до питань</button>
      <div className="part-active-title">{q.title}</div>
      <div className="part-active-question">{q.question}</div>

      <textarea className="part-active-textarea"
        rows={4}
        placeholder="напиши свою відповідь — чесно, без редагування"
        value={draft}
        onChange={(e) => setDraft(e.target.value)} />

      <button type="button" className="part-btn part-btn-primary part-active-submit"
        onClick={onSubmit} disabled={draft.trim().length < 5}>
        обмінятись
      </button>

      {previous && (
        <div className="part-prev-block">
          <div className="part-prev-label">партнер написав:</div>
          <blockquote className="part-prev-text">«{previous.partners}»</blockquote>
        </div>
      )}
    </div>
  );
}
