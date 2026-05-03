#!/usr/bin/env python3
"""Розбити СИСТЕМА ЧАКР на 7 секцій + ендокринні відповідності → JS-модуль."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / "src" / "data" / "library"
OUT = ROOT / "src" / "data" / "methodichka-chakras.js"

with open(LIB / "methodichka.json") as f:
    m = json.load(f)

chakras_section = next(s for s in m['sections'] if s['title'] == 'СИСТЕМА ЧАКР')
endo_section = next(s for s in m['sections'] if s['title'] == 'Ендокринні відповідності:')

# Розбити «1. Муладхара ...», «2. Свадхістана ...» тощо
text = chakras_section['body']
parts = re.split(r'\n(\d)\.\s+(Муладхара|Свадхістана|Маніпура|Анахата|Вішудха|Аджна|Сахасрара)\b', text)

result = {}
for i in range(1, len(parts), 3):
    n = int(parts[i])
    name = parts[i + 1]
    body = parts[i + 2].strip()
    # Обмежуємо ~700 символів — щоб лаконічно і не перевантажувати
    if len(body) > 800:
        body = body[:800].rsplit('.', 1)[0] + '.'
    result[n] = {"name": name, "body": body}

# Витягти ендокринні з окремої секції
endo_lines = [ln.strip() for ln in endo_section['body'].split('\n') if ' — ' in ln and any(c in ln for c in ['Муладхара','Свадхістана','Маніпура','Анахата','Вішудха','Аджна','Сахасрара'])]

CHAKRA_TO_LEVEL = {
    'Муладхара': 1, 'Свадхістана': 2, 'Маніпура': 3, 'Анахата': 4,
    'Вішудха': 5, 'Аджна': 6, 'Сахасрара': 7,
}
endo_map = {}
for ln in endo_lines:
    for chakra, level in CHAKRA_TO_LEVEL.items():
        if chakra in ln:
            # витягнути тільки правий бік
            parts2 = ln.split(' — ')
            if len(parts2) >= 2:
                endo_map[level] = parts2[1].strip(' .')
            break

# Генеруємо JS
js_lines = [
    '// Витяги з методички академії — розділ СИСТЕМА ЧАКР.',
    '// Згенеровано scripts/extract_chakra_passages.py — не редагуй вручну.',
    '// Джерело: data/library/methodichka.json',
    '',
    'export const CHAKRA_PASSAGES = {',
]

for n in sorted(result.keys()):
    item = result[n]
    body_escaped = (item['body']
                    .replace('\\', '\\\\')
                    .replace('`', '\\`')
                    .replace('${', '\\${'))
    endo = endo_map.get(n, '')
    js_lines.append(f"  {n}: {{")
    js_lines.append(f"    name: '{item['name']}',")
    js_lines.append(f"    endocrine: '{endo}',")
    js_lines.append(f"    body: `{body_escaped}`,")
    js_lines.append(f"  }},")

js_lines.append('};')
js_lines.append('')
js_lines.append('export function passageForLevel(n) {')
js_lines.append('  return CHAKRA_PASSAGES[n] || null;')
js_lines.append('}')

OUT.write_text('\n'.join(js_lines), encoding='utf-8')
print(f'wrote {OUT.relative_to(ROOT)}')
print(f'  7 chakras, endocrine map: {list(endo_map.keys())}')
