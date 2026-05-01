// Прогрес у поточному рівні — крапки. Кожна = одна клітинка.
// + опційний "🔒 N" — кількість заблокованих умовних клітинок (snake/awakening).
export default function ProgressDots({ total, current, locked }) {
  const lockedList = locked || [];
  return (
    <div className="progress-dots">
      {Array.from({ length: total }).map((_, i) => {
        let cls = 'progress-dot';
        if (i < current) cls += ' done';
        else if (i === current) cls += ' current';
        return <span key={i} className={cls} />;
      })}
      {lockedList.length > 0 && (
        <span className="progress-locked"
          title={lockedList.map((l) => l.hint).join('\n')}>
          🔒 {lockedList.length}
        </span>
      )}
    </div>
  );
}
