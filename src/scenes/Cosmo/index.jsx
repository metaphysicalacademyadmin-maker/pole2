import { useGameStore } from '../../store/gameStore.js';
import { COSMO_LEVELS, currentCosmoLevel } from '../../data/cosmo-levels.js';
import LevelCard from './LevelCard.jsx';
import './styles.css';

// Гілка космоенергетики — 5 рівнів від "Гра" до "Ініційованого".
// Гравець бачить свій поточний рівень + наступний (відкритий або заблокований).

export default function Cosmo({ onClose }) {
  const state = useGameStore();
  const cosmoLevel = currentCosmoLevel(state);

  return (
    <main className="cosmo-overlay">
      <div className="cosmo-frame">
        <button type="button" className="cosmo-close" onClick={onClose}>← повернутись</button>
        <div className="cosmo-eyebrow">шлях метафізичної академії</div>
        <h1 className="cosmo-title">Гілка Космоенергетики</h1>
        <p className="cosmo-subtitle">
          Це не курс — це ієрархія готовності. Кожен рівень відкривається коли ти ДОЗРІВ — не коли заплатив.
          Гра — фільтр. Поле бачить хто ти і коли тобі час.
        </p>

        <div className="cosmo-current-banner">
          ти зараз: <strong style={{ color: COSMO_LEVELS[cosmoLevel].color }}>
            {COSMO_LEVELS[cosmoLevel].symbol} {COSMO_LEVELS[cosmoLevel].name}
          </strong>
        </div>

        <div className="cosmo-levels">
          {COSMO_LEVELS.map((lvl) => (
            <LevelCard key={lvl.n} level={lvl}
              state={state}
              isCurrent={lvl.n === cosmoLevel}
              isUnlocked={lvl.n <= cosmoLevel}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
