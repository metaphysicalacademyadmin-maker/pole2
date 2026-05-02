import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import './styles.css';

const PLACEHOLDER_HINTS = [
  'знайти своє коріння...',
  'зцілити серце...',
  'почути свій голос...',
  'зрозуміти що несу від роду...',
  'звільнити стару образу...',
  'дозволити собі бути...',
  'побачити правду без страху...',
  'повернутись до тіла...',
];

// Другий екран: тиша + намір. Локальний useState для tempIntention — це UI-стан
// поки гравець набирає текст. Зберігаємо у store тільки при натисканні «зайти».
export default function Entry() {
  const setIntention = useGameStore((s) => s.setIntention);
  const firstName = useProfileStore((s) => s.profile?.firstName);
  const [tempIntention, setTempIntention] = useState('');
  const [hintIdx, setHintIdx] = useState(0);

  // Циклічна зміна підказки-наміру — кожні 3.5с, поки гравець не почав вводити
  useEffect(() => {
    if (tempIntention) return;
    const t = setInterval(() => {
      setHintIdx((i) => (i + 1) % PLACEHOLDER_HINTS.length);
    }, 3500);
    return () => clearInterval(t);
  }, [tempIntention]);

  const canEnter = tempIntention.trim().length >= 2;

  function handleEnter() {
    if (!canEnter) return;
    setIntention(tempIntention.trim());
  }

  return (
    <main className="scene">
      <div className="entry-frame">
        <div className="entry-eyebrow">рівень 0 · вхід</div>
        <h1 className="entry-title">Тиша перед полем</h1>
        <p className="entry-instruction">
          {firstName ? `${firstName}, перш ніж увійти` : 'Перш ніж увійти'} — зроби три вдихи. Не шукай слів. Чекай, поки вони
          самі прийдуть.
        </p>
        <div className="breath-row">
          <div className="breath-orb">I</div>
          <div className="breath-orb">II</div>
          <div className="breath-orb">III</div>
        </div>
        <p className="entry-instruction" style={{ marginBottom: '1.25rem' }}>
          Запиши намір — одним реченням. Це те, що ти приходиш шукати.
        </p>
        <textarea
          className="intention-input"
          placeholder={PLACEHOLDER_HINTS[hintIdx]}
          maxLength={500}
          value={tempIntention}
          onChange={(e) => setTempIntention(e.target.value)}
        />
        <button
          type="button"
          className="entry-enter-btn"
          onClick={handleEnter}
          disabled={!canEnter}
        >
          <span>зайти у Поле</span>
          <span className="entry-enter-arrow">→</span>
        </button>
      </div>
    </main>
  );
}
