import { passageForLevel } from '../../data/methodichka-chakras.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import { CHAKRAS } from '../../data/chakras.js';
import GlossaryTerm from '../GlossaryTerm.jsx';
import './styles.css';

// «📖 З методички академії» — інлайн-вставка на сторінці рівня.
// Показує реальний матеріал з СИСТЕМА ЧАКР для поточного рівня.
// Викликається з Topbar (кнопка 📖). Закривається кліком поза модалкою.
export default function ChakraPassage({ levelN, onClose }) {
  const passage = passageForLevel(levelN);
  const chakra = CHAKRAS.find((c) => c.levelN === levelN);

  useOverlayA11y(onClose);

  if (!passage) {
    return (
      <div className="cp-overlay" role="dialog" aria-modal="true">
        <div className="cp-modal">
          <button type="button" className="cp-close" onClick={onClose}>×</button>
          <p>Для цього рівня матеріалів ще немає.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-overlay" role="dialog" aria-modal="true"
      aria-label={`Методичка — ${passage.name}`}>
      <div className="cp-modal" style={{ '--cp-color': chakra?.color || '#f0c574' }}>
        <button type="button" className="cp-close" onClick={onClose}
          aria-label="Закрити">×</button>

        <div className="cp-eyebrow">📖 з методички академії</div>
        <h2 className="cp-title" style={{ color: chakra?.color }}>
          <GlossaryTerm>{passage.name}</GlossaryTerm>
        </h2>
        {chakra && (
          <div className="cp-sub">{chakra.sub} · рівень {levelN}</div>
        )}

        <div className="cp-body">
          {passage.body.split('\n').map((p, i) => {
            const t = p.trim();
            if (!t) return null;
            // Якщо рядок без розділового знаку у кінці і коротший за 50 — це підзаголовок
            const isSubheader = t.length < 50 && !t.endsWith('.') && !t.endsWith(':') && !t.startsWith('—') && !t.startsWith('Місце') && !t.includes('|');
            if (isSubheader && (t === 'Функції' || t === 'Психоемоційні теми' || t === 'Фізичні відповідності' || t === 'Прояви блоку' || t === 'Практики налаштування')) {
              return <h4 key={i} className="cp-subhead">{t}</h4>;
            }
            return <p key={i}>{t.replace(/⸻+/g, '')}</p>;
          })}
        </div>

        <div className="cp-source">
          Методична книга Академії — Том І
        </div>
      </div>
    </div>
  );
}
