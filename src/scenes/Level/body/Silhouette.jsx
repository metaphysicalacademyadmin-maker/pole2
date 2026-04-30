import Hand from './Hand.jsx';

// Анатомічно-натхненний силует у пропорціях 1:7.5 (близько до людських).
//
// Розкладка по y (viewBox 240×460, центр cx=120):
//   14-78    голова  (64 — голова + риси обличчя)
//   78-92    шия (14)
//   92-115   плечі/трапеція
//   115-200  грудна клітина (звужується до талії)
//   200-235  талія (вузька)
//   235-285  стегна (розширюються)
//   285-440  ноги (155 — ~3 голови)
//   440-450  стопи
//
// Тіло симетричне: торс — два дзеркальні шляхи зліва/справа,
// ноги і руки окремі компоненти.
const CX = 120;

export default function Silhouette({ glowHands = false }) {
  const stroke = 'rgba(232,196,118,0.7)';
  const fill = 'rgba(40,28,60,0.55)';
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <Head stroke={stroke} fill={fill} />
      <Neck stroke={stroke} fill={fill} />
      <Torso stroke={stroke} fill={fill} />
      <LeftLeg fill={fill} stroke={stroke} />
      <RightLeg fill={fill} stroke={stroke} />
      <LeftArm stroke={stroke} fill={fill} />
      <RightArm stroke={stroke} fill={fill} />
      <Hand cx={CX - 60} cy={314} side="left" glow={glowHands} />
      <Hand cx={CX + 60} cy={314} side="right" glow={glowHands} />
      <Foot cx={CX - 18} />
      <Foot cx={CX + 18} />
    </g>
  );
}

function Head({ stroke, fill }) {
  return (
    <g>
      <ellipse cx={CX} cy={46} rx={26} ry={32} fill={fill} stroke={stroke} strokeWidth="1.2" />
      {/* Чоло — підсвічене */}
      <ellipse cx={CX} cy={36} rx={6} ry={3} fill="rgba(232,196,118,0.18)" />
      {/* Очі */}
      <circle cx={CX - 7} cy={48} r={1.6} fill="rgba(232,196,118,0.55)" />
      <circle cx={CX + 7} cy={48} r={1.6} fill="rgba(232,196,118,0.55)" />
      {/* Ніс */}
      <line x1={CX} y1={54} x2={CX} y2={58} stroke="rgba(232,196,118,0.4)" strokeWidth="0.8" />
      {/* Рот */}
      <path d={`M ${CX - 4} 64 Q ${CX} 66, ${CX + 4} 64`} fill="none" stroke="rgba(232,196,118,0.4)" strokeWidth="0.7" />
    </g>
  );
}

function Neck({ stroke, fill }) {
  return (
    <path
      d={`M ${CX - 9} 76 Q ${CX} 80, ${CX + 9} 76 L ${CX + 10} 92 L ${CX - 10} 92 Z`}
      fill={fill} stroke={stroke} strokeWidth="1.1"
    />
  );
}

// Торс — Vitruvian-стилізований: плечі ширші, талія вузька, стегна — звужені у 290.
function Torso({ stroke, fill }) {
  return (
    <path
      d={`
        M ${CX - 10} 92
        L ${CX - 30} 95
        Q ${CX - 38} 102, ${CX - 38} 118
        L ${CX - 36} 138
        Q ${CX - 32} 168, ${CX - 26} 195
        L ${CX - 22} 215
        Q ${CX - 22} 235, ${CX - 28} 258
        L ${CX - 32} 285
        Q ${CX - 32} 290, ${CX - 28} 290
        L ${CX + 28} 290
        Q ${CX + 32} 290, ${CX + 32} 285
        L ${CX + 28} 258
        Q ${CX + 22} 235, ${CX + 22} 215
        L ${CX + 26} 195
        Q ${CX + 32} 168, ${CX + 36} 138
        L ${CX + 38} 118
        Q ${CX + 38} 102, ${CX + 30} 95
        L ${CX + 10} 92 Z
      `}
      fill={fill} stroke={stroke} strokeWidth="1.2"
    />
  );
}

function LeftLeg({ fill, stroke }) {
  return (
    <path
      d={`
        M ${CX - 28} 290
        Q ${CX - 30} 320, ${CX - 26} 350
        L ${CX - 24} 380
        Q ${CX - 22} 410, ${CX - 20} 438
        L ${CX - 9} 438
        Q ${CX - 6} 410, ${CX - 4} 380
        L ${CX - 3} 350
        Q ${CX - 2} 320, ${CX - 2} 290 Z
      `}
      fill={fill} stroke={stroke} strokeWidth="1.2"
    />
  );
}

function RightLeg({ fill, stroke }) {
  return (
    <path
      d={`
        M ${CX + 28} 290
        Q ${CX + 30} 320, ${CX + 26} 350
        L ${CX + 24} 380
        Q ${CX + 22} 410, ${CX + 20} 438
        L ${CX + 9} 438
        Q ${CX + 6} 410, ${CX + 4} 380
        L ${CX + 3} 350
        Q ${CX + 2} 320, ${CX + 2} 290 Z
      `}
      fill={fill} stroke={stroke} strokeWidth="1.2"
    />
  );
}

// Рука — наповнена форма (не лиш контур), з ліктем-суглобом.
function LeftArm({ stroke, fill }) {
  return (
    <>
      <path
        d={`
          M ${CX - 38} 100
          Q ${CX - 56} 130, ${CX - 60} 170
          L ${CX - 60} 220
          Q ${CX - 60} 260, ${CX - 60} 295
          L ${CX - 56} 314
          L ${CX - 64} 314
          Q ${CX - 68} 260, ${CX - 68} 220
          L ${CX - 68} 170
          Q ${CX - 64} 130, ${CX - 46} 96 Z
        `}
        fill={fill} stroke={stroke} strokeWidth="1.1"
      />
      {/* Лікоть-суглоб */}
      <circle cx={CX - 64} cy={195} r={2.5} fill="rgba(232,196,118,0.6)" />
    </>
  );
}

function RightArm({ stroke, fill }) {
  return (
    <>
      <path
        d={`
          M ${CX + 38} 100
          Q ${CX + 56} 130, ${CX + 60} 170
          L ${CX + 60} 220
          Q ${CX + 60} 260, ${CX + 60} 295
          L ${CX + 56} 314
          L ${CX + 64} 314
          Q ${CX + 68} 260, ${CX + 68} 220
          L ${CX + 68} 170
          Q ${CX + 64} 130, ${CX + 46} 96 Z
        `}
        fill={fill} stroke={stroke} strokeWidth="1.1"
      />
      <circle cx={CX + 64} cy={195} r={2.5} fill="rgba(232,196,118,0.6)" />
    </>
  );
}

function Foot({ cx }) {
  return (
    <ellipse cx={cx} cy={444} rx={11} ry={5}
      fill="rgba(40,28,60,0.6)"
      stroke="rgba(232,196,118,0.55)" strokeWidth="1" />
  );
}
