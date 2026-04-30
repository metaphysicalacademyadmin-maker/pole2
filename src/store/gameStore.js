import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sanitizeState } from './sanitize.js';
import {
  ensureSession as buildSession,
  constellationActions,
  bodyMapActions,
  practiceActions,
  channelActions,
  kaiActions,
  dailyActions,
  dilemmaActions,
  voiceActions,
  fieldActions,
  buildArchive,
} from './actions.js';

// ─────────────────────────────────────────────────────────────────
// gameStore — єдине джерело правди для стану гри ПОЛЕ · Втілення.
//
// Контракт із бекендом metaphysical-way.academy:
//   • localStorage ключ — `pole_game_state_v1`
//   • Парент-сторінка кожні 5с читає цей ключ і шле POST /api/pole-sessions/sync
//   • Архівні сесії — у `pole_game_history_v1` (масив snapshot-ів)
//
// 🚫 НЕ можна змінювати:
//   - назви ключів localStorage
//   - назви ключових полів state (sessionId, startedAt, savedAt)
//   - формат архівного snapshot у archiveAndReset()
// ─────────────────────────────────────────────────────────────────

const SAVE_KEY = 'pole_game_state_v1';
const HISTORY_KEY = 'pole_game_history_v1';
const HISTORY_MAX = 50;

const genSessionId = () =>
  Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);

const defaultState = {
  // ─── Identity (КРИТИЧНІ — не перейменовувати) ───
  sessionId: null,
  startedAt: null,
  savedAt: null,

  // ─── Шлях ───
  intention: '',
  pathMode: null,             // 'touch' | 'path' | 'depth'
  currentLevel: 0,            // 0 = вхід, 1..7 = рівні
  unlockedLevels: [0, 1],
  completedLevels: [],
  levelKeys: {},              // {1: 'Я тут...', 2: 'Хочу...'}

  // ─── Прогрес рівня ───
  levelProgress: {},          // {levelN: {answeredCells: ['r1','r2']}}
  cellAnswers: {},            // {cellId: {choice, customText, barometer, delta, ts}}
  currentCellIdx: 0,
  awaitingKey: false,         // true після останньої клітинки рівня → показуємо Key

  // ─── Ресурси та шкали ───
  resources: {
    root: 0, flow: 0, will: 0, love: 0,
    voice: 0, clarity: 0, light: 0, gratitude: 0,
  },
  stateScales: { energy: 0, wound: 0, bondage: 0, clarity: 0, protection: 0 },

  // ─── Журнал ───
  journal: [],

  // ─── Сумісність із загальним бекенд-контрактом ───
  visited: [],
  keys: [],
  soulLevel: 0,
  barometers: { spirit: 0, psyche: 0, emotion: 0, awareness: 0 },
  archetypesMet: [],
  unlockedAbilities: [],
  completedInitiations: [],

  // ─── Розстановки (Хвиля 4) ───
  // {level3: {figures: [{id, type, x, y, rotation, weight}], readings: [], resolution: ''}}
  constellations: {},

  // ─── Карта тіла ───
  // {cellId: [{x, y, depth, ts, sensation}]}
  bodyMap: {},

  // ─── Практики (Академія) ───
  // [{id, levelN, durationSec, reflection, ts}]
  practiceCompletions: [],

  // ─── Космоенергетичні канали ───
  channelsUnlocked: [],         // ['kraon', 'zeus', ...]
  channelsActive: [],           // що зараз увімкнено
  channelActivations: {},       // {channelId: {count, lastUsed}}

  // ─── Кай — супутник ───
  kaiState: {
    trust: 0,                   // 0..10, росте від чесних відповідей
    lastSpoke: null,            // ts
    mood: 'gentle',             // 'gentle' | 'concerned' | 'celebratory'
  },

  // ─── Денні чек-іни ───
  // [{date: '2026-04-30', scales: {...}, dream: '', morning: ''}]
  dailyCheckIns: [],
  lastCheckInDate: null,        // 'YYYY-MM-DD'

  // ─── Моральні дилеми (рівень 4) ───
  // {dilemmaId: {choice, customText, weight, ts}}
  moralChoices: {},

  // ─── Голос Душі ───
  // {keyN: dataUrl_base64}
  voiceRecordings: {},

  // ─── Резонанс ───
  // обчислюється з seed; зберігаємо лиш «бачив» події
  resonanceSeen: [],

  // ─── Еволюція між сесіями ───
  // {previousSessionId, previousIntention, previousKeys, divergenceScore}
  evolutionEcho: null,

  // ─── Карта Поля (Хвиля 5) ───
  // [{bodyId, score, ts}] — історія вимірювань
  bodyMeasurements: [],
  // {archetypeId: {ts, context}} — зустрінуті архетипи
  archetypesMet: [],
};

