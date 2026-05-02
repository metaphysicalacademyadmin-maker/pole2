// М'які тонові сигнали для медитації — sine з довгим release.
// Усе генерується Web Audio API, без аудіо-файлів (нуль bundle-cost).

let _ctx = null;
function ctx() {
  if (typeof window === 'undefined') return null;
  if (!_ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    _ctx = new C();
  }
  // Деякі браузери блокують autoplay — context resume() потрібен по user gesture
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
}

// Один тон. Частота у Hz, тривалість у секундах.
// Sine + м'яка квінта-гармоніка (×1.5) додає багатства, не роблячи різко.
function tone(freq, duration = 0.9, volume = 0.35, delaySec = 0) {
  const c = ctx();
  if (!c) return;
  const t0 = c.currentTime + delaySec;
  const master = c.createGain();
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.exponentialRampToValueAtTime(volume, t0 + 0.04);
  master.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  master.connect(c.destination);

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  osc.connect(master);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);

  // Друга, тихіша гармоніка — гілку відсіюємо при дуже високому freq
  if (freq < 1000) {
    const o2 = c.createOscillator();
    const g2 = c.createGain();
    o2.type = 'sine';
    o2.frequency.value = freq * 1.5;
    g2.gain.value = 0.35;
    o2.connect(g2);
    g2.connect(master);
    o2.start(t0);
    o2.stop(t0 + duration + 0.05);
  }
}

// Лише два знаки — щоб не плутати:
//   half  — половина часу пройшла (один низький тон 432 Гц, "якір")
//   end   — медитація завершилась (висхідний триплет, "розв'язка")
export function playChime(kind) {
  if (typeof window === 'undefined') return;
  if (!isSoundOn()) return;
  switch (kind) {
    case 'half':
      tone(432, 1.4, 0.45);
      break;
    case 'end':
      tone(528, 1.0, 0.5);
      tone(659, 1.0, 0.5, 0.6);
      tone(880, 1.8, 0.42, 1.2);
      break;
    default:
      break;
  }
}

// Глобальна mute-настройка — у localStorage щоб переживати reload
const KEY = 'pole_chimes_on';
export function isSoundOn() {
  if (typeof window === 'undefined') return false;
  const v = window.localStorage.getItem(KEY);
  return v === null ? true : v === '1';
}
export function setSoundOn(on) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, on ? '1' : '0');
}
