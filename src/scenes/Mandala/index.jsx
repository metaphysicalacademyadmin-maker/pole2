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
  // Стартово порожньо: гравець сам обирає, нічого не передвибрано.
  const [selected, setSelected] = useState(() => new Set());
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

  // Душа в центрі — броунівські частинки з blur для відчуття туману.
  // Радіус 95 безпечно вписується у білий void перед ring-9 (~111).
  //
  // TODO: прив'язати до прогресу. Чим більше пройдених пелюсток (selected.size
  // або окрема "completed" структура) — тим яскравіша душа і тим більше колір
  // зміщується палітрою (наприклад: бузковий → ціан → золото → білий).
  // Залежність може бути на: COUNT, baseOpacity, blur, palette index/mix.
  // Колекцію кольорів витягнути в стейт або derive із прогресу й оновлювати
  // частинки без перестворення шару (щоб рух не «смикався» при додаванні).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const svg = stage.querySelector('svg');
    if (!svg) return;

    const NS = 'http://www.w3.org/2000/svg';
    const CX = 400, CY = 400;
    const R_MAX = 95;
    const COUNT = 50;

    const layer = document.createElementNS(NS, 'g');
    layer.setAttribute('id', 'mnd-soul');
    layer.style.pointerEvents = 'none'; // не блокує кліки під соулом
    // Сильний blur + великі частинки = дим, який тече, без чітких дисків
    layer.style.filter = 'blur(7px)';
    svg.appendChild(layer);

    // Бузково-фіолетова палітра: «душа/дух»
    const colors = ['#c4b5fd', '#a78bfa', '#d8b4fe', '#e9d5ff', '#f0abfc'];
    const particles = [];
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * R_MAX * 0.6;
      const c = document.createElementNS(NS, 'circle');
      const size = 10 + Math.random() * 22;
      const opacity = 0.35 + Math.random() * 0.4;
      c.setAttribute('r', size);
      c.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
      c.setAttribute('opacity', opacity);
      layer.appendChild(c);
      particles.push({
        el: c,
        x: CX + Math.cos(angle) * r,
        y: CY + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        baseOpacity: opacity,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let raf = 0;
    let t = 0;
    function tick() {
      t += 0.016;
      for (const p of particles) {
        // Хаос: сильний випадковий поштовх по обох осях, без орбітального
        // зміщення — кожна частинка йде своєю траєкторією, без обертання
        // навколо центру
        p.vx += (Math.random() - 0.5) * 0.4;
        p.vy += (Math.random() - 0.5) * 0.4;
        // Демпфування — щоб швидкість не накопичувалась
        p.vx *= 0.92;
        p.vy *= 0.92;
        // Тяжіння до центру коли йде далеко (тільки радіальне, без дотичної)
        const dx = p.x - CX;
        const dy = p.y - CY;
        const dist = Math.hypot(dx, dy) || 0.0001;
        if (dist > R_MAX) {
          p.vx -= (dx / dist) * 0.22;
          p.vy -= (dy / dist) * 0.22;
        } else if (dist > R_MAX * 0.7) {
          p.vx -= (dx / dist) * 0.05;
          p.vy -= (dy / dist) * 0.05;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.el.setAttribute('cx', p.x.toFixed(2));
        p.el.setAttribute('cy', p.y.toFixed(2));
        // Гостріше «дихання» — швидше і ширше коливається яскравість
        const breathe = 0.55 + 0.45 * Math.sin(t * 2.2 + p.phase);
        p.el.setAttribute('opacity', (p.baseOpacity * breathe).toFixed(3));
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      layer.remove();
    };
  }, []);

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
