import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { BAROMETERS } from '../../data/barometers.js';

// 8 ресурсів-барометрів справа. Числа ростуть від відповідей.
// Анімуємо рядок коли значення змінюється — pulseRow ставить клас на 1.2с.
export default function BarometersList() {
  const resources = useGameStore((s) => s.resources);
  const prev = useRef(resources);
  const [pulseKey, setPulseKey] = useState(null);

  useEffect(() => {
    for (const b of BAROMETERS) {
      if (resources[b.key] !== prev.current[b.key]) {
        setPulseKey(b.key);
        const t = setTimeout(() => setPulseKey(null), 1200);
        prev.current = resources;
        return () => clearTimeout(t);
      }
    }
    prev.current = resources;
  }, [resources]);

  return (
    <div className="state-section">
      <div className="state-label">барометри</div>
      {BAROMETERS.map((b) => (
        <div
          key={b.key}
          className={`barometer-row${pulseKey === b.key ? ' pulse' : ''}`}
        >
          <span style={{ color: b.color }}>●</span>
          <span className="barometer-name">{b.name}</span>
          <span className="barometer-value" style={{ color: b.color }}>
            {resources[b.key] || 0}
          </span>
        </div>
      ))}
    </div>
  );
}
