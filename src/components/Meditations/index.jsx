import { useState, useMemo } from 'react';
import { getMeditations, categoryMeta, formatDuration } from '../../utils/meditations.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import MeditationPlayer from './MeditationPlayer.jsx';
import './styles.css';

// Відділ медитацій — завантажується з metaphysical-way.academy.
// Якщо парент-сторінка не інжектила window.__POLE_MEDITATIONS__ —
// показуємо empty-state з поясненням.
export default function Meditations({ onClose }) {
  const list = getMeditations();
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState('all');

  useOverlayA11y(active ? () => setActive(null) : onClose);

  const categories = useMemo(() => {
    if (!list) return [];
    const seen = new Set();
    list.forEach((m) => seen.add(m.category || 'general'));
    return [...seen];
  }, [list]);

  const visible = useMemo(() => {
    if (!list) return [];
    return filter === 'all' ? list : list.filter((m) => (m.category || 'general') === filter);
  }, [list, filter]);

  if (active) {
    return (
      <MeditationPlayer
        meditation={active}
        onClose={() => setActive(null)}
        onAllClose={onClose}
      />
    );
  }

  return (
    <div className="med-overlay" role="dialog" aria-modal="true" aria-label="Медитації — Метафізична Академія">
      <div className="med-frame">
        <button type="button" className="med-close" onClick={onClose}
          aria-label="Закрити відділ медитацій">← повернутись</button>
        <div className="med-eyebrow">метафізична академія</div>
        <h1 className="med-title">Медитації</h1>
        <p className="med-sub">
          Тілесні провідники — голос, частоти, тиша. Обери сферу або запиши себе у будь-яку.
        </p>

        {!list ? (
          <EmptyState />
        ) : list.length === 0 ? (
          <EmptyState empty />
        ) : (
          <>
            <div className="med-filters">
              <Chip active={filter === 'all'} onClick={() => setFilter('all')} icon="◯">
                усі ({list.length})
              </Chip>
              {categories.map((c) => {
                const meta = categoryMeta(c);
                const count = list.filter((m) => (m.category || 'general') === c).length;
                return (
                  <Chip key={c} active={filter === c} onClick={() => setFilter(c)}
                    icon={meta.icon} color={meta.color}>
                    {meta.label} ({count})
                  </Chip>
                );
              })}
            </div>

            <div className="med-list">
              {visible.map((m) => (
                <MeditationCard key={m.id} meditation={m} onPlay={() => setActive(m)} />
              ))}
            </div>
          </>
        )}

        <p className="med-foot">
          Контент оновлюється з metaphysical-way.academy. Без імпорту нового —
          одна і та сама колекція.
        </p>
      </div>
    </div>
  );
}

function MeditationCard({ meditation: m, onPlay }) {
  const meta = categoryMeta(m.category);
  return (
    <button type="button" className="med-card" onClick={onPlay}
      style={{ '--cat-color': meta.color }}>
      <div className="med-card__cover" style={m.coverUrl
        ? { backgroundImage: `url(${m.coverUrl})` }
        : { background: `linear-gradient(135deg, ${meta.color}55, ${meta.color}22)` }}>
        {!m.coverUrl && <span className="med-card__cover-icon">{meta.icon}</span>}
        <span className="med-card__play">▶</span>
      </div>
      <div className="med-card__body">
        <div className="med-card__meta">
          <span className="med-card__cat">{meta.icon} {meta.label}</span>
          <span className="med-card__dur">{formatDuration(m.durationSec)}</span>
        </div>
        <div className="med-card__title">{m.title}</div>
        {m.description && <div className="med-card__desc">{m.description}</div>}
        {m.teacher && <div className="med-card__teacher">— {m.teacher}</div>}
      </div>
    </button>
  );
}

function Chip({ active, icon, color, children, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={`med-chip ${active ? 'is-active' : ''}`}
      style={active && color ? { borderColor: color, color } : undefined}>
      <span>{icon}</span>{children}
    </button>
  );
}

function EmptyState({ empty }) {
  return (
    <div className="med-empty">
      <div className="med-empty__icon">🎧</div>
      <div className="med-empty__title">
        {empty ? 'Колекція порожня' : 'Медитації ще не завантажені'}
      </div>
      <p className="med-empty__text">
        {empty
          ? 'Автор додасть медитації — вони з\'являться тут автоматично.'
          : 'Цей розділ завантажується з metaphysical-way.academy. Якщо ти у браузері запустив single-file гру окремо від сайту — медитацій тут не буде.'}
      </p>
    </div>
  );
}
