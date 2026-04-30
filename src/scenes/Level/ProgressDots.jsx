// Прогрес у поточному рівні — крапки. Кожна = одна клітинка.
export default function ProgressDots({ total, current }) {
  return (
    <div className="progress-dots">
      {Array.from({ length: total }).map((_, i) => {
        let cls = 'progress-dot';
        if (i < current) cls += ' done';
        else if (i === current) cls += ' current';
        return <span key={i} className={cls} />;
      })}
    </div>
  );
}
