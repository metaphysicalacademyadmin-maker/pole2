# CLAUDE.md — інструкція для Клауда (репо `pole2`)

Цей файл задає **обов'язкові правила** для всіх Клауд-сесій у цьому
репозиторії. Перш ніж писати код — прочитай повністю.

## 🎯 Що це за проект

**ПОЛЕ · Втілення — Шлях Душі через Тіло.** React-гра з ритуальним
проходженням 7 рівнів свідомості (Коріння → Потік → Воля і Рід →
Серце → Голос → Видіння → Джерело).

Vite + React, single-file build для деплою на **metaphysical-way.academy**
через адмін-панель `/demo`. Сайт хоститиме гру в iframe і автоматично
синхронізуватиме її стан із MongoDB.

Кінцевий артефакт деплою — один файл `dist/index.html` з вшитим JS+CSS
(згенерований через `npm run build:embed`).

## 📦 Що вже реалізовано

### Сцени (App.jsx routing)
- **PathMode** — вибір шляху (Дотик ◌ · Шлях ✦ · Глибина ◉)
- **Entry** — намір з 3 колами дихання
- **Level** — головний робочий екран (топбар, піраміда, тіло, клітинка, барометри, журнал)
- **Constellation** — Hellinger-розстановка на рівні 3 (drag-drop фігур, FieldReader, ResolutionScript)
- **Key** — церемонія між рівнями + Voice recorder
- **Final** — Карта Втілення (мандала, body map, evolution echo, sub-stats)

### Модулі контенту
- **108 клітинок** у `data/cells/level{1-7}.js` (filtered за pathMode)
- **8 барометрів** + **5 шкал стану**
- **25 практик** (`data/practices.js`) — Заземлення, Метелик, Сила долонь, Мантра ОМ, тощо
- **8 космоенергетичних каналів** (`data/channels.js`) — Краон, Зевс, Раджа, Мідгард, Імпульс, Фіраст, Агап, Сахара
- **5 моральних дилем** (`data/dilemmas.js`) на рівні 4
- **14 карток дня** (`data/daily-cards.js`) — детерміновано з дати
- **Розстановки**: 7 типів фігур, 10 правил FieldReader, генератор Hellinger-резолюції

### Системні компоненти
- **Кай** (`components/Kai/`) — floating supercompanion з 3 mood states
- **GlobalToast** (MUI Snackbar) — реактивний фідбек
- **VoiceRecorder** — MediaRecorder з base64 збереженням
- **BodyMap** — Picker + Display (SVG силует)
- **ErrorBoundary** — захист від crash
- Модалки: Journal, Scales, Practices, Channels, DailyRitual, ResetConfirm

### Утиліти
- `utils/season.js` — currentSeason, moonPhase, seasonWhisper
- `utils/resonance.js` — псевдо-цифри інших гравців

### Store (zustand persist)
- `store/gameStore.js` (≤300 рядків) — основні мутації
- `store/actions.js` — actions для розширених модулів (constellation, body map, practices, channels, kai, daily, dilemmas, voice, archive)
- `store/sanitize.js` — захист від stale state

## 🌱 Workflow

1. Запусти `npm install` (раз)
2. `npm run dev` → http://localhost:5173 (HMR)
3. Після кожної значущої зміни:
   ```
   git add . && git commit -m "feat/fix/refactor: <опис>"
   ```
4. Push робить **користувач** через Cursor / GitHub UI.
5. Перед деплоєм — `npm run build:embed`, перевір `dist/index.html` < 500 KB.

**Що НЕ робити:**
- ❌ Не міняй ключі `pole_game_state_v1` / `pole_game_history_v1` (контракт з бекендом)
- ❌ Не торкайся `.github/workflows/` (автодеплой single-file)
- ❌ Не комітити `node_modules/`, `dist/`, `.env*`
- ❌ Не використовувати **Cormorant Garamond** для normal-weight Cyrillic — кирилиця рендериться невидимо. Уся гра на `-apple-system, BlinkMacSystemFont, "Segoe UI"`.

**Що НЕ робити:**
- ❌ Не міняй структуру `src/`, не видаляй `CLAUDE.md`
- ❌ Не торкайся `.github/workflows/` — це автодеплой single-file, він уже працює
- ❌ Не міняй ключі `pole_game_state_v1` / `pole_game_history_v1` (контракт із бекендом)
- ❌ Не комітьте `node_modules/`, `dist/`, `.env*` — вони уже в `.gitignore`

