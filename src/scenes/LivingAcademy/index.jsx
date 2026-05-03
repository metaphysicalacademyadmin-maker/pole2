import { useState, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import {
  getAcademyEvents, getMyRsvps, rsvpEvent,
  typeMeta, themeMeta, formatDate, daysUntil,
} from '../../utils/academy.js';
import { showToast } from '../../components/GlobalToast.jsx';
import GiftFormPanel from './GiftFormPanel.jsx';
import JoinGroupButton from '../../components/JoinGroupButton.jsx';
import './styles.css';

// Четверта спіраль — «Поле кличе».
// Запрошення на семінари/групи/ретрити від викладачів академії.
// Знизу — гібрид: можна залишити свідчення (стара логіка GiftToWorld).
export default function LivingAcademy({ onClose }) {
  const events = getAcademyEvents();
  const initialRsvps = useMemo(() => new Set(getMyRsvps()), []);
  const [myRsvps, setMyRsvps] = useState(initialRsvps);
  const [filter, setFilter] = useState('all');     // 'all' | type | theme
  const [giftPanelOpen, setGiftPanelOpen] = useState(false);
  const acknowledge = useGameStore((s) => s.acknowledgeFourthSpiral);
  const acknowledged = useGameStore((s) => s.fourthSpiralAcknowledged);

  useOverlayA11y(onClose);

  // Acknowledge один раз
  if (!acknowledged) acknowledge();

  async function handleRsvp(event, status) {
    const ok = await rsvpEvent(event.id, status);
    setMyRsvps((prev) => {
      const next = new Set(prev);
      if (status === 'going' || status === 'interested') next.add(event.id);
      else next.delete(event.id);
      return next;
    });
    showToast(
      ok ? `✦ ${status === 'going' ? 'я піду' : status === 'interested' ? 'цікаво' : 'нагадаю'}`
        : '✦ збережено локально (бекенд недоступний)',
      ok ? 'success' : 'info',
    );
  }

  const visible = useMemo(() => {
    if (!events) return [];
    if (filter === 'all') return events;
    return events.filter((e) => e.type === filter || e.theme === filter);
  }, [events, filter]);

  return (
    <div className="la-overlay" role="dialog" aria-modal="true" aria-label="Поле кличе">
      <div className="la-frame">
        <button type="button" className="la-close" onClick={onClose}
          aria-label="Закрити Поле кличе">← повернутись</button>

        <div className="la-eyebrow">четверта спіраль</div>
        <h1 className="la-title">Поле <em>кличе</em></h1>
        <p className="la-sub">
          Ти пройшов 3 спіралі. Тепер не один шлях — ти можеш увійти у живу академію.
          Викладачі зустрічають тих, хто готовий.
        </p>

        {!events ? <NotConnectedState /> : events.length === 0 ? <EmptyState /> : (
          <>
            <Filters events={events} filter={filter} setFilter={setFilter} />
            <div className="la-events">
              {visible.map((e) => (
                <EventCard key={e.id} event={e}
                  rsvped={myRsvps.has(e.id)}
                  onRsvp={(status) => handleRsvp(e, status)} />
              ))}
            </div>
            {myRsvps.size > 0 && (
              <div className="la-mine">
                ✦ зареєстровано на <strong>{myRsvps.size}</strong> {plural(myRsvps.size, 'подію', 'події', 'подій')}
              </div>
            )}
          </>
        )}

        <JoinGroupButton variant="soft"
          label="💬 Не бачиш події під себе? Заявка на навчальну групу"
          hint="Команда академії підбере групу під твій запит — індивідуально." />

        <div className="la-divider" />

        <button type="button"
          className={`la-gift-toggle ${giftPanelOpen ? 'is-open' : ''}`}
          onClick={() => setGiftPanelOpen((v) => !v)}>
          <span className="la-gift-toggle-icon" aria-hidden="true">🪶</span>
          <span className="la-gift-toggle-text">
            <strong>Залишити свідчення</strong>
            <span className="la-gift-toggle-hint">
              анонімно — для тих, хто йде за тобою
            </span>
          </span>
          <span className="la-gift-toggle-arrow" aria-hidden="true">{giftPanelOpen ? '▾' : '▸'}</span>
        </button>

        {giftPanelOpen && <GiftFormPanel />}
      </div>
    </div>
  );
}

function EventCard({ event, rsvped, onRsvp }) {
  const tMeta = typeMeta(event.type);
  const themeM = themeMeta(event.theme);
  const days = daysUntil(event.date);
  const isFew = event.slots && event.slots.left <= 3 && event.slots.left > 0;
  const isFull = event.slots && event.slots.left === 0;

  return (
    <div className="la-event" style={{ '--type-color': tMeta.color }}>
      {event.coverUrl ? (
        <div className="la-event-cover" style={{ backgroundImage: `url(${event.coverUrl})` }}>
          <span className="la-event-type">{tMeta.icon} {tMeta.label}</span>
        </div>
      ) : (
        <div className="la-event-cover la-event-cover--gradient"
          style={{ background: `linear-gradient(135deg, ${tMeta.color}55, ${tMeta.color}22)` }}>
          <span className="la-event-cover-icon">{tMeta.icon}</span>
          <span className="la-event-type">{tMeta.label}</span>
        </div>
      )}

      <div className="la-event-body">
        <h3 className="la-event-title">{event.title}</h3>

        {event.teacher && (
          <div className="la-event-teacher">— {event.teacher.name}</div>
        )}

        <div className="la-event-meta">
          {event.theme && (
            <span className="la-event-theme" style={{ color: themeM.color }}>
              {themeM.icon} {themeM.label}
            </span>
          )}
          {event.date && (
            <span className="la-event-date">
              {formatDate(event.date)}
              {days != null && days >= 0 && days <= 14 && (
                <span className="la-event-days"> · через {days} {plural(days, 'день', 'дні', 'днів')}</span>
              )}
            </span>
          )}
        </div>

        {event.description && <p className="la-event-desc">{event.description}</p>}

        <div className="la-event-foot">
          <div className="la-event-info">
            {event.location && <span>📍 {event.location}</span>}
            {event.duration && <span>⏱ {event.duration}</span>}
            {event.price && <span className="la-event-price">{event.price}</span>}
            {event.slots && (
              <span className={`la-event-slots ${isFew ? 'is-few' : ''} ${isFull ? 'is-full' : ''}`}>
                {isFull ? 'місць немає' : `${event.slots.left} з ${event.slots.total}`}
              </span>
            )}
          </div>

          <div className="la-event-actions">
            {!isFull && !rsvped && (
              <>
                <button type="button" className="la-btn la-btn-going"
                  onClick={() => onRsvp('going')}>я піду</button>
                <button type="button" className="la-btn la-btn-interested"
                  onClick={() => onRsvp('interested')}>цікаво</button>
              </>
            )}
            {rsvped && (
              <span className="la-rsvped">✓ зареєстровано</span>
            )}
            {event.registerUrl && (
              <a href={event.registerUrl} target="_blank" rel="noopener noreferrer"
                className="la-btn la-btn-link">сторінка події ↗</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Filters({ events, filter, setFilter }) {
  const types = [...new Set(events.map((e) => e.type).filter(Boolean))];
  const themes = [...new Set(events.map((e) => e.theme).filter(Boolean))];
  return (
    <div className="la-filters">
      <button type="button"
        className={`la-chip ${filter === 'all' ? 'is-active' : ''}`}
        onClick={() => setFilter('all')}>усі ({events.length})</button>
      {types.map((t) => {
        const m = typeMeta(t);
        return (
          <button key={t} type="button"
            className={`la-chip ${filter === t ? 'is-active' : ''}`}
            onClick={() => setFilter(t)}>{m.icon} {m.label}</button>
        );
      })}
      {themes.length > 0 && <span className="la-filter-sep">·</span>}
      {themes.map((t) => {
        const m = themeMeta(t);
        return (
          <button key={t} type="button"
            className={`la-chip ${filter === t ? 'is-active' : ''}`}
            onClick={() => setFilter(t)}>{m.icon} {m.label}</button>
        );
      })}
    </div>
  );
}

function NotConnectedState() {
  return (
    <div className="la-empty">
      <div className="la-empty-icon">🌌</div>
      <div className="la-empty-title">Поле тихе</div>
      <p className="la-empty-text">
        Цей розділ завантажується з metaphysical-way.academy. Якщо ти зайшов
        сюди standalone — запрошення з'являться коли гра буде на сайті.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="la-empty">
      <div className="la-empty-icon">⏳</div>
      <div className="la-empty-title">Зараз нема активних запрошень</div>
      <p className="la-empty-text">
        Викладачі готують нові події. Зайди пізніше — і повертайся
        регулярно. Поле кличе у свій ритм.
      </p>
    </div>
  );
}

function plural(n, one, few, many) {
  const m10 = Math.abs(n) % 10;
  const m100 = Math.abs(n) % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
