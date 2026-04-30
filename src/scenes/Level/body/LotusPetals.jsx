// Лотосні пелюстки навколо чакри. Кількість — традиційна (4, 6, 10, 12, 16, 2, 1000).
// Для 1000 рендеримо тільки 16 — просто для естетики.
const PETAL_RENDER_LIMIT = 16;

export default function LotusPetals({ count, color, radius, active, current }) {
  const petals = Math.min(count, PETAL_RENDER_LIMIT);
  const petalLen = radius + 8;
  const petalWidth = (Math.PI * 2 * radius) / Math.max(petals, 4) * 0.45;
  const opacity = current ? 0.85 : active ? 0.6 : 0.25;

  return (
    <g opacity={opacity}>
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * 360;
        return (
          <path
            key={i}
            d={`M 0 0 Q ${petalWidth} -${petalLen * 0.5}, 0 -${petalLen} Q -${petalWidth} -${petalLen * 0.5}, 0 0 Z`}
            transform={`rotate(${angle})`}
            fill={color}
            opacity="0.5"
            stroke={color}
            strokeWidth="0.4"
          >
            {current && (
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="3s"
                repeatCount="indefinite"
                begin={`${i * 0.1}s`}
              />
            )}
          </path>
        );
      })}
    </g>
  );
}
