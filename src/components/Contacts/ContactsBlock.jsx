import { CONTACTS, CONTACT_ORDER } from '../../data/contacts.js';
import './contacts.css';

// Reusable блок контактів. Можна вставити у Final, PathMode, Teacher.
// variant: 'compact' | 'full' (default 'full')
export default function ContactsBlock({ variant = 'full', title }) {
  const items = CONTACT_ORDER
    .map((id) => CONTACTS[id] && { ...CONTACTS[id], id })
    .filter(Boolean);
  return (
    <div className={`cnt-block cnt-${variant}`}>
      {title && <div className="cnt-title">{title}</div>}
      <div className="cnt-list">
        {items.map((c) => (
          <a key={c.id} href={c.url}
            target="_blank" rel="noopener noreferrer"
            className="cnt-item">
            <span className="cnt-icon">{c.icon}</span>
            <span className="cnt-info">
              <span className="cnt-label">{c.label}</span>
              <span className="cnt-handle">{c.handle}</span>
              {variant === 'full' && (
                <span className="cnt-desc">{c.description}</span>
              )}
            </span>
            <span className="cnt-arrow">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
