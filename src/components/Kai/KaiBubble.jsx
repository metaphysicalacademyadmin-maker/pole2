import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import { pickLine, personalizeLine } from './lines.js';
import './kai.css';

// Floating-bubble Кая в нижньому правому куті.
// Кай реагує на 15+ ключових моментів: кастоми, тінь, ключі, snake-bite,
// дзеркало тіні, криза, архетип, спеціалізація, аура, практика, streak,
// канал, партнерство, ранок/вечір.
// При trust > 7 зрідка вставляє "intimate" репліку — наче з пам'яті.

const TRIGGER_BY_TAG = {
  'ключ': 'after_key',
  'розстановка': 'after_constellation',
  'архетип': null,                    // вирішується нижче за текстом
  'тінь': null,                       // shadow / crisis / snake — за текстом
  'тінь-дзеркало': 'shadow_mirror_seen',
  'практика': 'practice_completed',
  'ритуал': null,                     // ранок або вечір — за текстом
  'аура': null,                       // тільки якщо delta > 0
  'шлях': null,                       // partnership / channel / specialization
};

const INTIMATE_THRESHOLD = 7;
const INTIMATE_CHANCE = 4;            // 1 з 4 (~25%) при високому trust

export default function KaiBubble() {
  const cellAnswers = useGameStore((s) => s.cellAnswers);
  const journal = useGameStore((s) => s.journal);
  const kaiState = useGameStore((s) => s.kaiState);
  const bumpKaiTrust = useGameStore((s) => s.bumpKaiTrust);
  const setKaiMood = useGameStore((s) => s.setKaiMood);
  const firstName = useProfileStore((s) => s.profile?.firstName);

  const [line, setLine] = useState(null);
  const [open, setOpen] = useState(false);
  const lastJournalTs = useRef(0);

  // Реакція на свіжу клітинку-відповідь
  useEffect(() => {
    const list = Object.values(cellAnswers);
    if (list.length === 0) return;
    const last = list.reduce((a, b) => (a.ts > b.ts ? a : b));
    if (Date.now() - last.ts > 3000) return;

    let category;
    if (last.customText) { category = 'custom_answer'; bumpKaiTrust(0.5); }
    else if (last.depth === 'shadow') { category = 'shadow_caught'; bumpKaiTrust(0.7); }
    else if (last.depth === 'deep') { category = 'deep_caught'; bumpKaiTrust(0.3); }

    if (category) speak(category, last.ts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellAnswers]);

  // Реакція на journal events — ключі, snake, shadow-mirror, archetype, etc.
  useEffect(() => {
    const lastEntry = journal[journal.length - 1];
    if (!lastEntry) return;
    if (Date.now() - lastEntry.ts > 3000) return;
    if (lastEntry.ts <= lastJournalTs.current) return;
    lastJournalTs.current = lastEntry.ts;

    const cat = mapJournalToCategory(lastEntry);
    if (cat) speak(cat, lastEntry.ts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journal]);

  function speak(category, seed) {
    // Intimate varia для високого trust (детермінована вибірка)
    let pickedCat = category;
    if (kaiState?.trust >= INTIMATE_THRESHOLD && (Math.abs(seed) % INTIMATE_CHANCE) === 0) {
      pickedCat = 'intimate_high_trust';
    }
    const picked = personalizeLine(pickLine(pickedCat, seed), firstName, seed);
    if (!picked) return;
    setLine(picked);
    setKaiMood(picked.mood);
    setOpen(true);
    const t = setTimeout(() => setOpen(false), 8000);
    return () => clearTimeout(t);
  }

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

// Mapping journal entry → Kai trigger category. Деякі теги розрізнюються
// за текстом (тінь — це snake/crisis/shadow-mirror — все одне теж).
function mapJournalToCategory(entry) {
  const explicit = TRIGGER_BY_TAG[entry.tag];
  if (explicit) return explicit;
  const t = (entry.text || '').toLowerCase();
  if (entry.tag === 'тінь') {
    if (t.includes('🐍') || t.includes('snake') || t.includes('тіньова зустріч')) return 'snake_bite';
    if (t.includes('криза')) return 'crisis_acknowledged';
    if (t.includes('точка перевороту')) return 'crisis_acknowledged';
  }
  if (entry.tag === 'архетип') {
    if (t.includes('трансформація')) return 'archetype_transformed';
    if (t.includes('калібровка')) return 'archetype_confirmed';
    if (t.includes('спеціалізація')) return 'specialization_chosen';
  }
  if (entry.tag === 'ритуал') {
    if (t.includes('🌙') || t.includes('вечір')) return 'evening_ritual';
    if (t.includes('🌅') || t.includes('ранк')) return 'morning_ritual';
  }
  if (entry.tag === 'аура') {
    // Лише якщо позитивна Δ — звертати увагу
    const m = t.match(/\(([+-]?\d+)\)/);
    if (m && parseInt(m[1], 10) > 0) return 'aura_growth';
  }
  if (entry.tag === 'шлях') {
    if (t.includes('партнерство')) return 'partnership_activated';
    if (t.includes('сертифікат каналу')) return 'channel_certified';
    if (t.includes('ініціація')) return 'channel_certified';
  }
  return null;
}
