import { useGameStore } from '../../store/gameStore.js';
import { SPECIALIZATIONS } from '../../data/specializations.js';
import './styles.css';

// Модалка вибору спеціалізації — після рівня 4 (Серце).
// 5 типів шляху: Цілитель, Воїн Світла, Провідник Душ, Хранитель Роду, Творець Реальності.

export default function SpecializationChoice() {
  const open = useGameStore((s) => s.specializationOpen);
  const existing = useGameStore((s) => s.specialization);
  const activeModal = useGameStore((s) => s.activeModal);
  const setSpec = useGameStore((s) => s.setSpecialization);
  const close = useGameStore((s) => s.closeSpecializationChoice);

  if (!open || existing) return null;
  if (activeModal?.id !== 'specialization') return null;

  return (
    <div className="spec-overlay">
      <div className="spec-modal">
        <div className="spec-eyebrow">✦ після пелюстки серця</div>
        <h2 className="spec-title">Хто ти у цьому шляху?</h2>
        <p className="spec-subtitle">
          Душі бувають різні. З цього моменту твій шлях стане індивідуальним —
          тон Кая, канали, практики адаптуються під тип, який ти впізнаєш своїм.
        </p>

        <div className="spec-grid">
          {SPECIALIZATIONS.map((spec) => (
            <button key={spec.id} type="button" className="spec-card"
              onClick={() => setSpec(spec.id)}>
              <div className="spec-card-symbol" style={{ color: spec.color }}>{spec.symbol}</div>
              <div className="spec-card-name" style={{ color: spec.color }}>{spec.name}</div>
              <div className="spec-card-focus">{spec.focus}</div>
              <div className="spec-card-desc">{spec.description}</div>
              <div className="spec-card-channels">
                <strong>канали:</strong> {spec.channels.join(' · ')}
              </div>
            </button>
          ))}
        </div>

        <div className="spec-actions">
          <button type="button" className="spec-btn-skip" onClick={close}>
            обрати пізніше
          </button>
        </div>
      </div>
    </div>
  );
}
