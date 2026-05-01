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
npm run build          # split bundle (для дебагу)
npm run build:embed    # single-file dist/index.html для /demo
npm run preview        # переглянути збілджений варіант
```

## Деплой одною командою

```bash
npm run deploy
```

Скрипт `scripts/deploy.js`:
1. Запускає `vite build --mode embed`
2. Бере `dist/index.html`
3. Шле `PUT /api/static-pages/<slug>/content` з Bearer-токеном
4. Сторінка `https://metaphysical-way.academy/<slug>` оновлена за ~10 сек

**Налаштування (один раз):**
1. На сайті: `/demo` під superadmin → **створити** StaticPage із потрібним slug,
   white­list, заголовком, видимістю в меню. (Деплой-скрипт лише замінює HTML —
   все решту бекенд лишає як є.)
2. На сервері Lightsail: додати у `.env.local`:
   ```
   STATIC_DEPLOY_TOKEN=<довгий випадковий рядок>
   ```
   `pm2 restart metaphysical-way`.
3. У цьому репо: скопіювати `.env.local.example` → `.env.local` і заповнити
   `STATIC_DEPLOY_TOKEN` (той самий) і `STATIC_DEPLOY_SLUG` (slug із кроку 1).

Подальші релізи — просто `npm run deploy`.

## Ручний деплой (fallback)

Якщо API-токен недоступний:
1. `npm run build:embed` → `dist/index.html`
2. `metaphysical-way.academy/demo` під superadmin → ☁ «Замінити файл»

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
