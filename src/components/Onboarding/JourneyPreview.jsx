// 4-частинна візуалізація для гайду — показує весь шлях:
// піраміда → мандала → канали → дар у Світ.
// SVG, без зовнішніх файлів.

const CHAKRAS = ['#a8c898', '#9fc8e8', '#f5b870', '#f0a8b8', '#9fc8e8', '#c9b3e8', '#ffe7a8'];

export default function JourneyPreview() {
  return (
    <div className="onb-journey">
      <Stage label="перша" sub="7 рівнів"><Pyramid /></Stage>
      <Arrow />
      <Stage label="друга" sub="12 пелюсток"><Mandala /></Stage>
      <Arrow />
      <Stage label="третя" sub="11 каналів"><Channels /></Stage>
      <Arrow />
      <Stage label="четверта" sub="дар у Світ"><Gift /></Stage>
    </div>
  );
}

function Stage({ label, sub, children }) {
  return (
    <div className="onb-journey__stage">
      <div className="onb-journey__svg">{children}</div>
      <div className="onb-journey__label">{label}</div>
      <div className="onb-journey__sub">{sub}</div>
    </div>
  );
}

function Arrow() {
  return <div className="onb-journey__arrow">→</div>;
}

// ─── 1. Піраміда — 7 чакр-точок знизу вгору ─────────────────────
function Pyramid() {
  return (
    <svg viewBox="0 0 40 70" width="100%" height="100%">
      <line x1="20" y1="6" x2="20" y2="64"
        stroke="rgba(232,196,118,0.3)" strokeWidth="0.8" strokeDasharray="2 2" />
      {CHAKRAS.map((c, i) => {
        const cy = 64 - i * 8.5;
        return (
          <circle key={i} cx="20" cy={cy} r="3.5"
            fill={c} stroke="#fff7e0" strokeWidth="0.4" opacity="0.92" />
        );
      })}
    </svg>
  );
}

// ─── 2. Мандала — 12 пелюсток навколо центру ────────────────────
function Mandala() {
  const petals = Array.from({ length: 12 });
  return (
    <svg viewBox="-35 -35 70 70" width="100%" height="100%">
      {petals.map((_, i) => {
        const angle = (i * 360) / 12;
        return (
          <ellipse key={i} cx="0" cy="-18" rx="4" ry="13"
            transform={`rotate(${angle})`}
            fill="rgba(232,196,118,0.45)"
            stroke="#f0c574" strokeWidth="0.6" />
        );
      })}
      <circle r="6" fill="#ffe7a8" stroke="#c89849" strokeWidth="0.8" />
    </svg>
  );
}

// ─── 3. Канали — 11 вертикальних потоків ────────────────────────
function Channels() {
  const channels = Array.from({ length: 11 });
  return (
    <svg viewBox="0 0 70 70" width="100%" height="100%">
      {channels.map((_, i) => {
        const x = 4 + i * 6;
        const hue = (i * 33) % 360;
        return (
          <line key={i} x1={x} y1="8" x2={x} y2="62"
            stroke={`hsl(${hue}, 65%, 65%)`} strokeWidth="2"
            strokeLinecap="round" opacity="0.85" />
        );
      })}
    </svg>
  );
}

// ─── 4. Дар — центральна зірка випромінює до 6 точок назовні ────
function Gift() {
  const rays = Array.from({ length: 6 });
  return (
    <svg viewBox="-35 -35 70 70" width="100%" height="100%">
      {rays.map((_, i) => {
        const angle = (i * 60 - 90) * Math.PI / 180;
        const x1 = Math.cos(angle) * 8;
        const y1 = Math.sin(angle) * 8;
        const x2 = Math.cos(angle) * 26;
        const y2 = Math.sin(angle) * 26;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255, 231, 168, 0.45)" strokeWidth="0.8"
              strokeLinecap="round" />
            <circle cx={x2} cy={y2} r="3"
              fill="#ffe7a8" stroke="#c89849" strokeWidth="0.6"
              opacity="0.85" />
          </g>
        );
      })}
      {/* центральна сяюча зірка */}
      <g>
        <circle r="8" fill="rgba(255, 231, 168, 0.18)" />
        <circle r="5" fill="#ffe7a8" stroke="#c89849" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
