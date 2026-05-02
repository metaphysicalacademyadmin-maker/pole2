// Розширені actions для нових модулів. Імпортуються у gameStore.js.
// Кожен повертає функцію (set, get) → (...args) щоб уникнути циркулярних посилань.

import { HISTORY_KEY } from './defaultState.js';

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
    const entry = { date, kind: 'morning', ...payload, ts: Date.now() };
    set({
      ...ensure(s),
      dailyCheckIns: [...s.dailyCheckIns, entry],
      lastCheckInDate: date,
      journal: [...s.journal, { text: `🌅 Ранковий ритуал`, tag: 'ритуал', ts: Date.now() }],
    });
  },
  completeEveningRitual: (evening) => {
    // evening: { shadow, light, gratitude }
    const s = get();
    const date = todayKey();
    const entry = { date, kind: 'evening', evening, ts: Date.now() };
    set({
      ...ensure(s),
      dailyCheckIns: [...s.dailyCheckIns, entry],
      lastEveningDate: date,
      journal: [...s.journal, { text: `🌙 Вечірній ритуал · ${evening.gratitude?.slice(0, 40) || ''}`, tag: 'ритуал', ts: Date.now() }],
    });
  },
  needsDailyCheckIn: () => {
    return get().lastCheckInDate !== todayKey();
  },
  needsEveningRitual: () => {
    return get().lastEveningDate !== todayKey();
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

// ───────────── КОСМОЕНЕРГЕТИКА ─────────────

export const cosmoActions = (set, get, ensure) => ({
  markCosmoIntroSeen: (cardId) => {
    const s = get();
    if (s.cosmoIntroSeen.includes(cardId)) return;
    set({
      ...ensure(s),
      cosmoIntroSeen: [...s.cosmoIntroSeen, cardId],
    });
  },
  submitCosmoApplication: (answers) => {
    const s = get();
    set({
      ...ensure(s),
      cosmoApplication: {
        answers,
        status: 'submitted',
        ts: Date.now(),
        reviewedAt: null,
      },
      journal: [...s.journal, {
        text: '🔮 Заявку у космоенергетику подано',
        tag: 'шлях', ts: Date.now(),
      }],
    });
  },
  reviewCosmoApplication: (decision) => {
    // decision: 'approved' | 'rejected' (admin action)
    const s = get();
    if (!s.cosmoApplication) return;
    set({
      ...ensure(s),
      cosmoApplication: {
        ...s.cosmoApplication,
        status: decision,
        reviewedAt: Date.now(),
      },
      journal: [...s.journal, {
        text: `🔮 Заявку: ${decision === 'approved' ? 'прийнято' : 'відхилено'}`,
        tag: 'шлях', ts: Date.now(),
      }],
    });
  },
  initiateCosmo: () => {
    const s = get();
    if (!s.cosmoApplication || s.cosmoApplication.status !== 'approved') return;
    set({
      ...ensure(s),
      cosmoApplication: { ...s.cosmoApplication, status: 'initiated', initiatedAt: Date.now() },
      journal: [...s.journal, {
        text: '⚡ Ініціація космоенергетики',
        tag: 'шлях', ts: Date.now(),
      }],
    });
  },
  enterChannel: (channelId) => set({ currentChannelId: channelId }),
  exitChannel: () => set({ currentChannelId: null }),
  recordChannelAnswer: (channelId, cellId, totalCells, payload) => {
    const s = get();
    const key = `${channelId}-${cellId}`;
    const newResources = { ...s.resources };
    if (payload.barometer && typeof payload.delta === 'number') {
      const next = (newResources[payload.barometer] || 0) + payload.delta;
      newResources[payload.barometer] = Math.max(-10, Math.min(10, next));
    }
    const prev = s.channelProgress[channelId] || { answeredIds: [], completed: false, certifiedAt: null };
    const answeredIds = prev.answeredIds.includes(cellId)
      ? prev.answeredIds : [...prev.answeredIds, cellId];
    const completed = answeredIds.length >= totalCells;
    set({
      ...ensure(s),
      resources: newResources,
      channelAnswers: { ...s.channelAnswers, [key]: { ...payload, ts: Date.now() } },
      channelProgress: {
        ...s.channelProgress,
        [channelId]: {
          ...prev, answeredIds, completed,
          certifiedAt: completed && !prev.certifiedAt ? Date.now() : prev.certifiedAt,
        },
      },
      journal: completed && !prev.completed
        ? [...s.journal, { text: `⚡ Сертифікат каналу: ${channelId}`, tag: 'шлях', ts: Date.now() }]
        : s.journal,
    });
  },
});

// ───────────── РЕЗОНАНСНІ ДЗЕРКАЛА (соц) ─────────────

export const socialActions = (set, get, ensure) => ({
  triggerResonance: ({ pseudoPlayer, message, levelN, barometer }) => {
    const s = get();
    if (s.currentResonance) return;
    set({
      ...ensure(s),
      currentResonance: { pseudoPlayer, message, levelN, barometer, ts: Date.now() },
    });
    get().showModal('resonance', 20);
  },
  resolveResonance: (response) => {
    const s = get();
    if (!s.currentResonance) return;
    const r = s.currentResonance;
    set({
      ...ensure(s),
      currentResonance: null,
      resonanceHistory: [...s.resonanceHistory,
        { pseudoPlayerId: r.pseudoPlayer.id, message: r.message,
          response, levelN: r.levelN, ts: Date.now() },
      ],
    });
    get().closeModal();
  },
  generateMyPartnershipCode: (code) => {
    const s = get();
    const existing = s.partnership;
    if (existing?.myCode) return;
    set({
      ...ensure(s),
      partnership: {
        ...(existing || {}),
        myCode: code,
        partnerCode: existing?.partnerCode || null,
        partnerData: existing?.partnerData || null,
        sharedAnswers: existing?.sharedAnswers || {},
        createdAt: Date.now(),
      },
    });
  },
  enterPartnerCode: (code, partnerData) => {
    const s = get();
    set({
      ...ensure(s),
      partnership: {
        ...(s.partnership || {}),
        partnerCode: code,
        partnerData,
        sharedAnswers: s.partnership?.sharedAnswers || {},
        lastSyncAt: Date.now(),
      },
      journal: [...s.journal, {
        text: `👯 Партнерство активоване з ${partnerData.name}`,
        tag: 'шлях', ts: Date.now(),
      }],
    });
  },
  recordSharedAnswer: (questionId, myText, partnerText) => {
    const s = get();
    if (!s.partnership) return;
    set({
      ...ensure(s),
      partnership: {
        ...s.partnership,
        sharedAnswers: {
          ...s.partnership.sharedAnswers,
          [questionId]: { mine: myText, partners: partnerText, ts: Date.now() },
        },
        lastSyncAt: Date.now(),
      },
    });
  },
  exitPartnership: () => {
    set({ partnership: null });
  },
  joinCircle: (circleId) => {
    const s = get();
    set({
      ...ensure(s),
      joinedCircle: { id: circleId, joinedAt: Date.now() },
      journal: [...s.journal, {
        text: `🔮 Приєднано до Кола Сили: ${circleId}`,
        tag: 'шлях', ts: Date.now(),
      }],
    });
  },
  leaveCircle: () => {
    set({ joinedCircle: null });
  },
});

// ───────────── 9 ПЕЛЮСТОК (post-game) ─────────────

export const petalActions = (set, get, ensure) => ({
  activatePetals: () => {
    const s = get();
    set({
      ...ensure(s),
      petalsActive: true,
      journal: [...s.journal, {
        text: '✦ Шлях продовжено — 12 пелюсток відкрито',
        tag: 'шлях', ts: Date.now(),
      }],
    });
  },
  enterPetal: (petalId) => {
    set({ currentPetalId: petalId });
  },
  exitPetal: () => {
    set({ currentPetalId: null });
  },
  acknowledgeMandalaFinal: () => {
    const s = get();
    set({
      ...ensure(s),
      mandalaFinalShown: true,
      journal: [...s.journal, {
        text: '✺ Квітка Життя · 12 пелюсток розкриті',
        tag: 'шлях', ts: Date.now(),
      }],
    });
  },
  submitGift: (payload) => {
    // payload: { text, kind, forLevelN? }
    const s = get();
    const gift = {
      id: `gift_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      text: (payload.text || '').trim(),
      kind: payload.kind,
      forLevelN: payload.forLevelN || null,
      ts: Date.now(),
    };
    if (!gift.text) return null;
    set({
      ...ensure(s),
      gifts: [...(s.gifts || []), gift],
      journal: [...s.journal, {
        text: `✨ Дар у Поле: ${gift.kind} · «${gift.text.slice(0, 60)}${gift.text.length > 60 ? '…' : ''}»`,
        tag: 'дар', ts: Date.now(),
      }],
    });
    return gift;
  },
  removeGift: (giftId) => {
    const s = get();
    set({
      ...ensure(s),
      gifts: (s.gifts || []).filter((g) => g.id !== giftId),
    });
  },
  acknowledgeFourthSpiral: () => set({ fourthSpiralAcknowledged: true }),
  recordPetalAnswer: (petalId, cellId, totalCellsInPetal, payload) => {
    const s = get();
    const key = `${petalId}-${cellId}`;
    const newResources = { ...s.resources };
    if (payload.barometer && typeof payload.delta === 'number') {
      const next = (newResources[payload.barometer] || 0) + payload.delta;
      newResources[payload.barometer] = Math.max(-10, Math.min(10, next));
    }
    const prevProgress = s.petalProgress[petalId] || { completed: false, answeredIds: [], ts: null };
    const answeredIds = prevProgress.answeredIds.includes(cellId)
      ? prevProgress.answeredIds
      : [...prevProgress.answeredIds, cellId];
    const completed = answeredIds.length >= totalCellsInPetal;
    set({
      ...ensure(s),
      resources: newResources,
      petalAnswers: { ...s.petalAnswers, [key]: { ...payload, ts: Date.now() } },
      petalProgress: {
        ...s.petalProgress,
        [petalId]: { completed, answeredIds, ts: Date.now() },
      },
      journal: completed && !prevProgress.completed
        ? [...s.journal, { text: `✦ Пелюстка ${petalId} завершена`, tag: 'шлях', ts: Date.now() }]
        : s.journal,
    });
  },
});

// ───────────── ДОСЯГНЕННЯ ─────────────

export const achievementsActions = (set, get, ensure) => ({
  awardAchievements: (ids) => {
    if (!ids || ids.length === 0) return;
    const s = get();
    const ts = Date.now();
    const earnedIds = new Set((s.achievements || []).map((a) => a.id));
    const fresh = ids.filter((id) => !earnedIds.has(id));
    if (fresh.length === 0) return;
    set({
      ...ensure(s),
      achievements: [...(s.achievements || []), ...fresh.map((id) => ({ id, ts }))],
      journal: [...s.journal, ...fresh.map((id) => ({
        text: `🏆 Досягнення: ${id}`,
        tag: 'досягнення',
        ts,
      }))],
    });
  },
});

// ───────────── ЧЕРГА МОДАЛОК ─────────────

export const modalActions = (set, get, ensure) => ({
  showModal: (id, priority = 30) => {
    const s = get();
    const entry = { id, priority };
    if (!s.activeModal) {
      set({ activeModal: entry });
      return;
    }
    // Якщо нова має вищий пріоритет — витісняє поточну (поточна → у чергу)
    if (priority > s.activeModal.priority) {
      const next = [...s.modalQueue, s.activeModal].sort((a, b) => b.priority - a.priority);
      set({ activeModal: entry, modalQueue: next });
    } else {
      const next = [...s.modalQueue, entry].sort((a, b) => b.priority - a.priority);
      set({ modalQueue: next });
    }
  },
  closeModal: () => {
    const s = get();
    if (s.modalQueue.length === 0) {
      set({ activeModal: null });
    } else {
      const [next, ...rest] = s.modalQueue;
      set({ activeModal: next, modalQueue: rest });
    }
  },
});

// ───────────── РЕАКТИВНЕ ТІЛО + UI ─────────────

export const uiActions = (set, get, ensure) => ({
  triggerChakraFlash: (chakraId) => {
    set({ flashChakraId: chakraId, flashCounter: (get().flashCounter || 0) + 1 });
  },
  triggerChakraDim: (chakraId) => {
    // Чакра пригасає на 3 секунди (shadow-вибір на її рівні)
    set({ dimChakraId: chakraId, dimCounter: (get().dimCounter || 0) + 1 });
  },
  setUiMode: (mode) => set({ uiMode: mode }),
  setThemeMode: (mode) => set({ themeMode: mode }),
  completeOnboarding: () => set({ onboardingDone: true }),
  resetOnboarding: () => set({ onboardingDone: false }),
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
  startArchetypeCalibration: (suggestedId) => {
    const s = get();
    if (s.archetypeCalibration?.status) return;
    set({
      ...ensure(s),
      archetypeCalibration: { status: 'pending', suggested: suggestedId, confirmed: null, ts: null },
    });
    get().showModal('archetype-calibration', 35);
  },
  confirmArchetype: (archetypeId) => {
    const s = get();
    set({
      ...ensure(s),
      archetypeCalibration: {
        status: 'confirmed',
        suggested: s.archetypeCalibration?.suggested || null,
        confirmed: archetypeId,
        ts: Date.now(),
      },
      journal: [...s.journal, {
        text: `Калібровка: я — ${archetypeId}`,
        tag: 'архетип', ts: Date.now(),
      }],
    });
    get().closeModal();
  },
  skipArchetypeCalibration: () => {
    const s = get();
    set({
      ...ensure(s),
      archetypeCalibration: {
        ...(s.archetypeCalibration || {}),
        status: 'skipped',
        ts: Date.now(),
      },
    });
    get().closeModal();
  },
  startArchetypeTransformation: ({ fromId, toId, eligibleLevel }) => {
    const s = get();
    if (s.currentArchetypeTransformation) return;
    set({
      ...ensure(s),
      currentArchetypeTransformation: { fromId, toId, eligibleLevel, ts: Date.now() },
    });
    get().showModal('archetype-transform', 60);
  },
  acceptArchetypeTransformation: () => {
    const s = get();
    const t = s.currentArchetypeTransformation;
    if (!t) return;
    set({
      ...ensure(s),
      archetypeCalibration: {
        ...(s.archetypeCalibration || {}),
        confirmed: t.toId,
        ts: Date.now(),
      },
      currentArchetypeTransformation: null,
      archetypeTransformations: [...s.archetypeTransformations,
        { from: t.fromId, to: t.toId, eligibleLevel: t.eligibleLevel, response: 'accepted', ts: Date.now() },
      ],
      journal: [...s.journal, {
        text: `✦ Трансформація архетипу: ${t.fromId} → ${t.toId}`,
        tag: 'архетип', ts: Date.now(),
      }],
    });
    get().closeModal();
  },
  openSpecializationChoice: () => {
    const s = get();
    if (s.specialization) return;
    set({ ...ensure(s), specializationOpen: true });
    get().showModal('specialization', 40);
  },
  setSpecialization: (id) => {
    const s = get();
    set({
      ...ensure(s),
      specialization: { id, ts: Date.now() },
      specializationOpen: false,
      journal: [...s.journal, {
        text: `✦ Спеціалізація обрана: ${id}`,
        tag: 'архетип', ts: Date.now(),
      }],
    });
    get().closeModal();
  },
  closeSpecializationChoice: () => {
    set({ specializationOpen: false });
    get().closeModal();
  },
  rejectArchetypeTransformation: () => {
    const s = get();
    const t = s.currentArchetypeTransformation;
    if (!t) return;
    set({
      ...ensure(s),
      currentArchetypeTransformation: null,
      archetypeTransformations: [...s.archetypeTransformations,
        { from: t.fromId, to: t.toId, eligibleLevel: t.eligibleLevel, response: 'rejected', ts: Date.now() },
      ],
    });
    get().closeModal();
  },
  triggerShadowMirror: (payload) => {
    // payload: {category, label, keyword, reflection, helpline, cellId, customText}
    const s = get();
    set({
      ...ensure(s),
      currentShadowMirror: { ...payload, ts: Date.now() },
    });
    get().showModal('shadow-mirror', payload.helpline ? 95 : 50);
  },
  acknowledgeCrisis: () => {
    const s = get();
    set({
      ...ensure(s),
      crisisAcknowledgedTs: Date.now(),
      journal: [...s.journal, {
        text: '⚡ Криза Системи · усвідомлено',
        tag: 'тінь', ts: Date.now(),
      }],
    });
    get().closeModal();
  },
  resolveTurningPoint: ({ choice, barometer }) => {
    const s = get();
    const newResources = { ...s.resources };
    newResources[barometer] = Math.max(-10, Math.min(10, (newResources[barometer] || 0) + 2));
    set({
      ...ensure(s),
      resources: newResources,
      turningPointShown: true,
      turningPointResponse: { choice, barometer, ts: Date.now() },
      journal: [...s.journal, {
        text: `⚡ Точка Перевороту: ${choice.slice(0, 50)}…`,
        tag: 'тінь', ts: Date.now(),
      }],
    });
    get().closeModal();
  },
  resolveShadowMirror: (response) => {
    // response: 'seen' | 'not_mine'
    const s = get();
    if (!s.currentShadowMirror) return;
    const entry = { ...s.currentShadowMirror, response, resolvedAt: Date.now() };
    set({
      ...ensure(s),
      currentShadowMirror: null,
      shadowMirrorHistory: [...s.shadowMirrorHistory, entry],
      journal: [...s.journal, {
        text: `🪞 Дзеркало Тіні (${entry.label}): ${response === 'seen' ? 'побачив' : 'не моє'} — «${entry.keyword}»`,
        tag: 'тінь-дзеркало', ts: Date.now(),
      }],
    });
    get().closeModal();
  },
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
  clearVoiceRecording: (keyN) => {
    const s = get();
    const next = { ...s.voiceRecordings };
    delete next[keyN];
    set({
      ...ensure(s),
      voiceRecordings: next,
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
  recordAuraReading: ({ cellId, levelN, before, after, keyword }) => {
    const s = get();
    const delta = (after || 0) - (before || 0);
    const sign = delta > 0 ? '+' : '';
    set({
      ...ensure(s),
      auraReadings: [
        ...s.auraReadings,
        { cellId, levelN, before, after, delta, keyword, ts: Date.now() },
      ],
      journal: [...s.journal, {
        text: `Аура: ${before}→${after}см (${sign}${delta}). Ключ: «${keyword}»`,
        tag: 'аура',
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
