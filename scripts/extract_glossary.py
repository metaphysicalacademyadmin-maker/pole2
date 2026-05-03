#!/usr/bin/env python3
"""Парсити Глосарій з методички академії → JS-модуль."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / "src" / "data" / "library"
OUT = ROOT / "src" / "data" / "glossary.js"

with open(LIB / "methodichka.json") as f:
    m = json.load(f)

glos = next(s for s in m['sections'] if s['title'] == 'Глосарій термінів')
text = glos['body']

# Структура: рядок-термін / рядок-визначення.
# Парсимо по парах: короткий рядок (< 40 сим) → довге визначення.
lines = [ln.strip() for ln in text.split('\n') if ln.strip()]

terms = {}
i = 0
while i < len(lines):
    line = lines[i]
    if line.startswith('У цьому розділі') or line.startswith('⸻') or line.startswith('Підсумок'):
        i += 1
        continue
    # Стоп — секція «Підсумок: Шлях...» вже не потрібна
    if 'Підсумок' in line or 'Команда Академії' in line or 'Цілісність важливіша' in line:
        break

    # Якщо рядок < 40 сим, не закінчується крапкою/двокрапкою, не містить пробілу-тире
    if len(line) < 40 and not line.endswith('.') and not line.endswith(':'):
        # Це термін. Наступний — визначення.
        if i + 1 < len(lines):
            term = line
            definition = lines[i + 1]
            # Перевіряємо що визначення довге (це справжня дефініція)
            if len(definition) > 30 and definition.endswith('.'):
                terms[term.lower()] = {
                    'term': term,
                    'definition': definition,
                }
                i += 2
                continue
    i += 1

print(f'Розпарсено {len(terms)} термінів')
for k in list(terms.keys())[:5]:
    print(f"  {terms[k]['term']:20s} — {terms[k]['definition'][:60]}...")

# Генеруємо JS-модуль
js_lines = [
    '// Глосарій термінів — з методички академії.',
    '// Згенеровано scripts/extract_glossary.py — не редагуй вручну.',
    '',
    'export const GLOSSARY = {',
]

for key in sorted(terms.keys()):
    item = terms[key]
    term_esc = item['term'].replace("'", "\\'")
    def_esc = item['definition'].replace("'", "\\'").replace("\n", " ")
    js_lines.append(f"  '{key}': {{ term: '{term_esc}', definition: '{def_esc}' }},")

js_lines.append('};')
js_lines.append('')
js_lines.append("// Швидкий пошук — повертає визначення або null.")
js_lines.append('export function findTerm(query) {')
js_lines.append('  if (!query) return null;')
js_lines.append('  return GLOSSARY[query.toLowerCase().trim()] || null;')
js_lines.append('}')
js_lines.append('')
js_lines.append('// Усі терміни як масив для пошуку у тексті')
js_lines.append('export const GLOSSARY_TERMS = Object.values(GLOSSARY).map((t) => t.term);')

OUT.write_text('\n'.join(js_lines), encoding='utf-8')
print(f'\nwrote {OUT.relative_to(ROOT)}')
