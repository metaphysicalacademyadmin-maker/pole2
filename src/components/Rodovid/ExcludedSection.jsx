import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { EXCLUDED_TYPES, EXCLUDED_RELATIONS, findExcludedType } from '../../data/rodovid-hellinger.js';

// Aussenseiter за Хеллінгером — виключені члени роду.
// Без них родова робота неповна. Додавання + позначення «визнаний».
export default function ExcludedSection({ onCeremonyOpen }) {
  const items = useGameStore((s) => s.rodovidExcluded) || [];
  const remove = useGameStore((s) => s.removeExcludedMember);
  const [adding, setAdding] = useState(false);

  return (
    <div className="rod-excluded">
      <div className="rod-excluded-header">
        <h3>Виключені у роді</h3>
        <p className="rod-excluded-hint">
          Кого «забули» або не говорять. За Хеллінгером: виключений залишає
          місце що несуть нащадки. Назвати — почати звільняти.
        </p>
      </div>

      {items.length > 0 && (
        <div className="rod-excluded-list">
          {items.map((it) => (
            <ExcludedRow key={it.id} item={it}
              onRemove={() => remove(it.id)}
              onCeremony={() => onCeremonyOpen?.(it.id)} />
          ))}
        </div>
      )}

      {adding ? (
        <ExcludedAddForm onClose={() => setAdding(false)} />
      ) : (
        <button type="button" className="rod-excluded-add"
          onClick={() => setAdding(true)}>
          + назвати ще одного
        </button>
      )}
    </div>
  );
}

function ExcludedRow({ item, onRemove, onCeremony }) {
  const type = findExcludedType(item.type);
  const relation = EXCLUDED_RELATIONS.find((r) => r.id === item.relation);
  return (
    <div className="rod-excluded-row" style={{ borderColor: `${type.color}66` }}>
      <span className="rod-excluded-icon" style={{ color: type.color }}>{type.icon}</span>
      <div className="rod-excluded-body">
        <div className="rod-excluded-title">
          {item.name || type.label}
          {item.acknowledged && <span className="rod-excluded-ack">✓ визнаний</span>}
        </div>
        <div className="rod-excluded-meta">
          {type.label}{relation ? ` · ${relation.label}` : ''}
        </div>
        {item.story && <div className="rod-excluded-story">«{item.story}»</div>}
      </div>
      <div className="rod-excluded-actions">
        {!item.acknowledged && (
          <button type="button" className="rod-excluded-btn"
            onClick={onCeremony}
            title="Провести ритуал визнання">
            ✦ ритуал
          </button>
        )}
        <button type="button" className="rod-excluded-btn rod-excluded-del"
          onClick={onRemove} title="Видалити">×</button>
      </div>
    </div>
  );
}

function ExcludedAddForm({ onClose }) {
  const add = useGameStore((s) => s.addExcludedMember);
  const [type, setType] = useState('');
  const [relation, setRelation] = useState('');
  const [name, setName] = useState('');
  const [story, setStory] = useState('');

  function handleSave() {
    if (!type) return;
    add({ type, relation: relation || null,
      name: name.trim() || null,
      story: story.trim() || null });
    onClose();
  }

  return (
    <div className="rod-excluded-form">
      <h4>Хто? Назви як знаєш — навіть «дитина яку не бачила» — це теж ім'я.</h4>

      <div className="rod-excluded-types">
        {EXCLUDED_TYPES.map((t) => (
          <button key={t.id} type="button"
            className={`rod-excluded-type${type === t.id ? ' active' : ''}`}
            onClick={() => setType(t.id)}
            style={type === t.id ? { borderColor: t.color, color: t.color } : undefined}>
            <span className="rod-excluded-type-icon">{t.icon}</span>
            <span className="rod-excluded-type-label">{t.label}</span>
          </button>
        ))}
      </div>

      {type && (
        <p className="rod-excluded-type-hint">{findExcludedType(type).hint}</p>
      )}

      {type && (
        <>
          <label className="rne-field">
            <span className="rne-label">по якій лінії?</span>
            <div className="rod-excluded-relations">
              {EXCLUDED_RELATIONS.map((r) => (
                <button key={r.id} type="button"
                  className={`rne-status-btn${relation === r.id ? ' active' : ''}`}
                  onClick={() => setRelation(r.id)}>{r.label}</button>
              ))}
            </div>
          </label>

          <label className="rne-field">
            <span className="rne-label">ім'я або як ти називаєш</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="опційно — дитина, перший партнер, прадід..."
              maxLength={60} />
          </label>

          <label className="rne-field">
            <span className="rne-label">що ти знаєш про цю людину</span>
            <input type="text" value={story} onChange={(e) => setStory(e.target.value)}
              placeholder="одна фраза — те що чув, відчуваєш, знаєш"
              maxLength={120} />
          </label>
        </>
      )}

      <div className="rne-actions">
        <button type="button" className="rne-btn rne-btn-clear" onClick={onClose}>
          скасувати
        </button>
        <button type="button" className="rne-btn rne-btn-save"
          onClick={handleSave} disabled={!type}
          style={{ background: type ? findExcludedType(type).color : '#444' }}>
          ✓ додати
        </button>
      </div>
    </div>
  );
}
