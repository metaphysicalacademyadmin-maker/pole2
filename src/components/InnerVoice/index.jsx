import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import './styles.css';

// Голос Душі — sacred moment коли гравець записав voice OR пройшов рівень 5 (Голос).
// З'являється раз за сесію. Тиха pulsing modal без обличчя — лише цитата.
// Приймає лише "почув" — не вимагає відповіді.

const INNER_VOICE_LINES = [
  'Ти щойно сказав те, що чуло Поле — а ти ні. Послухай ще раз.',
  'Твій голос — це не звук. Це факт твого існування.',
  'Той, хто говорить чесно — народжується знову у мить мовлення.',
  'Слова, які ти випустив — повертаються змінними. Ти теж.',
  'Тіло сказало правду. Розум ще наздоганяє.',
];

export default function InnerVoice() {
  const journal = useGameStore((s) => s.journal);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [line, setLine] = useState('');

  useEffect(() => {
    if (shown) return;

    // Trigger: voice recording saved (tag 'ключ' з 'голосом' AБО рівень 5 завершено)
    const lastEntry = journal[journal.length - 1];
    const voiceJustSaved = lastEntry?.text?.includes('Голос Душі')
      || (lastEntry?.tag === 'ключ' && completedLevels.includes(5));
    const justFinishedVoice = completedLevels.includes(5)
      && lastEntry?.tag === 'ключ'
      && Date.now() - lastEntry.ts < 4000;

    if (voiceJustSaved || justFinishedVoice) {
      const seed = lastEntry.ts;
      setLine(INNER_VOICE_LINES[Math.abs(seed) % INNER_VOICE_LINES.length]);
      setTimeout(() => {
        setOpen(true);
        setShown(true);
      }, 2000);
    }
  }, [journal, completedLevels, shown]);

  if (!open) return null;

  return (
    <div className="iv-overlay" onClick={() => setOpen(false)}>
      <div className="iv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="iv-eyebrow">🌬 голос душі</div>
        <div className="iv-orb">
          <span className="iv-orb-inner" />
          <span className="iv-orb-pulse" />
        </div>
        <blockquote className="iv-text">«{line}»</blockquote>
        <button type="button" className="iv-close" onClick={() => setOpen(false)}>
          почув
        </button>
      </div>
    </div>
  );
}
