import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ENTANGLEMENT_TYPES } from '../../data/rodovid-hellinger.js';

// Verstrickung за Хеллінгером — несвідоме заміщення предків.
// Гравець обирає тип переплетіння, опційно своїми словами,
// потім — ритуал відпускання («залишаю це з тобою»).
export default function EntanglementCheck() {
  const ent = useGameStore((s) => s.rodovidEntanglement);
  const setEnt = useGameStore((s) => s.setRodovidEntanglement);
  const release = useGameStore((s) => s.releaseRodovidEntanglement);
  const [picking, setPicking] = useState(false);
  const [customText, setCustomText] = useState(ent?.customText || '');

  function handlePick(typeId) {
    if (typeId === 'custom') {
      setEnt({ carrying: 'custom', customText: '' });
      return;
    }
    setEnt({ carrying: typeId, customText: null });
    setPicking(false);
  }

  function saveCustom() {
    if (customText.trim().length < 5) return;
    setEnt({ carrying: 'custom', customText: customText.trim() });
    setPicking(false);
  }

  function clearAll() {
    setEnt(null);
    setCustomText('');
    setPicking(false);
  }

  const carryingType = ent?.carrying
    ? ENTANGLEMENT_TYPES.find((t) => t.id === ent.carrying)
    : null;

  return (
    <div className="rod-entangle">
      <h3>Чию долю ти несеш?</h3>
      <p className="rod-entangle-hint">
        За Хеллінгером — переплетіння (Verstrickung). Іноді ми живемо
        чуже життя замість свого. Назвати — почати звільнятись.
      </p>

      {!ent && !picking && (
        <button type="button" className="rod-entangle-start"
          onClick={() => setPicking(true)}>
          ◯ перевірити чи я несу чуже
        </button>
      )}

      {picking && !ent?.carrying && (
        <EntanglementOptions onPick={handlePick} onClose={() => setPicking(false)} />
      )}

      {ent?.carrying === 'custom' && !ent?.customText && (
        <div className="rod-entangle-custom">
          <textarea value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="напиши своїми словами — що відчуваєш що несеш не своє..."
            rows={3} maxLength={200} />
          <div className="rne-actions">
            <button type="button" className="rne-btn rne-btn-clear" onClick={clearAll}>
              скасувати
            </button>
            <button type="button" className="rne-btn rne-btn-save"
              onClick={saveCustom}
              disabled={customText.trim().length < 5}
              style={{ background: '#a890b0' }}>
              ✓ так, це я
            </button>
          </div>
        </div>
      )}

      {ent?.carrying && (ent.carrying !== 'custom' || ent.customText) && (
        <div className="rod-entangle-state">
          <div className="rod-entangle-named">
            <span className="rod-entangle-named-label">я несу:</span>
            <strong>
              {carryingType?.label || 'інше'}
              {ent.customText && ` — ${ent.customText}`}
            </strong>
          </div>

          {!ent.released ? (
            <div className="rod-entangle-ritual">
              <p>Готовий відпустити? Ритуал — фразу проговори вголос:</p>
              <div className="rod-entangle-quote">
                «Я бачу. Це твоє, не моє. Я залишаю це з тобою — з любов'ю.
                Я несу тільки своє життя.»
              </div>
              <button type="button" className="rod-entangle-release-btn"
                onClick={release}>
                ⊹ я відпустив — це залишається з ним/нею
              </button>
            </div>
          ) : (
            <div className="rod-entangle-released">
              ✓ <em>Відпущено. Це більше не твоє.</em>
            </div>
          )}

          <button type="button" className="rod-entangle-clear"
            onClick={clearAll}>
            ← вибрати інше
          </button>
        </div>
      )}
    </div>
  );
}

function EntanglementOptions({ onPick, onClose }) {
  return (
    <div className="rod-entangle-options">
      {ENTANGLEMENT_TYPES.map((t) => (
        <button key={t.id} type="button"
          className="rod-entangle-option"
          onClick={() => onPick(t.id)}>
          <span className="rod-entangle-option-label">{t.label}</span>
          <span className="rod-entangle-option-hint">{t.hint}</span>
        </button>
      ))}
      <button type="button" className="rne-btn rne-btn-clear"
        onClick={onClose}>скасувати</button>
    </div>
  );
}