function ensureSession(s) {
  return {
    sessionId: s.sessionId || genSessionId(),
    startedAt: s.startedAt || Date.now(),
    savedAt: Date.now(),
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      // ─── Шлях і вхід ───────────────────────────────────────────

      setPathMode: (modeId) => {
        const s = get();
        // Вибір шляху — це початок нової сесії. Скидаємо проміжні поля,
        // щоб гравець гарантовано пройшов через екран наміру (Entry).
        // ЗБЕРІГАЄМО journal, completedLevels, levelKeys — це історія.
        const note = `Обрано шлях: ${modeId}`;
        set({
          ...ensureSession(s),
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
          ...ensureSession(s),
          pathMode: newMode,
          journal: [...s.journal, { text: note, tag: 'шлях', ts: Date.now() }],
        });
      },

      setIntention: (text) => {
        const s = get();
        set({
          ...ensureSession(s),
          intention: text,
          currentLevel: 1,           // після наміру переходимо на рівень 1
          journal: [...s.journal, { text: `Намір: ${text}`, tag: 'намір', ts: Date.now() }],
        });
      },

      // ─── Клітинки ──────────────────────────────────────────────

      recordAnswer: (levelN, cellId, payload) => {
        // payload: { choice, customText, barometer, delta, shadow }
        const s = get();
        const lp = s.levelProgress[levelN] || { answeredCells: [] };
        const answered = lp.answeredCells.includes(cellId)
          ? lp.answeredCells
          : [...lp.answeredCells, cellId];
        const newResources = { ...s.resources };
        if (payload.barometer && typeof payload.delta === 'number') {
          newResources[payload.barometer] =
            (newResources[payload.barometer] || 0) + payload.delta;
        }
        const updates = {
          ...ensureSession(s),
          cellAnswers: { ...s.cellAnswers, [cellId]: { ...payload, ts: Date.now() } },
          levelProgress: { ...s.levelProgress, [levelN]: { ...lp, answeredCells: answered } },
          resources: newResources,
          visited: s.visited.includes(cellId) ? s.visited : [...s.visited, cellId],
        };
        set(updates);
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
        // Якщо це остання клітинка — переходимо у режим очікування ключа.
        // App.jsx тоді показує сцену Key замість Level.
        const s = get();
        const nextIdx = s.currentCellIdx + 1;
        const isLastCell = typeof totalCells === 'number' && nextIdx >= totalCells;
        set({
          ...ensureSession(s),
          currentCellIdx: nextIdx,
          awaitingKey: isLastCell,
        });
      },

      resetCellIdx: () => set({ currentCellIdx: 0, awaitingKey: false }),

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
          ...ensureSession(s),
          completedLevels: completed,
          unlockedLevels: unlocked,
          levelKeys: { ...s.levelKeys, [levelN]: keyText },
          keys: s.keys.includes(keyText) ? s.keys : [...s.keys, keyText],
          currentLevel: nextLevel,
          currentCellIdx: 0,
          awaitingKey: false,
          journal: [...s.journal, { text: `Ключ ${levelN}: ${keyText}`, tag: 'ключ', ts: Date.now() }],
        });
      },

      // ─── Шкали стану ───────────────────────────────────────────

      setScale: (key, value) => {
        const s = get();
        set({
          ...ensureSession(s),
          stateScales: {
            ...s.stateScales,
            [key]: clamp(value, -2, 2),
          },
        });
      },

      // ─── Журнал ────────────────────────────────────────────────

      addJournalEntry: (text, tag = '') => {
        const s = get();
        set({
          ...ensureSession(s),
          journal: [...s.journal, { text, tag, ts: Date.now() }],
        });
      },

      archiveAndReset: buildArchive(set, get, defaultState, genSessionId),

      // ─── Розширені модулі (Хвиля 4+) ────────────────────────────
      ...constellationActions(set, get, (s) => buildSession(s, genSessionId)),
      ...bodyMapActions(set, get, (s) => buildSession(s, genSessionId)),
      ...practiceActions(set, get, (s) => buildSession(s, genSessionId)),
      ...channelActions(set, get, (s) => buildSession(s, genSessionId)),
      ...kaiActions(set, get, (s) => buildSession(s, genSessionId)),
      ...dailyActions(set, get, (s) => buildSession(s, genSessionId)),
      ...dilemmaActions(set, get, (s) => buildSession(s, genSessionId)),
      ...voiceActions(set, get, (s) => buildSession(s, genSessionId)),
      ...fieldActions(set, get, (s) => buildSession(s, genSessionId)),
    }),
    {
      name: SAVE_KEY,
      version: 2,
      // Санітизація при rehydrate — захист від stale/чужого state з
      // оригінального HTML-ПОЛЯ або пошкодженого localStorage.
      merge: (persisted, current) => {
        const cleaned = sanitizeState({ ...persisted }, defaultState);
        return { ...current, ...cleaned };
      },
      // Міграції між версіями state (для майбутніх змін поля).
      migrate: (persistedState, version) => {
        if (version < 2) {
          return sanitizeState(persistedState || {}, defaultState);
        }
        return persistedState;
      },
    },
  ),
);
