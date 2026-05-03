// Жива Академія — запрошення на семінари/групи від metaphysical-way.academy.
//
// Завантажуються через window-injection від парент-сторінки.
// Якщо нема — показуємо empty state.
//
// Контракт парента:
//   window.__POLE_ACADEMY__ = {
//     events: [{
//       id: 'event_xxx',
//       title: 'Тіло як вівтар',
//       teacher: { name: 'Анна Іваненко', photoUrl: '...' },
//       type: 'retreat' | 'seminar' | 'group' | 'online-course',
//       date: '2026-06-15',
//       duration: '3 дні',
//       location: 'Київ' | 'online',
//       theme: 'body' | 'shadow' | 'voice' | 'relations' | 'spirit',
//       description: '...',
//       coverUrl: '...',                  // опційно
//       price: '1200 грн' | 'безкоштовно' | 'donation',
//       slots: { left: 5, total: 20 },
//       registerUrl: 'https://...',
//     }],
//     rsvp: async ({ eventId, status }) => {...},   // опційно
//     myRsvps: ['event_xxx'],                        // що я вже реєстрував
//   };

const TYPE_META = {
  retreat:        { icon: '🏔', label: 'Ретрит',           color: '#a8c898' },
  seminar:        { icon: '◉',  label: 'Семінар',          color: '#9fc8e8' },
  group:          { icon: '👥', label: 'Група',            color: '#f0a8b8' },
  'online-course':{ icon: '🎓', label: 'Онлайн-курс',      color: '#c9b3e8' },
  ritual:         { icon: '✦',  label: 'Ритуал',           color: '#ffe7a8' },
};

const THEME_META = {
  body:        { icon: '🌍', label: 'тіло',         color: '#a8c898' },
  shadow:      { icon: '🌑', label: 'тінь',         color: '#7a5a8a' },
  voice:       { icon: '🗣',  label: 'голос',        color: '#9fc8e8' },
  relations:   { icon: '💗', label: 'стосунки',     color: '#f0a8b8' },
  spirit:      { icon: '✨', label: 'дух',          color: '#ffe7a8' },
  rod:         { icon: '🌳', label: 'рід',          color: '#e8b0b8' },
  cosmo:       { icon: '🔮', label: 'космо',        color: '#c9b3e8' },
};

export function getAcademyEvents() {
  if (typeof window === 'undefined') return null;
  const a = window.__POLE_ACADEMY__;
  if (!a || !Array.isArray(a.events)) return null;
  return a.events;
}

export function getMyRsvps() {
  if (typeof window === 'undefined') return [];
  return window.__POLE_ACADEMY__?.myRsvps || [];
}

export async function rsvpEvent(eventId, status) {
  if (typeof window === 'undefined') return false;
  const a = window.__POLE_ACADEMY__;
  if (!a?.rsvp) return false;
  try {
    await a.rsvp({ eventId, status });
    return true;
  } catch (e) {
    return false;
  }
}

export function typeMeta(type) {
  return TYPE_META[type] || { icon: '✦', label: type || '—', color: '#c89849' };
}

export function themeMeta(theme) {
  return THEME_META[theme] || { icon: '·', label: theme || '', color: '#c8bca8' };
}

// Дата у читабельному форматі для українця
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// Скільки днів до події
export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((d - today) / 86_400_000);
}
