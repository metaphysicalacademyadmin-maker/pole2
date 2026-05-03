import { PATH_MODES, PATH_MODE_ORDER } from '../../data/pathmodes.js';

// Внизу PathMode — діаграма гнучкості: 5 треків з'єднані стрілками,
// показуючи що можна переходити «вгору» у середині гри. Знизити — ні.
export default function TrackProgression() {
  return (
    <div className="tp-frame">
      <div className="tp-eyebrow">✦ між треками можна переходити вгору</div>
      <div className="tp-row">
        {PATH_MODE_ORDER.map((id, i) => {
          const mode = PATH_MODES[id];
          const isLast = i === PATH_MODE_ORDER.length - 1;
          return (
            <div key={id} className="tp-step-wrap">
              <div className="tp-step">
                <div className="tp-dot" style={{
                  background: mode.color,
                  boxShadow: `0 0 14px ${mode.color}`,
                  borderColor: mode.color,
                }}>
                  <span className="tp-dot-symbol" aria-hidden="true">{mode.symbol}</span>
                </div>
                <div className="tp-step-label" style={{ color: mode.color }}>
                  {mode.name}
                </div>
              </div>
              {!isLast && <div className="tp-arrow" aria-hidden="true">→</div>}
            </div>
          );
        })}
      </div>
      <p className="tp-foot">
        знизити трек неможливо · це особиста дорога, не ігровий рівень складності
      </p>
    </div>
  );
}
