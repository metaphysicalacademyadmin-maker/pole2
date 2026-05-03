import { bookMeta } from '../../utils/library.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';

// Читальня — рендер однієї секції.
export default function LibraryReader({ section, onClose }) {
  useOverlayA11y(onClose);
  const meta = bookMeta(section.book || section.id?.split('-')[0]);

  return (
    <div className="lib-overlay" role="dialog" aria-modal="true">
      <div className="lib-frame lib-reader">
        <button type="button" className="lib-close" onClick={onClose}>
          ← до бібліотеки
        </button>

        <div className="lib-reader-meta">
          <span className="lib-reader-icon" style={{ color: meta.color }}>{meta.icon}</span>
          <span className="lib-reader-source">{meta.label}</span>
          {section.chapter && <span className="lib-reader-chapter">· {section.chapter}</span>}
        </div>

        <h2 className="lib-reader-title">{section.title}</h2>

        <div className="lib-reader-body">
          {(section.body || '').split('\n').map((p, i) => (
            p.trim() ? <p key={i}>{p}</p> : null
          ))}
        </div>
      </div>
    </div>
  );
}
