# ПОЛЕ · Втілення

React-версія гри **ПОЛЕ · Втілення — Шлях Душі через Тіло**.
Синтез ПОЛЯ (наратив, питання душі) + АКАДЕМІЇ ПРАКТИК (тіло, чакри).
Зібрано з шаблону `metaphysicalacademyadmin-maker/template`.

Готовий артефакт — single-file `dist/index.html` для завантаження
через `/demo` на metaphysical-way.academy.

## Як стартанути нову гру з цього шаблону

**Цей репо — GitHub Template Repository.** Не редагуй його напряму
для конкретної гри. Замість цього:

### Варіант A — через GitHub UI (одна кнопка)
1. Відкрий цей репо на GitHub
2. Натисни **«Use this template» → «Create a new repository»**
3. Вкажи назву (наприклад `pole-game-meditation`) → Create
4. На сторінці нового репо натисни **«Open with Codespaces»** або клонуй у Cursor:
   ```
   git clone <url-нового-репо>
   ```
5. Далі див. «Швидкий старт» нижче

### Варіант B — через термінал (`gh CLI`)
```bash
gh repo create pole-game-meditation --template metaphysicalacademyadmin-maker/template --clone --public
cd pole-game-meditation
npm install
npm run dev
```

## Швидкий старт (після клонування)

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

## Workflow (для розробника)

1. Клонуй цей шаблон → нова гра
2. Відкрий проект у Cursor/VS Code з Claude Code
3. У панелі Claude напиши що хочеш — він сам редагуватиме файли за правилами
4. Перевіряй у браузері (`npm run dev` має бути запущений)
5. Коли готово — `git push` → GitHub Action збере single-file HTML
6. Скачай артефакт `game-embed` зі сторінки Actions → завантаж `embed.html` через `/demo`

## Як налаштувати цей репо як шаблон (раз)

```bash
# 1. Створи порожній репо на GitHub: pole-game-template
# 2. Прив'яжи і запушити
git remote add origin git@github.com:metaphysicalacademyadmin-maker/template.git
git push -u origin main
# 3. На GitHub: Settings → General → ✅ Template repository
```

Після цього кнопка «Use this template» доступна на сторінці репо.

## Структура проекту

```
src/
├── App.jsx               ← top-level layout
├── main.jsx              ← React entry
├── styles.css            ← глобальні стилі
├── scenes/               ← сцени гри (Welcome, Mandala, …)
├── components/           ← reusable UI
├── store/
│   └── gameStore.js      ← Zustand store (state + персистенція)
├── hooks/                ← кастомні hooks
└── data/                 ← тексти питань, конфіги
```

## Правила

Усі обов'язкові архітектурні правила — у [`CLAUDE.md`](./CLAUDE.md).
Він читається кожною Клауд-сесією. Дотримання цих правил гарантує,
що результат будете легко інтегрувати з бекендом і підтримувати.

## Інтеграція з metaphysical-way.academy

- Гра використовує `localStorage[pole_game_state_v1]` (через Zustand persist)
- Парент-сторінка автоматично синхронізує state із MongoDB кожні 5с
- Whitelist, меню-лінки і Telegram-сповіщення — налаштовуються на сайті
  через адмін-панель `/demo`

Деталі контракту з бекендом — у [`CLAUDE.md`](./CLAUDE.md) → секція
"Контракт із бекендом".
