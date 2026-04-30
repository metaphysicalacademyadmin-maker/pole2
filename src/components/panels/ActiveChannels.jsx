import { useGameStore } from '../../store/gameStore.js';
import { findChannel } from '../../data/channels.js';

// Активні канали як кольорові точки.
export default function ActiveChannels({ onClick }) {
  const channelsActive = useGameStore((s) => s.channelsActive);
  const channelsUnlocked = useGameStore((s) => s.channelsUnlocked);

  return (
    <div className={`panel${onClick ? ' panel-clickable' : ''}`} onClick={onClick}>
      <div className="panel-label">канали</div>
      <div className="panel-content">
        {channelsActive.length === 0 && channelsUnlocked.length === 0 && (
          <div className="ac-empty">жодного ще</div>
        )}
        <div className="ac-list">
          {channelsUnlocked.map((id) => {
            const c = findChannel(id);
            if (!c) return null;
            const active = channelsActive.includes(id);
            return (
              <div key={id} className="ac-dot"
                title={`${c.name} ${active ? '· увімкнено' : ''}`}
                style={{
                  color: c.color,
                  background: active ? c.color : 'transparent',
                  opacity: active ? 1 : 0.5,
                }}>
                {c.icon}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
