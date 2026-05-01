// Базові мутації гри: шлях / намір / клітинка / ключ / шкала / журнал.
// Винесено з gameStore.js, щоб тримати головний файл під лімітом 300 рядків.
// Кожен модуль приймає (set, get, ensure) і повертає об'єкт actions.

export const pathActions = (set, get, ensure) => ({
  setPathMode: (modeId) => {
    const s = get();
    // Вибір шляху — це початок нової сесії. Скидаємо проміжні поля,
    // щоб гравець гарантовано пройшов через екран наміру (Entry).
    // ЗБЕРІГАЄМО journal, completedLevels, levelKeys — це історія.
    const note = `Обрано шлях: ${modeId}`;
    set({
      ...ensure(s),
      pathMode: modeId,
      intention: '',
      currentLevel: 0,
      currentCellIdx: 0,
      journal: [...s.journal, { text: note, tag: 'шлях', ts: Date.now() }],
    });
  },

  upgradePathMode: (newMode) => {
    const s = get();
    if (s.pathMode === newMode) return;
    const note = `Шлях підвищено: ${s.pathMode} → ${newMode}`;
    set({
      ...ensure(s),
      pathMode: newMode,
      journal: [...s.journal, { text: note, tag: 'шлях', ts: Date.now() }],
    });
  },

  setIntention: (text) => {
    const s = get();
    set({
      ...ensure(s),
      intention: text,
      currentLevel: 1, // після наміру переходимо на рівень 1
      journal: [...s.journal, { text: `Намір: ${text}`, tag: 'намір', ts: Date.now() }],
    });
  },
});

export const cellActions = (set, get, ensure) => ({
  // payload: { choice, customText, barometer, delta, shadow }
  recordAnswer: (levelN, cellId, payload) => {
    const s = get();
    const lp = s.levelProgress[levelN] || { answeredCells: [] };
    const answered = lp.answeredCells.includes(cellId)
      ? lp.answeredCells
      : [...lp.answeredCells, cellId];
    const newResources = { ...s.resources };
    if (payload.barometer && typeof payload.delta === 'number') {
      // Барометри полярні: -10..+10. Клампимо щоб уникнути overflow.
      const next = (newResources[payload.barometer] || 0) + payload.delta;
      newResources[payload.barometer] = Math.max(-10, Math.min(10, next));
    }
    set({
      ...ensure(s),
      cellAnswers: { ...s.cellAnswers, [cellId]: { ...payload, ts: Date.now() } },
      levelProgress: { ...s.levelProgress, [levelN]: { ...lp, answeredCells: answered } },
      resources: newResources,
      visited: s.visited.includes(cellId) ? s.visited : [...s.visited, cellId],
    });
    // Детект архетипу — асинхронно (не блокує UI). Якщо знайдено новий — додаємо.
    Promise.all([
      import('../utils/archetype-detector.js'),
      import('../data/archetypes.js'),
    ]).then(([{ detectArchetype }, { findArchetype }]) => {
      const newState = get();
      const found = detectArchetype(newState, { type: 'answer', payload });
      if (found) {
        const full = findArchetype(found.id);
        if (full) get().addArchetype(full);
      }
    }).catch(() => {});
  },

  advanceCell: (totalCells) => {
    // Якщо це остання клітинка — режим очікування ключа.
    // App.jsx тоді показує сцену Key замість Level.
    const s = get();
    const nextIdx = s.currentCellIdx + 1;
    const isLastCell = typeof totalCells === 'number' && nextIdx >= totalCells;
    set({
      ...ensure(s),
      currentCellIdx: nextIdx,
      awaitingKey: isLastCell,
    });
  },

  resetCellIdx: () => set({ currentCellIdx: 0, awaitingKey: false }),

  // Snake-bite: гравець обрав тіньовий варіант на snake-клітинці.
  // Подвійне падіння: відкат на 2 клітинки назад, запис у journal.
  applySnakeBite: ({ cellId, levelN, barometer }) => {
    const s = get();
    const jumpBack = 2;
    const newIdx = Math.max(0, s.currentCellIdx - jumpBack);
    set({
      ...ensure(s),
      currentCellIdx: newIdx,
      awaitingKey: false,
      snakePenalties: [...(s.snakePenalties || []), { cellId, levelN, barometer, jumpBack, ts: Date.now() }],
      journal: [...s.journal, {
        text: `🐍 Тіньова зустріч: ${barometer} впав ще глибше, повертаюсь на ${jumpBack} клітинки`,
        tag: 'тінь', ts: Date.now(),
      }],
    });
  },

  // Викликається з Key-екрану — гравець «бере ключ» і йде на наступний рівень.
  claimKey: (levelN, keyText) => {
    const s = get();
    const completed = s.completedLevels.includes(levelN)
      ? s.completedLevels
      : [...s.completedLevels, levelN];
    const nextLevel = levelN + 1;
    const unlocked = s.unlockedLevels.includes(nextLevel)
      ? s.unlockedLevels
      : [...s.unlockedLevels, nextLevel];
    set({
      ...ensure(s),
      completedLevels: completed,
      unlockedLevels: unlocked,
      levelKeys: { ...s.levelKeys, [levelN]: keyText },
      keys: s.keys.includes(keyText) ? s.keys : [...s.keys, keyText],
      currentLevel: nextLevel,
      currentCellIdx: 0,
      awaitingKey: false,
      journal: [...s.journal, { text: `Ключ ${levelN}: ${keyText}`, tag: 'ключ', ts: Date.now() }],
    });
    // Резонансне дзеркало — після ключа, асинхронно через 1.5с
    Promise.all([
      import('../utils/pseudo-player.js'),
      import('../data/chakras.js'),
    ]).then(([{ pickPseudoPlayer, pickResonanceMessage }, { chakraForLevel }]) => {
      const chakra = chakraForLevel(levelN);
      const barometer = chakra?.barometers?.[0] || 'light';
      const seed = `${s.sessionId || ''}-${levelN}-${keyText}`;
      const pseudoPlayer = pickPseudoPlayer(seed);
      const message = pickResonanceMessage(barometer, seed + '-msg');
      setTimeout(() => {
        const trigger = get().triggerResonance;
        if (trigger) trigger({ pseudoPlayer, message, levelN, barometer });
      }, 1500);
    }).catch(() => {});
  },
});

export const scaleActions = (set, get, ensure, clamp) => ({
  setScale: (key, value) => {
    const s = get();
    set({
      ...ensure(s),
      stateScales: {
        ...s.stateScales,
        [key]: clamp(value, -2, 2),
      },
    });
  },
});

export const journalActions = (set, get, ensure) => ({
  addJournalEntry: (text, tag = '') => {
    const s = get();
    set({
      ...ensure(s),
      journal: [...s.journal, { text, tag, ts: Date.now() }],
    });
  },
});
