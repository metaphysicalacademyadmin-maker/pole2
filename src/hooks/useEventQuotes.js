import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { hasQuoteFor } from '../utils/event-quotes.js';

// Хук-детектор значущих подій → тригерить EventQuote.
// Слухає зміну state і визначає що змінилось:
//   - completedLevels grew → 'level-complete-N'
//   - petalProgress.xi_shadow.completed став true → 'shadow-petal-complete'
//   - currentQuest з'явився (uperше) → 'first-quest'
//   - archetypeCalibration.confirmed став істиною → 'archetype-confirmed'
//   - rodovid filledCount >= 5 → 'rodovid-substantial'
//   - rodovidExcluded.acknowledged зріс → 'excluded-acknowledged'
//   - cosmoApplication з'явився → 'cosmo-applied'
//
// Cooldown 30s між показами щоб не спамити.

const COOLDOWN_MS = 30_000;

export function useEventQuotes() {
  const state = useGameStore();
  const [eventKey, setEventKey] = useState(null);
  const last = useRef({
    completedLevels: state.completedLevels?.length || 0,
    shadowDone: !!state.petalProgress?.xi_shadow?.completed,
    hasQuest: !!state.currentQuest,
    archConfirmed: !!state.archetypeCalibration?.confirmed,
    rodovidFilled: Object.keys(state.rodovid || {}).length,
    excludedAck: (state.rodovidExcluded || []).filter((e) => e.acknowledged).length,
    cosmoApplied: !!state.cosmoApplication,
  });
  const lastShownAt = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastShownAt.current < COOLDOWN_MS) {
      // Ще оновлюємо лічильники але не показуємо
      updateLast(state, last.current);
      return;
    }

    const key = detectEvent(state, last.current);
    if (key && hasQuoteFor(key)) {
      setEventKey(key);
      lastShownAt.current = now;
    }
    updateLast(state, last.current);
  }, [
    state.completedLevels?.length,
    state.petalProgress?.xi_shadow?.completed,
    !!state.currentQuest,
    state.archetypeCalibration?.confirmed,
    Object.keys(state.rodovid || {}).length,
    (state.rodovidExcluded || []).filter((e) => e.acknowledged).length,
    !!state.cosmoApplication,
  ]);

  function dismiss() {
    setEventKey(null);
  }

  return { eventKey, dismiss };
}

function detectEvent(state, prev) {
  const newLevels = state.completedLevels?.length || 0;
  if (newLevels > prev.completedLevels) {
    const justCompleted = state.completedLevels[newLevels - 1];
    return `level-complete-${justCompleted}`;
  }

  const shadowDone = !!state.petalProgress?.xi_shadow?.completed;
  if (shadowDone && !prev.shadowDone) return 'shadow-petal-complete';

  const hasQuest = !!state.currentQuest;
  if (hasQuest && !prev.hasQuest) return 'first-quest';

  const archConfirmed = !!state.archetypeCalibration?.confirmed;
  if (archConfirmed && !prev.archConfirmed) return 'archetype-confirmed';

  const rodovidFilled = Object.keys(state.rodovid || {}).length;
  if (rodovidFilled >= 5 && prev.rodovidFilled < 5) return 'rodovid-substantial';

  const excludedAck = (state.rodovidExcluded || []).filter((e) => e.acknowledged).length;
  if (excludedAck > prev.excludedAck) return 'excluded-acknowledged';

  const cosmoApplied = !!state.cosmoApplication;
  if (cosmoApplied && !prev.cosmoApplied) return 'cosmo-applied';

  return null;
}

function updateLast(state, last) {
  last.completedLevels = state.completedLevels?.length || 0;
  last.shadowDone = !!state.petalProgress?.xi_shadow?.completed;
  last.hasQuest = !!state.currentQuest;
  last.archConfirmed = !!state.archetypeCalibration?.confirmed;
  last.rodovidFilled = Object.keys(state.rodovid || {}).length;
  last.excludedAck = (state.rodovidExcluded || []).filter((e) => e.acknowledged).length;
  last.cosmoApplied = !!state.cosmoApplication;
}
