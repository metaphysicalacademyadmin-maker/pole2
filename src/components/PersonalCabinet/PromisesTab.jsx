import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { WEEKLY_QUESTS, QUEST_DURATION_DAYS } from '../../data/weekly-quests.js';
import { showToast } from '../GlobalToast.jsx';

// Вкладка «Обіцянки» — тримає поточну 7-денну обіцянку гравця.
// Видно: поточна (з календарем 7 днів), історія завершених/частково/відмовлених.

export default function PromisesTab() {
  const currentQuest = useGameStore((s) => s.currentQuest);
  const questHistory = useGameStore((s) => s.questHistory) || [];
  const commitQuest = useGameStore((s) => s.commitQuest);
  const markQuestDay = useGameStore((s) => s.markQuestDay);
  const unmarkQuestDay = useGameStore((s) => s.unmarkQuestDay);
  const completeQuest = useGameStore((s) => s.completeQuest);

  const [picking, setPicking] = useState(false);

  if (currentQuest) {
    return (
      <CurrentQuestView
        quest={currentQuest}
        onMark={markQuestDay}
        onUnmark={unmarkQuestDay}
        onComplete={completeQuest}
        history={questHistory} />
    );
  }

  if (picking) {
    return (
      <QuestPicker
        onPick={(q) => {
          commitQuest(q);
          showToast(`✦ Обіцянка прийнята: ${q.title}`, 'success');
          setPicking(false);
        }}
        onCancel={() => setPicking(false)} />
    );
  }

  return (
    <div className="cab-promises">
      <div className="cab-promises-empty">
        <div className="cab-promises-icon">✦</div>
        <h3>Поле тримає обіцянки</h3>
        <p>
          Візьми одну обіцянку на 7 днів. Маленьку. Реальну.
          Поле буде нагадувати — а ти будеш помічати дні коли робив.
        </p>
        <button type="button" className="cab-promises-take"
          onClick={() => setPicking(true)}>
          ✦ взяти обіцянку
        </button>
      </div>

      {questHistory.length > 0 && <QuestHistory history={questHistory} />}
    </div>
  );
}

function CurrentQuestView({ quest, onMark, onUnmark, onComplete, history }) {
  const days = generateDays(quest.startedAt);
  const todayIso = new Date().toISOString().slice(0, 10);
  const marked = quest.markedDays || [];

  const dueIn = Math.max(0, Math.ceil((quest.dueAt - Date.now()) / 86400000));
  const isOver = Date.now() >= quest.dueAt;

  function toggleDay(d) {
    if (d > todayIso) {
      showToast('цей день ще не настав', 'info');
      return;
    }
    if (marked.includes(d)) onUnmark(d);
    else onMark(d);
  }

  return (
    <div className="cab-promises">
      <div className="cab-quest-card">
        <div className="cab-quest-icon">{quest.icon}</div>
        <h3 className="cab-quest-title">{quest.title}</h3>
        <p className="cab-quest-text">{quest.text}</p>
        {quest.customText && (
          <p className="cab-quest-custom">«{quest.customText}»</p>
        )}

        <div className="cab-quest-meta">
          {!isOver
            ? <>лишилось <strong>{dueIn}</strong> {dueIn === 1 ? 'день' : dueIn < 5 ? 'дні' : 'днів'}</>
            : <>тиждень минув — час підбити</>
          }
        </div>

        <div className="cab-quest-calendar">
          {days.map((d, i) => {
            const isMarked = marked.includes(d);
            const isToday = d === todayIso;
            const isFuture = d > todayIso;
            return (
              <button key={d} type="button"
                onClick={() => toggleDay(d)}
                disabled={isFuture}
                className={`cab-quest-day${isMarked ? ' done' : ''}${isToday ? ' today' : ''}${isFuture ? ' future' : ''}`}>
                <span className="cab-quest-day-n">{i + 1}</span>
                <span className="cab-quest-day-mark">{isMarked ? '✓' : '·'}</span>
              </button>
            );
          })}
        </div>

        <div className="cab-quest-actions">
          <button type="button" className="cab-quest-btn cab-quest-btn-done"
            onClick={() => {
              const status = marked.length >= QUEST_DURATION_DAYS ? 'completed'
                : marked.length >= 3 ? 'partial' : 'abandoned';
              onComplete(status);
              showToast(`обіцянку закрито: ${marked.length}/${QUEST_DURATION_DAYS} днів`, 'info');
            }}>
            {isOver ? '✦ підбити' : 'завершити раніше'}
          </button>
        </div>
      </div>

      {history.length > 0 && <QuestHistory history={history} />}
    </div>
  );
}

function QuestPicker({ onPick, onCancel }) {
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState('');

  if (customMode) {
    return (
      <div className="cab-promises">
        <h3>Своя обіцянка</h3>
        <p>Сформулюй коротко — як ти кажеш собі. На 7 днів.</p>
        <textarea value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="напр. «7 днів — щодня дзвонити мамі»"
          rows={3} maxLength={200}
          className="cab-quest-custom-input" />
        <div className="cab-quest-actions">
          <button type="button" className="cab-quest-btn"
            onClick={() => setCustomMode(false)}>
            ← готові варіанти
          </button>
          <button type="button" className="cab-quest-btn cab-quest-btn-done"
            disabled={customText.trim().length < 10}
            onClick={() => onPick({
              icon: '✦', title: customText.trim().slice(0, 40),
              text: customText.trim(), customText: customText.trim(),
            })}>
            ✦ беру
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cab-promises">
      <h3>Обери обіцянку на тиждень</h3>
      <p className="cab-promises-hint">Одна. Реальна. На 7 днів.</p>
      <div className="cab-quest-list">
        {WEEKLY_QUESTS.map((q) => (
          <button key={q.id} type="button"
            className="cab-quest-option"
            onClick={() => onPick(q)}>
            <span className="cab-quest-option-icon">{q.icon}</span>
            <span className="cab-quest-option-body">
              <span className="cab-quest-option-title">{q.title}</span>
              <span className="cab-quest-option-text">{q.text}</span>
              <span className="cab-quest-option-hint">{q.fieldHint}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="cab-quest-actions">
        <button type="button" className="cab-quest-btn"
          onClick={onCancel}>← назад</button>
        <button type="button" className="cab-quest-btn"
          onClick={() => setCustomMode(true)}>✎ написати свою</button>
      </div>
    </div>
  );
}

function QuestHistory({ history }) {
  return (
    <div className="cab-quest-history">
      <h4>історія обіцянок</h4>
      <div className="cab-quest-history-list">
        {[...history].reverse().slice(0, 10).map((h, i) => (
          <div key={i} className={`cab-quest-history-item status-${h.status}`}>
            <span className="cab-quest-history-icon">
              {h.status === 'completed' ? '✓' : h.status === 'partial' ? '◐' : '○'}
            </span>
            <span className="cab-quest-history-body">
              <span className="cab-quest-history-title">{h.title}</span>
              <span className="cab-quest-history-meta">
                {h.daysCompleted}/{QUEST_DURATION_DAYS} днів · {fmtDate(h.finishedAt)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function generateDays(startTs) {
  const out = [];
  const start = new Date(startTs);
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < QUEST_DURATION_DAYS; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function fmtDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}
