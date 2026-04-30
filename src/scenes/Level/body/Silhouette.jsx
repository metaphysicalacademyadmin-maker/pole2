import Hand from './Hand.jsx';

// Анатомічно-натхненний силует. Голова, плечі, торс, руки, таз, ноги.
// Долоні — детальні (Hand.jsx). У позі «receiving» — палми вперед, відкрити.
// glowHands — чи світити долонями (бажано true для Силу Долонь практики).
export default function Silhouette({ glowHands = false }) {
  return (
    <g
      stroke="rgba(232,196,118,0.6)"
      strokeWidth="1.1"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="rgba(20,14,30,0.5)"
    >
      {/* Голова */}
      <ellipse cx={120} cy={36} rx={20} ry={26} />
      {/* М'яка тінь у голові — натяк на обличчя */}
      <ellipse cx={120} cy={32} rx={5} ry={3} fill="rgba(232,196,118,0.18)" stroke="none" />
      <ellipse cx={114} cy={42} rx={1.5} ry={1.5} fill="rgba(232,196,118,0.4)" stroke="none" />
      <ellipse cx={126} cy={42} rx={1.5} ry={1.5} fill="rgba(232,196,118,0.4)" stroke="none" />

      {/* Шия */}
      <path d="M 110 60 Q 120 64, 130 60 L 130 70 L 110 70 Z" />

      {/* Торс */}
      <path d="
        M 78 84
        C 88 75, 152 75, 162 84
        L 168 132
        Q 168 158, 158 178
        L 152 232
        Q 148 268, 142 304
        L 138 380
        Q 132 410, 122 422
        L 118 422
        L 122 304
        L 118 304
        L 114 422
        L 110 422
        Q 100 410, 94 380
        L 90 304
        Q 84 268, 80 232
        L 74 178
        Q 64 158, 64 132 Z
      " />

      {/* Ліва рука — плече → лікоть → зап'ясток */}
      <path d="
        M 78 90
        Q 56 110, 50 145
        Q 46 180, 48 215
        L 52 260
        Q 50 285, 46 310
      " fill="none" />

      {/* Права рука */}
      <path d="
        M 162 90
        Q 184 110, 190 145
        Q 194 180, 192 215
        L 188 260
        Q 190 285, 194 310
      " fill="none" />

      {/* Лікті — суглоби */}
      <circle cx={48} cy={188} r={2.2} fill="rgba(232,196,118,0.5)" stroke="none" />
      <circle cx={192} cy={188} r={2.2} fill="rgba(232,196,118,0.5)" stroke="none" />

      {/* Стопи (натяк) */}
      <ellipse cx={108} cy={428} rx={10} ry={4} fill="rgba(40,28,60,0.6)" />
      <ellipse cx={132} cy={428} rx={10} ry={4} fill="rgba(40,28,60,0.6)" />

      {/* Долоні — детальні */}
      <Hand cx={44} cy={322} side="left" glow={glowHands} />
      <Hand cx={196} cy={322} side="right" glow={glowHands} />
    </g>
  );
}
