import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import Mandala from './Mandala.jsx';
import BodyMapDisplay from '../../components/BodyMap/BodyMapDisplay.jsx';
import ContactsBlock from '../../components/Contacts/ContactsBlock.jsx';
import SoulBook from '../../components/SoulBook/index.jsx';
import Circles from '../../components/Circles/index.jsx';
import './styles.css';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// Фінальний екран: «Карта Втілення». Показує намір, ключі, статистику.
// Гравець може почати новий шлях (archiveAndReset) або зберегти карту.
export default function Final({ openCosmo, openAdmin, openPartnership }) {
  const intention = useGameStore((s) => s.intention);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const levelKeys = useGameStore((s) => s.levelKeys);
  const journal = useGameStore((s) => s.journal);
  const cellAnswers = useGameStore((s) => s.cellAnswers);
  const archiveAndReset = useGameStore((s) => s.archiveAndReset);
  const evolutionEcho = useGameStore((s) => s.evolutionEcho);
  const constellations = useGameStore((s) => s.constellations);
  const practiceCompletions = useGameStore((s) => s.practiceCompletions);
  const bodyMap = useGameStore((s) => s.bodyMap);
  const channelsUnlocked = useGameStore((s) => s.channelsUnlocked);
  const firstName = useProfileStore((s) => s.profile?.firstName);
  const activatePetals = useGameStore((s) => s.activatePetals);
  const [bookOpen, setBookOpen] = useState(false);

  const cellsAnswered = Object.keys(cellAnswers).length;
  const orderedKeys = completedLevels.map((n) => ({ n, text: levelKeys[n] }));

  function handleNew() {
    if (window.confirm('Почати новий шлях? Поточну сесію буде збережено в історії.')) {
      archiveAndReset('completed');
    }
  }

  return (
    <main className="scene">
      <div className="final-frame">
        <div className="final-meta">шлях завершено</div>
        <h1 className="final-title">
          Карта <em>Втілення</em>
        </h1>
        <div className="final-sub">те, що залишилось у тілі</div>
        <div className="final-attribution">— і у пам'яті поля</div>

        {intention && (
          <div className="final-intention">
            <div className="final-intention-label">намір з якого почалось</div>
            «{intention}»
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Mandala completedLevels={completedLevels} levelKeys={levelKeys} />
          {Object.keys(bodyMap).length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: SYS, fontSize: '11px', fontWeight: 700, letterSpacing: '4px', color: '#f0c574', textTransform: 'uppercase', marginBottom: '8px' }}>
                карта тіла
              </div>
              <BodyMapDisplay size={150} />
            </div>
          )}
        </div>

        {evolutionEcho && (
          <div style={{
            background: 'rgba(192,174,220,0.08)', border: '1px solid #c9b3e8',
            borderRadius: '12px', padding: '16px 20px', marginBottom: '24px',
          }}>
            <div style={{ fontFamily: SYS, fontSize: '11px', fontWeight: 700, letterSpacing: '4px', color: '#c9b3e8', textTransform: 'uppercase', marginBottom: '8px' }}>
              ехо попередньої сесії
            </div>
            <div style={{ fontFamily: SYS, fontStyle: 'italic', fontSize: '14px', color: '#fff7e0', opacity: 0.9 }}>
              Раніше ти приходив з наміром: «{evolutionEcho.previousIntention}». Пройшов {evolutionEcho.previousLevelsCompleted} рівнів.
            </div>
          </div>
        )}

        {(practiceCompletions.length > 0 || channelsUnlocked.length > 0 || Object.keys(constellations).length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {practiceCompletions.length > 0 && <SubStat n={practiceCompletions.length} label="практик" />}
            {channelsUnlocked.length > 0 && <SubStat n={channelsUnlocked.length} label="каналів" />}
            {Object.keys(constellations).length > 0 && <SubStat n={Object.keys(constellations).length} label="розстановок" />}
          </div>
        )}

        <div className="final-stats">
          <div className="final-stat">
            <div className="final-stat-num">{completedLevels.length}</div>
            <div className="final-stat-label">рівнів</div>
          </div>
          <div className="final-stat">
            <div className="final-stat-num">{orderedKeys.length}</div>
            <div className="final-stat-label">ключів</div>
          </div>
          <div className="final-stat">
            <div className="final-stat-num">{cellsAnswered}</div>
            <div className="final-stat-label">клітинок</div>
          </div>
          <div className="final-stat">
            <div className="final-stat-num">{journal.length}</div>
            <div className="final-stat-label">записів</div>
          </div>
        </div>

        {orderedKeys.length > 0 && (
          <>
            <div className="final-section-tag">
              {firstName ? `сім слів — твоїх, ${firstName}` : 'сім слів — твоїх'}
            </div>
            <div className="final-keys">
              {orderedKeys.map(({ n, text }) => (
                <div key={n} className="final-key">«{text}»</div>
              ))}
            </div>
          </>
        )}

        <div className="final-quote-stage">
          <p className="final-quote-text">
            {firstName ? `${firstName}, ти прийшов, щоб бачити поле.` : 'Ти прийшов, щоб бачити поле.'}
            <br />
            Тепер <em>ти і є поле</em>.
          </p>
          <div className="final-quote-attr">арбітр-свідок</div>
        </div>

        <div className="final-actions" style={{ gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button type="button" className="btn btn-primary" onClick={() => setBookOpen(true)}>
            📜 Книга Душі
          </button>
          <button type="button" className="btn btn-primary" onClick={activatePetals}>
            ✺ продовжити у 9 пелюсток
          </button>
          {openCosmo && (
            <button type="button" className="btn btn-primary" onClick={openCosmo}>
              🔮 космоенергетика
            </button>
          )}
          {openPartnership && (
            <button type="button" className="btn btn-primary" onClick={openPartnership}>
              👯 партнерство
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={handleNew}>
            почати новий шлях
          </button>
        </div>

        {bookOpen && <SoulBook onClose={() => setBookOpen(false)} />}

        <Circles />

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(232,196,118,0.2)' }}>
          <ContactsBlock title="Знайди нас" />
        </div>
      </div>
    </main>
  );
}

function SubStat({ n, label }) {
  return (
    <div style={{
      padding: '12px',
      background: 'rgba(20, 14, 30, 0.7)',
      borderRadius: '10px',
      border: '1px solid rgba(232,196,118,0.2)',
      textAlign: 'center',
    }}>
      <div style={{ fontFamily: SYS, fontSize: '24px', color: '#f0c574', fontWeight: 700 }}>{n}</div>
      <div style={{ fontFamily: SYS, fontSize: '10px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#c8bca8', marginTop: '4px' }}>{label}</div>
    </div>
  );
}
