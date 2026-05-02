import { useEffect, useState } from 'react';
import { CHAKRAS } from '../../data/chakras.js';
import { getFieldPresence } from '../../utils/presence.js';
import './styles.css';

// Inline-блок для Final-екрану — без модалки.
// Тонкий рядок «поряд з тобою у Полі ще N людей» + міні-діаграма.
export default function FinalPresenceLine() {
  const [presence, setPresence] = useState(() => getFieldPresence());

  useEffect(() => {
    const t = setInterval(() => setPresence(getFieldPresence()), 60_000);
    return () => clearInterval(t);
  }, []);

  const max = Math.max(1, ...presence.byLevel);
  const chakras = [...CHAKRAS].sort((a, b) => a.levelN - b.levelN);

  return (
    <div className="fp-final">
      <div className="fp-final__line">
        <span className="fp-final__pulse" aria-hidden="true" />
        поряд з тобою у Полі — ще <span className="fp-final__num">{Math.max(0, presence.total - 1)}</span> {plural(presence.total - 1)}
      </div>
      <div className="fp-final__chart" aria-hidden="true">
        {chakras.map((ch) => {
          const count = presence.byLevel[ch.levelN - 1] || 0;
          const heightPct = Math.max(6, (count / max) * 100);
          return (
            <div key={ch.id} className="fp-final__bar"
              style={{
                height: `${heightPct}%`,
                background: `linear-gradient(180deg, ${ch.color}, ${ch.colorDeep})`,
              }} />
          );
        })}
      </div>
    </div>
  );
}

function plural(n) {
  const a = Math.abs(n);
  const m10 = a % 10, m100 = a % 100;
  if (m10 === 1 && m100 !== 11) return 'людина у своєму шляху';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'людей у своїх шляхах';
  return 'людей у своїх шляхах';
}
