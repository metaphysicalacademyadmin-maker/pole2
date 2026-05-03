import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { findNode } from '../../data/rodovid-nodes.js';
import { phrasesFor } from '../../data/rodovid-hellinger.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';

// Редактор одного вузла родоводу — модалка-form поверх SVG.
export default function RodovidNodeEditor({ nodeId, onClose }) {
  const node = findNode(nodeId);
  const existing = useGameStore((s) => s.rodovid?.[nodeId]);
  const save = useGameStore((s) => s.saveRodovidNode);
  const clear = useGameStore((s) => s.clearRodovidNode);
  const markPhrase = useGameStore((s) => s.markRodovidPhrase);

  const [name, setName] = useState(existing?.name || '');
  const [gift, setGift] = useState(existing?.gift || '');
  const [program, setProgram] = useState(existing?.program || '');
  const [alive, setAlive] = useState(existing?.alive !== false);

  useOverlayA11y(onClose);

  // Якщо редагуємо вже існуючу — синхронізуємо при зміні nodeId
  useEffect(() => {
    setName(existing?.name || '');
    setGift(existing?.gift || '');
    setProgram(existing?.program || '');
    setAlive(existing?.alive !== false);
  }, [nodeId, existing]);

  if (!node) return null;

  const isMe = nodeId === 'me';

  function handleSave() {
    save(nodeId, {
      name: name.trim() || null,
      gift: gift.trim() || null,
      program: program.trim() || null,
      alive,
    });
    onClose();
  }

  function handleClear() {
    clear(nodeId);
    onClose();
  }

  return (
    <div className="rne-overlay" role="dialog" aria-modal="true"
      aria-label={`Редагувати: ${node.label}`}>
      <div className="rne-modal" style={{ borderColor: `${node.color}66` }}>
        <div className="rne-header">
          <span className="rne-icon" style={{ color: node.color }}>
            {isMe ? '◯' : node.sex === 'male' ? '◇' : '◈'}
          </span>
          <h3 style={{ color: node.color }}>{node.label}</h3>
          <button type="button" className="rne-close" onClick={onClose}
            aria-label="Закрити редактор">×</button>
        </div>

        <label className="rne-field">
          <span className="rne-label">{isMe ? 'твоє ім\'я' : 'ім\'я (як ти називав/називаєш)'}</span>
          <input type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isMe ? 'твоє ім\'я' : 'або просто «Тато», «Бабуся Оля»...'}
            maxLength={40} />
        </label>

        {!isMe && (
          <label className="rne-field">
            <span className="rne-label">статус</span>
            <div className="rne-status-row">
              <button type="button"
                className={`rne-status-btn${alive ? ' active' : ''}`}
                onClick={() => setAlive(true)}>живий/жива</button>
              <button type="button"
                className={`rne-status-btn${!alive ? ' active' : ''}`}
                onClick={() => setAlive(false)}>у полі предків</button>
            </div>
          </label>
        )}

        <label className="rne-field">
          <span className="rne-label">
            {isMe ? 'що ти береш для свого продовження' : 'дар, що передався тобі від цієї людини'}
          </span>
          <input type="text" value={gift}
            onChange={(e) => setGift(e.target.value)}
            placeholder="одне слово/фраза..."
            maxLength={80} />
          <span className="rne-hint">тільки добре. Що тебе тримає до сьогодні.</span>
        </label>

        <label className="rne-field">
          <span className="rne-label">
            {isMe ? 'що ти НЕ хочеш повторювати' : 'програма, що повторюється у тобі'}
          </span>
          <input type="text" value={program}
            onChange={(e) => setProgram(e.target.value)}
            placeholder="одне слово/фраза..."
            maxLength={80} />
          <span className="rne-hint">не вирок — спостереження. Назване — вже менше керує.</span>
        </label>

        {existing && (
          <RitualPhrasesBlock nodeId={nodeId}
            phrases={existing.phrases || {}}
            onMark={(phraseId) => markPhrase(nodeId, phraseId)}
            color={node.color} />
        )}

        <div className="rne-actions">
          {existing && (
            <button type="button" className="rne-btn rne-btn-clear"
              onClick={handleClear}>очистити</button>
          )}
          <button type="button" className="rne-btn rne-btn-save"
            onClick={handleSave}
            style={{ background: node.color }}>
            ✓ зберегти
          </button>
        </div>
      </div>
    </div>
  );
}

function RitualPhrasesBlock({ nodeId, phrases, onMark, color }) {
  const list = phrasesFor(nodeId);
  return (
    <div className="rne-ritual">
      <div className="rne-ritual-label">
        ⊹ ритуал визнання — вимов вголос
      </div>
      <div className="rne-ritual-hint">
        За Хеллінгером: фраза, проговорена з тілом — звільняє переплетіння.
      </div>
      <div className="rne-ritual-list">
        {list.map((p) => {
          const spoken = !!phrases[p.id];
          return (
            <button key={p.id} type="button"
              className={`rne-ritual-btn${spoken ? ' is-spoken' : ''}`}
              onClick={() => onMark(p.id)}
              style={spoken ? { borderColor: color, color } : undefined}>
              <span className="rne-ritual-mark">{spoken ? '✓' : '○'}</span>
              <span className="rne-ritual-text">«{p.text}»</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
