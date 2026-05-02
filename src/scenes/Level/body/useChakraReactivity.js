import { useEffect, useRef } from 'react';
import { CHAKRAS } from '../../../data/chakras.js';

const RITUAL_CASCADE_MS = 280;
const FLASH_HOLD_MS = 1200;

// Хук слухає зміни у полі стану і триггерить flash-чакри для подій,
// які бекенд store не розсилає через flashChakraId/flashCounter.
//
// - completePractice → flash чакри рівня практики
// - activateChannel → flash anahata (4) — серце як центр каналу
// - completeDailyCheckIn / completeEveningRitual → каскад знизу вгору (1→7)
//
// setFlashingId — локальний setter з BodyHologram (single chakra at a time).
export function useChakraReactivity({ practiceCompletions, channelsActive,
                                      dailyCheckIns, setFlashingId }) {
  const prev = useRef({
    practices: practiceCompletions?.length || 0,
    channels: channelsActive?.length || 0,
    rituals: dailyCheckIns?.length || 0,
    cascadeTimer: null,
  });

  // Practice → flash specific chakra
  useEffect(() => {
    const cur = practiceCompletions?.length || 0;
    if (cur > prev.current.practices) {
      const last = practiceCompletions[practiceCompletions.length - 1];
      const ch = CHAKRAS.find((c) => c.levelN === last.levelN);
      if (ch) flashOnce(setFlashingId, ch.id);
    }
    prev.current.practices = cur;
  }, [practiceCompletions, setFlashingId]);

  // Channel activated → flash anahata (heart)
  useEffect(() => {
    const cur = channelsActive?.length || 0;
    if (cur > prev.current.channels) {
      flashOnce(setFlashingId, 'anahata');
    }
    prev.current.channels = cur;
  }, [channelsActive, setFlashingId]);

  // Ritual → cascade flash 1→7
  useEffect(() => {
    const cur = dailyCheckIns?.length || 0;
    if (cur > prev.current.rituals) {
      runCascade(setFlashingId, prev.current);
    }
    prev.current.rituals = cur;
    return () => {
      if (prev.current.cascadeTimer) {
        clearTimeout(prev.current.cascadeTimer);
        prev.current.cascadeTimer = null;
      }
    };
  }, [dailyCheckIns, setFlashingId]);
}

function flashOnce(setFlashingId, id) {
  setFlashingId(id);
  setTimeout(() => setFlashingId((cur) => (cur === id ? null : cur)), FLASH_HOLD_MS);
}

function runCascade(setFlashingId, ref) {
  let i = 0;
  const ordered = [...CHAKRAS].sort((a, b) => a.levelN - b.levelN);
  const step = () => {
    if (i >= ordered.length) {
      setFlashingId(null);
      ref.cascadeTimer = null;
      return;
    }
    setFlashingId(ordered[i].id);
    i += 1;
    ref.cascadeTimer = setTimeout(step, RITUAL_CASCADE_MS);
  };
  step();
}
