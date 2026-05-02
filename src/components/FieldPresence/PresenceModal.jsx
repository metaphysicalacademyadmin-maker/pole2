import { useEffect, useState } from 'react';
import GameModal from '../GameModal.jsx';
import { CHAKRAS } from '../../data/chakras.js';
import { getFieldPresence, peersAtLevel, msUntilNextRefresh } from '../../utils/presence.js';
import { useGameStore } from '../../store/gameStore.js';
import './styles.css';

// Модалка з діаграмою присутності — 7 стовпчиків (рівні 1-7).
// Кольори стовпчиків — кольори чакр відповідного рівня.
export default function PresenceModal({ onClose }) {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const [presence, setPresence] = useState(() => getFieldPresence());
  const [refreshIn, setRefreshIn] = useState(() => msUntilNextRefresh());

  useEffect(() => {
    const t = setInterval(() => {
      setPresence(getFieldPresence());
      setRefreshIn(msUntilNextRefresh());
    }, 30_000);
    return () => clearInterval(t);
  }, []);

  const max = Math.max(1, ...presence.byLevel);
  const chakras = [...CHAKRAS].sort((a, b) => a.levelN - b.levelN);
  const peers = peersAtLevel(presence, currentLevel);

  return (
    <GameModal open onClose={onClose} title="Присутність у Полі">
      <div className="fp-eyebrow">👥 Хто зараз тут</div>
      <div className="fp-headline">
        <span className="fp-headline__num">{presence.total}</span> людей у Полі
      </div>
      <p className="fp-sub">
        {presence.source === 'real'
          ? 'дані щойно з поля'
          : 'оцінка поля — анонімно, без імен'}
      </p>

      <div className="fp-chart" role="img" aria-label="розподіл по рівнях">
        {chakras.map((ch) => {
          const count = presence.byLevel[ch.levelN - 1] || 0;
          const heightPct = Math.max(2, (count / max) * 100);
          const isCurrent = ch.levelN === currentLevel;
          return (
            <div key={ch.id} className={`fp-bar ${isCurrent ? 'is-current' : ''}`}>
              <span className="fp-bar__count">{count}</span>
              <div className="fp-bar__rect"
                style={{
                  height: `${heightPct}%`,
                  background: `linear-gradient(180deg, ${ch.color}, ${ch.colorDeep})`,
                  '--bar-glow': `${ch.color}66`,
                }} />
            </div>
          );
        })}
      </div>
      <div className="fp-labels">
        {chakras.map((ch) => (
          <div key={ch.id} className={`fp-label ${ch.levelN === currentLevel ? 'is-current' : ''}`}>
            {ch.levelN}
          </div>
        ))}
      </div>

      {currentLevel >= 1 && currentLevel <= 7 && (
        <div className="fp-peers">
          ти на <span className="fp-peers__num">рівні {currentLevel}</span> —{' '}
          {peers === 0
            ? 'і поки сам тут'
            : <>поряд ще <span className="fp-peers__num">{peers}</span> {plural(peers, 'людина', 'люди', 'людей')}</>}
        </div>
      )}

      <p className="fp-disclaimer">
        {presence.source === 'real'
          ? 'оновлюється у реальному часі · без імен і відповідей'
          : `орієнтовна оцінка · оновиться через ~${Math.round(refreshIn / 60_000)} хв`}
      </p>
    </GameModal>
  );
}

function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
