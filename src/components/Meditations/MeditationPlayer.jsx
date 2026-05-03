import { useEffect, useRef, useState } from 'react';
import {
  categoryMeta,
  formatDuration,
  trackMeditationStart,
  trackMeditationComplete,
} from '../../utils/meditations.js';
import { showToast } from '../GlobalToast.jsx';
import BreathCircle from '../Ritual/BreathCircle.jsx';

// Простий аудіо-плеєр для медитації. Завантажує audioUrl, показує
// progress + play/pause + close.
export default function MeditationPlayer({ meditation, onClose, onAllClose }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(meditation.durationSec || 0);
  const completedRef = useRef(false);
  const meta = categoryMeta(meditation.category);

  useEffect(() => {
    trackMeditationStart(meditation.id);
    const audio = audioRef.current;
    if (!audio) return;

    function onTime() { setCurrent(audio.currentTime); }
    function onMeta() { if (!isNaN(audio.duration)) setDuration(audio.duration); }
    function onPlay() { setPlaying(true); }
    function onPause() { setPlaying(false); }
    function onEnd() {
      setPlaying(false);
      if (!completedRef.current) {
        completedRef.current = true;
        trackMeditationComplete(meditation.id, audio.duration || 0);
        showToast('✦ медитацію завершено', 'success');
      }
    }
    function onErr() {
      showToast('помилка завантаження аудіо', 'warning');
    }

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onErr);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onErr);
    };
  }, [meditation.id]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => showToast('браузер не дозволив автоплей', 'warning'));
    } else {
      audio.pause();
    }
  }

  function seek(e) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
  }

  const progress = duration > 0 ? (current / duration) : 0;

  return (
    <div className="med-overlay med-player-overlay" style={{
      background: `radial-gradient(ellipse at center, ${meta.color}22, rgba(8,4,16,0.97) 70%)`,
    }}>
      <div className="med-player">
        <button type="button" className="med-close" onClick={onClose}>← інші медитації</button>

        <div className="med-player__cover" style={meditation.coverUrl
          ? { backgroundImage: `url(${meditation.coverUrl})` }
          : { background: `radial-gradient(circle, ${meta.color}, ${meta.color}33 70%)` }}>
          {!meditation.coverUrl && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <BreathCircle size={140} hue={meta.color === '#a8c898' ? 'gold' : 'violet'} />
            </div>
          )}
        </div>

        <div className="med-player__cat" style={{ color: meta.color }}>
          {meta.icon} {meta.label}
        </div>
        <h2 className="med-player__title">{meditation.title}</h2>
        {meditation.teacher && (
          <div className="med-player__teacher">— {meditation.teacher}</div>
        )}
        {meditation.description && (
          <p className="med-player__desc">{meditation.description}</p>
        )}

        <audio ref={audioRef} src={meditation.audioUrl} preload="metadata" />

        <div className="med-player__progress" onClick={seek}>
          <div className="med-player__progress-fill"
            style={{ width: `${progress * 100}%`, background: meta.color }} />
        </div>
        <div className="med-player__times">
          <span>{formatDuration(current)}</span>
          <span>{formatDuration(duration)}</span>
        </div>

        <button type="button" className="med-player__play" onClick={toggle}
          style={{ background: meta.color }}>
          {playing ? '⏸ пауза' : '▶ слухати'}
        </button>

        {meditation.transcript && (
          <details className="med-player__transcript">
            <summary>текст медитації</summary>
            <div>{meditation.transcript}</div>
          </details>
        )}

        <button type="button" className="med-player__exit" onClick={onAllClose}>
          вийти з відділу медитацій
        </button>
      </div>
    </div>
  );
}
