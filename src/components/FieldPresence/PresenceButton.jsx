import { useEffect, useState } from 'react';
import { getFieldPresence } from '../../utils/presence.js';
import './styles.css';

// Маленький індикатор присутності — показує загальне число гравців у Полі.
// Натиск відкриває модалку з діаграмою.
export default function PresenceButton({ onClick }) {
  const [presence, setPresence] = useState(() => getFieldPresence());

  useEffect(() => {
    // Оновлюємо щохвилини — на випадок переходу через годинну межу
    const t = setInterval(() => setPresence(getFieldPresence()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <button type="button" className="fp-button" onClick={onClick}
      aria-label={`${presence.total} людей зараз у Полі`}>
      <span className="fp-button__pulse" aria-hidden="true" />
      <span>{presence.total} у Полі</span>
    </button>
  );
}
