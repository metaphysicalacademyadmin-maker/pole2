import { useEffect, useState } from 'react';
import { playMantra, stopMantra, isMantraSupported, getMantraFrequency } from '../utils/solfeggio.js';

const STORAGE_KEY = 'pole2_mantra_enabled';

// Toggle Solfeggio мантри для пелюстки. Запам'ятовує preference у
// localStorage окремо від гри (бо аудіо-перевага не має ходити з сесією).
// При зміні petalId — переграє з новою частотою.
export default function MantraToggle({ petalId }) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === '1';
  });

  // Запускати/зупиняти при зміні enabled або petalId
  useEffect(() => {
    if (!enabled || !petalId) {
      stopMantra();
      return;
    }
    playMantra(petalId);
    return () => stopMantra();
  }, [enabled, petalId]);

  // Cleanup при unmount гарантовано
  useEffect(() => () => stopMantra(), []);

  if (!isMantraSupported()) return null;

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0'); } catch {}
  }

  const freq = petalId ? getMantraFrequency(petalId) : 528;

  return (
    <button type="button"
      className={`mantra-toggle${enabled ? ' is-on' : ''}`}
      onClick={toggle}
      aria-label={enabled ? `Вимкнути мантру (${freq} Hz)` : `Увімкнути мантру (${freq} Hz)`}
      title={enabled ? `мантра: ${freq} Hz · клік щоб вимкнути` : `мантра: ${freq} Hz · клік щоб увімкнути`}>
      <span className="mantra-toggle-icon">{enabled ? '♪' : '♪̸'}</span>
      <span className="mantra-toggle-freq">{freq}</span>
    </button>
  );
}
