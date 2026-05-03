import { useEffect, useState } from 'react';
import { quoteForEvent } from '../utils/event-quotes.js';

// Плашка-цитата при події. Авто-зникає через 8 секунд або по кліку.
// Унікальний key — щоб React гарантовано перемонтував і анімація грала.
export default function EventQuote({ eventKey, onDismiss }) {
  const [quote] = useState(() => quoteForEvent(eventKey));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 400);     // після fade-out
    }, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!quote) return null;

  function handleClick() {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 200);
  }

  return (
    <div className={`eq-card${visible ? ' eq-visible' : ' eq-hiding'}`}
      onClick={handleClick}
      role="status" aria-live="polite">
      <div className="eq-quote-mark">«</div>
      <p className="eq-text">{quote.text}</p>
      <div className="eq-source">— {quote.source}</div>
    </div>
  );
}
