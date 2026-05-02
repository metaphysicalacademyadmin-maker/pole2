import { useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { showToast } from './GlobalToast.jsx';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// VoiceRecorder — записує голос для конкретного ключа рівня.
// Зберігає у localStorage як base64 dataURL (gameStore.voiceRecordings).
// MAX 30 секунд — обмеження для розміру localStorage.
//
// Mobile-friendly:
//  - webm не підтримує Safari iOS — пробуємо mp4/ogg/«за замовчуванням»
//  - перезапис правильно очищає попередній запис через clearVoiceRecording

// Обираємо MIME-тип, який підтримує цей браузер. iOS Safari у нижчих версіях
// підтримує лише `audio/mp4`, новіший Safari + Chrome — `audio/webm`.
function pickMimeType() {
  if (typeof MediaRecorder === 'undefined') return null;
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4;codecs=mp4a.40.2',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  for (const t of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(t)) return t;
    } catch { /* ignore */ }
  }
  return ''; // без явного типу — браузер обере дефолт
}

export default function VoiceRecorder({ keyN, label }) {
  const saveRec = useGameStore((s) => s.saveVoiceRecording);
  const clearRec = useGameStore((s) => s.clearVoiceRecording);
  const existing = useGameStore((s) => s.voiceRecordings[keyN]);

  const [state, setState] = useState('idle');     // idle | recording | done
  const [seconds, setSeconds] = useState(0);
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  async function start() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      showToast('браузер не підтримує запис голосу', 'error');
      return;
    }
    if (typeof MediaRecorder === 'undefined') {
      showToast('запис не підтримується у цьому браузері', 'error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blobType = rec.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: blobType });
        const reader = new FileReader();
        reader.onload = () => {
          saveRec(keyN, reader.result);
          showToast('голос збережено', 'success');
          setState('done');
        };
        reader.onerror = () => {
          showToast('не вдалось зберегти запис', 'error');
          setState('idle');
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recRef.current = rec;
      setState('recording');
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 29) { stop(); return 30; }
          return s + 1;
        });
      }, 1000);
    } catch (e) {
      const msg = e?.name === 'NotAllowedError'
        ? 'доступ до мікрофона відмовлений'
        : 'не вдалось почати запис на цьому пристрої';
      showToast(msg, 'error');
    }
  }

  function stop() {
    if (recRef.current && recRef.current.state !== 'inactive') {
      try { recRef.current.stop(); } catch { /* ignore */ }
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function rerecord() {
    // Очищуємо збережений запис у store і запускаємо новий
    clearRec(keyN);
    setState('idle');
    setSeconds(0);
  }

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      {label && (
        <div style={{ fontFamily: SYS, fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: '#f0c574', marginBottom: '8px', textTransform: 'uppercase' }}>
          {label}
        </div>
      )}
      {state === 'idle' && !existing && (
        <button className="btn btn-ghost" onClick={start}>🎙 прокажи цей ключ вголос</button>
      )}
      {state === 'recording' && (
        <button className="btn btn-primary" onClick={stop}>
          ⏺ запис · {seconds}с · клікни щоб зупинити
        </button>
      )}
      {(state === 'done' || existing) && state !== 'recording' && (
        <div>
          <audio src={existing || ''} controls style={{ marginBottom: '8px', maxWidth: '100%' }} />
          <div>
            <button className="btn btn-ghost" onClick={rerecord}>
              🔄 перезаписати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
