import { useGameStore } from '../../store/gameStore.js';

// 4 ознайомчі картки на рівні 1 — "Цікавий". Гравець розкриває їх по одній.
export default function IntroCards({ content, state }) {
  const seen = state.cosmoIntroSeen || [];
  const mark = useGameStore((s) => s.markCosmoIntroSeen);

  const allSeen = content.cards.every((c) => seen.includes(c.id));

  return (
    <div className="cl-intro">
      {content.cards.map((card) => {
        const isSeen = seen.includes(card.id);
        return (
          <div key={card.id} className={`cl-intro-card${isSeen ? ' seen' : ''}`}
            onClick={() => !isSeen && mark(card.id)}>
            <div className="cl-intro-symbol">{card.symbol}</div>
            <div className="cl-intro-card-title">{card.title}</div>
            {isSeen ? (
              <div className="cl-intro-text">{card.text}</div>
            ) : (
              <div className="cl-intro-tap">клікни щоб відкрити</div>
            )}
          </div>
        );
      })}
      {allSeen && (
        <div className="cl-intro-allseen">
          ✦ <em>Тепер ти знаєш базу. Наступний крок — дозріти до заявки.</em>
        </div>
      )}
    </div>
  );
}
