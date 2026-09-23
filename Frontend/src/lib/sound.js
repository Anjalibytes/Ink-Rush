// Tiny synthesized sound kit for InkRush.
// Everything is generated with the Web Audio API — no audio files to load,
// so nothing can 404. Every call is wrapped so a missing/blocked AudioContext
// simply results in silence instead of a broken UI.
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "inkrush:muted";

let ctx = null;
let noiseBuffer = null;
let lastScratch = 0;
const listeners = new Set();

let muted = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
})();

function getCtx() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

function envTone(ac, { freq, type = "sine", start = 0, dur = 0.15, gain = 0.15, endFreq }) {
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function play(fn) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  try {
    fn(ac);
  } catch {
    /* sound is optional — ignore */
  }
}

export const sound = {
  // Bright two-note "ding" for a correct guess
  ding() {
    play((ac) => {
      envTone(ac, { freq: 988, start: 0, dur: 0.18, gain: 0.16 });
      envTone(ac, { freq: 1480, start: 0.09, dur: 0.35, gain: 0.14 });
    });
  },

  // Subtle clock tick for the last 10 seconds
  tick(urgent = false) {
    play((ac) => {
      envTone(ac, { freq: urgent ? 1400 : 1100, type: "triangle", dur: 0.05, gain: 0.07 });
    });
  },

  // Soft "bonk" when a guess misses — deliberately gentle
  miss() {
    play((ac) => {
      envTone(ac, { freq: 260, endFreq: 190, type: "sine", dur: 0.14, gain: 0.07 });
    });
  },

  // Light pencil-on-paper scratch (throttled so fast strokes don't get noisy)
  scratch() {
    const now = performance.now();
    if (now - lastScratch < 70) return;
    lastScratch = now;
    play((ac) => {
      if (!noiseBuffer) {
        const len = Math.floor(ac.sampleRate * 0.08);
        noiseBuffer = ac.createBuffer(1, len, ac.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      }
      const src = ac.createBufferSource();
      src.buffer = noiseBuffer;
      const filter = ac.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2600 + Math.random() * 1400;
      filter.Q.value = 0.9;
      const g = ac.createGain();
      const t0 = ac.currentTime;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.035, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.07);
      src.connect(filter).connect(g).connect(ac.destination);
      src.start(t0);
      src.stop(t0 + 0.08);
    });
  },
};

export function setMuted(value) {
  muted = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* storage unavailable — keep in-memory value */
  }
  listeners.forEach((l) => l());
}

export function useMuted() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => muted,
    () => muted
  );
}
