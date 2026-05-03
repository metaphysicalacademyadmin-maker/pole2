import { useGameStore } from '../../store/gameStore.js';
import { COSMO_CHANNELS } from '../../data/cosmo-channels/index.js';
import ChannelView from './ChannelView.jsx';

// Список 11 каналів на рівні 4. Натиснувши — заходимо у канал і проходимо 12 клітинок.

export default function ChannelsList() {
  const enterChannel = useGameStore((s) => s.enterChannel);
  const currentChannelId = useGameStore((s) => s.currentChannelId);
  const channelProgress = useGameStore((s) => s.channelProgress) || {};

  if (currentChannelId) return <ChannelView channelId={currentChannelId} />;

  const studiedCount = Object.values(channelProgress).filter((p) => p.completed).length;
  const totalChannels = COSMO_CHANNELS.length;
  const allStudied = studiedCount === totalChannels;
  const cosmoApp = useGameStore((s) => s.cosmoApplication);
  const hasApplied = !!cosmoApp;

  return (
    <div className="cl-channels">
      <div className="cl-channels-disclaimer">
        ⚠ Це <strong>навчальний</strong> курс. Канали — теорія, історія, метод.
        Реальне відкриття каналів відбувається <strong>лише у живій академії,
        з учителем</strong>. Гра готує тебе — академія ініціює.
      </div>

      <div className="cl-channels-header">
        <div className="cl-channels-label">11 каналів — почни з будь-якого</div>
        {studiedCount > 0 && (
          <div className="cl-channels-overall">
            <strong>{studiedCount}</strong> з {totalChannels} вивчено
          </div>
        )}
      </div>
      <div className="cl-channels-grid">
        {COSMO_CHANNELS.map((ch) => {
          const prog = channelProgress[ch.id] || { answeredIds: [], completed: false };
          const total = ch.cells.length;
          const done = prog.answeredIds.length;
          const inProgress = done > 0 && !prog.completed;
          return (
            <button key={ch.id} type="button"
              className={`channel-tile${prog.completed ? ' certified' : ''}${inProgress ? ' in-progress' : ''}`}
              style={{ borderColor: ch.color, '--ch-color': ch.color }}
              onClick={() => enterChannel(ch.id)}>
              <div className="channel-tile-type-bar" />
              <div className="channel-tile-symbol" style={{ color: ch.color }}>{ch.symbol}</div>
              <div className="channel-tile-name">{ch.name}</div>
              <div className="channel-tile-type">{ch.type}</div>
              <div className="channel-tile-progress">
                {prog.completed ? '✓ вивчено' : inProgress ? `${done}/${total}` : 'не почато'}
              </div>
              {inProgress && (
                <div className="channel-tile-bar"
                  style={{ width: `${(done / total) * 100}%`, background: ch.color }} />
              )}
            </button>
          );
        })}
      </div>

      {allStudied && !hasApplied && (
        <div className="cl-channels-cta">
          <div className="cl-channels-cta-eyebrow">всі канали вивчені</div>
          <h3>Готовий до реальної ініціації?</h3>
          <p>
            Ти вивчив теорію всіх 11 каналів. Тепер можна подати заявку
            на справжнє відкриття — у академії, з учителем.
          </p>
        </div>
      )}
      {hasApplied && (
        <div className="cl-channels-applied">
          ✦ Заявку подано — статус: <strong>{cosmoApp.status || 'submitted'}</strong>
        </div>
      )}
    </div>
  );
}
