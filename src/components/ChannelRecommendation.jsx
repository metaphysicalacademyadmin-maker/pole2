import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { findChannelRecommendation } from '../utils/channel-recommender.js';
import { findChannel } from '../data/cosmo-channels/index.js';
import { showToast } from './GlobalToast.jsx';
import './ChannelRecommendation.css';

const SNOOZE_MS = 30 * 60 * 1000;     // 30 хв між повторами
// Module-scope: snooze між показами зберігається між mount/unmount компонента
let snoozeUntil = 0;

// Рекомендація каналу коли барометр падає у мінус.
// Тонка плашка-toast, не overlay-модалка. Snooze 30хв після показу/закриття.
export default function ChannelRecommendation({ openCosmo }) {
  const state = useGameStore();
  const activateChannel = useGameStore((s) => s.activateChannel);
  const [dismissed, setDismissed] = useState(false);

  const rec = findChannelRecommendation(state);
  const channel = rec ? findChannel(rec.channelId) : null;
  const isSnoozed = Date.now() < snoozeUntil;
  const visible = !!rec && !!channel && !dismissed && !isSnoozed;

  // Коли реально показуємо — одразу ставимо snooze щоб не зникло і знов
  // не з'явилось при незначних коливаннях барометра.
  useEffect(() => {
    if (visible) {
      snoozeUntil = Date.now() + SNOOZE_MS;
    }
  }, [visible]);

  if (!visible) return null;

  function handleActivate() {
    if (!rec.hasAccess) {
      if (openCosmo) openCosmo();
      showToast('відкрий заявку на космо у меню', 'info');
      setDismissed(true);
      return;
    }
    activateChannel(rec.channelId);
    showToast(`✦ ${channel.name} активовано на 24 години`, 'success');
    setDismissed(true);
  }

  function handleDismiss() {
    setDismissed(true);
    snoozeUntil = Date.now() + SNOOZE_MS;
  }

  return (
    <div className="ch-rec" role="status" aria-live="polite">
      <div className="ch-rec-icon" style={{
        background: `linear-gradient(135deg, ${channel.color}cc, ${channel.color}55)`,
      }}>{channel.symbol}</div>
      <div className="ch-rec-body">
        <div className="ch-rec-line">
          <strong>{rec.barometerLabel}</strong> на {rec.barometerValue}.{' '}
          <strong style={{ color: channel.color }}>{channel.name}</strong> допоможе.
        </div>
        <div className="ch-rec-hint">{rec.channelHint}</div>
      </div>
      <div className="ch-rec-actions">
        <button type="button" className="ch-rec-btn ch-rec-btn-go"
          onClick={handleActivate}>
          {rec.hasAccess ? 'активувати' : 'дізнатись'}
        </button>
        <button type="button" className="ch-rec-dismiss"
          onClick={handleDismiss}
          aria-label="закрити підказку">×</button>
      </div>
    </div>
  );
}