## 🏗️ Архітектурні правила (НЕ ламай їх ніколи)

### Розмір файлів і компонентів — ЗАВЖДИ структурувати

**Жорсткі ліміти:**
- Один файл ≤ **300 рядків**. Перевищив — поділи негайно.
- Один компонент ≤ **150 рядків** (включно з JSX).
- Одна функція / hook ≤ **60 рядків**.
- JSX-блок повертає не більше ~80 рядків розмітки. Більше — виноси у підкомпоненти.

**Правило «Decompose first, code second»:**
Перш ніж писати великий компонент чи функцію — **спершу склади дерево
підкомпонентів**, далі реалізовуй кожен окремо. НЕ пиши все в одному
файлі з наміром «потім розіб'ємо».

**Тригери коли ОБОВ'ЯЗКОВО виносити у окремий компонент / файл:**
- JSX-фрагмент повторюється > 1 разу → витягни в reusable компонент у `src/components/`
- JSX-блок має > 30 рядків і логічно цілісний (карточка, список, форма, модал) → окремий файл
- Логіка з `useEffect` + 2+ `useState` → витягни у custom hook у `src/hooks/`
- Масив об'єктів даних > 10 елементів → винеси у `src/data/<theme>.js`
- Ланцюжок умов рендеру `condA ? <BlockA /> : condB ? <BlockB /> : ...` з 3+ варіантами →
  винеси кожен `<BlockX />` у окремий компонент
- Inline-handler довший за 5 рядків → витягни у named function над JSX
- Об'єкт стилів довший за 10 ключів → у `styles.css` під class

**Сцена як підпапка:** якщо сцена має > 1 підкомпонента, структуруй так:
```
src/scenes/Mandala/
├── index.jsx              ← сама сцена (≤ 150 рядків, тільки композиція)
├── Petal.jsx              ← елемент мандали
├── CenterCircle.jsx       ← центральний круг
├── ResourceBar.jsx        ← бар ресурсів
└── data.js                ← дані пелюсток
```
Імпорт: `import Mandala from './scenes/Mandala/index.jsx'`.

**Анти-патерни — НЕ робити:**
- ❌ Сцена з 500+ рядків JSX «бо так зручніше бачити все в одному місці»
- ❌ Один компонент який рендерить заголовок + список + модал + футер
- ❌ Inline-функції на 30 рядків всередині `onClick`
- ❌ Дублювання JSX-фрагментів між сценами
- ❌ Масиви питань / варіантів відповідей у тілі компонента — виноси у `data/`

**Чому це важливо:** великі компоненти ускладнюють Клауд-сесії —
ти витрачаєш контекст на читання тисяч рядків замість того щоб
точково правити маленький файл. Маленькі компоненти = швидші ітерації,
менше помилок, легша підтримка людиною.

**Перевірка перед коммітом:**
```bash
wc -l src/**/*.{js,jsx} | sort -rn | head -10
```
Якщо щось > 300 рядків — розбий ПЕРШ ніж писати нову фічу.

### Конкретні файли pole2, які перевищують ліміт (борг)

Цей репо успадкував файли, які вже > 300 рядків. **Перш ніж додавати в них код — спершу розбий їх:**

- `src/store/gameStore.js` (339) → винеси `defaultState` у `src/store/defaultState.js`,
  цикл `claimKey` / `recordAnswer` / `advanceCell` / `archiveAndReset` — у `src/store/cellActions.js`. У `gameStore.js` залиш лише композицію.
- `src/store/actions.js` (324) → розбий по файлу на модуль:
  `src/store/actions/constellation.js`, `bodyMap.js`, `practice.js`, `channel.js`,
  `kai.js`, `daily.js`, `dilemma.js`, `voice.js`, `field.js`, `character.js`, `ui.js`, `mirror.js`. У `actions/index.js` — barrel.
- `src/data/teacher.js` (369) → винеси діалоги в `src/data/teacher/dialogs.js`, методички в `src/data/teacher/lessons.js`. У `teacher.js` — лише експорт.

### Анти-патерни, які вже ловили в pole2

