import Hand from './Hand.jsx';

// Сакральний силует — пропорції 1:7.5 (Vitruvian).
// Не мультиплікаційна фігурка з обличчям, а тонке тіло-світильник.
//
// Лінії: золоті 0.9px з opacity 0.55, акцентні точки (joints) 0x80
// Fill: радіальний gradient від глибокого фіолету до напівпрозорого
// Drop-shadow: subtle gold glow на всю групу
//
// Розкладка по y (viewBox 240×460, центр cx=120):
//   12-78    голова  (без обличчя, чисте яйце)
//   78-92    шия (тонший S-curve)
//   92-200   плечі-груди-талія (плавний пісковий годинник)
//   200-285  стегна
//   285-440  ноги (taper)

const CX = 120;
const STROKE = 'rgba(232,196,118,0.55)';
const STROKE_ACCENT = 'rgba(232,196,118,0.85)';
const SW = 0.9;

export default function Silhouette({ glowHands = false }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round"
      style={{ filter: 'drop-shadow(0 0 8px rgba(232,196,118,0.18))' }}>
      <defs>
        <radialGradient id="body-fill" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(60, 40, 80, 0.5)" />
          <stop offset="60%" stopColor="rgba(40, 28, 60, 0.4)" />
          <stop offset="100%" stopColor="rgba(20, 14, 30, 0.25)" />
        </radialGradient>
        <linearGradient id="limb-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(50, 35, 70, 0.45)" />
          <stop offset="100%" stopColor="rgba(20, 14, 30, 0.3)" />
        </linearGradient>
      </defs>

      <Head />
      <Neck />
      <Torso />
      <LeftLeg />
      <RightLeg />
      <LeftArm />
      <RightArm />

      {/* Joints — золотисті точки на з'єднаннях, як акупунктурні маркери */}
      <Joint cx={CX - 40} cy={97} />
      <Joint cx={CX + 40} cy={97} />
      <Joint cx={CX - 64} cy={195} />
      <Joint cx={CX + 64} cy={195} />
      <Joint cx={CX - 16} cy={290} />
      <Joint cx={CX + 16} cy={290} />

      <Hand cx={CX - 60} cy={314} side="left" glow={glowHands} />
      <Hand cx={CX + 60} cy={314} side="right" glow={glowHands} />
      <Foot cx={CX - 18} />
      <Foot cx={CX + 18} />
    </g>
  );
}

// Голова — чисте яйце, без обличчя. Чакрова mandala (sahasrara)
// додасть світло зверху самостійно через ChakraSphere.
function Head() {
  return (
    <ellipse cx={CX} cy={46} rx={22} ry={30}
      fill="url(#body-fill)" stroke={STROKE} strokeWidth={SW * 1.1} />
  );
}

// Шия — тонкий пісковий годинник
function Neck() {
  return (
    <path
      d={`M ${CX - 7} 76
          C ${CX - 9} 82, ${CX - 9} 87, ${CX - 8} 92
          L ${CX + 8} 92
          C ${CX + 9} 87, ${CX + 9} 82, ${CX + 7} 76 Z`}
      fill="url(#body-fill)" stroke={STROKE} strokeWidth={SW * 0.9}
    />
  );
}

// Торс — плавний Vitruvian: широкі плечі (40), вузька талія (22),
// стегна повертаються до 28. Один безперервний path.
function Torso() {
  return (
    <path
      d={`
        M ${CX - 8} 92
        C ${CX - 22} 94, ${CX - 36} 96, ${CX - 40} 110
        C ${CX - 42} 130, ${CX - 38} 158, ${CX - 30} 180
        C ${CX - 26} 198, ${CX - 22} 215, ${CX - 22} 230
        C ${CX - 22} 248, ${CX - 26} 268, ${CX - 30} 285
        C ${CX - 31} 290, ${CX - 28} 292, ${CX - 24} 292
        L ${CX + 24} 292
        C ${CX + 28} 292, ${CX + 31} 290, ${CX + 30} 285
        C ${CX + 26} 268, ${CX + 22} 248, ${CX + 22} 230
        C ${CX + 22} 215, ${CX + 26} 198, ${CX + 30} 180
        C ${CX + 38} 158, ${CX + 42} 130, ${CX + 40} 110
        C ${CX + 36} 96, ${CX + 22} 94, ${CX + 8} 92 Z
      `}
      fill="url(#body-fill)" stroke={STROKE} strokeWidth={SW}
    />
  );
}

function LeftLeg() {
  return (
    <path
      d={`
        M ${CX - 28} 292
        C ${CX - 30} 330, ${CX - 28} 370, ${CX - 24} 410
        C ${CX - 22} 425, ${CX - 20} 435, ${CX - 18} 438
        L ${CX - 8} 438
        C ${CX - 6} 425, ${CX - 4} 410, ${CX - 4} 390
        C ${CX - 4} 360, ${CX - 4} 320, ${CX - 4} 292 Z
      `}
      fill="url(#limb-fill)" stroke={STROKE} strokeWidth={SW}
    />
  );
}

function RightLeg() {
  return (
    <path
      d={`
        M ${CX + 28} 292
        C ${CX + 30} 330, ${CX + 28} 370, ${CX + 24} 410
        C ${CX + 22} 425, ${CX + 20} 435, ${CX + 18} 438
        L ${CX + 8} 438
        C ${CX + 6} 425, ${CX + 4} 410, ${CX + 4} 390
        C ${CX + 4} 360, ${CX + 4} 320, ${CX + 4} 292 Z
      `}
      fill="url(#limb-fill)" stroke={STROKE} strokeWidth={SW}
    />
  );
}

// Рука — плавний S-curve. Без різкого ліктя, лікоть позначається маркером.
function LeftArm() {
  return (
    <path
      d={`
        M ${CX - 40} 96
        C ${CX - 54} 130, ${CX - 62} 170, ${CX - 62} 210
        C ${CX - 62} 250, ${CX - 60} 285, ${CX - 58} 312
        L ${CX - 64} 312
        C ${CX - 66} 285, ${CX - 70} 250, ${CX - 70} 210
        C ${CX - 70} 170, ${CX - 62} 130, ${CX - 48} 95 Z
      `}
      fill="url(#limb-fill)" stroke={STROKE} strokeWidth={SW * 0.95}
    />
  );
}

function RightArm() {
  return (
    <path
      d={`
        M ${CX + 40} 96
        C ${CX + 54} 130, ${CX + 62} 170, ${CX + 62} 210
        C ${CX + 62} 250, ${CX + 60} 285, ${CX + 58} 312
        L ${CX + 64} 312
        C ${CX + 66} 285, ${CX + 70} 250, ${CX + 70} 210
        C ${CX + 70} 170, ${CX + 62} 130, ${CX + 48} 95 Z
      `}
      fill="url(#limb-fill)" stroke={STROKE} strokeWidth={SW * 0.95}
    />
  );
}

// Joint — sacred-marker на з'єднаннях
function Joint({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={3} fill="rgba(40,28,60,0.95)"
        stroke={STROKE_ACCENT} strokeWidth={0.8} />
      <circle cx={cx} cy={cy} r={1.2} fill="rgba(255,231,168,0.7)" />
    </g>
  );
}

function Foot({ cx }) {
  return (
    <ellipse cx={cx} cy={444} rx={10} ry={4.5}
      fill="rgba(40,28,60,0.7)"
      stroke={STROKE} strokeWidth={SW} />
  );
}
