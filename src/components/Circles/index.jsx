import { useGameStore } from '../../store/gameStore.js';
import { POWER_CIRCLES } from '../../data/social.js';
import { showToast } from '../GlobalToast.jsx';
import './styles.css';

// Кола Сили — псевдо-список малих груп з тематичним фокусом.
// Гравець обирає коло за станом — це декоративна функція без бекенду,
// але наближає до реальної соц-частини.

export default function Circles() {
  const joined = useGameStore((s) => s.joinedCircle);
  const join = useGameStore((s) => s.joinCircle);
  const leave = useGameStore((s) => s.leaveCircle);
  const resources = useGameStore((s) => s.resources) || {};

  const recommended = pickRecommended(resources);

  return (
    <div className="circles-block">
      <div className="circles-eyebrow">🔮 кола сили</div>
      <div className="circles-subtitle">
        Малі групи 3-9 людей що йдуть разом через одну тему. Раз на тиждень — спільна година.
      </div>

      {joined && (
        <div className="circles-joined-banner">
          ✦ ти в колі: <strong>{POWER_CIRCLES.find((c) => c.id === joined.id)?.name}</strong>
          <button type="button" className="circles-leave" onClick={leave}>покинути</button>
        </div>
      )}

      <div className="circles-list">
        {POWER_CIRCLES.map((circle) => {
          const isJoined = joined?.id === circle.id;
          const isRec = recommended === circle.id;
          return (
            <div key={circle.id} className={`circle-card${isJoined ? ' joined' : ''}${isRec ? ' recommended' : ''}`}>
              {isRec && <div className="circle-rec-badge">резонує з тобою</div>}
              <div className="circle-name">{circle.name}</div>
              <div className="circle-intention">«{circle.intention}»</div>
              <div className="circle-desc">{circle.description}</div>
              {!isJoined && !joined && (
                <button type="button" className="circle-join"
                  onClick={() => { join(circle.id); showToast(`приєднано до «${circle.name}»`, 'success'); }}>
                  приєднатись
                </button>
              )}
              {isJoined && <div className="circle-in">✓ ти тут</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function pickRecommended(resources) {
  // Рекомендуємо за найслабшим барометром — те що потребує підтримки спільнотою.
  let weakest = null, min = 999;
  for (const [k, v] of Object.entries(resources)) {
    if (v < min) { min = v; weakest = k; }
  }
  if (!weakest) return null;
  const circle = POWER_CIRCLES.find((c) => c.focus === weakest);
  return circle?.id || null;
}
