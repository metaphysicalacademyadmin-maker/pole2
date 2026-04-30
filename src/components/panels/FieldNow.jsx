import { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { calcIntegrity, fieldOverall } from '../../utils/integrity-calc.js';

// Бейдж у топбарі — клік відкриває SoulField.
export default function FieldNow({ onOpen }) {
  const state = useGameStore();
  const overall = useMemo(() => fieldOverall(calcIntegrity(state)), [state]);

  return (
    <button className="field-now" onClick={onOpen} type="button">
      <span className="field-now-icon">◯</span>
      <span className="field-now-label">поле</span>
      <span className="field-now-percent">{overall}%</span>
    </button>
  );
}
