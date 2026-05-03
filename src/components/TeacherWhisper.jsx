import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { findActiveTrigger } from '../utils/teacher-triggers.js';
import TeacherModal from './Teacher/TeacherModal.jsx';

// Маленька floating-плашка яка з'являється у тригерних моментах.
// Shows once per trigger per 24h. При кліку відкриває TeacherModal
// з заздалегідь обраним topic. Можна закрити (markTeacherWhisper —
// зберігає що показалось, не повторюємо).
export default function TeacherWhisper() {
  const state = useGameStore();
  const markWhisper = useGameStore((s) => s.markTeacherWhisper);
  const [trigger, setTrigger] = useState(null);
  const [modalTopic, setModalTopic] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  // Перевіряємо тригер при кожному значущому update state
  // (resources, petalProgress, currentQuest)
  useEffect(() => {
    if (dismissed) return;
    const t = findActiveTrigger(state, state.teacherWhisperHistory || {});
    if (t && (!trigger || trigger.id !== t.id)) {
      setTrigger(t);
    } else if (!t && trigger) {
      // Trigger більше не активний — ховаємо
      setTrigger(null);
    }
  }, [state.resources, state.petalProgress, state.currentQuest, state.teacherWhisperHistory, dismissed, trigger, state]);

  if (!trigger || dismissed) return null;

  function handleOpen() {
    markWhisper(trigger.id);
    setModalTopic(trigger.topicId);
  }

  function handleClose() {
    markWhisper(trigger.id);
    setDismissed(true);
  }

  return (
    <>
      <div className="tw-whisper" role="status" aria-live="polite">
        <button type="button" className="tw-whisper-close"
          onClick={handleClose} aria-label="Закрити шепіт">×</button>
        <div className="tw-whisper-icon">◯</div>
        <div className="tw-whisper-body">
          <div className="tw-whisper-name">учитель поля</div>
          <div className="tw-whisper-text">{trigger.text}</div>
          <button type="button" className="tw-whisper-cta" onClick={handleOpen}>
            почути більше →
          </button>
        </div>
      </div>
      {modalTopic && (
        <TeacherModal defaultTopicId={modalTopic}
          onClose={() => { setModalTopic(null); setDismissed(true); }} />
      )}
    </>
  );
}
