import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { SCENARIOS, findScenario } from '../../data/constellation/scenarios.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import { showToast } from '../GlobalToast.jsx';
import ConstellationSession from './Session.jsx';
import ConstellationHistory from './History.jsx';
import './styles.css';

// Розстановка як інструмент-практика. Гравець обирає сценарій
// (з тінню / симптомом / рішенням / стосунками), розставляє фігури,
// проговорює ритуальні фрази, зберігає у toolConstellations[].
//
// Окремо від Constellation на рівні 3 (там Hellinger-розстановка
// прив'язана до контенту рівня).
export default function ConstellationTool({ onClose }) {
  const trackUsage = useGameStore((s) => s.trackToolUsage);
  const [scenarioId, setScenarioId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useOverlayA11y(onClose);

  const scenario = scenarioId ? findScenario(scenarioId) : null;

  function handlePick(id) {
    setScenarioId(id);
    trackUsage('constellation');
  }

  function handleSessionEnd() {
    showToast('розстановку збережено', 'success');
    setScenarioId(null);
  }

  if (scenario) {
    return (
      <ConstellationSession scenario={scenario}
        onEnd={handleSessionEnd}
        onCancel={() => setScenarioId(null)} />
    );
  }

  if (showHistory) {
    return <ConstellationHistory onClose={() => setShowHistory(false)} />;
  }

  return (
    <div className="ct-overlay" role="dialog" aria-modal="true" aria-label="Розстановка-практика">
      <div className="ct-frame">
        <button type="button" className="ct-close" onClick={onClose}
          aria-label="Закрити інструмент">← повернутись</button>

        <div className="ct-header">
          <div className="ct-eyebrow">інструмент-практика</div>
          <h2 className="ct-title">Розстановка</h2>
          <p className="ct-sub">
            Системний метод за Хеллінгером. Тіло знає більше ніж голова.
            Постав фігури — слухай що відчувається.
          </p>
        </div>

        <div className="ct-scenarios">
          {SCENARIOS.map((sc) => (
            <button key={sc.id} type="button"
              className="ct-scenario"
              style={{ borderColor: `${sc.color}66` }}
              onClick={() => handlePick(sc.id)}>
              <span className="ct-scenario-icon" style={{ color: sc.color }}>{sc.icon}</span>
              <span className="ct-scenario-body">
                <span className="ct-scenario-name">{sc.name}</span>
                <span className="ct-scenario-short">{sc.short}</span>
              </span>
            </button>
          ))}
        </div>

        <button type="button" className="ct-history-btn"
          onClick={() => setShowHistory(true)}>
          📜 переглянути попередні розстановки
        </button>

        <div className="ct-safety">
          <strong>Перед початком:</strong> Знайди тихе місце. Вимкни телефон. Дихай.
          Розстановка — це робота з полем. Не «правильні відповіді» — а правда тіла.
        </div>
      </div>
    </div>
  );
}
