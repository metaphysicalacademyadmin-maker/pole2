import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { HISTORICAL_EVENTS } from '../../data/rodovid-hellinger.js';

// Історичні події XX ст. — те що залишило тінь у кожному
// постсовєцькому роді. На наших землях без цього робота — фікція.
export default function HistoricalContext() {
  const history = useGameStore((s) => s.rodovidHistory) || {};
  const setHistory = useGameStore((s) => s.setRodovidHistory);
  const [otherText, setOtherText] = useState(history.other || '');

  function toggle(id) {
    setHistory({ [id]: !history[id] });
  }

  function saveOther() {
    setHistory({ other: otherText.trim() || '' });
  }

  const checkedCount = HISTORICAL_EVENTS.filter((e) => history[e.id]).length;
  const hasOther = !!history.other;

  return (
    <div className="rod-history">
      <h3>Війни і репресії XX ст.</h3>
      <p className="rod-history-hint">
        У постсовєцькому роді ці події торкнулись майже кожного.
        Назвати — визнати тих хто пройшов крізь це і повертає тобі життя.
      </p>

      <div className="rod-history-list">
        {HISTORICAL_EVENTS.map((e) => {
          const checked = !!history[e.id];
          return (
            <label key={e.id}
              className={`rod-history-item${checked ? ' checked' : ''}`}>
              <input type="checkbox" checked={checked}
                onChange={() => toggle(e.id)} />
              <span className="rod-history-mark">{checked ? '✓' : '○'}</span>
              <span className="rod-history-body">
                <span className="rod-history-label">{e.label}</span>
                <span className="rod-history-evhint">{e.hint}</span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="rod-history-other">
        <label className="rne-label">
          інше — назви якщо знаєш конкретніше
        </label>
        <input type="text" value={otherText}
          onChange={(e) => setOtherText(e.target.value)}
          onBlur={saveOther}
          placeholder="напр. полонські вибухи, повоєнний голод 1947, Чорнобиль..."
          maxLength={140} />
      </div>

      {(checkedCount > 0 || hasOther) && (
        <div className="rod-history-acknowledge">
          ⊹ <em>Я визнаю — мій рід пройшов крізь це. Я живу їхньою силою.</em>
        </div>
      )}
    </div>
  );
}
