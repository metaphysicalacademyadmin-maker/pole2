// Розширені actions для нових модулів. Імпортуються у gameStore.js.
// Кожен повертає функцію (set, get) → (...args) щоб уникнути циркулярних посилань.

const todayKey = () => new Date().toISOString().slice(0, 10);

export const ensureSession = (s, genSessionId) => ({
  sessionId: s.sessionId || genSessionId(),
  startedAt: s.startedAt || Date.now(),
  savedAt: Date.now(),
});

// ───────────── РОЗСТАНОВКИ ─────────────

export const constellationActions = (set, get, ensure) => ({
  placeFigure: (levelN, figure) => {
    const s = get();
    const lvl = s.constellations[levelN] || { figures: [], readings: [], resolution: '' };
    const figures = lvl.figures.filter((f) => f.id !== figure.id).concat(figure);
    set({
      ...ensure(s),
      constellations: { ...s.constellations, [levelN]: { ...lvl, figures } },
    });
  },
  removeFigure: (levelN, figureId) => {
    const s = get();
    const lvl = s.constellations[levelN] || { figures: [], readings: [], resolution: '' };
    set({
      ...ensure(s),
      constellations: {
        ...s.constellations,
        [levelN]: { ...lvl, figures: lvl.figures.filter((f) => f.id !== figureId) },
      },
    });
  },
  saveConstellationReading: (levelN, readingText) => {
    const s = get();
    const lvl = s.constellations[levelN] || { figures: [], readings: [], resolution: '' };
    set({
      ...ensure(s),
      constellations: {
        ...s.constellations,
        [levelN]: { ...lvl, readings: [...lvl.readings, { text: readingText, ts: Date.now() }] },
      },
    });
  },
  saveConstellationResolution: (levelN, resolutionText) => {
    const s = get();
    const lvl = s.constellations[levelN] || { figures: [], readings: [], resolution: '' };
    set({
      ...ensure(s),
      constellations: { ...s.constellations, [levelN]: { ...lvl, resolution: resolutionText } },
      journal: [...s.journal, { text: `Розстановка ${levelN}: ${resolutionText.slice(0, 60)}…`, tag: 'розстановка', ts: Date.now() }],
    });
  },
});

// ───────────── BODY MAP ─────────────

export const bodyMapActions = (set, get, ensure) => ({
  markBodyPoint: (cellId, point) => {
    // point: { x, y, depth, sensation }
    const s = get();
    const list = s.bodyMap[cellId] || [];
    set({
      ...ensure(s),
      bodyMap: { ...s.bodyMap, [cellId]: [...list, { ...point, ts: Date.now() }] },
    });
  },
});

// ───────────── ПРАКТИКИ ─────────────

export const practiceActions = (set, get, ensure) => ({
  completePractice: (practiceId, levelN, durationSec, reflection) => {
    const s = get();
    set({
      ...ensure(s),
      practiceCompletions: [
        ...s.practiceCompletions,
        { id: practiceId, levelN, durationSec, reflection, ts: Date.now() },
      ],
      journal: [...s.journal, { text: `Практика: ${practiceId}`, tag: 'практика', ts: Date.now() }],
    });
  },
});

// ───────────── КАНАЛИ ─────────────

export const channelActions = (set, get, ensure) => ({
  unlockChannel: (channelId) => {
    const s = get();
    if (s.channelsUnlocked.includes(channelId)) return;
    set({
      ...ensure(s),
      channelsUnlocked: [...s.channelsUnlocked, channelId],
      journal: [...s.journal, { text: `Відкрито канал: ${channelId}`, tag: 'канал', ts: Date.now() }],
    });
  },
  activateChannel: (channelId) => {
    const s = get();
    const active = s.channelsActive.includes(channelId)
      ? s.channelsActive
      : [...s.channelsActive, channelId];
    const acts = s.channelActivations[channelId] || { count: 0, lastUsed: null };
    set({
      ...ensure(s),
      channelsActive: active,
      channelActivations: {
        ...s.channelActivations,
        [channelId]: { count: acts.count + 1, lastUsed: Date.now() },
      },
    });
  },
  deactivateChannel: (channelId) => {
    const s = get();
    set({
      ...ensure(s),
      channelsActive: s.channelsActive.filter((c) => c !== channelId),
    });
  },
});

// ───────────── КАЙ ─────────────

export const kaiActions = (set, get, ensure) => ({
  bumpKaiTrust: (delta) => {
    const s = get();
    const trust = Math.max(0, Math.min(10, (s.kaiState.trust || 0) + delta));
    set({ ...ensure(s), kaiState: { ...s.kaiState, trust, lastSpoke: Date.now() } });
  },
  setKaiMood: (mood) => {
    const s = get();
    set({ ...ensure(s), kaiState: { ...s.kaiState, mood, lastSpoke: Date.now() } });
  },
});

// ───────────── DAILY ─────────────

export const dailyActions = (set, get, ensure) => ({
  completeDailyCheckIn: (payload) => {
    // payload: { scales, dream, morning }
    const s = get();
    const date = todayKey();
    const entry = { date, ...payload, ts: Date.now() };
    set({
      ...ensure(s),
      dailyCheckIns: [...s.dailyCheckIns, entry],
      lastCheckInDate: date,
      journal: [...s.journal, { text: `Ранковий чек-ін`, tag: 'ритуал', ts: Date.now() }],
    });
  },
  needsDailyCheckIn: () => {
    return get().lastCheckInDate !== todayKey();
  },
});

// ───────────── ДИЛЕМИ ─────────────

