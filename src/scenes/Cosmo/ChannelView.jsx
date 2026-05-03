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

  const isEducational = !!channel.educational;

  function handlePick(opt) {
    if (!cell) return;
    setPickedKey(opt.text);
    recordAnswer(channel.id, cell.id, total, {
      choice: opt.text,
      // У освітніх каналах — без зміни ресурсів. Лише позначка знання.
      barometer: isEducational ? null : opt.barometer,
      delta: isEducational ? 0 : opt.delta,
      knowledge: opt.knowledge || null,
    });
    if (isEducational) {
      const labels = { know: '✓ знаю', partial: '◐ частково', not_yet: '○ ще ні' };
      showToast(labels[opt.knowledge] || '✓ записано', 'info');
    } else {
      const sign = opt.delta >= 0 ? '+' : '';
      showToast(`${sign}${opt.delta} ${opt.barometer}`, opt.delta >= 0 ? 'success' : 'info');
    }
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

      <StageProgress channel={channel} answered={answered} nextIdx={nextIdx} total={total} />

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
        <CertificateView channel={channel} progress={progress} onClose={exitChannel} />
      ) : (
        <div className="channel-cell">
          {stage && (
            <div className="channel-stage" style={{ color: stage.color }}>
              <span className="channel-stage-bar" style={{ background: stage.color }} />
              {stage.label}
            </div>
          )}
          <h4 className="channel-cell-title">{cell.title}</h4>
          {cell.text && (
            <div className={isEducational ? 'channel-theory' : 'channel-cell-text-wrap'}>
              {isEducational && <div className="channel-theory-label">📖 теорія</div>}
              <p className="channel-cell-text">{cell.text}</p>
            </div>
          )}
          <p className="channel-cell-question">
            {isEducational && <span className="channel-q-tag">перевірка </span>}
            {cell.question}
          </p>
          <div className={`channel-options${isEducational ? ' is-educational' : ''}`}>
            {cell.options.map((opt, i) => {
              const knowledgeIcon = opt.knowledge === 'know' ? '✓'
                : opt.knowledge === 'partial' ? '◐'
                : opt.knowledge === 'not_yet' ? '○'
                : null;
              return (
                <button key={i} type="button"
                  className={`channel-option${pickedKey === opt.text ? ' picked' : ''}${opt.knowledge ? ` knowledge-${opt.knowledge}` : ''}`}
                  onClick={() => handlePick(opt)}
                  disabled={pickedKey != null}>
                  {knowledgeIcon && <span className="channel-option-mark">{knowledgeIcon}</span>}
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Справжній сертифікат — золотий border + дата + ім'я каналу
function CertificateView({ channel, progress, onClose }) {
  const certDate = progress.certifiedAt ? new Date(progress.certifiedAt) : new Date();
  const dateStr = certDate.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="channel-certificate" style={{ '--ch-color': channel.color }}>
      <div className="cert-corners">
        <span className="cert-corner cert-corner-tl" />
        <span className="cert-corner cert-corner-tr" />
        <span className="cert-corner cert-corner-bl" />
        <span className="cert-corner cert-corner-br" />
      </div>
      <div className="cert-eyebrow">підготовлений до ініціації</div>
      <div className="cert-symbol" style={{ color: channel.color }}>{channel.symbol}</div>
      <h3 className="cert-channel-name" style={{ color: channel.color }}>{channel.name}</h3>
      <div className="cert-divider" />
      <p className="cert-text">
        Ти вивчив теорію цього каналу.<br />
        Реальна ініціація — лише у живій академії, з учителем.<br />
        Подай заявку коли відчуваєш готовність.
      </p>
      <div className="cert-meta">
        <div className="cert-date">{dateStr}</div>
        <div className="cert-id">id · {String(progress.certifiedAt || '').slice(-6)}</div>
      </div>
      <button type="button" className="channel-btn-return" onClick={onClose}>
        повернутись до каналів →
      </button>
    </div>
  );
}

// 5-сегментний прогрес-bar за стадіями: теорія / практика / на собі / на інших / сертифікат
function StageProgress({ channel, answered, nextIdx, total }) {
  const STAGE_RANGES = [
    { id: 'theory',        label: 'теорія',       from: 0, to: 3 },
    { id: 'practice',      label: 'практика',     from: 3, to: 6 },
    { id: 'self_work',     label: 'на собі',      from: 6, to: 9 },
    { id: 'others',        label: 'на інших',     from: 9, to: 11 },
    { id: 'certification', label: 'сертифікат',   from: 11, to: 12 },
  ];

  return (
    <div className="channel-stages">
      {STAGE_RANGES.map((s) => {
        const stageCells = channel.cells.slice(s.from, s.to);
        const stageAnswered = stageCells.filter((c) => answered.includes(c.id)).length;
        const stageTotal = stageCells.length;
        const isCurrent = nextIdx >= s.from && nextIdx < s.to;
        const isDone = stageAnswered === stageTotal;
        const cls = `channel-stage-segment${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}`;
        return (
          <div key={s.id} className={cls}>
            <div className="channel-stage-fill"
              style={{
                width: `${(stageAnswered / stageTotal) * 100}%`,
                background: isDone ? channel.color : 'rgba(240, 197, 116, 0.5)',
              }} />
            <span className="channel-stage-name">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
