import { getAcademyEvents, formatDate, daysUntil, themeMeta } from '../utils/academy.js';
import { getPetalThemes, getFallbackHint, getJoinUrl } from '../data/petal-academy-map.js';

// Компактна картка пропозиції академії під чакру пелюстки.
// Показується після завершення пелюстки. М'який funnel.
//
// Приоритет:
//   1. Якщо є динамічні events з window.__POLE_ACADEMY__ що матчать theme →
//      показуємо до 2 ближчих за датою
//   2. Інакше — статична FALLBACK_HINTS картка з кнопкою «дізнатись більше»
//
export default function PetalAcademyHint({ petalId, petalColor }) {
  const themes = getPetalThemes(petalId);
  const events = getAcademyEvents();

  // Динамічний матчинг
  const matched = (events || [])
    .filter((e) => themes.includes(e.theme))
    .filter((e) => {
      const days = daysUntil(e.date);
      return days === null || days >= 0;   // тільки майбутні або без дати
    })
    .sort((a, b) => (daysUntil(a.date) || 999) - (daysUntil(b.date) || 999))
    .slice(0, 2);

  if (matched.length > 0) {
    return (
      <div className="pah-block">
        <div className="pah-label">академія пропонує</div>
        <div className="pah-events">
          {matched.map((e) => (
            <DynamicCard key={e.id} event={e} petalColor={petalColor} />
          ))}
        </div>
      </div>
    );
  }

  const hint = getFallbackHint(petalId);
  if (!hint) return null;

  return (
    <div className="pah-block">
      <div className="pah-label">академія пропонує</div>
      <div className="pah-fallback" style={{ borderColor: `${petalColor}55` }}>
        <div className="pah-icon" style={{ color: petalColor }}>{hint.icon}</div>
        <div className="pah-body">
          <div className="pah-title">{hint.title}</div>
          <div className="pah-desc">{hint.desc}</div>
          <a href={getJoinUrl()} target="_blank" rel="noopener noreferrer"
            className="pah-cta" style={{ color: petalColor }}>
            дізнатись більше →
          </a>
        </div>
      </div>
    </div>
  );
}

function DynamicCard({ event, petalColor }) {
  const t = themeMeta(event.theme);
  const days = daysUntil(event.date);
  const dateLabel = days === 0 ? 'сьогодні'
    : days === 1 ? 'завтра'
    : days != null && days < 14 ? `через ${days} ${days < 5 ? 'дні' : 'днів'}`
    : formatDate(event.date);

  return (
    <a href={event.registerUrl || getJoinUrl()} target="_blank" rel="noopener noreferrer"
      className="pah-event" style={{ borderColor: `${t.color}55` }}>
      <div className="pah-event-icon" style={{ color: t.color }}>{t.icon}</div>
      <div className="pah-event-body">
        <div className="pah-event-title">{event.title}</div>
        <div className="pah-event-meta">
          {event.teacher?.name && <span>{event.teacher.name} · </span>}
          <span>{dateLabel}</span>
          {event.location && <span> · {event.location}</span>}
        </div>
        {event.slots?.left != null && event.slots.left <= 5 && (
          <div className="pah-event-slots" style={{ color: petalColor }}>
            ⌛ лишилось {event.slots.left} місць
          </div>
        )}
      </div>
    </a>
  );
}
