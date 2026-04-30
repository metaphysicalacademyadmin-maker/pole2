import { useState } from 'react';
import { createPortal } from 'react-dom';
import { TEACHER_CATEGORIES, topicsByCategory, findTopic } from '../../data/teacher.js';
import './teacher.css';

// Учитель Поля — модалка з гідом по грі. Структура:
// 1. Перелік категорій (5 кнопок)
// 2. Список тем у категорії (~3-4 теми)
// 3. Відкрита тема — повна відповідь
//
// Рендериться через createPortal у document.body — щоб уникнути
// stacking-context конфліктів з .app (z-index 10).
export default function TeacherModal({ onClose, defaultTopicId }) {
  const initial = defaultTopicId ? findTopic(defaultTopicId) : null;
  const [activeCategory, setActiveCategory] = useState(initial?.category || 'базове');
  const [activeTopic, setActiveTopic] = useState(initial);

  const topics = topicsByCategory(activeCategory);

  return createPortal(
    <div className="tch-overlay" onClick={onClose}>
      <div className="tch-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tch-header">
          <div className="tch-symbol">?</div>
          <div>
            <div className="tch-name">Учитель Поля</div>
            <div className="tch-tagline">Допоможу зрозуміти все що тут відбувається</div>
          </div>
          <button type="button" className="tch-close" onClick={onClose}>×</button>
        </div>

        <div className="tch-cats">
          {TEACHER_CATEGORIES.map((c) => (
            <button key={c.id} type="button"
              className={`tch-cat${activeCategory === c.id ? ' active' : ''}`}
              onClick={() => { setActiveCategory(c.id); setActiveTopic(null); }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {!activeTopic ? (
          <div className="tch-topics">
            {topics.map((t) => (
              <button key={t.id} type="button"
                className="tch-topic"
                onClick={() => setActiveTopic(t)}>
                <span className="tch-topic-icon">{t.icon}</span>
                <span className="tch-topic-title">{t.title}</span>
                <span className="tch-topic-arrow">→</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="tch-answer">
            <button type="button" className="tch-back" onClick={() => setActiveTopic(null)}>
              ← інші теми
            </button>
            <h3 className="tch-answer-title">
              {activeTopic.icon} {activeTopic.title}
            </h3>
            <div className="tch-answer-body" dangerouslySetInnerHTML={{
              __html: formatAnswer(activeTopic.answer),
            }} />
          </div>
        )}

        <div className="tch-footer">
          Не бачиш відповіді? Контакт у Telegram: <strong>@dr_Zayats</strong>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Простий markdown → HTML: **bold**, • bullet, абзаци
function formatAnswer(text) {
  return text
    .split('\n\n')
    .map((para) => {
      const html = para
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br/>');
      if (html.includes('•') || html.includes('×')) {
        return `<div class="tch-list">${html}</div>`;
      }
      return `<p>${html}</p>`;
    })
    .join('');
}
