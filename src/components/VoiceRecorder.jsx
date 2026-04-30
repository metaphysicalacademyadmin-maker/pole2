import { useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { showToast } from './GlobalToast.jsx';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// VoiceRecorder — записує голос для конкретного ключа рівня.
// Зберігає у localStorage як base64 dataURL (gameStore.voiceRecordings).
// MAX 30 секунд, обмеження для розміру localStorage.

export default function VoiceRecorder({ keyN, label }) {
  const saveRec = useGameStore((s) => s.saveVoiceRecording);
  const existing = useGameStore((s) => s.voiceRecordings[keyN]);

  const [state, setState] = useState('idle');     // idle | recording | done
  const [seconds, setSeconds] = useState(0);
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  async function start() {
    if (!navigator.mediaDevices) {
      showToast('браузер не підтримує запис', 'error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          saveRec(keyN, reader.result);
          showToast('голос збережено', 'success');
          setState('done');
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
      showToast('доступ до мікрофона відмовлений', 'error');
    }
  }

  function stop() {
    if (recRef.current) recRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setState('done');
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
      {(state === 'done' || existing) && (
        <div>
          <audio src={existing || ''} controls style={{ marginBottom: '8px', maxWidth: '100%' }} />
          <div>
            <button className="btn btn-ghost" onClick={() => { setState('idle'); }}>
              перезаписати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