- ❌ **Дубль поля у `defaultState`.** В `gameStore.js` `archetypesMet` оголошено двічі (рядки 77 і 130) — другий перетирає перший, тип неузгоджений (масив vs об'єкт у коментарі). Перш ніж додавати поле — `grep` його по файлу.
- ❌ **`uiActions` забули зареєструвати в `gameStore.js`** (фікс у коміті `e5e4457`). Завжди при додаванні нового модуля actions перевіряй, що він є в розгортанні `...moduleActions(...)` всередині `create(persist(...))`.
- ❌ **Cormorant Garamond у `theme.js` для h1/h2/h3.** Кирилиця рендериться невидимо. Якщо MUI-тема має `typography.h1.fontFamily = 'Cormorant ...'` — постав fallback `-apple-system, system-ui` ПЕРЕД Cormorant, або взагалі прибери. **Перевіряй `src/theme.js` після кожної правки палітри.**
- ❌ **README залишився від шаблону.** Якщо інструкції в `README.md` ще згадують `metaphysicalacademyadmin-maker/template` чи «Use this template» — їх давно треба переписати під поточну гру.

### GitHub Actions (auto-build single-file)

⚠️ `.github/workflows/build-artifact.yml` у цьому репо **в `.gitignore`** (комміт `b2d63cb`: «PAT lacks workflow scope»). Це означає:
- Auto-збірка single-file артефакту через GitHub Actions **не працює**.
- Тригер-фрази «залий на сайт» / «деплой» вимагають **локального** `npm run build:embed` і ручного завантаження `dist/index.html` через `/demo`.
- Якщо клієнт хоче відновити автозбірку — треба згенерувати новий PAT з `workflow` scope, прибрати workflow з `.gitignore`, закоммітити файл.

### Стан гри
- **Тільки через `useGameStore`** (`src/store/gameStore.js`).
  НЕ використовуй `useState` для ігрового стану.
- `useState` дозволено ЛИШЕ для:
  - локального UI-стейту (відкритий-закритий модал, hover-стан)
  - тимчасового вводу форм (поки користувач набирає текст до save)
- Стан зберігається у `localStorage` ключем `pole_game_state_v1`
  (через `zustand persist middleware`).
- Архів завершених сесій — у `localStorage[pole_game_history_v1]` через
  `archiveAndReset(reason)`.

### Файлова структура
```
src/
├── App.jsx               ← top-level layout, routing між сценами
├── main.jsx              ← React root + import 'styles.css'
├── styles.css            ← глобальні стилі, CSS variables
├── scenes/               ← кожна сцена — окремий файл (Welcome, Mandala, …)
├── components/           ← reusable UI (Button, Card, Modal, StatsPanel)
├── store/
│   └── gameStore.js      ← єдиний zustand store
├── hooks/                ← кастомні hooks (useTimer, useScrollLock, …)
└── data/                 ← статичний контент (тексти питань, конфіги)
```

### Імпорти / шляхи
- **Усі імпорти — relative.** `import X from '../components/X.jsx'`. Не додавай alias-ів.
- **Розширення `.jsx` обов'язкове** в імпортах (для Vite resolve).

### Стилі
- Глобальні стилі — у `src/styles.css`, базові CSS variables на `:root`.
- Компонентні стилі — теж у `styles.css` під класом компонента (не CSS-in-JS).
- НЕ використовуй inline `style={{...}}` для динамічного оформлення кольорів — це ускладнює зміну теми.
  Виключення: position/transform для анімацій, обчислені розміри.

### Material UI (MUI) — встановлений, користуйся розумно

Шаблон уже містить **@mui/material + @emotion + @mui/icons-material**.
Тема (палітра, типографіка) налаштована у `src/theme.js` і обгортає
весь застосунок через `<ThemeProvider>` у `main.jsx`.

**Коли використовувати MUI:**
- ✅ Складні UI-патерни: `Dialog`, `Snackbar`, `Slider`, `Tabs`, `Drawer`,
  `Autocomplete`, `Tooltip`, `Accordion`, `Stepper` — швидко і доступно
- ✅ Форми зі стандартними інпутами: `TextField`, `Select`, `Checkbox`, `Radio`
- ✅ Layout-примітиви: `Box`, `Stack`, `Grid` (швидше ніж писати CSS вручну)
- ✅ Іконки з `@mui/icons-material`

**Коли НЕ використовувати MUI:**
- ❌ Прості div/span — пиши `<div className="x">` із CSS у `styles.css`
- ❌ Кастомна форма гри (мандала, поле клітинок, картки) — там MUI заважає,
  потрібен повний контроль над DOM/SVG/canvas
- ❌ Текстовий контент сторінки — `<h1>`, `<p>` без MUI

**Правила імпорту (КРИТИЧНО для bundle-size):**

✅ **Правильно** — per-component імпорт (tree-shaking працює):
```jsx
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
```

❌ **НЕПРАВИЛЬНО** — barrel-імпорт (тягне ВСЮ бібліотеку, +500 KB у bundle):
```jsx
import { Button, Dialog } from '@mui/material';
import { Close } from '@mui/icons-material';
```

**Іконки — лише ті що реально потрібні.** Не імпортуй більше 5-7 icons на гру.
Якщо потрібно багато іконок — підбери emoji, вони безкоштовні в bundle.

**Тема `src/theme.js`:**
- Палітра: `theme.palette.primary.main` = золотий, `secondary.main` = сірий,
  `background.default` = темний фіолет, `text.primary` = кремовий
- Доступ у компонентах: `sx={{ color: 'primary.main' }}` або через `useTheme()`
- НЕ хардкодь кольори — завжди через theme

**Bundle-size лімит:** після кожних 5-10 нових MUI-компонентів роби
`npm run build:embed` і дивись розмір. Якщо `dist/index.html > 500 KB` —
переглянь що можна замінити на простий HTML/CSS.

**Власний `src/components/Button.jsx` уже обгортає MUI Button** — використовуй
його замість прямого `import Button from '@mui/material/Button'` для
консистентного оформлення кнопок гри.

## 🔌 Контракт із бекендом metaphysical-way.academy

Гра рендериться у `<iframe srcDoc>` на metaphysical-way.academy. Парент:

1. **При завантаженні** — інжектить `localStorage[pole_game_state_v1]` і
   `[pole_game_history_v1]` із бекенду (resume сесії юзера).
2. **Кожні 5 секунд** — читає `iframe.contentWindow.localStorage`,
   шле `POST /api/pole-sessions/sync` з тілом `{ slug, current, history }`.
3. **Сервер зберігає** у MongoDB (модель `PoleSession`):
   - `current` → один документ зі статусом `in_progress`
   - кожен item у `history[]` → окремий документ зі статусом `completed`/`abandoned`

### Поля які бекенд індексує

З root-рівня `state` (тобто з твого zustand store):
- `sessionId` (string) — унікальний для сесії, генерується автоматично
- `startedAt` (number, Date.now()) — час старту
- `savedAt` (number) — час останнього save (zustand робить автоматично)
- `intention` (string)
- `visited` (array) — кількість елементів = `cellsVisited` на бекенді
- `keys` (array) — кількість = `keysCollected`
- `soulLevel` (number)
- `resources` (object: `{root, flow, light, ...}`)
- `barometers` (object: `{spirit, psyche, emotion, awareness}`)
- `completedInitiations` (array)
- `unlockedAbilities` (array)
- `archetypesMet` (array)
- `cellAnswers` (object) — кількість записів > 120 символів = `deepAnswersCount`

Усі **інші поля** автоматично зберігаються у `fullSnapshot` без індексації.

### Поля архівного snapshot (з `archiveAndReset`)

`pole_game_history_v1` — масив об'єктів:
```js
{
  sessionId, startedAt, finishedAt,
  reason, // 'completed' | 'abandoned'
  intention, pathMode, levelsCompleted,
  keys, resources, journal, cellAnswers,
  constellations, bodyMap, practiceCompletions,
  channelsUnlocked, moralChoices, dailyCheckIns
}
```

### Розширений state (Хвиля 4+) — у `fullSnapshot`

Додаткові root-поля, що автоматично пишуться у MongoDB без окремого індексу:
- `constellations` (object: `{levelN: {figures, readings, resolution}}`)
- `bodyMap` (object: `{cellId: [{x, y, depth, ts}]}`)
- `practiceCompletions` (array of `{id, levelN, durationSec, reflection, ts}`)
- `channelsUnlocked` (array), `channelsActive` (array), `channelActivations` (object)
- `kaiState` (object: `{trust, lastSpoke, mood}`)
- `dailyCheckIns` (array of `{date, scales, dream, morning, ts}`)
- `lastCheckInDate` (string YYYY-MM-DD)
- `moralChoices` (object: `{dilemmaId: {choice, customText, weight, ts}}`)
- `voiceRecordings` (object: `{keyN: dataUrl_base64}`) — **УВАГА:** великий розмір, варто чистити при sync
- `evolutionEcho` (object: `{previousSessionId, previousIntention, previousKeys, previousLevelsCompleted, previousFinishedAt}`)
- `awaitingKey` (boolean) — режим очікування ключа між Level → Key/Constellation

## 🚨 Якщо ти змінюєш state — обов'язкова поведінка

Якщо ти **додаєш**, **перейменовуєш** чи **видаляєш** поле у `gameStore.js`,
у відповіді користувачу **обов'язково** додай блок:

```
─── ЗМІНИ НА БЕКЕНДІ ───
Через додане поле `state.<нове_поле>` (тип: <type>):

1. У репозиторії metaphysical-way2:
   - src/models/PoleSession.js: додати у схему `<нове_поле>: <Type>`
     (опційно `index: true` якщо буде запит)

2. src/app/api/pole-sessions/sync/route.js:
   - У mapping `state → doc` додати:
     `<нове_поле>: state.<нове_поле> ?? <default>,`
   - Якщо це масив, який треба сумувати — додати у `totalMeasurements`

3. (опційно) src/app/profile/components/PoleSessionsCard.js:
   - Якщо хочеш бачити поле у списку сесій профілю — додай у renderItem
─── КІНЕЦЬ ЗМІН ───
```

**BREAKING CHANGE** (вимагає одночасного деплою бекенду):
- Перейменування `pole_game_state_v1` чи `pole_game_history_v1`
- Зміна формату snapshot у `archiveAndReset`
- Видалення `sessionId`, `startedAt`, `savedAt` чи `state` як кореневого об'єкта

У такому випадку явно скажи "⚠ BREAKING CHANGE — оновити бекенд ОДНОЧАСНО з релізом цього файлу".

## 📝 Стиль коду

- Functional components + hooks (без classes)
- React 18 (StrictMode у `main.jsx` — не прибирай)
- Без TypeScript — pure JavaScript + JSDoc для type hints коли треба
- Український текст у UI; коментарі — англійською або українською
- Не додавай зовнішніх залежностей без потреби. Якщо потрібно щось серйозне —
  спершу запропонуй у відповіді користувачу, чекай підтвердження.

## ⚙️ Команди

```bash
npm install            # один раз після клонування
npm run dev            # → http://localhost:5173 (hot reload)
npm run build:embed    # single-file dist/index.html (для /demo)
npm run preview        # переглянути збілджений варіант
```

## 🚀 Коли клієнт каже «гра готова, заливаємо на сайт»

Тригер-фрази: «залий на сайт», «деплой», «готово», «все зробив»,
«пора заливати», «релізь», «build», «зроби збірку» — реагуй на них так:

### Крок 1 — Sanity-перевірка (ЗАВЖДИ виконуй)
```bash
git status                    # переконайся що нема uncommitted змін
npm run build:embed           # зібрати single-file
ls -lh dist/index.html        # перевір розмір
```

**Що очікуй побачити:**
- `git status` → `nothing to commit, working tree clean` (якщо є незакомічені — комітнь!)
- Build → `✓ built in Xs` без помилок
- Розмір `dist/index.html`:
  - < 300 KB — 🟢 чудово
  - 300-500 KB — 🟡 нормально
  - 500-800 KB — 🟠 попередь користувача, спитай чи прийнятно
  - > 800 KB — 🔴 ЗУПИНИСЬ, прискіпливо подивись що тягнеш зайвого
    (часто barrel-імпорти MUI чи великі дані у код замість `data/`)

### Крок 2 — Smoke-тест (швидко)
- Відкрий `dist/index.html` у вкладці браузера → грай 30 секунд
- Перевір: гра запускається без console-помилок, state зберігається
  у localStorage[pole_game_state_v1] (DevTools → Application → Local Storage)
- Якщо не запускається в standalone — в інлайн-build щось пішло не так,
  розбирайся ДО push

### Крок 3 — Перевір контракт із бекендом

Відкрий `src/store/gameStore.js` і переконайся:
- [ ] `name: 'pole_game_state_v1'` у `persist` config — НЕ перейменовано
- [ ] У `archiveAndReset` ключ `'pole_game_history_v1'` — НЕ перейменовано
- [ ] Поля `sessionId`, `startedAt`, `savedAt` присутні у `defaultState`
- [ ] `genSessionId` викликається у `ensureSession`

Якщо щось зламано — попередь явно: «⚠ BREAKING CHANGE — гра НЕ синхронізуватиметься з бекендом, спершу треба оновити src/models/PoleSession.js і API на metaphysical-way2». НЕ деплой.

### Крок 4 — Коміт і push

Якщо нема uncommitted змін, останній коміт описовий — пропусти. Інакше:
```bash
git add .
git commit -m "release: <короткий опис що змінилось у цій версії>"
```

Push робить **користувач** через Cursor («Sync Changes» у Source Control panel).
Не запускай `git push` сам якщо ти на машині клієнта — у нього налаштовані credentials у Cursor, не в терміналі.

### Крок 5 — Дай користувачу чіткі інструкції на завантаження

Після build і push повідом користувачу **точно цей текст** (підстав реальний
розмір і slug, якщо знаєш):

> ✅ Готово. Single-file зібрано: `dist/index.html` (~XXX KB).
>
> 1. Зайди на **metaphysical-way.academy/demo** (під superadmin)
> 2. Якщо це **оновлення** існуючої сторінки — натисни **☁ «Замінити файл»**
>    на картці потрібного slug → вибери `dist/index.html`
> 3. Якщо це **нова гра** — натисни **«Завантажити HTML»**, заповни slug,
>    назву, додай юзерів у whitelist, ✅ «Показувати у меню» і назва в меню —
>    Зберегти
> 4. Перевір: відкрий `https://metaphysical-way.academy/<slug>` у іншій
>    вкладці залогінений як whitelist-юзер — гра має запуститись зі станом
>
> Anti-cache гарантовано (no-store headers + `?t=` cache-buster), нова версія
> підвантажиться відразу.

Не пропонуй автоматизацію через токен/CI — деплой завжди ручний через `/demo`,
це навмисний контроль безпеки.

### Чого НЕ робити при деплої
- ❌ Не пропускай smoke-тест навіть якщо клієнт квапить
- ❌ Не коміть з повідомленням типу `update`, `fix`, `wip` — пиши що саме змінилось
- ❌ Завжди `build:embed`, не `build` — у package.json лишений тільки embed-варіант, інший не годиться для /demo
- ❌ Не редагуй вручну `dist/index.html` — він регенерується кожний build
- ❌ Не комітьте `dist/` — він уже у `.gitignore`

## ✅ Чек-лист перед відповіддю

Перш ніж завершити завдання:
- [ ] **жоден файл > 300 рядків, жоден компонент > 150 рядків,
      жодна функція > 60 рядків** — якщо щось більше, розбий
- [ ] усі повторювані JSX-фрагменти витягнуті в reusable компоненти
- [ ] усі великі дані (масиви питань, конфіги) у `src/data/`
- [ ] усі hook-логіки (useEffect + state) витягнуті у custom hooks
- [ ] стан тільки через `useGameStore`, без useState на ігровий стан
- [ ] якщо змінив поля state — додав блок "ЗМІНИ НА БЕКЕНДІ"
- [ ] якщо це BREAKING CHANGE — попередив явно
- [ ] протестував у `npm run dev`, hot-reload працює

## 📚 Швидкий референс — як додати нове X

### Нову сцену
1. `src/scenes/MyScene.jsx` — компонент, читає state через `useGameStore`
2. У `App.jsx` додай умову роутингу (наприклад, `state.currentScene === 'my'`)
3. Стан перемикання — у store: `setScene: (name) => set({ currentScene: name })`

### Новий ресурс
1. У `defaultState.resources` додай `{ ..., myResource: 0 }`
2. У UI використай `addResource('myResource', 1)`
3. У `StatsPanel.jsx` додай рядок для відображення
4. **Поверни блок "ЗМІНИ НА БЕКЕНДІ"** з оновленням `resources` об'єкта

### Нову мутацію
1. У `gameStore.js` додай метод поряд із існуючими:
   ```js
   myAction: (param) => {
     const s = get();
     set({ ...ensureSession(s), <зміна полів> });
   }
   ```
2. Виклик: `useGameStore((s) => s.myAction)(...)`
