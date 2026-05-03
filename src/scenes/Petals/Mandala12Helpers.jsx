import PetalCooldownModal from '../../components/PetalCooldownModal.jsx';

// Маленькі helpers які тематично належать до Mandala12 але виносимо
// окремо щоб тримати головний файл < 300 рядків.

export function DailyFocusBanner({ card, petalName, color }) {
  if (!card || !petalName) return null;
  return (
    <div className="m12-focus-banner" style={{ borderColor: `${color}55` }}>
      <span className="m12-focus-icon">{card.symbol}</span>
      <span className="m12-focus-text">
        сьогодні поле підказує — <strong style={{ color }}>{petalName}</strong>
        <span className="m12-focus-hint">{card.hint}</span>
      </span>
    </div>
  );
}

export function PetalCooldownModalWrap({ pending, setPending, enterPetal }) {
  return (
    <PetalCooldownModal
      petalId={pending.petalId}
      petalName={pending.name}
      cooldown={pending.cooldown}
      onClose={() => setPending(null)}
      onProceed={() => {
        const id = pending.petalId;
        setPending(null);
        enterPetal(id);
      }} />
  );
}
