// One-time трансформація мандала-SVG: додає id/class на ринги і пелюстки.
//
// Input: manadalas/1.svg (експорт з Illustrator, без id на групах)
// Output: src/assets/mandalas-1.svg (із тегованими групами)
//
// Логіка — стек-машина за document order. Розраховує що Illustrator
// згенерував стабільну ієрархію:
//
//   <g id="_x34_">                ← root
//     <g>                          ← wrapper
//       <g>                        ← ring N (1..)
//         <g>...</g>               ← bg-circle (1-ша дитина ринга)
//         <g>                      ← petals-wrap (2-га дитина ринга)
//           <g>...</g>             ← петал 1
//           <g>...</g>             ← петал 2
//
// Усі діти wrapper'а — ринги. Раніше idx=0 спеціально маркувалось як
// "center", але це виявилось неправильним: idx=0 у цьому SVG — це
// зовнішній ринг (35 петлей на радіусі ~300), а не центр.
//
// Запуск: node scripts/tag-mandala.js

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = join(ROOT, 'manadalas', '1.svg');
const DST = join(ROOT, 'src', 'assets', 'mandalas-1.svg');

const raw = readFileSync(SRC, 'utf8');
const lines = raw.split(/\r?\n/);
const stack = [];
const out = [];

let totalRings = 0;
let totalPetals = 0;

for (const line of lines) {
  // Збираємо <g> opens — Illustrator зазвичай ставить тег на окремому
  // рядку (з можливими атрибутами), тож регекс на повний рядок.
  const openMatch = line.match(/^(\s*)<g(\s+[^>]*)?>$/);
  const closeMatch = line.match(/^(\s*)<\/g>$/);

  if (openMatch) {
    const indent = openMatch[1];
    const attrs = openMatch[2] || '';
    const parent = stack[stack.length - 1];

    let entry = { type: 'other' };
    let newAttrs = attrs;

    if (stack.length === 0 && /id="_x34_"/.test(attrs)) {
      entry.type = 'root';
    } else if (parent?.type === 'root') {
      entry = { type: 'wrapper', childCount: 0 };
    } else if (parent?.type === 'wrapper') {
      const idx = parent.childCount++;
      const ringNum = idx + 1; // 1-based: ring-1 — outermost, ring-N — innermost
      totalRings = Math.max(totalRings, ringNum);
      entry = { type: 'ring', ringNum, childCount: 0 };
      newAttrs = ` id="ring-${ringNum}" class="mnd-ring"`;
    } else if (parent?.type === 'ring') {
      const idx = parent.childCount++;
      if (idx === 0) {
        entry = { type: 'bg' };
        // bg-circle лишаємо без тегів, нехай буде як є
      } else {
        entry = { type: 'petals-wrap', ringNum: parent.ringNum, petalCount: 0 };
        newAttrs = ' class="mnd-petals-wrap"';
      }
    } else if (parent?.type === 'petals-wrap') {
      const petalNum = ++parent.petalCount;
      const ringNum = parent.ringNum;
      totalPetals++;
      entry = { type: 'petal' };
      newAttrs = ` id="petal-${ringNum}-${petalNum}"`
        + ` class="mnd-petal"`
        + ` data-ring="${ringNum}"`
        + ` data-petal="${petalNum}"`;
    }
    // інакше — entry.type='other', проходимо без змін

    stack.push(entry);
    out.push(`${indent}<g${newAttrs}>`);
  } else if (closeMatch) {
    stack.pop();
    out.push(line);
  } else {
    out.push(line);
  }
}

writeFileSync(DST, out.join('\n'), 'utf8');
console.log(`OK → ${DST}`);
console.log(`   рингів: ${totalRings}`);
console.log(`   пелюсток: ${totalPetals}`);
