# ПОЛЕ · Втілення

React-версія гри **ПОЛЕ · Втілення — Шлях Душі через Тіло**.
Синтез ПОЛЯ (наратив, питання душі) + АКАДЕМІЇ ПРАКТИК (тіло, чакри).

Кінцевий артефакт — single-file `dist/index.html` для завантаження
через `/demo` на metaphysical-way.academy.

## Швидкий старт

```bash
npm install
npm run dev          # відкриється http://localhost:5173
```

## Команди

```bash
npm run dev            # dev сервер з hot reload
npm run build:embed    # single-file dist/index.html для /demo
npm run preview        # переглянути збілджений варіант
```

## Деплой

1. `npm run build:embed` → отримати `dist/index.html` (single-file)
2. На сайті: `metaphysical-way.academy/demo` (під superadmin)
   - **Заміна** існуючої сторінки → ☁ «Замінити файл» → `dist/index.html`
   - **Нова гра** → «Завантажити HTML», заповнити slug, заголовок, whitelist,
     меню — і Зберегти
3. Перевірити на `https://metaphysical-way.academy/<slug>` під whitelist-юзером.

## Структура проекту

```
src/
├── App.jsx               ← top-level layout + роутинг сцен + 4 персонажі (Кай/Антип/Арбітр/Дзеркало)
├── main.jsx              ← React entry + ThemeProvider
├── theme.js              ← MUI dark theme (Cyrillic-safe stack, без Cormorant)
├── styles.css            ← глобальні стилі + CSS variables
│
├── scenes/               ← по підпапці на сцену
│   ├── PathMode/         ← вибір шляху (Дотик/Шлях/Глибина)
│   ├── Entry/            ← намір
│   ├── Level/            ← головний робочий екран (Topbar + Pyramid + BodyHologram + CellView + …)
│   ├── Key/              ← ключ між рівнями + Voice recorder
│   ├── Constellation/    ← Hellinger drag-drop на рівні 3
│   ├── SoulField/        ← оверлей-діагностика
│   └── Final/            ← Карта Втілення (Mandala + body map + evolution echo)
│
├── components/
│   ├── Kai/              ← floating супутник
│   ├── Arbiter/, Antyp/, Mirror/, Koan/  ← модалки внутрішніх фігур
│   ├── Onboarding/       ← перший вхід
│   ├── Teacher/          ← Учитель Поля (методики)
│   ├── BodyMap/          ← Picker + Display (SVG силует)
│   ├── modals/           ← Journal, Scales, Practices, Channels, DailyRitual, History, Reset
│   ├── panels/           ← FieldNow, DailyPulse, Archetypes, KaiTrust, ActiveChannels, Practices, Help, Theme
│   ├── Contacts/         ← блок «Академія / Instagram / Telegram»
│   ├── Button.jsx, ErrorBoundary.jsx, GlobalToast.jsx, VoiceRecorder.jsx
│
├── store/
│   ├── gameStore.js      ← Zustand store (defaultState + базові мутації)
│   ├── actions.js        ← actions для розширених модулів
│   └── sanitize.js       ← merge/migrate захист від stale state
│
├── data/                 ← статичний контент (~3k рядків)
│   ├── cells/level{1-7}.js   ← 108 клітинок-питань
│   ├── levels.js, chakras.js, channels.js, archetypes.js
│   ├── practices.js, practices-academy.js
│   ├── dilemmas.js, daily-cards.js, koans.js, mirror.js
│   ├── constellation/    ← Hellinger figures + readings + resolutions
│   ├── teacher.js, contacts.js, scales.js, barometers.js,
│   │   subtle-bodies.js, antyp.js, arbiter.js, pathmodes.js
│
└── utils/                ← archetype-detector, character-detector, integrity-calc, resonance, season
```

## Правила розробки

Усі обов'язкові архітектурні правила — у [`CLAUDE.md`](./CLAUDE.md).
Він читається кожною Клауд-сесією. Дотримуйся і отримуєш:

- **≤ 300 рядків/файл, ≤ 150/компонент, ≤ 60/функція** — жорсткі ліміти
- Стан **тільки** через `useGameStore`, не через `useState`
- MUI імпорти **per-component**, інакше bundle роздуває до 500+ KB
- Контракт із бекендом: ключі `pole_game_state_v1` / `pole_game_history_v1`
  не перейменовувати, поля state беруться зі схеми `PoleSession.js` на бекенді

## Інтеграція з metaphysical-way.academy

- Гра пише `localStorage[pole_game_state_v1]` (через `zustand persist`)
- Парент-сторінка кожні 5с шле `POST /api/pole-sessions/sync`
- MongoDB зберігає `current` як `in_progress`, `history[]` — як `completed`/`abandoned`
- Whitelist, лінки в меню, Telegram-сповіщення — у адмін-панелі `/demo`

Деталі контракту → [`CLAUDE.md`](./CLAUDE.md) → секція «Контракт із бекендом».
