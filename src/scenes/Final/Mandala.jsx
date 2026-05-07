import { useState } from 'react';
import mandalaSvgRaw from '../../assets/mandala.svg?raw';

// Inline SVG-мандала — артефакт Карти Втілення.
// Витягуємо вміст файлу (між <svg> і </svg>) щоб обгорнути власною React-обгорткою
// з нашими атрибутами, обробниками і aria. Білий fill замінюємо на currentColor —
// мандала підхопить золотий колір з CSS (тёмні деталі лишаємо як є для глибини).
const INNER_SVG = mandalaSvgRaw
  .replace(/^\s*<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .replace(/fill="#fff"/gi, 'fill="currentColor"')
  .replace(/fill="#ffffff"/gi, 'fill="currentColor"');

// Підсумкова мандала на Final-екрані. Клік запускає одне ритуальне обертання
// (4 секунди). Якщо передано onClick — викликається теж після старту анімації.
// Props completedLevels / levelKeys лишилися у сигнатурі для сумісності з Final/index.jsx
// — поточна реалізація їх не використовує (мандала статична-цілісна, без per-level стану).
export default function Mandala({ onClick }) {
  const [spinning, setSpinning] = useState(false);

  function handleActivate(e) {
    if (!spinning) {
      setSpinning(true);
      setTimeout(() => setSpinning(false), 4000);
    }
    onClick?.(e);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate(e);
    }
  }

  return (
    <div
      className={`final-mandala-wrap${spinning ? ' is-spinning' : ''}`}
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      aria-label="Мандала Втілення — натисни щоб відкрити Книгу Душі"
    >
      <svg
        viewBox="0 0 800 800"
        xmlns="http://www.w3.org/2000/svg"
        className="final-mandala-svg"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: INNER_SVG }}
      />
    </div>
  );
}
