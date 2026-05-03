import { useState, useRef, useEffect } from 'react';
import { findTerm } from '../data/glossary.js';

// Обгортка-термін: підкреслюється dotted, при кліку показує тултіп
// з визначенням. Поза рамкою тултіпу — закриває.
//
// Використання: <GlossaryTerm>чакра</GlossaryTerm>  → знайде у глосарії
//                <GlossaryTerm term="Сахасрара">7 чакра</GlossaryTerm>  → ручний term
export default function GlossaryTerm({ children, term }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Шукаємо у глосарії — за term-проп або за children-текстом
  const lookup = term || (typeof children === 'string' ? children : '');
  const found = findTerm(lookup);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [open]);

  if (!found) {
    // Термін не знайдений — рендеримо як звичайний текст
    return <>{children}</>;
  }

  return (
    <span ref={ref} className="gt-wrap">
      <span className="gt-trigger"
        onClick={() => setOpen(!open)}
        role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setOpen(!open); }}>
        {children}
      </span>
      {open && (
        <span className="gt-tooltip" role="tooltip">
          <span className="gt-tooltip-arrow" />
          <strong className="gt-tooltip-term">{found.term}</strong>
          <span className="gt-tooltip-def">{found.definition}</span>
        </span>
      )}
    </span>
  );
}
