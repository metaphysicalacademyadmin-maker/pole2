import { useGameStore } from '../../store/gameStore.js';

// Невелика панель з прогресом довіри Кая.
export default function KaiTrust() {
  const trust = useGameStore((s) => s.kaiState?.trust || 0);
  const pct = (trust / 10) * 100;

  return (
    <div className="panel">
      <div className="panel-label">кай · довіра</div>
      <div className="panel-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontStyle: 'italic', opacity: 0.85, fontSize: 12 }}>
            {trust < 2 ? 'тільки знайомимось' :
             trust < 5 ? 'починає чути' :
             trust < 8 ? 'довіряє' :
             'ваш союз глибокий'}
          </span>
          <span style={{ fontWeight: 700, color: '#f0c574', fontSize: 16 }}>
            {Math.round(trust * 10) / 10}/10
          </span>
        </div>
        <div className="kt-bar"><div className="kt-fill" style={{ width: `${pct}%` }} /></div>
      </div>
    </div>
  );
}
