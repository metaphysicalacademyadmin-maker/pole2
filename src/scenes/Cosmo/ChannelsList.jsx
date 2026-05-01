import { useGameStore } from '../../store/gameStore.js';
import { COSMO_CHANNELS } from '../../data/cosmo-channels/index.js';
import ChannelView from './ChannelView.jsx';

// Список 11 каналів на рівні 4. Натиснувши — заходимо у канал і проходимо 12 клітинок.

export default function ChannelsList() {
  const enterChannel = useGameStore((s) => s.enterChannel);
  const currentChannelId = useGameStore((s) => s.currentChannelId);
  const channelProgress = useGameStore((s) => s.channelProgress) || {};

  if (currentChannelId) return <ChannelView channelId={currentChannelId} />;

  return (
    <div className="cl-channels">
      <div className="cl-channels-label">11 каналів — обери будь-який:</div>
      <div className="cl-channels-grid">
        {COSMO_CHANNELS.map((ch) => {
          const prog = channelProgress[ch.id] || { answeredIds: [], completed: false };
          const total = ch.cells.length;
          const done = prog.answeredIds.length;
          return (
            <button key={ch.id} type="button"
              className={`channel-tile${prog.completed ? ' certified' : ''}`}
              style={{ borderColor: ch.color }}
              onClick={() => enterChannel(ch.id)}>
              <div className="channel-tile-symbol" style={{ color: ch.color }}>{ch.symbol}</div>
              <div className="channel-tile-name">{ch.name}</div>
              <div className="channel-tile-type">{ch.type}</div>
              <div className="channel-tile-progress">
                {prog.completed ? '✓ сертифікат' : `${done}/${total}`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
