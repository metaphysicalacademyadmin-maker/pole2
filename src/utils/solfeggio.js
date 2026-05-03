// Solfeggio — стародавні «священні» частоти.
// Web Audio API генерує тон без аудіо-файлів (нуль bytes у bundle).
// Використовується як ambient mantra під час пелюсток.

const FREQS = {
  i_self:           396,   // звільнення від страху
  ii_body:          417,   // зміна, обрив циклів
  iii_rod:          396,   // звільнення від родових патернів
  iv_home:          396,   // заземлення
  v_relations:      528,   // любов і трансформація («міракл»)
  vi_creativity:    639,   // зв'язок, гармонія стосунків
  vii_realization:  741,   // правда, очищення вираження
  viii_spirit:      852,   // інтуіція, пробудження
  ix_knowledge:     852,   //
  x_purpose:        963,   // єдність зі джерелом
  xi_shadow:        285,   // зцілення зранених полів
  ix_unity:         963,   //
};

const DEFAULT_FREQ = 528;

let audioCtx = null;
let masterGain = null;
let oscillators = [];

function ensureContext() {
  if (audioCtx) return audioCtx;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.04;     // дуже тихо — ambient
    masterGain.connect(audioCtx.destination);
    return audioCtx;
  } catch (e) {
    return null;
  }
}

export function playMantra(petalId) {
  const ctx = ensureContext();
  if (!ctx) return false;
  if (ctx.state === 'suspended') ctx.resume();

  stopMantra();

  const freq = FREQS[petalId] || DEFAULT_FREQ;

  // Основний тон + 5-та (1.5×) — створює природну гармонію
  const tones = [
    { freq, type: 'sine',     gain: 0.6 },
    { freq: freq * 1.5, type: 'sine', gain: 0.25 },
    { freq: freq * 0.5, type: 'sine', gain: 0.4 },   // octave below = глибина
  ];

  for (const t of tones) {
    const osc = ctx.createOscillator();
    osc.type = t.type;
    osc.frequency.value = t.freq;
    const g = ctx.createGain();
    g.gain.value = t.gain;
    osc.connect(g).connect(masterGain);
    osc.start();
    oscillators.push({ osc, gain: g });
  }

  // Fade in
  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);

  return true;
}

export function stopMantra() {
  if (!audioCtx) return;
  // Fade out над 1с
  if (masterGain) {
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
  }
  setTimeout(() => {
    for (const { osc } of oscillators) {
      try { osc.stop(); osc.disconnect(); } catch {}
    }
    oscillators = [];
  }, 1100);
}

export function isMantraSupported() {
  return typeof window !== 'undefined' &&
    !!(window.AudioContext || window.webkitAudioContext);
}

export function getMantraFrequency(petalId) {
  return FREQS[petalId] || DEFAULT_FREQ;
}
