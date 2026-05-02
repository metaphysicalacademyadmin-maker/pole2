import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import Mandala from './Mandala.jsx';
import BodyMapDisplay from '../../components/BodyMap/BodyMapDisplay.jsx';
import ContactsBlock from '../../components/Contacts/ContactsBlock.jsx';
import SoulBook from '../../components/SoulBook/index.jsx';
import Circles from '../../components/Circles/index.jsx';
import FinalPresenceLine from '../../components/FieldPresence/FinalPresenceLine.jsx';
import { PETALS } from '../../data/petals.js';
import './styles.css';

// Фінальний екран: «Карта Втілення». Показує намір, ключі, статистику.
// Гравець може почати новий шлях (archiveAndReset) або зберегти карту.
export default function Final({ openCosmo, openAdmin, openPartnership, openCabinet, openGift }) {
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
  const petalProgress = useGameStore((s) => s.petalProgress) || {};
  const firstName = useProfileStore((s) => s.profile?.firstName);
  const activatePetals = useGameStore((s) => s.activatePetals);
  const [bookOpen, setBookOpen] = useState(false);

  const cellsAnswered = Object.keys(cellAnswers).length;
  const orderedKeys = completedLevels.map((n) => ({ n, text: levelKeys[n] }));

  // 4-та спіраль розкривається коли пройдено: 7 рівнів + 12 пелюсток + хоч 1 канал
  const allPetalsDone = PETALS.every((p) => petalProgress[p.id]?.completed);
  const fourthSpiralUnlocked =
    completedLevels.length >= 7 &&
    allPetalsDone &&
    (channelsUnlocked || []).length >= 1;

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

        <div className="final-mandala-row">
          <Mandala completedLevels={completedLevels} levelKeys={levelKeys} />
          {Object.keys(bodyMap).length > 0 && (
            <div className="final-body-map">
              <div className="final-body-map-label">карта тіла</div>
              <BodyMapDisplay size={150} />
            </div>
          )}
        </div>

        {evolutionEcho && (
          <div className="final-echo">
            <div className="final-echo-label">ехо попередньої сесії</div>
            <div className="final-echo-text">
              Раніше ти приходив з наміром: «{evolutionEcho.previousIntention}». Пройшов {evolutionEcho.previousLevelsCompleted} рівнів.
            </div>
          </div>
        )}

        {(practiceCompletions.length > 0 || channelsUnlocked.length > 0 || Object.keys(constellations).length > 0) && (
          <div className="final-substats">
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

        <FinalPresenceLine />

        {/* Hero CTA — Книга Душі (головний артефакт) */}
        <div className="final-hero-action">
          <button type="button" className="final-btn-hero" onClick={() => setBookOpen(true)}>
            <span className="final-hero-icon">📜</span>
            <span className="final-hero-content">
              <span className="final-hero-title">Книга Душі</span>
              <span className="final-hero-hint">забери з собою те, що проявилось</span>
            </span>
          </button>
        </div>

        {/* Secondary — наступні шляхи */}
        <div className="final-paths">
          <div className="final-paths-label">або продовжити шлях:</div>
          <div className="final-paths-row">
            <button type="button" className="final-btn-path" onClick={activatePetals}>
              <span>✺</span> 12 пелюсток
            </button>
            {openCosmo && (
              <button type="button" className="final-btn-path" onClick={openCosmo}>
                <span>🔮</span> космоенергетика
              </button>
            )}
            {openPartnership && (
              <button type="button" className="final-btn-path" onClick={openPartnership}>
                <span>👯</span> партнерство
              </button>
            )}
            {fourthSpiralUnlocked && openGift && (
              <button type="button" className="final-btn-path final-btn-gift" onClick={openGift}>
                <span>✨</span> дар у світ</button>
            )}
          </div>
        </div>

        {/* Reset — destructive */}
        <div className="final-reset">
          <button type="button" className="final-btn-reset" onClick={handleNew}>
            ↻ почати новий шлях
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
    <div className="final-substat">
      <div className="final-substat-num">{n}</div>
      <div className="final-substat-label">{label}</div>
    </div>
  );
}
