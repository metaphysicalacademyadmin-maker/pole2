import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import { pickLine, personalizeLine } from './lines.js';
import './kai.css';

// Floating-bubble Кая в нижньому правому куті.
// Кай зʼявляється на ключових моментах і ховається через 8 секунд.
// Слухає зміни state.cellAnswers — реагує на свіжу відповідь.
export default function KaiBubble() {
  const cellAnswers = useGameStore((s) => s.cellAnswers);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const journal = useGameStore((s) => s.journal);
  const kaiState = useGameStore((s) => s.kaiState);
  const bumpKaiTrust = useGameStore((s) => s.bumpKaiTrust);
  const setKaiMood = useGameStore((s) => s.setKaiMood);
  const firstName = useProfileStore((s) => s.profile?.firstName);

  const [line, setLine] = useState(null);
  const [open, setOpen] = useState(false);

  // Реакція на свіжу відповідь: остання за ts.
  useEffect(() => {
    const list = Object.values(cellAnswers);
    if (list.length === 0) return;
    const last = list.reduce((a, b) => (a.ts > b.ts ? a : b));
    // Тільки якщо менше 3 секунд тому
    if (Date.now() - last.ts > 3000) return;

    let category;
    if (last.customText) { category = 'custom_answer'; bumpKaiTrust(0.5); }
    else if (last.depth === 'shadow') { category = 'shadow_caught'; bumpKaiTrust(0.7); }
    else if (last.depth === 'deep') { category = 'deep_caught'; bumpKaiTrust(0.3); }

    if (category) {
      const picked = personalizeLine(pickLine(category, last.ts), firstName, last.ts);
      if (picked) {
        setLine(picked);
        setKaiMood(picked.mood);
        setOpen(true);
        const t = setTimeout(() => setOpen(false), 8000);
        return () => clearTimeout(t);
      }
    }
  }, [cellAnswers, bumpKaiTrust, setKaiMood, firstName]);

  // Реакція на завершення рівня (ключ).
  useEffect(() => {
    const lastJournal = journal[journal.length - 1];
    if (!lastJournal) return;
    if (lastJournal.tag === 'ключ' && Date.now() - lastJournal.ts < 3000) {
      const picked = personalizeLine(pickLine('after_key', lastJournal.ts), firstName, lastJournal.ts);
      if (picked) {
        setLine(picked);
        setKaiMood(picked.mood);
        setOpen(true);
        const t = setTimeout(() => setOpen(false), 8000);
        return () => clearTimeout(t);
      }
    }
    if (lastJournal.tag === 'розстановка' && Date.now() - lastJournal.ts < 3000) {
      const picked = personalizeLine(pickLine('after_constellation', lastJournal.ts), firstName, lastJournal.ts);
      if (picked) { setLine(picked); setKaiMood(picked.mood); setOpen(true);
        const t = setTimeout(() => setOpen(false), 8000);
        return () => clearTimeout(t);
      }
    }
  }, [journal, setKaiMood, firstName]);

  return (
    <div className={`kai-bubble${open ? ' open' : ''}${line ? ` mood-${line.mood}` : ''}`}>
      <div className="kai-orb">К</div>
      {open && line && (
        <div className="kai-text">
          <div className="kai-name">Кай · довіра {Math.round(kaiState.trust * 10) / 10}</div>
          <div className="kai-line">{line.text}</div>
        </div>
      )}
    </div>
  );
}
