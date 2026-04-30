// Одна чакра у тілі — сфера з лотосними пелюстками і bija-літерою.
import LotusPetals from './LotusPetals.jsx';

export default function ChakraSphere({ chakra, cx, cy, active, current, intensity, onClick }) {
  const baseR = 12;
  const sphereR = baseR + intensity * 4;

  return (
    <g
      transform={`translate(${cx} ${cy})`}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      {/* Лотосні пелюстки — за сферою */}
      <LotusPetals
        count={chakra.petals}
        color={chakra.color}
        radius={sphereR + 6}
        active={active}
        current={current}
      />

      {/* Зовнішнє свічення */}
      {(active || current) && (
        <circle r={sphereR + 14}
          fill={chakra.color}
          opacity={current ? 0.25 : 0.12}
          filter="url(#chakra-glow)">
          {current && (
            <animate attributeName="r" values={`${sphereR + 14};${sphereR + 22};${sphereR + 14}`} dur="3.5s" repeatCount="indefinite" />
          )}
        </circle>
      )}

      {/* Сфера */}
      <circle r={sphereR}
        fill={`url(#chakra-${chakra.id})`}
        stroke={active || current ? chakra.color : 'rgba(232,196,118,0.4)'}
        strokeWidth={current ? 1.8 : active ? 1.4 : 0.9}
        opacity={0.55 + intensity * 0.45}>
        {current && (
          <animate attributeName="opacity"
            values={`${0.55 + intensity * 0.45};1;${0.55 + intensity * 0.45}`}
            dur="2.5s" repeatCount="indefinite" />
        )}
      </circle>

      {/* Внутрішнє «дихання» — менше коло */}
      {(active || current) && (
        <circle r={sphereR * 0.6} fill={chakra.colorDeep} opacity="0.6" />
      )}

      {/* Bija-літера */}
      {(active || current) && (
        <text textAnchor="middle" y={5}
          fontSize={sphereR > 13 ? 12 : 10}
          fontWeight="800"
          fontFamily="Georgia, 'Times New Roman', serif"
          fill={current ? '#fff7e0' : chakra.color}
          opacity="0.95"
          pointerEvents="none">
          {chakra.bija}
        </text>
      )}

      {/* Прозоре більше коло для зручного кліку */}
      <circle r={28} fill="transparent" />
    </g>
  );
}
