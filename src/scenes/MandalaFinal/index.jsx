import { useGameStore } from '../../store/gameStore.js';
import { PETALS } from '../../data/petals.js';
import SacredGeometry from '../Final/SacredGeometry.jsx';
import './styles.css';

const VIEW = 540;
const CENTER = 270;
const PETAL_R = 200;
const PETAL_INNER = 80;

// Церемоніальний екран — з'являється коли гравець завершив усі 12 пелюсток.
// Артефакт «Карта Розквіту» — мандала з усіма 12 пелюстками золотою кольорою.
export default function MandalaFinal({ openCosmo }) {
  const acknowledge = useGameStore((s) => s.acknowledgeMandalaFinal);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const channelsUnlocked = useGameStore((s) => s.channelsUnlocked);

  function handleContinueToCosmo() {
    acknowledge();
    if (openCosmo) openCosmo();
  }

  function handleStayInMandala() {
    acknowledge();
  }

  return (
    <main className="scene mf-scene" role="region" aria-label="Квітка Життя — друга спіраль завершено">
      <div className="mf-frame">
        <div className="mf-eyebrow">друга спіраль · завершено</div>
        <h1 className="mf-title">Квітка <em>Життя</em></h1>
        <div className="mf-sub">12 сфер життя — розкриті</div>
        <div className="mf-attr">— Карта Розквіту</div>

        <div className="mf-mandala-wrap">
          <CompleteMandala />
        </div>

        <div className="mf-summary">
          <SummaryItem icon="🔻" n={completedLevels.length} total={7} label="ключів піраміди" />
          <SummaryItem icon="✺" n={12} total={12} label="пелюсток розквіту" />
          <SummaryItem icon="🔮" n={(channelsUnlocked || []).length} total={11} label="каналів космо" />
        </div>

        <blockquote className="mf-quote">
          «Ти прийшов знайти себе.<br />
          Ти знайшов — і розквітнув.<br />
          Тепер — час стати <em>провідником</em>.»
        </blockquote>
        <div className="mf-quote-attr">— Арбітр свідчить</div>

        <div className="mf-actions">
          <button type="button" className="mf-btn-primary" onClick={handleContinueToCosmo}>
            🔮 продовжити до космоенергетики
          </button>
          <button type="button" className="mf-btn-ghost" onClick={handleStayInMandala}>
            ↩ повернутись до мандали
          </button>
        </div>

        <div className="mf-foot">
          Третя спіраль — 11 каналів · стати інструментом Поля
        </div>
      </div>
    </main>
  );
}

function SummaryItem({ icon, n, total, label }) {
  return (
    <div className="mf-summary__item">
      <div className="mf-summary__icon">{icon}</div>
      <div className="mf-summary__num"><strong>{n}</strong>/{total}</div>
      <div className="mf-summary__label">{label}</div>
    </div>
  );
}

function CompleteMandala() {
  const total = PETALS.length;
  return (
    <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="mf-mandala-svg">
      <circle cx={CENTER} cy={CENTER} r={PETAL_R + 14} fill="none"
        stroke="rgba(232,196,118,0.25)" strokeWidth="0.6" />
      <circle cx={CENTER} cy={CENTER} r={PETAL_R + 28} fill="none"
        stroke="rgba(232,196,118,0.12)" strokeWidth="0.4" strokeDasharray="3 5" />

      {PETALS.map((petal, i) => {
        const angle = (i / total) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const startX = CENTER + Math.cos(rad) * PETAL_INNER;
        const startY = CENTER + Math.sin(rad) * PETAL_INNER;
        const tipX = CENTER + Math.cos(rad) * PETAL_R;
        const tipY = CENTER + Math.sin(rad) * PETAL_R;
        const px = CENTER + Math.cos(rad) * ((PETAL_R + PETAL_INNER) / 2);
        const py = CENTER + Math.sin(rad) * ((PETAL_R + PETAL_INNER) / 2);
        const perpX = Math.cos(rad + Math.PI / 2);
        const perpY = Math.sin(rad + Math.PI / 2);
        const halfW = 26;
        const c1x = px + perpX * halfW, c1y = py + perpY * halfW;
        const c2x = px - perpX * halfW, c2y = py - perpY * halfW;
        const path = `M ${startX} ${startY}
          Q ${c1x} ${c1y} ${tipX} ${tipY}
          Q ${c2x} ${c2y} ${startX} ${startY} Z`;
        return (
          <g key={petal.id} className="mf-petal-glow">
            <path d={path} fill={petal.color} fillOpacity="0.85"
              stroke={petal.color} strokeWidth="1.4"
              filter="url(#mf-glow)" />
            <text x={px} y={py - 2} textAnchor="middle"
              fontSize="13" fontWeight="700" fill="#04020c"
              style={{ userSelect: 'none', pointerEvents: 'none' }}>
              {petal.symbol}
            </text>
            <text x={px} y={py + 13} textAnchor="middle"
              fontSize="9" fill="#04020c" fontWeight="600"
              style={{ userSelect: 'none', pointerEvents: 'none' }}>
              {petal.name}
            </text>
          </g>
        );
      })}

      <defs>
        <filter id="mf-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <SacredGeometry keysCount={12} cx={CENTER} cy={CENTER} />

      <circle cx={CENTER} cy={CENTER} r={PETAL_INNER - 6}
        fill="rgba(20, 14, 30, 0.95)"
        stroke="#f0c574" strokeWidth="1.6"
        style={{ filter: 'drop-shadow(0 0 18px rgba(232,196,118,0.7))' }} />
      <text x={CENTER} y={CENTER + 14} textAnchor="middle"
        fontSize="46" fill="#f0c574"
        fontFamily="Georgia, 'Times New Roman', serif">
        ✺
      </text>
    </svg>
  );
}