export const dilemmaActions = (set, get, ensure) => ({
  recordDilemma: (dilemmaId, payload) => {
    // payload: { choice, customText, weight }
    const s = get();
    set({
      ...ensure(s),
      moralChoices: {
        ...s.moralChoices,
        [dilemmaId]: { ...payload, ts: Date.now() },
      },
    });
  },
});

// ───────────── РЕАКТИВНЕ ТІЛО + UI ─────────────

export const uiActions = (set, get, ensure) => ({
  triggerChakraFlash: (chakraId) => {
    set({ flashChakraId: chakraId, flashCounter: (get().flashCounter || 0) + 1 });
  },
  setUiMode: (mode) => set({ uiMode: mode }),
  setThemeMode: (mode) => set({ themeMode: mode }),
});

// ───────────── DZERKALO (Mirror) ─────────────

export const mirrorActions = (set, get, ensure) => ({
  recordMirrorAppearance: (id, action) => {
    const s = get();
    set({
      ...ensure(s),
      mirrorAppearances: [...s.mirrorAppearances, { id, action, ts: Date.now() }],
    });
  },
});

// ───────────── АРБІТР І АНТИП ─────────────

export const characterActions = (set, get, ensure) => ({
  recordArbiterAppearance: (lineId) => {
    const s = get();
    if (s.arbiterAppearances.some((a) => a.id === lineId)) return;
    set({
      ...ensure(s),
      arbiterAppearances: [...s.arbiterAppearances, { id: lineId, ts: Date.now() }],
      journal: [...s.journal, { text: 'Арбітр свідчить', tag: 'арбітр', ts: Date.now() }],
    });
  },
  recordAntypChallenge: (provocationId, choice, opt) => {
    const s = get();
    const accepted = !!opt.arbiterTrigger;
    const newResources = { ...s.resources };
    if (opt.effect?.resource) {
      for (const [k, delta] of Object.entries(opt.effect.resource)) {
        newResources[k] = (newResources[k] || 0) + delta;
      }
    }
    const newPraxis = (s.praxis || 5) + (opt.effect?.praxis || 0);
    set({
      ...ensure(s),
      resources: newResources,
      praxis: Math.max(0, Math.min(10, newPraxis)),
      antypAppearances: [
        ...s.antypAppearances,
        { id: provocationId, choice, accepted, ts: Date.now() },
      ],
      journal: [...s.journal, {
        text: `Антип ${accepted ? 'прийнятий' : 'відкинутий'}: ${opt.text.slice(0, 40)}…`,
        tag: 'антип', ts: Date.now(),
      }],
    });
  },
});

// ───────────── ГОЛОС ─────────────

export const voiceActions = (set, get, ensure) => ({
  saveVoiceRecording: (keyN, dataUrl) => {
    const s = get();
    set({
      ...ensure(s),
      voiceRecordings: { ...s.voiceRecordings, [keyN]: dataUrl },
    });
  },
});

// ───────────── КАРТА ПОЛЯ ─────────────

export const fieldActions = (set, get, ensure) => ({
  recordBodyMeasurement: (bodyId, score) => {
    const s = get();
    set({
      ...ensure(s),
      bodyMeasurements: [
        ...s.bodyMeasurements,
        { bodyId, score, ts: Date.now() },
      ],
      journal: [...s.journal, {
        text: `Виміряно ${bodyId}: ${score}/100`,
        tag: 'поле',
        ts: Date.now(),
      }],
    });
  },
  addArchetype: (archetype) => {
    const s = get();
    if (s.archetypesMet.some((a) => a.id === archetype.id)) return;
    set({
      ...ensure(s),
      archetypesMet: [
        ...s.archetypesMet,
        { id: archetype.id, ts: Date.now(), context: archetype.encounterText },
      ],
      journal: [...s.journal, {
        text: `Архетип: ${archetype.name}`,
        tag: 'архетип',
        ts: Date.now(),
      }],
    });
  },
});

// ───────────── АРХІВ + ЕВОЛЮЦІЯ ─────────────

const HISTORY_KEY = 'pole_game_history_v1';
const HISTORY_MAX = 50;

export function buildArchive(set, get, defaultState, genSessionId) {
  return (reason = 'completed') => {
    const s = get();
    if (s.sessionId && s.startedAt) {
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        const history = raw ? JSON.parse(raw) : [];
        const snapshot = {
          sessionId: s.sessionId, startedAt: s.startedAt, finishedAt: Date.now(),
          reason, intention: s.intention, pathMode: s.pathMode,
          levelsCompleted: s.completedLevels.length,
          keys: { ...s.levelKeys }, resources: { ...s.resources },
          journal: s.journal, cellAnswers: s.cellAnswers,
          constellations: s.constellations, bodyMap: s.bodyMap,
          practiceCompletions: s.practiceCompletions,
          channelsUnlocked: s.channelsUnlocked,
          moralChoices: s.moralChoices, dailyCheckIns: s.dailyCheckIns,
        };
        const idx = history.findIndex((h) => h.sessionId === snapshot.sessionId);
        if (idx >= 0) history[idx] = snapshot; else history.push(snapshot);
        while (history.length > HISTORY_MAX) history.shift();
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      } catch (e) { console.warn('[gameStore] archive failed', e); }
    }
    const echo = (s.sessionId && s.completedLevels.length > 0) ? {
      previousSessionId: s.sessionId,
      previousIntention: s.intention,
      previousKeys: { ...s.levelKeys },
      previousLevelsCompleted: s.completedLevels.length,
      previousFinishedAt: Date.now(),
    } : null;
    set({
      ...defaultState,
      sessionId: genSessionId(), startedAt: Date.now(), savedAt: Date.now(),
      evolutionEcho: echo,
    });
  };
}
