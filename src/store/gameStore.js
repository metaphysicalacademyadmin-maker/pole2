import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sanitizeState } from './sanitize.js';
import {
  defaultState,
  ensureSession as ensure,
  clamp,
  genSessionId,
  SAVE_KEY,
} from './defaultState.js';
import {
  pathActions,
  cellActions,
  scaleActions,
  journalActions,
} from './coreActions.js';
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
  characterActions,
  uiActions,
  mirrorActions,
  petalActions,
  cosmoActions,
  socialActions,
  modalActions,
  achievementsActions,
  buildArchive,
} from './actions.js';

// ─────────────────────────────────────────────────────────────────
// gameStore — єдине джерело правди для стану гри ПОЛЕ · Втілення.
//
// Контракт із бекендом metaphysical-way.academy:
//   • localStorage ключ — `pole2_game_state_v1` (унікальний namespace pole2,
//     щоб не зіткнутись із legacy HTML-грою, яка використовує `pole_game_state_v1`)
//   • Парент-сторінка кожні 5с читає цей ключ і шле POST /api/pole-sessions/sync
//   • Архівні сесії — у `pole2_game_history_v1` (масив snapshot-ів)
//
// 🚫 НЕ можна змінювати:
//   - назви ключових полів state (sessionId, startedAt, savedAt)
//   - формат архівного snapshot у archiveAndReset()
// Назви localStorage-ключів МОЖНА змінювати, але ОБОВ'ЯЗКОВО синхронно з
// `metaphysical-way2/src/app/[slug]/StaticPageView.js` (POLE2_STATE_KEY/
// POLE2_HISTORY_KEY) інакше парент не побачить writes гри.
//
// Структура файлу:
//   defaultState.js — defaultState + ensureSession + clamp + genSessionId
//   coreActions.js  — path / cell / scale / journal мутації
//   actions.js      — розширені модулі (Хвиля 4+)
//   sanitize.js     — захист від stale state на rehydrate
// ─────────────────────────────────────────────────────────────────

const ensureLegacy = (s) => buildSession(s, genSessionId);


export const useGameStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      ...pathActions(set, get, ensure),
      ...cellActions(set, get, ensure),
      ...scaleActions(set, get, ensure, clamp),
      ...journalActions(set, get, ensure),

      archiveAndReset: buildArchive(set, get, defaultState, genSessionId),

      // ─── Розширені модулі (Хвиля 4+) ────────────────────────────
      ...constellationActions(set, get, ensureLegacy),
      ...bodyMapActions(set, get, ensureLegacy),
      ...practiceActions(set, get, ensureLegacy),
      ...channelActions(set, get, ensureLegacy),
      ...kaiActions(set, get, ensureLegacy),
      ...dailyActions(set, get, ensureLegacy),
      ...dilemmaActions(set, get, ensureLegacy),
      ...voiceActions(set, get, ensureLegacy),
      ...fieldActions(set, get, ensureLegacy),
      ...characterActions(set, get, ensureLegacy),
      ...uiActions(set, get, ensureLegacy),
      ...mirrorActions(set, get, ensureLegacy),
      ...petalActions(set, get, ensureLegacy),
      ...cosmoActions(set, get, ensureLegacy),
      ...socialActions(set, get, ensureLegacy),
      ...modalActions(set, get, ensureLegacy),
      ...achievementsActions(set, get, ensureLegacy),
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
      // Міграції між версіями state.
      migrate: (persistedState, version) => {
        if (version < 2) {
          return sanitizeState(persistedState || {}, defaultState);
        }
        return persistedState;
      },
    },
  ),
);
