import { useEffect, useRef, useState } from 'react';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import {
  SECTORS, TOTAL_SECTORS, PETALS_PER_SECTOR,
  DEFAULT_LOCKED_SECTORS, DEFAULT_UNLOCKED_PETALS, DEFAULT_LOCKED_PETALS,
  DEFAULT_BEACON_PETALS,
  DEFAULT_PETAL_LEVEL_OVERRIDES, DEFAULT_PETAL_PROGRESS,
  DEFAULT_LEVELS_PER_PETAL as DEFAULT_LEVELS_PER_PETAL_FALLBACK,
  getPetalLockState, petalKey, parsePetalKey,
  getPetalCompletedSet,
  COLORS, LAYOUT, SOUL, MODAL_OPEN, MODAL_CLOSE_TOTAL_MS, buildCssVars,
} from './config.js';
// `?raw` — імпорт як рядок-сирець, щоб inline-вставити SVG-код у DOM
// (через dangerouslySetInnerHTML). Так SVG доступний для інспекції,
// CSS-таргетингу, анімації окремих <path>, на відміну від <img>.
import mandala1 from '../../assets/mandalas-1.svg?raw';
import lotusSvgRaw from '../../assets/lotus.svg?raw';
import './styles.css';

// Препроцесинг лотос-SVG при імпорті — один раз, не на кожен рендер:
//   1. Зчищаємо inline `style="fill:#ffffff;stroke:#000000"` (інакше
//      перебивають CSS-класи через вищу специфічність).
//   2. Оригінальний <svg> має width/height але БЕЗ viewBox — це ламає
//      масштабування і центрування. Додаємо viewBox 0 0 317.40625
//      і preserveAspectRatio="xMidYMid meet" — це гарантує, що SVG
//      центрується у контейнері незалежно від його розміру.
const lotusSvg = lotusSvgRaw
  .replace(/\s*style="[^"]*"/g, '')
  .replace(/<svg\b([^>]*?)>/, '<svg$1 viewBox="0 0 317.40625 317.40625" preserveAspectRatio="xMidYMid meet">');

