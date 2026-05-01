import IntroCards from './IntroCards.jsx';
import Application from './Application.jsx';
import ChannelsList from './ChannelsList.jsx';

// Картка одного рівня в гілці космоенергетики.
// Видається з 4 контент-типів: reference, intro, application, theory, channels.

export default function LevelCard({ level, state, isCurrent, isUnlocked }) {
  const cls = `cosmo-level${isCurrent ? ' current' : ''}${!isUnlocked ? ' locked' : ''}`;

  return (
    <div className={cls} style={{ borderColor: isUnlocked ? level.color : 'rgba(255,255,255,0.1)' }}>
      <div className="cl-header">
        <div className="cl-symbol" style={{ color: level.color }}>{level.symbol}</div>
        <div className="cl-meta">
          <div className="cl-num">рівень {level.n}</div>
          <div className="cl-name" style={{ color: level.color }}>{level.name}</div>
        </div>
        <div className="cl-status">
          {isCurrent ? <span className="cl-tag-current">тут</span>
            : isUnlocked ? <span className="cl-tag-passed">пройдено</span>
            : <span className="cl-tag-locked">🔒 закрито</span>}
        </div>
      </div>

      <div className="cl-description">{level.description}</div>
      <div className="cl-criterion">критерій: <em>{level.criterion}</em></div>

      {!isUnlocked && level.locked && (
        <div className="cl-locked-msg">⏳ {level.locked.reason}</div>
      )}

      {isUnlocked && level.content && (
        <div className="cl-content">
          {level.content.kind === 'reference' && (
            <div className="cl-ref">{level.content.message}</div>
          )}
          {level.content.kind === 'intro' && <IntroCards content={level.content} state={state} />}
          {level.content.kind === 'application' && (
            <Application content={level.content} state={state} />
          )}
          {level.content.kind === 'theory' && (
            <div className="cl-theory">📖 {level.content.message}</div>
          )}
          {level.content.kind === 'channels' && <ChannelsList />}
        </div>
      )}
    </div>
  );
}
