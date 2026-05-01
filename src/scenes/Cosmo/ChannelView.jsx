import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { findChannel, STAGES, stageOf } from '../../data/cosmo-channels/index.js';
import { showToast } from '../../components/GlobalToast.jsx';

// Перегляд одного каналу — 12 клітинок підряд.
// Після останньої — сертифікат.

export default function ChannelView({ channelId }) {
  const exitChannel = useGameStore((s) => s.exitChannel);
  const recordAnswer = useGameStore((s) => s.recordChannelAnswer);
  const progress = useGameStore((s) => s.channelProgress[channelId]) || { answeredIds: [], completed: false };
  const [pickedKey, setPickedKey] = useState(null);

  const channel = findChannel(channelId);
  if (!channel) return null;

  const total = channel.cells.length;
  const answered = progress.answeredIds || [];
  const nextIdx = channel.cells.findIndex((c) => !answered.includes(c.id));
  const allDone = nextIdx === -1 || progress.completed;
  const cell = !allDone ? channel.cells[nextIdx] : null;
  const stage = !allDone ? STAGES[stageOf(nextIdx)] : null;

  function handlePick(opt) {
    if (!cell) return;
    setPickedKey(opt.text);
    recordAnswer(channel.id, cell.id, total, {
      choice: opt.text, barometer: opt.barometer, delta: opt.delta,
    });
    const sign = opt.delta >= 0 ? '+' : '';
    showToast(`${sign}${opt.delta} ${opt.barometer}`, opt.delta >= 0 ? 'success' : 'info');
    setTimeout(() => setPickedKey(null), 600);
  }

  return (
    <div className="channel-view">
      <button type="button" className="channel-back" onClick={exitChannel}>← до каналів</button>
      <div className="channel-header">
        <div className="channel-symbol" style={{ color: channel.color }}>{channel.symbol}</div>
        <h3 className="channel-name" style={{ color: channel.color }}>{channel.name}</h3>
        <div className="channel-desc">{channel.description}</div>
      </div>

      <div className="channel-progress-bar">
        {channel.cells.map((c, i) => {
          const done = answered.includes(c.id);
          const current = nextIdx === i;
          return <span key={c.id} className={`channel-dot${done ? ' done' : ''}${current ? ' current' : ''}`}
            style={done ? { background: channel.color } : undefined} />;
        })}
        <span className="channel-progress-label">{answered.length} / {total}</span>
      </div>

      {allDone ? (
        <div className="channel-certified">
          <div className="channel-cert-symbol" style={{ color: channel.color }}>⚡</div>
          <div className="channel-cert-title">провідник {channel.name}</div>
          <div className="channel-cert-text">
            Канал у тобі — ти у каналі. Це сертифікат твого Поля.
          </div>
          <button type="button" className="channel-btn-return" onClick={exitChannel}>
            повернутись до каналів →
          </button>
        </div>
      ) : (
        <div className="channel-cell">
          {stage && (
            <div className="channel-stage" style={{ color: stage.color }}>
              {stage.label} · клітинка {nextIdx + 1}
            </div>
          )}
          <h4 className="channel-cell-title">{cell.title}</h4>
          {cell.text && <p className="channel-cell-text">{cell.text}</p>}
          <p className="channel-cell-question">{cell.question}</p>
          <div className="channel-options">
            {cell.options.map((opt, i) => (
              <button key={i} type="button"
                className={`channel-option${pickedKey === opt.text ? ' picked' : ''}`}
                onClick={() => handlePick(opt)}
                disabled={pickedKey != null}>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