// ╔════════════════════════════════════════════════════════════════════╗
// ║ Сцена Mandala — інтерактивна SVG-мандала з 9 секторами × 9 рингів ║
// ╚════════════════════════════════════════════════════════════════════╝
//
// ── Як відкрити сцену ──────────────────────────────────────────────────
// З будь-якої сцени отримуй callback `openMandala` з App.jsx — він тогглить
// `mandalaOpen` стан, який рендерить <Mandala onClose={...} />.
//
// ── Структура SVG ─────────────────────────────────────────────────────
// SVG `src/assets/mandalas-1.svg` уже теговано (через `scripts/tag-mandala.js`):
//   <g id="ring-N" class="mnd-ring">              N = 1..9 (1=зовнішній)
//     <g class="mnd-petals-wrap">
//       <g id="petal-N-M" class="mnd-petal"        M = 1..35 у кожному рингу
//          data-ring="N" data-petal="M">
// Якщо переекспортуєш SVG з Illustrator → запусти `node scripts/tag-mandala.js`
// → онови константи у `config.js` якщо змінилася кількість рингів/пелюсток.
//
// ── Сектори (поділ мандали на 9 «шматків пирога») ──────────────────────
// Усі 315 пелюсток сортуються за полярним кутом і ріжуться на 9 чанків
// по 35 (PETALS_PER_SECTOR). Кожна пелюстка отримує `data-sector="0..8"`.
// Сектори можуть мати трохи різну кутову ширину (бо межа сектора може
// проходити крізь радіальну лінію), але кількість пелюсток у кожному
// строго 35. Назви та гліфи секторів — у `config.js → SECTORS`.
//
// ── Props для ігрової логіки ───────────────────────────────────────────
// БЛОКУВАННЯ:
//   lockedSectors:   Set<number>   id секторів 0..8 які повністю закриті
//   unlockedPetals:  Set<string>   ключі "ring-petal" точково-відкритих
//   lockedPetals:    Set<string>   ключі точково-заблокованих у відкритому
//
// АКТИВНИЙ СТАН (BEACON):
//   beaconPetals:    Set<string>   ключі пелюсток-«маяків» — пульсують
//                    золотим світлом щоб привернути увагу гравця. Гра
//                    додає сюди ключ при розблокуванні, видаляє після
//                    взаємодії гравця з пелюсткою.
//
// ПРОГРЕС РІВНІВ (per-petal completion):
//   petalLevelOverrides: Map<string, number>  override кількості рівнів
//                        ЯКЩО НЕ ЗАДАНО — кількість рівнів дорівнює числу
//                        sub-`<g>` у пелюстці (детектиться runtime).
//                        Тобто природно варіюється: ring-1..3 → 4-7 рівнів,
//                        ring-4..6 → 3-5, ring-7..9 → 1-2 рівні.
//   petalProgress:       Map<string, Set<number>>  виконані рівні per petal
//   onPetalOpen(ring, petal, levelCount):  callback, гра може реагувати
//                        (відкрити свою модалку завдань). Якщо не задано —
//                        Mandala сама показує внутрішню демо-модалку.
//   onLevelToggle(ring, petal, level): callback при toggle демо-рівня. Гра
//                        має оновити petalProgress і передати назад.
//
// Mandala сама малює прогрес: floor((completed/total) * subGroupCount)
// перших sub-`<g>` у пелюстці підсвічуються золотом. 100% → вся пелюстка
// золота. Кожна пелюстка отримує атрибут `data-level-count` із
// фактичною кількістю рівнів (override або subGroupCount).
//
// Якщо props не передати — використовуються DEFAULT_* з config.js.
// useEffect перетеговування підписаний на blocking + progress у deps.
//
// Детальніше про API і пріоритети — у `config.js` (header).
export default function Mandala({
  onClose,
  lockedSectors = DEFAULT_LOCKED_SECTORS,
  unlockedPetals = DEFAULT_UNLOCKED_PETALS,
  lockedPetals = DEFAULT_LOCKED_PETALS,
  beaconPetals = DEFAULT_BEACON_PETALS,
  petalLevelOverrides = DEFAULT_PETAL_LEVEL_OVERRIDES,
  petalProgress: petalProgressProp = DEFAULT_PETAL_PROGRESS,
  onPetalOpen = null,
  onLevelToggle = null,
}) {
  const stageRef = useRef(null);
  // Поточний сектор під курсором (для hover-підсвітки 35 пелюсток).
  const hoverSectorRef = useRef(null);
  // Активна пелюстка для модалки рівнів. null = модалка закрита.
  const [activePetal, setActivePetal] = useState(null); // { ring, petal, originX, originY } | null
  // Прапорець закриття: коли true, модалка програє reverse-анімацію перед unmount
  const [isClosingModal, setIsClosingModal] = useState(false);
  const closeTimerRef = useRef(null);

  // Закриття модалки із зворотною анімацією. Запускає reverse-цикл,
  // після завершення (MODAL_CLOSE_TOTAL_MS) знімає activePetal.
  function handleClosePetalModal() {
    if (isClosingModal) return; // вже у процесі закриття
    setIsClosingModal(true);
    closeTimerRef.current = setTimeout(() => {
      setActivePetal(null);
      setIsClosingModal(false);
      closeTimerRef.current = null;
    }, MODAL_CLOSE_TOTAL_MS);
  }
  // Якщо модалка unmount раніше (наприклад, гра закрила) — чистимо таймер
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);
  // Внутрішній стейт прогресу — копія petalProgressProp із можливістю
  // тоглити демо-рівні без втручання в зовнішній стор. Гра може передати
  // свій onLevelToggle і ігнорувати internalProgress.
  const [internalProgress, setInternalProgress] = useState(
    () => new Map(petalProgressProp)
  );
  // Ефективний прогрес: якщо гра контролює state ззовні, internalProgress
  // дублює її (синкається через useEffect). Коли гра не контролює —
  // internalProgress самостійний.
  const effectiveProgress = onLevelToggle ? petalProgressProp : internalProgress;

  useOverlayA11y(activePetal ? handleClosePetalModal : onClose);

  function handleStageClick(e) {
    const petalEl = e.target.closest('.mnd-petal');
    if (!petalEl) return;
    // Заблоковано — sector-level (.is-locked) або petal-level (.is-petal-locked)
    if (
      petalEl.classList.contains('is-locked') ||
      petalEl.classList.contains('is-petal-locked')
    ) return;
    const ring = Number(petalEl.dataset.ring);
    const petal = Number(petalEl.dataset.petal);
    // Жорстко фіксуємо 8 рівнів для будь-якої пелюстки. Раніше це
    // читалось із data-level-count (= subGroupCount у svg або override
    // у petalLevelOverrides), що давало непередбачуваний розкид 1..20+.
    const levelCount = 8;
    // Координати центру пелюстки у viewport — для trace-анімації, що
    // вилітає з пелюстки і малює модалку
    const rect = petalEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    if (onPetalOpen) onPetalOpen(ring, petal, levelCount, originX, originY);
    else setActivePetal({ ring, petal, levelCount, originX, originY });
  }

  function handleLevelToggle(level) {
    if (!activePetal) return;
    const { ring, petal } = activePetal;
    if (onLevelToggle) {
      onLevelToggle(ring, petal, level);
      return;
    }
    // Внутрішній toggle (демо-режим)
    setInternalProgress((prev) => {
      const next = new Map(prev);
      const k = petalKey(ring, petal);
      const set = new Set(next.get(k) ?? []);
      if (set.has(level)) set.delete(level);
      else set.add(level);
      next.set(k, set);
      return next;
    });
  }

  // Поділ мандали на 9 секторів РІВНОЇ кількості пелюсток (315/9 = 35),
  // за рахунок того що кутові ширини секторів можуть різнитись.
  // Алгоритм: сортуємо всі пелюстки за кутом → ріжемо на 9 чанків по 35 →
  // кожна пелюстка отримує data-sector="0..8". Межі секторів (для радіальних
  // роздільників) — фактичні кути на стиках чанків.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const svg = stage.querySelector('svg');
    if (!svg) return;

    const NS = 'http://www.w3.org/2000/svg';
    const { CX, CY } = LAYOUT;

    // 1) Збираємо кути всіх пелюсток
    const petalNodes = stage.querySelectorAll('.mnd-petal');
    if (!petalNodes.length) return;
    const items = [];
    for (const el of petalNodes) {
      const bb = el.getBBox();
      const px = bb.x + bb.width / 2;
      const py = bb.y + bb.height / 2;
      let theta = Math.atan2(py - CY, px - CX);
      // Нормалізуємо у [0, 2π) із зсувом так, щоб 0 був вгорі
      theta = theta + Math.PI / 2;
      theta = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      items.push({ el, theta });
    }
    // 2) Сортуємо по кутах і ріжемо на рівні чанки (PETALS_PER_SECTOR = 35)
    items.sort((a, b) => a.theta - b.theta);

    // 2a) Внутрішня нумерація 1..35 У МЕЖАХ КОЖНОГО СЕКТОРА.
    //     Порядок: outer→inner (ring ASC) первинний, left→right (theta ASC)
    //     вторинний. Тобто #1 — найзовнішня пелюстка зліва сектора, далі
    //     по горизонталі вправо, потім спускаємось на ринг нижче.
    //     Цей індекс — стабільний ID для геймплейної прогресії: розблокування
    //     йтиме у порядку 1 → 2 → 3 → ... → 35.
    //     Кладемо у `data-petal-index="N"` (атрибут пелюстки).
    const sectorBuckets = Array.from({ length: TOTAL_SECTORS }, () => []);
    for (let i = 0; i < items.length; i++) {
      const sector = Math.floor(i / PETALS_PER_SECTOR);
      sectorBuckets[sector].push(items[i]);
    }
    // ─── DEMO: блокуємо в секторі РІД (id=2) усі пелюстки крім #1 ────
    // Перша (data-petal-index="1") — outermost-leftmost, єдина відкрита.
    // Решта 34 — petal-locked (синюватий відтінок), бо сектор у цілому
    // відкритий, а гравець іще не дійшов до них.
    // TODO(game): прибрати коли гра почне керувати lockedPetals через props.
    const RID_SECTOR_ID = 2;
    const demoLockedPetals = new Set();

    for (let s = 0; s < TOTAL_SECTORS; s++) {
      sectorBuckets[s].sort((a, b) => {
        const rA = Number(a.el.dataset.ring);
        const rB = Number(b.el.dataset.ring);
        if (rA !== rB) return rA - rB;
        return a.theta - b.theta;
      });
      for (let j = 0; j < sectorBuckets[s].length; j++) {
        const it = sectorBuckets[s][j];
        const internalIdx = j + 1;
        it.el.setAttribute('data-petal-index', String(internalIdx));
        // DEMO для сектора РІД
        if (s === RID_SECTOR_ID && internalIdx !== 1) {
          demoLockedPetals.add(petalKey(it.el.dataset.ring, it.el.dataset.petal));
        }
      }
    }
    const effectiveLockedPetals = new Set([...lockedPetals, ...demoLockedPetals]);

    // 2b) Тегаємо пелюстки сектором + класом блокування (розрізняючи рівень)
    for (let i = 0; i < items.length; i++) {
      const sector = Math.floor(i / PETALS_PER_SECTOR);
      const el = items[i].el;
      const ring = Number(el.dataset.ring);
      const petal = Number(el.dataset.petal);
      el.setAttribute('data-sector', String(sector));
      const lockState = getPetalLockState({
        ring, petal, sector,
        lockedSectors, unlockedPetals,
        lockedPetals: effectiveLockedPetals,
      });
      if (lockState === 'sector') el.classList.add('is-locked');
      else if (lockState === 'petal') el.classList.add('is-petal-locked');
    }

    // 3) Межові кути — між останньою пелюсткою сектора i та першою i+1
    const boundaries = [];
    for (let i = 0; i < TOTAL_SECTORS; i++) {
      const lastIdx = (i + 1) * PETALS_PER_SECTOR - 1;
      const nextIdx = (lastIdx + 1) % items.length;
      let mid = (items[lastIdx].theta + items[nextIdx].theta) / 2;
      // Якщо перейшли через 0/2π — корекція
      if (items[nextIdx].theta < items[lastIdx].theta) mid += Math.PI;
      // Повертаємо у систему атан2 (відняти зсув π/2)
      boundaries.push(mid - Math.PI / 2);
    }

    // 4) Малюємо радіальні роздільники на цих кутах
    const layer = document.createElementNS(NS, 'g');
    layer.setAttribute('id', 'mnd-sectors');
    layer.style.pointerEvents = 'none';
    for (const angle of boundaries) {
      const x1 = CX + Math.cos(angle) * LAYOUT.SECTOR_DIVIDER_INNER;
      const y1 = CY + Math.sin(angle) * LAYOUT.SECTOR_DIVIDER_INNER;
      const x2 = CX + Math.cos(angle) * LAYOUT.SECTOR_DIVIDER_OUTER;
      const y2 = CY + Math.sin(angle) * LAYOUT.SECTOR_DIVIDER_OUTER;
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', x1.toFixed(2));
      line.setAttribute('y1', y1.toFixed(2));
      line.setAttribute('x2', x2.toFixed(2));
      line.setAttribute('y2', y2.toFixed(2));
      line.setAttribute('stroke', COLORS.gold);
      line.setAttribute('stroke-width', String(LAYOUT.DIVIDER_STROKE_WIDTH));
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', String(LAYOUT.DIVIDER_OPACITY));
      layer.appendChild(line);
    }

    // 5) Назви секторів — з config.js (SECTORS array, тепер єдине джерело).
    // Сектор lockedSectors → темна мітка з 🔒.
    for (let i = 0; i < TOTAL_SECTORS; i++) {
      const sectorLocked = lockedSectors.has(i);
      // Середина сектора = пелюстка з середньої позиції чанка
      const midItem = items[Math.floor(i * PETALS_PER_SECTOR + PETALS_PER_SECTOR / 2)];
      const midAngle = midItem.theta - Math.PI / 2; // повертаємо до атан2-системи
      const lx = CX + Math.cos(midAngle) * LAYOUT.SECTOR_LABEL_RADIUS;
      const ly = CY + Math.sin(midAngle) * LAYOUT.SECTOR_LABEL_RADIUS;

      const text = document.createElementNS(NS, 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      // Заблоковані — приглушений сіро-фіолетовий, відкриті — золото
      text.setAttribute('fill', sectorLocked ? COLORS.sectorLockedText : COLORS.gold);
      text.setAttribute('font-family', "'EB Garamond', 'Cormorant Garamond', Georgia, serif");

      const glyphSpan = document.createElementNS(NS, 'tspan');
      glyphSpan.setAttribute('x', lx.toFixed(2));
      glyphSpan.setAttribute('y', ly.toFixed(2));
      glyphSpan.setAttribute('font-size', String(LAYOUT.LABEL_GLYPH_FONT_SIZE));
      glyphSpan.setAttribute('font-weight', '300');
      glyphSpan.setAttribute('opacity', sectorLocked ? '0.5' : '0.95');
      glyphSpan.textContent = SECTORS[i].glyph;
      text.appendChild(glyphSpan);

      const nameSpan = document.createElementNS(NS, 'tspan');
      nameSpan.setAttribute('x', lx.toFixed(2));
      nameSpan.setAttribute('dy', String(LAYOUT.LABEL_NAME_DY));
      nameSpan.setAttribute('font-size', String(LAYOUT.LABEL_NAME_FONT_SIZE));
      nameSpan.setAttribute('font-weight', '500');
      nameSpan.setAttribute('letter-spacing', '0.1em');
      nameSpan.setAttribute('opacity', sectorLocked ? '0.55' : '0.85');
      nameSpan.textContent = sectorLocked
        ? `${SECTORS[i].name} 🔒`
        : SECTORS[i].name;
      text.appendChild(nameSpan);

      layer.appendChild(text);
    }
    svg.appendChild(layer);

    return () => {
      layer.remove();
      for (const el of petalNodes) {
        el.removeAttribute('data-sector');
        el.removeAttribute('data-petal-index');
        el.classList.remove('is-locked');
        el.classList.remove('is-petal-locked');
      }
    };
  }, [lockedSectors, unlockedPetals, lockedPetals]);

  // ─── Beacon: пелюстки в активному стані пульсують золотом ─────
  // Клас .is-beacon → CSS keyframes пульсації drop-shadow + brightness.
  // Гра кладе у beaconPetals ключі щойно розблокованих пелюсток; коли
  // гравець з ними попрацював, прибирає.
  //
  // DEMO: автоматично додаємо у beacon ту єдину відкриту пелюстку у
  // секторі РІД (level 1, internalIdx=1). TODO(game): прибрати коли гра
  // керуватиме beaconPetals через props.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Чистимо попередній стан
    stage.querySelectorAll('.mnd-petal.is-beacon').forEach((el) =>
      el.classList.remove('is-beacon')
    );

    // Пропсний beacon-список
    for (const key of beaconPetals) {
      const el = stage.querySelector(`#petal-${key}`);
      if (el) el.classList.add('is-beacon');
    }

    // DEMO: дві пелюстки в beacon-стані для прев'ю — petal-6-29 і petal-6-4.
    // TODO(game): прибрати коли гра почне керувати beaconPetals через props.
    for (const id of ['#petal-6-29', '#petal-6-4']) {
      const el = stage.querySelector(id);
      if (el) el.classList.add('is-beacon');
    }

    return () => {
      stage.querySelectorAll('.mnd-petal.is-beacon').forEach((el) =>
        el.classList.remove('is-beacon')
      );
    };
  }, [beaconPetals, lockedSectors, unlockedPetals, lockedPetals]);

  // ─── Прогрес рівнів: фарбуємо sub-`<g>` пелюсток пропорційно ─────
  // Для кожної пелюстки знаходимо всі leaf-`<g>` (не мають вкладених <g>,
  // мають хоча б один <path>). Перший — головний силует, решта — деталі.
  //
  // КІЛЬКІСТЬ РІВНІВ per petal:
  //   - override з petalLevelOverrides (якщо гра задала)
  //   - інакше = subGroupCount (природна варіація 1-7 залежно від ринга)
  //   - якщо subGroupCount === 0 → DEFAULT_LEVELS_PER_PETAL (5)
  // Зберігаємо total у data-level-count на елементі — модалка читає це.
  //
  // ВІЗУАЛ: floor((completed/total) * subGroupCount) перших sub-group'ів
  // отримують клас .is-done. При 100% — пелюстка отримує .is-completed.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const petalNodes = stage.querySelectorAll('.mnd-petal');
    if (!petalNodes.length) return;

    const allSubs = [];
    for (const petalEl of petalNodes) {
      // Leaf-g: <g> без вкладених <g>, із принаймні одним <path>
      const leafGs = Array.from(petalEl.querySelectorAll('g')).filter((g) => {
        if (g.querySelector(':scope > g')) return false;
        return !!g.querySelector(':scope > path, :scope > circle, :scope > polygon, :scope > ellipse');
      });
      const details = leafGs.slice(1); // перший = головний силует
      const subCount = details.length;

      const ring = Number(petalEl.dataset.ring);
      const petal = Number(petalEl.dataset.petal);
      // Фіксуємо 8 рівнів на кожну пелюстку (контракт з модалкою).
      // petalLevelOverrides і subCount тут ігноруємо — раніше це давало
      // розкид 1..20+, нерівномірний UX. Прогрес = completed/8.
      const total = 8;
      petalEl.setAttribute('data-level-count', String(total));

      const completed = getPetalCompletedSet(ring, petal, effectiveProgress).size;
      const ratio = total > 0 ? Math.min(1, completed / total) : 0;
      const fillCount = Math.floor(ratio * subCount);

      // Тегаємо sub-groups класом + станом
      details.forEach((g, i) => {
        g.classList.add('mnd-petal-sub');
        if (i < fillCount) g.classList.add('is-done');
        else g.classList.remove('is-done');
        allSubs.push(g);
      });

      // 100% complete → фарбуємо ВСЮ пелюстку як золоту
      if (ratio >= 1) petalEl.classList.add('is-completed');
      else petalEl.classList.remove('is-completed');
    }

    return () => {
      for (const g of allSubs) {
        g.classList.remove('mnd-petal-sub');
        g.classList.remove('is-done');
      }
      for (const petalEl of petalNodes) {
        petalEl.removeAttribute('data-level-count');
        petalEl.classList.remove('is-completed');
      }
    };
  }, [effectiveProgress, petalLevelOverrides]);

  // Hover-підсвітка цілого сектора. При наведенні на будь-яку пелюстку —
  // підсвічуються всі 35 пелюсток того ж сектора.
  function handlePointerMove(e) {
    const stage = stageRef.current;
    if (!stage) return;
    const petal = e.target.closest?.('.mnd-petal');
    // Будь-який рівень блокування → не підсвічуємо сектор
    const isLocked = petal && (
      petal.classList.contains('is-locked') ||
      petal.classList.contains('is-petal-locked')
    );
    const newSector = petal && !isLocked ? petal.dataset.sector : null;
    if (newSector === hoverSectorRef.current) return;
    stage.querySelectorAll('.mnd-petal.is-sector-hover').forEach((el) =>
      el.classList.remove('is-sector-hover')
    );
    if (newSector != null) {
      stage.querySelectorAll(`.mnd-petal[data-sector="${newSector}"]`).forEach((el) =>
        el.classList.add('is-sector-hover')
      );
    }
    hoverSectorRef.current = newSector;
  }
  function handlePointerLeave() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.querySelectorAll('.mnd-petal.is-sector-hover').forEach((el) =>
      el.classList.remove('is-sector-hover')
    );
    hoverSectorRef.current = null;
  }

  // Душа в центрі — броунівські частинки з blur для відчуття туману.
  // Радіус 95 безпечно вписується у білий void перед ring-9 (~111).
  //
  // TODO: прив'язати до прогресу. Чим більше пройдених рівнів сумарно
  // (e.g., total of getPetalCompletedSet across all petals) — тим яскравіша
  // душа і тим більше колір зміщується палітрою (бузковий → золото → біле).
  // Залежність може бути на: COUNT, baseOpacity, blur, palette index/mix.
  // Колекцію кольорів витягнути в стейт або derive із прогресу й оновлювати
  // частинки без перестворення шару (щоб рух не «смикався» при додаванні).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const svg = stage.querySelector('svg');
    if (!svg) return;

    const NS = 'http://www.w3.org/2000/svg';
    const { CX, CY, SOUL_RADIUS_MAX: R_MAX } = LAYOUT;

    const layer = document.createElementNS(NS, 'g');
    layer.setAttribute('id', 'mnd-soul');
    layer.style.pointerEvents = 'none'; // не блокує кліки під соулом
    // Blur + великі частинки = дим, який тече, без чітких дисків
    layer.style.filter = `blur(${SOUL.BLUR_PX}px)`;
    svg.appendChild(layer);

    // Палітра «душі/духу» з config.js
    const colors = COLORS.soulParticles;
    const particles = [];
    for (let i = 0; i < SOUL.PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * R_MAX * SOUL.R_INIT_RATIO;
      const c = document.createElementNS(NS, 'circle');
      const size = SOUL.SIZE_MIN + Math.random() * SOUL.SIZE_RANGE;
      const opacity = SOUL.OPACITY_MIN + Math.random() * SOUL.OPACITY_RANGE;
      c.setAttribute('r', size);
      c.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
      c.setAttribute('opacity', opacity);
      layer.appendChild(c);
      particles.push({
        el: c,
        x: CX + Math.cos(angle) * r,
        y: CY + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * SOUL.VELOCITY_INIT,
        vy: (Math.random() - 0.5) * SOUL.VELOCITY_INIT,
        baseOpacity: opacity,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let raf = 0;
    let t = 0;
    function tick() {
      t += 0.016;
      for (const p of particles) {
        // Хаос: випадковий поштовх по обох осях, без орбітального зміщення
        p.vx += (Math.random() - 0.5) * SOUL.CHAOS_FORCE;
        p.vy += (Math.random() - 0.5) * SOUL.CHAOS_FORCE;
        // Демпфування — щоб швидкість не накопичувалась
        p.vx *= SOUL.DAMPING;
        p.vy *= SOUL.DAMPING;
        // Тяжіння до центру (радіальне)
        const dx = p.x - CX;
        const dy = p.y - CY;
        const dist = Math.hypot(dx, dy) || 0.0001;
        if (dist > R_MAX) {
          p.vx -= (dx / dist) * SOUL.CENTER_PULL_FAR;
          p.vy -= (dy / dist) * SOUL.CENTER_PULL_FAR;
        } else if (dist > R_MAX * SOUL.CENTER_PULL_THRESHOLD) {
          p.vx -= (dx / dist) * SOUL.CENTER_PULL_NEAR;
          p.vy -= (dy / dist) * SOUL.CENTER_PULL_NEAR;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.el.setAttribute('cx', p.x.toFixed(2));
        p.el.setAttribute('cy', p.y.toFixed(2));
        // «Дихання» opacity — синусоїда із індивідуальною фазою
        const breathe = SOUL.BREATHE_BASE + SOUL.BREATHE_AMPLITUDE * Math.sin(t * SOUL.BREATHE_SPEED + p.phase);
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
    <div className="mnd-overlay" role="dialog" aria-modal="true" aria-label="Мандала"
      style={buildCssVars()}>
      <div className="mnd-frame">
        <button type="button" className="mnd-close" onClick={onClose}
          aria-label="Закрити мандалу">← повернутись</button>

        <div className="mnd-header">
          <div className="mnd-eyebrow">сакральна геометрія</div>
          <h1 className="mnd-title">Мандала</h1>
          <div className="mnd-info">
            натисни на пелюстку — побачиш рівні
          </div>
        </div>

        <div className="mnd-stage"
          ref={stageRef}
          onClick={handleStageClick}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          dangerouslySetInnerHTML={{ __html: mandala1 }} />
      </div>

      {activePetal && (
        <PetalLevelsModal
          ring={activePetal.ring}
          petal={activePetal.petal}
          totalLevels={activePetal.levelCount}
          completed={getPetalCompletedSet(activePetal.ring, activePetal.petal, effectiveProgress)}
          originX={activePetal.originX}
          originY={activePetal.originY}
          closing={isClosingModal}
          onToggle={handleLevelToggle}
          onClose={handleClosePetalModal}
        />
      )}
    </div>
  );
}

// ─── Внутрішня модалка рівнів пелюстки ─────────────────────────────
// Демо UI: показує N рівнів як кнопки-чекбокси. Клік toggle → виконано/ні.
//
// Open-анімація (фази керуються через config.js → MODAL_OPEN):
//   1. TRACE — дві спіральні лінії вилітають із пелюстки, спіраллю йдуть
//      до протилежних кутів модалки, далі обводять її периметр
//   2. MODAL_REVEAL — модалка матеріалізується усередині рамки (delayed)
//
// Для гри: передай свій `onPetalOpen` у Mandala і рендери свою модалку із
// реальними завданнями. Тоді ця внутрішня не активується.
// Модалка рівнів — завжди показує варіант "Лотос". Інші варіанти
// (Галактика, Спіральна галактика, Сузір'я) видалені. Модалка завжди
// на повний екран (.is-lotus стилі), canvas без overflow:hidden.
function PetalLevelsModal({
  ring, petal, totalLevels, completed,
  originX, originY,
  closing,
  onToggle, onClose,
}) {
  const doneCount = completed.size;
  const ratio = totalLevels > 0 ? doneCount / totalLevels : 0;
  return (
    <div className={`mnd-levels-overlay is-lotus${closing ? ' is-closing' : ''}`}
      role="dialog" aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget && !closing) onClose(); }}>
      {/* Trace: спіральні лінії з пелюстки → периметр модалки */}
      <ModalTrace originX={originX} originY={originY} closing={closing} />
      {/* Сама модалка — матеріалізується після того як рамка майже домальована */}
      <div className="mnd-levels-modal is-lotus">
        <button type="button" className="mnd-levels-close" onClick={onClose}
          aria-label="Закрити">×</button>
        <div className="mnd-levels-eyebrow">пелюстка {ring}-{petal}</div>
        <h2 className="mnd-levels-title">Рівні</h2>
        <div className="mnd-levels-progress">
          {doneCount} / {totalLevels} · {Math.round(ratio * 100)}%
        </div>
        <div className="mnd-levels-canvas is-lotus">
          <LevelsLotus total={totalLevels}
            completed={completed} onToggle={onToggle} />
        </div>
      </div>
    </div>
  );
}


// ─── Variant 2: Лотос (зі svg-файлу assets/lotus.svg) ────────────────
// SVG лотоса (4 концентричні кільця по 8 пелюсток = 32 пелюстки) вставлений
// inline. Самі шляхи пелюсток клікабельні: useEffect шукає <path>'и у
// чергових групах і навішує на них:
//   • data-level — порядковий номер рівня 1..10 (у коді, не показуємо)
//   • класи .mnd-lotus-petal / .is-done
//   • click handler → onToggle(level)
// Цифри НЕ виводяться візуально — пелюстка сама є рівнем; на кліку
// заливається золотим через клас .is-done.
//
// Порядок призначення рівнів: outer ring g3128 → g3146 → g3164 → g3182.
// При LOTUS_LEVELS=10: рівні 1-8 на зовнішньому кільці, 9-10 на другому.
// Якщо колись треба зробити прогресивне розблокування — пропусти у
// LevelsLotus новий prop `unlocked: Set<number>` і не навішуй click+
// клас .mnd-lotus-petal на ті, що ще не у Set'і.
// Тільки зовнішнє кільце (8 великих пелюсток) — клікабельне і розкидане.
// Інші 3 кільця (g3146, g3164, g3182) лишаються декоративними у центрі.
const LOTUS_OUTER_RING_ID = 'g3128';
const LOTUS_SVG_CENTER = 158.7; // viewBox 317.40625 / 2
// Хаотичний розкид: кожна пелюстка летить на радіус [MIN..MAX] під випадковим
// кутом (seed = level → стабільний лейаут між рендерами).
const LOTUS_SCATTER_MIN = 100;
const LOTUS_SCATTER_MAX = 175;

// Стабільне seed-random — той самий level завжди дає ту саму пару (angle, r).
function lotusRand(level, salt) {
  const x = Math.sin(level * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function LevelsLotus({ total, completed, onToggle }) {
  // total зараз ігноруємо: ВСІ 32 пелюстки клікабельні (8 пелюсток × 4 ринги).
  // Якщо колись треба обмеження — повернути перевірку level > N всередині forEach.
  const containerRef = useRef(null);
  // Кеш пелюсток і їхніх pushed-трансформацій — заповнюється в init-ефекті
  // і використовується в apply-state ефекті (без перерахунку bbox/handlers).
  const petalsRef = useRef([]);
  // Latest onToggle у ref — щоб init-ефект не реагував на ре-рендери parent
  // при яких onToggle отримує нову reference (часта пастка).
  const onToggleRef = useRef(onToggle);
  useEffect(() => { onToggleRef.current = onToggle; }, [onToggle]);

  // Init: знаходимо пелюстки, рахуємо offset, навішуємо handlers ОДИН раз
  // (deps: тільки levelCount — handlers тримаємо через ref).
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const svg = root.querySelector('svg');
    if (!svg) return;

    // Беремо тільки <path>'и зовнішнього кільця — 8 великих пелюсток.
    const outerGroup = svg.querySelector(`#${LOTUS_OUTER_RING_ID}`);
    const allPetals = outerGroup
      ? Array.from(outerGroup.querySelectorAll(':scope > path'))
      : [];

    const infos = [];
    const cleanups = [];
    allPetals.forEach((path, idx) => {
      const level = idx + 1;

      path.setAttribute('data-level', String(level));
      path.classList.add('mnd-lotus-petal');

      // Хаотична ціль: випадкові угол і радіус (seeded by level → стабільно).
      const angle = lotusRand(level, 1) * Math.PI * 2;
      const radius = LOTUS_SCATTER_MIN + lotusRand(level, 2) * (LOTUS_SCATTER_MAX - LOTUS_SCATTER_MIN);
      const targetX = LOTUS_SVG_CENTER + Math.cos(angle) * radius;
      const targetY = LOTUS_SVG_CENTER + Math.sin(angle) * radius;

      // Offset до цілі = target - природна позиція центру bbox.
      const bbox = path.getBBox();
      const naturalX = bbox.x + bbox.width / 2;
      const naturalY = bbox.y + bbox.height / 2;
      const offX = targetX - naturalX;
      const offY = targetY - naturalY;

      // Випадковий тилт ±35° та scale 0.55-1.0 — додає хаотичності,
      // частина пелюсток виходить помітно меншою.
      const tilt = (lotusRand(level, 3) - 0.5) * 70;
      const scale = 0.55 + lotusRand(level, 4) * 0.45;
      const cx = naturalX.toFixed(2);
      const cy = naturalY.toFixed(2);
      const ncx = (-naturalX).toFixed(2);
      const ncy = (-naturalY).toFixed(2);

      // Композитний transform — порядок справа наліво (SVG):
      //   1. translate(-cx -cy)   зсуваємо центр bbox у origin
      //   2. scale(s)             масштабуємо навколо origin
      //   3. translate(cx cy)     повертаємо
      //   4. rotate(angle cx cy)  тилт навколо центру bbox
      //   5. translate(off, off)  переносимо до scattered позиції
      // Home — той самий шаблон з ідентичними значеннями (0, 0°, 1×),
      // щоб CSS transition інтерполював по компонентах без matrix-decomp.
      const pushedTransform =
        `translate(${offX.toFixed(2)} ${offY.toFixed(2)}) rotate(${tilt.toFixed(1)} ${cx} ${cy}) translate(${cx} ${cy}) scale(${scale.toFixed(2)}) translate(${ncx} ${ncy})`;
      const homeTransform =
        `translate(0 0) rotate(0 ${cx} ${cy}) translate(${cx} ${cy}) scale(1) translate(${ncx} ${ncy})`;
      infos.push({ path, level, pushedTransform, homeTransform });

      const handler = (e) => {
        e.stopPropagation();
        onToggleRef.current(level);
      };
      path.addEventListener('click', handler);
      cleanups.push(() => {
        path.removeEventListener('click', handler);
        path.classList.remove('mnd-lotus-petal', 'is-done');
        path.removeAttribute('data-level');
        path.removeAttribute('transform');
      });
    });

    petalsRef.current = infos;
    return () => {
      cleanups.forEach((fn) => fn());
      petalsRef.current = [];
    };
  }, []);

  // Apply-state: коли completed змінюється — оновлюємо ТІЛЬКИ transform/class.
  // Для пелюсток, чий статус не змінився, setAttribute з тим самим значенням
  // не тригерить CSS transition (computed value без зміни). Тому анімується
  // лише та пелюстка, яку щойно клацнули.
  //
  // Коли ВСІ клікабельні пелюстки зібрані → ставимо клас .is-complete на
  // контейнер. CSS робить внутрішні (декоративні) кільця білими із золотим
  // обведенням — лотос "розквітає" повністю.
  useEffect(() => {
    const petals = petalsRef.current;
    petals.forEach(({ path, level, pushedTransform, homeTransform }) => {
      if (completed.has(level)) {
        path.classList.add('is-done');
        path.setAttribute('transform', homeTransform);
      } else {
        path.classList.remove('is-done');
        path.setAttribute('transform', pushedTransform);
      }
    });

    const wrap = containerRef.current;
    if (!wrap) return;
    const allDone = petals.length > 0 && petals.every(({ level }) => completed.has(level));
    wrap.classList.toggle('is-complete', allDone);
  }, [completed]);

  return (
    <div className="mnd-lotus-wrap">
      <div
        ref={containerRef}
        className="mnd-lotus-svg"
        dangerouslySetInnerHTML={{ __html: lotusSvg }}
      />
    </div>
  );
}


// ─── ModalTrace: спіральні лінії з пелюстки → периметр модалки ─────
// Дві спіральні криві стартують з (originX, originY) — центру клікнутої
// пелюстки, обертаються на TRACE_TURNS обертів і досягають кутів майбутньої
// модалки. Далі кожна продовжує по сторонах рамки до протилежного кута,
// разом замикаючи прямокутник.
//
// Малювання — через stroke-dasharray + stroke-dashoffset: 0 (CSS animation).
// Реальна довжина шляху обчислюється у useEffect через getTotalLength()
// щоб timing був точним (animation керується `--mnd-trace-draw-ms`).
function ModalTrace({ originX, originY, closing }) {
  const svgRef = useRef(null);
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
  const cx = vw / 2, cy = vh / 2;
  // Trace target = фактичний прямокутник модалки.
  // Overlay має padding 16px з кожного боку → модалка inset 16px.
  // Якщо config задає менший MODAL_W/H — обмежуємо ним (для компактного режиму).
  const PAD = 16;
  const W = Math.min(MODAL_OPEN.MODAL_W, vw - PAD * 2);
  const H = Math.min(MODAL_OPEN.MODAL_H, vh - PAD * 2);
  const tl = { x: cx - W / 2, y: cy - H / 2 };
  const tr = { x: cx + W / 2, y: cy - H / 2 };
  const br = { x: cx + W / 2, y: cy + H / 2 };
  const bl = { x: cx - W / 2, y: cy + H / 2 };

  function spiralPath(end, dir) {
    const dx = end.x - originX;
    const dy = end.y - originY;
    const endAngle = Math.atan2(dy, dx);
    const endR = Math.hypot(dx, dy);
    let d = `M ${originX.toFixed(2)},${originY.toFixed(2)}`;
    for (let i = 1; i <= MODAL_OPEN.TRACE_SAMPLES; i++) {
      const t = i / MODAL_OPEN.TRACE_SAMPLES;
      const r = endR * t;
      const theta = endAngle - dir * MODAL_OPEN.TRACE_TURNS * 2 * Math.PI * (1 - t);
      const x = originX + r * Math.cos(theta);
      const y = originY + r * Math.sin(theta);
      d += ` L ${x.toFixed(2)},${y.toFixed(2)}`;
    }
    return d;
  }

  // Path A: спіраль до TL → периметр top → TR → right → BR
  const pathA =
    spiralPath(tl, +1) +
    ` L ${tr.x.toFixed(2)},${tr.y.toFixed(2)}` +
    ` L ${br.x.toFixed(2)},${br.y.toFixed(2)}`;
  // Path B: спіраль до BR → периметр bottom → BL → left → TL
  const pathB =
    spiralPath(br, -1) +
    ` L ${bl.x.toFixed(2)},${bl.y.toFixed(2)}` +
    ` L ${tl.x.toFixed(2)},${tl.y.toFixed(2)}`;

  // Точна довжина → точне dasharray/dashoffset → drawing працює коректно.
  // Перший mount: dashoffset len → 0 (малювання).
  // Коли closing змінюється на true: dashoffset 0 → len (стирання, reverse).
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = svg.querySelectorAll('.mnd-trace-path');
    for (const p of paths) {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      if (closing) {
        // Reverse: вже намальована (dashoffset=0) → анімуємо до len
        p.style.transition = `stroke-dashoffset ${MODAL_OPEN.TRACE_DRAW_MS}ms cubic-bezier(0.6, 0, 0.4, 1)`;
        p.style.strokeDashoffset = String(len);
      } else {
        p.style.strokeDashoffset = String(len);
        // forced reflow + плавна анімація до 0
        void p.getBoundingClientRect();
        p.style.transition = `stroke-dashoffset ${MODAL_OPEN.TRACE_DRAW_MS}ms cubic-bezier(0.6, 0, 0.4, 1)`;
        p.style.strokeDashoffset = '0';
      }
    }
  }, [closing]);

  return (
    <svg ref={svgRef} className="mnd-modal-trace"
         viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="none"
         aria-hidden="true">
      <path className="mnd-trace-path" d={pathA} />
      <path className="mnd-trace-path" d={pathB} />
    </svg>
  );
}
