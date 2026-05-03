import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { detectCrisis, detectTurningPoint, TURNING_POINT_CELL } from '../../utils/crisis-detector.js';
import { BAROMETERS } from '../../data/barometers.js';
import { showToast } from '../GlobalToast.jsx';
import './styles.css';

const COOLDOWN_MS = 30 * 60 * 1000;     // 30 хв між повторними кризами

// Криза Системи + Точка Перевороту — обидва події в одному компоненті.
// Криза першочергова. Точка показується після того як крипа усвідомлена або не активна.

export default function CrisisModal() {
  const state = useGameStore();
  const activeModal = useGameStore((s) => s.activeModal);
  const showModal = useGameStore((s) => s.showModal);
  const ack = useGameStore((s) => s.acknowledgeCrisis);
  const resolve = useGameStore((s) => s.resolveTurningPoint);
  const [pickedIdx, setPickedIdx] = useState(null);

  const crisis = detectCrisis(state);
  const cooldownActive = state.crisisAcknowledgedTs &&
    (Date.now() - state.crisisAcknowledgedTs) < COOLDOWN_MS;
  const shouldShowCrisis = crisis && !cooldownActive;
  const turning = !shouldShowCrisis ? detectTurningPoint(state) : null;
  const shouldShow = shouldShowCrisis || turning;

  // Криза/Точка Перевороту — найвищий пріоритет 100, ставимо у чергу
  useEffect(() => {
    if (shouldShow && activeModal?.id !== 'crisis') {
      // Не дублюємо якщо вже у черзі або активна
      const inQueue = (state.modalQueue || []).some((m) => m.id === 'crisis');
      if (!inQueue) showModal('crisis', 100);
    }
  }, [shouldShow, activeModal?.id, state.modalQueue, showModal]);

  if (activeModal?.id !== 'crisis') return null;
  if (!shouldShow) return null;

  if (shouldShowCrisis) return <Crisis crisis={crisis} onAck={ack} />;
  if (turning) return <TurningPoint pickedIdx={pickedIdx} setPickedIdx={setPickedIdx}
    onResolve={(opt) => { resolve({ choice: opt.text, barometer: opt.barometer });
      showToast(`+${opt.delta} ${opt.barometer} · точка перевороту`, 'success'); }} />;
  return null;
}

function Crisis({ crisis, onAck }) {
  const labelFor = (key) => BAROMETERS.find((b) => b.key === key)?.name || key;
  return (
    <div className="crisis-overlay" role="alertdialog" aria-modal="true"
      aria-label={crisis.helpline ? 'Криза системи з лінією допомоги' : 'Криза системи'}>
      <div className={`crisis-modal${crisis.helpline ? ' helpline' : ''}`}>
        <div className="cs-eyebrow">⚡ криза системи</div>
        <h2 className="cs-title">Зупинись.<br />Ти йдеш у глухий кут.</h2>
        <div className="cs-body">
          <p className="cs-intro">
            Поле бачить — кілька твоїх барометрів зараз глибоко у тіні. Це не випадковість.
            Це сигнал що пора зупинитись і подивитись що відбувається.
          </p>
          <div className="cs-list">
            <div className="cs-list-label">у тіні зараз:</div>
            {crisis.inCrisis.map((b) => (
              <div key={b.key} className="cs-list-item">
                <span>{labelFor(b.key)}</span>
                <span className="cs-list-val">{b.value}</span>
              </div>
            ))}
          </div>
          <div className="cs-instruction">
            <strong>Що робити просто зараз:</strong><br />
            1. Закрий екран на 5 хвилин.<br />
            2. Випий води. Полеж. Подихай у живіт.<br />
            3. Поверни увагу в тіло — без аналізу.
          </div>
          {crisis.helpline && (
            <div className="cs-helpline">
              <strong>Якщо потрібно поговорити:</strong><br />
              ☎ <a href="tel:+380800212121">+380 800 21 21 21</a> — Лінія психологічної допомоги, безкоштовно, 24/7
            </div>
          )}
        </div>
        <button type="button" className="cs-btn-ack" onClick={onAck}>
          я зупинився · бачу
        </button>
      </div>
    </div>
  );
}

function TurningPoint({ pickedIdx, setPickedIdx, onResolve }) {
  const cell = TURNING_POINT_CELL;
  return (
    <div className="crisis-overlay" role="dialog" aria-modal="true" aria-label="Точка Перевороту">
      <div className="crisis-modal turning">
        <div className="cs-eyebrow turning-eyebrow">⚡ точка перевороту</div>
        <h2 className="cs-title">{cell.title.replace('⚡ ', '')}</h2>
        <div className="cs-body">
          <p className="cs-intro">{cell.prologue}</p>
          <div className="cs-question">{cell.question}</div>
          <div className="tp-options">
            {cell.options.map((opt, i) => (
              <button key={i} type="button"
                className={`tp-option${pickedIdx === i ? ' picked' : ''}`}
                onClick={() => setPickedIdx(i)}>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="cs-btn-ack"
          disabled={pickedIdx == null}
          onClick={() => onResolve(cell.options[pickedIdx])}>
          {pickedIdx == null ? 'обери одне щоб продовжити' : 'визнаю · далі'}
        </button>
      </div>
    </div>
  );
}
