import { useEffect, useRef, useState } from 'react';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
// `?raw` — імпорт як рядок-сирець, щоб inline-вставити SVG-код у DOM
// (через dangerouslySetInnerHTML). Так SVG доступний для інспекції,
// CSS-таргетингу, анімації окремих <path>, на відміну від <img>.
import mandala1 from '../../assets/mandalas-1.svg?raw';
import './styles.css';

// Окрема сторінка для перегляду мандали.
// Використовуй `openMandala` callback щоб відкрити з будь-якої сцени.
//
// SVG уже теговано через scripts/tag-mandala.js:
//   <g id="ring-N" class="mnd-ring">
//     <g class="mnd-petals-wrap">
//       <g id="petal-N-M" class="mnd-petal" data-ring="N" data-petal="M">
// Якщо переекспортуєш SVG з Illustrator — запусти `node scripts/tag-mandala.js`.
export default function Mandala({ onClose }) {
  const stageRef = useRef(null);
  // Set ключів "ring-n" — обрані пелюстки. Клік перемикає елемент.
  const [selected, setSelected] = useState(() => new Set(['8-1']));
  useOverlayA11y(onClose);

  function handleStageClick(e) {
    const petal = e.target.closest('.mnd-petal');
    if (!petal) return;
    const key = `${petal.dataset.ring}-${petal.dataset.petal}`;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Перефарбовуємо обрані пелюстки на місці (без клонування у top-шар) —
  // щоб вони лишались у своєму z-порядку і не перекривали сусідні.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.querySelectorAll('.mnd-petal.is-selected').forEach((el) =>
      el.classList.remove('is-selected')
    );

    selected.forEach((key) => {
      const orig = stage.querySelector(`#petal-${key}`);
      if (orig) orig.classList.add('is-selected');
    });
  }, [selected]);

  return (
    <div className="mnd-overlay" role="dialog" aria-modal="true" aria-label="Мандала">
      <div className="mnd-frame">
        <button type="button" className="mnd-close" onClick={onClose}
          aria-label="Закрити мандалу">← повернутись</button>

        <div className="mnd-header">
          <div className="mnd-eyebrow">сакральна геометрія</div>
          <h1 className="mnd-title">Мандала</h1>
          <div className="mnd-info">
            {selected.size > 0
              ? <>обрано: <strong>{selected.size}</strong> · клік ще раз — зняти</>
              : <>натисни на пелюстку</>}
          </div>
        </div>

        <div className="mnd-stage"
          ref={stageRef}
          onClick={handleStageClick}
          dangerouslySetInnerHTML={{ __html: mandala1 }} />
      </div>
    </div>
  );
}
