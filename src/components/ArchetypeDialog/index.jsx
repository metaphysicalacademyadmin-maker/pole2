import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { findArchetype } from '../../data/archetypes.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import { fetchArchetypeReply, pickFallbackReply, isArchetypeChatAvailable } from '../../utils/archetype-chat.js';
import './styles.css';

// Чат з підтвердженим архетипом гравця.
// Архетип говорить ВІД ПЕРШОЇ ОСОБИ як внутрішня частина.
// LLM якщо є, fallback на заздалегідь записані репліки.
export default function ArchetypeDialog({ onClose }) {
  const archetypeId = useGameStore((s) => s.archetypeCalibration?.confirmed);
  const intention = useGameStore((s) => s.intention);
  const archetype = archetypeId ? findArchetype(archetypeId) : null;

  const [history, setHistory] = useState([]);    // [{ role, text, ts }]
  const [input, setInput] = useState('');
  const [waiting, setWaiting] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useOverlayA11y(onClose);

  // Привітальна репліка архетипа
  useEffect(() => {
    if (!archetype || history.length > 0) return;
    setHistory([{
      role: 'archetype',
      text: archetype.encounterText || `Я — ${archetype.name} у тобі. Я слухаю.`,
      ts: Date.now(),
    }]);
  }, [archetype, history.length]);

  // Auto-scroll до низу при новій репліці
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length, waiting]);

  if (!archetype) {
    return (
      <div className="ad-overlay" role="dialog" aria-modal="true">
        <div className="ad-modal">
          <div className="ad-empty">
            <div className="ad-empty-icon">◯</div>
            <h3>Архетип ще не підтверджений</h3>
            <p>
              Пройди калібрування архетипу — і повертайся.
              Тоді у тебе буде з ким говорити «з середини».
            </p>
            <button type="button" className="ad-btn-close" onClick={onClose}>
              зрозумів
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function handleSend() {
    const msg = input.trim();
    if (!msg || waiting) return;

    const userTurn = { role: 'user', text: msg, ts: Date.now() };
    setHistory((h) => [...h, userTurn]);
    setInput('');
    setWaiting(true);

    let replyText = null;
    if (isArchetypeChatAvailable()) {
      const r = await fetchArchetypeReply({
        archetype, message: msg, history: [...history, userTurn], intention,
      });
      if (r?.text) replyText = r.text;
    }
    if (!replyText) {
      replyText = pickFallbackReply(archetype.id, msg, history);
    }

    // Невелика затримка щоб не миттєво — менш «чатбот»
    setTimeout(() => {
      setHistory((h) => [...h, { role: 'archetype', text: replyText, ts: Date.now() }]);
      setWaiting(false);
      inputRef.current?.focus();
    }, 600 + Math.random() * 600);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="ad-overlay" role="dialog" aria-modal="true"
      aria-label={`Діалог з архетипом ${archetype.name}`}>
      <div className="ad-modal" style={{ '--arc-color': archetype.color }}>
        <div className="ad-header">
          <div className="ad-symbol" style={{ color: archetype.color }}>
            {archetype.symbol}
          </div>
          <div className="ad-name-block">
            <div className="ad-name" style={{ color: archetype.color }}>{archetype.name}</div>
            <div className="ad-sub">внутрішня частина · діалог</div>
          </div>
          <button type="button" className="ad-close" onClick={onClose}
            aria-label="Закрити діалог">×</button>
        </div>

        <div className="ad-thread" ref={scrollRef}>
          {history.map((m, i) => (
            <div key={i} className={`ad-msg ad-msg-${m.role}`}>
              {m.role === 'archetype' && (
                <span className="ad-msg-avatar" style={{ color: archetype.color }}>
                  {archetype.symbol}
                </span>
              )}
              <div className="ad-msg-bubble">{m.text}</div>
            </div>
          ))}
          {waiting && (
            <div className="ad-msg ad-msg-archetype">
              <span className="ad-msg-avatar" style={{ color: archetype.color }}>
                {archetype.symbol}
              </span>
              <div className="ad-msg-bubble ad-msg-thinking">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        <div className="ad-input-row">
          <textarea ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`скажи ${archetype.name.toLowerCase()}...`}
            rows={2} maxLength={400}
            disabled={waiting} />
          <button type="button"
            onClick={handleSend}
            disabled={waiting || !input.trim()}
            className="ad-send"
            style={{ background: archetype.color }}>
            ↑
          </button>
        </div>
        <div className="ad-hint">
          {isArchetypeChatAvailable()
            ? 'Архетип відповідає у моменті.'
            : '(оффлайн-режим — заздалегідь записані репліки)'}
        </div>
      </div>
    </div>
  );
}
