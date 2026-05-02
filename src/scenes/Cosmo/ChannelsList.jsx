import { useGameStore } from '../../store/gameStore.js';
import { COSMO_CHANNELS } from '../../data/cosmo-channels/index.js';
import ChannelView from './ChannelView.jsx';

// Список 11 каналів на рівні 4. Натиснувши — заходимо у канал і проходимо 12 клітинок.

export default function ChannelsList() {
  const enterChannel = useGameStore((s) => s.enterChannel);
  const currentChannelId = useGameStore((s) => s.currentChannelId);
  const channelProgress = useGameStore((s) => s.channelProgress) || {};

  if (currentChannelId) return <ChannelView channelId={currentChannelId} />;

  const certifiedCount = Object.values(channelProgress).filter((p) => p.completed).length;
  const totalChannels = COSMO_CHANNELS.length;

  return (
    <div className="cl-channels">
      <div className="cl-channels-header">
        <div className="cl-channels-label">11 каналів — обери будь-який</div>
        {certifiedCount > 0 && (
          <div className="cl-channels-overall">
            <strong>{certifiedCount}</strong> з {totalChannels} сертифіковано
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
                {prog.completed ? '✓ сертифікат' : inProgress ? `${done}/${total}` : 'не почато'}
              </div>
              {inProgress && (
                <div className="channel-tile-bar"
                  style={{ width: `${(done / total) * 100}%`, background: ch.color }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
