# Backend Patch — для Nazar (metaphysical-way2)

Патч для синхронізації нових полів `pole2` (Епізоди 3, 4, 8, 9, 11, 12 + Хеллінгер А-Б) у MongoDB через `/api/pole-sessions/sync`.

**2 файли** для зміни. Усе copy-paste, нічого додумувати.

---

## 1. `src/models/PoleSession.js` — додати поля в схему

Знайти секцію де описані основні індексовані поля (поряд з `cellsVisited`, `keysCollected` тощо). Додати **після останнього індексованого блоку**:

```js
  // ─── Тижневі обіцянки (pole2 Епізод 3) ───
  currentQuestId: { type: String, default: null, index: true },
  currentQuestStartedAt: { type: Date, default: null },
  questsCompletedTotal: { type: Number, default: 0, index: true },

  // ─── Родовід базовий (pole2 Епізод 12) ───
  rodovidFilledCount: { type: Number, default: 0, index: true },
  rodovidHasParents: { type: Boolean, default: false, index: true },

  // ─── Хеллінгер-розширення родоводу (pole2 Етап А-Б) ───
  rodovidExcludedCount: { type: Number, default: 0 },
  rodovidExcludedAcknowledgedCount: { type: Number, default: 0 },
  rodovidEntanglementReleased: { type: Boolean, default: false, index: true },
  rodovidParentRitualMotherDone: { type: Boolean, default: false },
  rodovidParentRitualFatherDone: { type: Boolean, default: false },
  rodovidHistoryEventsCount: { type: Number, default: 0 },

  // ─── Опційні (для аналітики «імпульсивних vs терплячих») ───
  petalsOverriddenCount: { type: Number, default: 0 },
  shadowPetalAcknowledged: { type: Boolean, default: false },
```

**Чому індексуємо саме це:**
- `currentQuestId` — щоб запитувати «у кого зараз активна обіцянка»
- `questsCompletedTotal` — рейтинги/звіти
- `rodovidFilledCount` + `rodovidHasParents` — фільтр «хто почав робити з родом»
- `rodovidEntanglementReleased` — крос-аналітика «звільнення → активніша участь у академії»

Решта полів — без індексу, просто щоб було видно у документі.

---

## 2. `src/app/api/pole-sessions/sync/route.js` — додати mapping

Знайти `mapStateToDoc` (або подібну функцію де `state` мапиться у `doc`). Додати **в кінець об'єкта**, перед `fullSnapshot: state`:

```js
    // ─── Тижневі обіцянки ───
    currentQuestId: state.currentQuest?.id ?? null,
    currentQuestStartedAt: state.currentQuest?.startedAt
      ? new Date(state.currentQuest.startedAt)
      : null,
    questsCompletedTotal: (state.questHistory || [])
      .filter((q) => q.status === 'completed').length,

    // ─── Родовід базовий ───
    rodovidFilledCount: Object.keys(state.rodovid || {}).length,
    rodovidHasParents: !!(state.rodovid?.father || state.rodovid?.mother),

    // ─── Хеллінгер ───
    rodovidExcludedCount: (state.rodovidExcluded || []).length,
    rodovidExcludedAcknowledgedCount: (state.rodovidExcluded || [])
      .filter((e) => e.acknowledged).length,
    rodovidEntanglementReleased: !!state.rodovidEntanglement?.released,
    rodovidParentRitualMotherDone: !!(
      state.rodovidParentRitual?.mother?.acceptance
      && state.rodovidParentRitual?.mother?.release
    ),
    rodovidParentRitualFatherDone: !!(
      state.rodovidParentRitual?.father?.acceptance
      && state.rodovidParentRitual?.father?.release
    ),
    rodovidHistoryEventsCount: Object.values(state.rodovidHistory || {})
      .filter((v) => v === true).length,

    // ─── Опційні (аналітика) ───
    petalsOverriddenCount: Object.keys(state.petalCooldownOverrides || {}).length,
    shadowPetalAcknowledged: !!state.shadowPetalAcknowledged,
```

---

## 3. (опційно) `src/app/profile/components/PoleSessionsCard.js` — показати у профілі

Якщо хочеш щоб гравець бачив прогрес обіцянки і родоводу в кабінеті профілю на сайті — додай у renderItem:

```jsx
{session.currentQuestId && (
  <div className="pole-card-quest">
    ✦ активна обіцянка
  </div>
)}
{session.rodovidFilledCount >= 3 && (
  <div className="pole-card-rod">
    🌳 родове дерево {session.rodovidFilledCount}/15
  </div>
)}
{session.rodovidEntanglementReleased && (
  <div className="pole-card-rod-released">
    ⊹ переплетіння відпущено
  </div>
)}
```

---

## Що НЕ потрібно міняти

- `pole2_game_state_v1` / `pole2_game_history_v1` — ключі localStorage НЕ змінювались. Контракт стабільний.
- Формат архівного snapshot — без змін.
- Існуючі індексовані поля (`sessionId`, `intention`, `soulLevel`, тощо) — без змін.

## LLM-контракт (Епізоди 1, 11) — опційно

Якщо хочете додати **архетип-діалог** і **арбітра-свідка**, парент-сторінка має інжектити:

```js
window.__POLE_LLM__ = {
  // Свідчення Арбітра після пелюстки (Епізод 1)
  witness: async ({ text, levelN, chakra, intention }) => {
    // POST /api/pole-llm/witness
    // → { text, tone?: 'gentle'|'serious'|'celebratory' }
  },

  // Діалог з архетипом (Епізод 11)
  archetypeChat: async ({ archetype, message, history, intention }) => {
    // POST /api/pole-llm/archetype-chat
    // → { text, tone? }
  },
};
```

Деталі промптів і crisis-detection — у `src/utils/llm-witness.js` і `src/utils/archetype-chat.js` (коментарі вгорі).

Без `__POLE_LLM__` гра працює — просто без живих відповідей (для архетипа є fallback з 6 заздалегідь записаних реплік на кожен з 12).

## Presence-контракт (Епізод 10) — опційно

Для соціальної ноти «зараз у мандалі ще N людей» — інжектити:

```js
window.__POLE_PRESENCE__ = {
  total: 24,
  byLevel: [3, 4, 6, 5, 3, 2, 1],   // індекс 0 = рівень 1
  petalsActive: 8,                   // нове поле для пелюсток
  updatedAt: Date.now(),
};
```

Без нього гра показує детерміновані pseudo-цифри (~25-35% від total).

---

## Підсумок міграції БД

Після деплою бекенду — нові поля з'являться у документах автоматично при найближчому sync кожного юзера. Існуючі документи оновляться без міграції (Mongoose default-значення спрацюють).

Якщо хочеш одразу заповнити для всіх — окремий скрипт:

```js
await PoleSession.updateMany(
  { currentQuestId: { $exists: false } },
  { $set: {
    currentQuestId: null,
    questsCompletedTotal: 0,
    rodovidFilledCount: 0,
    rodovidHasParents: false,
    rodovidExcludedCount: 0,
    rodovidExcludedAcknowledgedCount: 0,
    rodovidEntanglementReleased: false,
    rodovidParentRitualMotherDone: false,
    rodovidParentRitualFatherDone: false,
    rodovidHistoryEventsCount: 0,
    petalsOverriddenCount: 0,
    shadowPetalAcknowledged: false,
  }}
);
```

Але навіть без цього — `find({ rodovidFilledCount: { $gte: 3 } })` працюватиме коректно (відсутні поля не матчаться, що еквівалентно `$gte: 3` = false).
