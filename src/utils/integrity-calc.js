// Розрахунок integrity для 7 тонких тіл — 0-100.
// Базується на:
//  1. Прямі вимірювання гравця (state.bodyMeasurements) — найвагоміше
//  2. Барометри (resources) — 30%
//  3. Завершені рівні + ключі — 25%
//  4. Виконані практики що відновлюють це тіло — 20%
//  5. Активні канали + розблоковані — 15%
//
// Формула:
//   integrity = lastMeasurement (якщо є за останні 14 днів)
//              інакше — обчислюється з активностей
//
// Кожна активність дає +X% до конкретного тіла, не вище 100.

import { SUBTLE_BODIES } from '../data/subtle-bodies.js';

const ABSENT_THRESHOLD_MS = 14 * 24 * 60 * 60 * 1000;   // 14 днів

// Розрахунок одного тіла без вимірювань (з activity)
function activityScore(body, state) {
  let score = 30;     // базовий рівень — кожне тіло «жиє» на старті

  // 1. Resources
  for (const resKey of body.sourceResources || []) {
    const v = state.resources?.[resKey] || 0;
    score += Math.min(15, v * 1.5);   // до 15% з одного ресурсу, capped
  }

  // 2. Завершений «свій» рівень піраміди
  if (body.sourceLevel && (state.completedLevels || []).includes(body.sourceLevel)) {
    score += 15;
  }

  // 3. Виконані практики на це тіло
  const myPractices = (state.practiceCompletions || [])
    .filter((p) => body.restoredByPractices?.includes(p.id));
  score += Math.min(20, myPractices.length * 4);

  // 4. Активні + розблоковані канали
  const channelsForBody = body.restoredByChannels || [];
  const unlocked = (state.channelsUnlocked || []).filter((c) => channelsForBody.includes(c)).length;
  const active = (state.channelsActive || []).filter((c) => channelsForBody.includes(c)).length;
  score += Math.min(10, unlocked * 3) + Math.min(10, active * 5);

  // 5. Custom answers — глибокі відповіді живлять усе
  const customCount = Object.values(state.cellAnswers || {}).filter((a) => a.customText).length;
  score += Math.min(10, customCount * 1);

  return Math.max(0, Math.min(100, Math.round(score)));
}

// Останнє вимірювання тіла з історії
function lastMeasurement(bodyId, measurements) {
  const list = (measurements || []).filter((m) => m.bodyId === bodyId);
  if (list.length === 0) return null;
  return list.reduce((a, b) => (a.ts > b.ts ? a : b));
}

// Основна функція — повертає {bodyId: integrity}
export function calcIntegrity(state) {
  const out = {};
  for (const body of SUBTLE_BODIES) {
    const last = lastMeasurement(body.id, state.bodyMeasurements);
    const activity = activityScore(body, state);

    if (last && Date.now() - last.ts < ABSENT_THRESHOLD_MS) {
      // Гібрид: 70% — пряме вимірювання, 30% — поточна активність
      out[body.id] = Math.round(last.score * 0.7 + activity * 0.3);
    } else {
      out[body.id] = activity;
    }
  }
  return out;
}

// Загальний % поля — середнє з усіх 7
export function fieldOverall(integrity) {
  const vals = Object.values(integrity);
  if (vals.length === 0) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

// Найслабше тіло — кому потрібна турбота
export function weakestBody(integrity) {
  let weakest = null, min = 101;
  for (const [id, val] of Object.entries(integrity)) {
    if (val < min) { min = val; weakest = id; }
  }
  return weakest ? { id: weakest, score: min } : null;
}

// Тренд — порівняння двох останніх вимірювань
export function trendForBody(bodyId, measurements) {
  const list = (measurements || []).filter((m) => m.bodyId === bodyId).sort((a, b) => a.ts - b.ts);
  if (list.length < 2) return 0;
  return list[list.length - 1].score - list[list.length - 2].score;
}
