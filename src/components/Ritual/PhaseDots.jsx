import './styles.css';

// Індикатор фаз ритуалу (точки під заголовком).
// phases: ['картка','шкали','рефлексія']; current: index 0..n-1.
export default function PhaseDots({ phases, current }) {
  return (
    <div className="phase-dots" role="status" aria-label={`фаза ${current + 1} з ${phases.length}`}>
      {phases.map((p, i) => (
        <span key={p} className={`phase-dots__dot ${i === current ? 'is-active' : ''} ${i < current ? 'is-done' : ''}`} title={p} />
      ))}
    </div>
  );
}
