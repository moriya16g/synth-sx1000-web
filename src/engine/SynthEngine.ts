import type { SynthState, OctaveFootage } from '../types/synth';

// ── Mapping helpers ──

function mapToTime(v: number, min = 0.002, max = 5.0): number {
  return min * Math.pow(max / min, v);
}
function mapCutoff(v: number): number {
  return 20 * Math.pow(1000, v);
}
function mapQ(v: number): number {
  return 0.5 + v * 29.5;
}
function mapLFOSpeed(v: number): number {
  return 0.1 + v * 19.9;
}
function octOff(f: OctaveFootage): number {
  return f === '32' ? -24 : f === '16' ? -12 : f === '4' ? 12 : 0;
}
function mtof(n: number): number {
  return 440 * Math.pow(2, (n - 69) / 12);
}

// ── Analog modeling helpers ──

/** Attempt to convert an exponential time constant into a value
 *  that makes setTargetAtTime reach ~95% in the given duration.
 *  τ = duration / 3  (e^-3 ≈ 0.05 → 95% reached) */
function timeConstant(duration: number): number {
  return Math.max(0.001, duration / 3);
}

/** Build a soft-saturation curve for WaveShaperNode.
 *  Attempt to mimic analog transistor stage: tanh-style. */
function makeSaturationCurve(samples = 8192, drive = 3.5): Float32Array {
  const curve = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;          // -1 … +1
    // Asymmetric: positive clips harder → even harmonics (analog warmth)
    const d = x >= 0 ? drive : drive * 0.85;
    curve[i] = Math.tanh(x * d);
  }
  return curve;
}

/** Random ±cents drift, updated slowly — mimics analog VCO instability */
const DRIFT_MAX_CENTS = 6;     // ±6 cents max
const DRIFT_INTERVAL = 0.15;   // update every 150ms

/** Number of harmonics for PeriodicWave (browser auto-bandlimits at Nyquist) */
const NUM_HARMONICS = 128;
/** Sub-oscillator level relative to main VCO */
const SUB_OSC_LEVEL = 0.18;

/** Deterministic per-harmonic amplitude variation.
 *  Simulates analog component tolerance (±5%). */
function analogVar(n: number): number {
  return 1.0 + 0.05 * Math.sin(n * 7.13 + n * n * 0.31);
}

interface Voice {
  osc: OscillatorNode;
  subOsc: OscillatorNode;
  f1: BiquadFilterNode;
  f2: BiquadFilterNode;
  vca: GainNode;
  lfoOsc: OscillatorNode | null;
  lfoGain: GainNode | null;
  driftLfo: OscillatorNode | null;
  driftGain: GainNode | null;
  note: number;
  timer: ReturnType<typeof setTimeout> | null;
}

export class SynthEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private voice: Voice | null = null;
  private _state: SynthState;

  // Shared WaveShaper curves (created once per AudioContext)
  private satCurve: Float32Array | null = null;

  // Cached PeriodicWave objects for analog-modeled waveforms
  private analogSawWave: PeriodicWave | null = null;
  private pulseWaveCache: { pw: number; wave: PeriodicWave } | null = null;

  constructor(state: SynthState) {
    this._state = { ...state };
  }

  get state() { return this._state; }
  set state(s: SynthState) {
    this._state = s;
    this.updateLive();
  }

  /** Expose AudioContext for sequencer timing */
  get audioContext(): AudioContext | null { return this.ctx; }

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(this.ctx.destination);
    this.satCurve = makeSaturationCurve();
    this.analogSawWave = this.buildAnalogSawtooth();
  }

  /** iOS Safari requires resuming AudioContext on user gesture */
  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  // ── Analog PeriodicWave generators ──

  /** Analog-style sawtooth: standard 1/n harmonics with component-tolerance
   *  variation and subtle phase asymmetry. */
  private buildAnalogSawtooth(): PeriodicWave {
    const N = NUM_HARMONICS;
    const real = new Float32Array(N + 1);
    const imag = new Float32Array(N + 1);
    for (let n = 1; n <= N; n++) {
      const rolloff = 1.0 / (1.0 + n * n * 0.0001);
      imag[n] = (Math.pow(-1, n + 1) / n) * analogVar(n) * rolloff;
      real[n] = 0.004 * Math.cos(n * 2.71) / n; // tiny cosine leakage
    }
    return this.ctx!.createPeriodicWave(real, imag, { disableNormalization: false });
  }

  /** Pulse wave with variable duty cycle and analog flavor. */
  private buildPulseWave(dutyCycle: number): PeriodicWave {
    const pw = Math.max(0.05, Math.min(0.95, dutyCycle));
    const N = NUM_HARMONICS;
    const real = new Float32Array(N + 1);
    const imag = new Float32Array(N + 1);
    for (let n = 1; n <= N; n++) {
      const rolloff = 1.0 / (1.0 + n * n * 0.0001);
      const v = analogVar(n) * rolloff;
      real[n] = ((2 / (n * Math.PI)) * Math.sin(2 * Math.PI * n * pw)) * v;
      imag[n] = ((2 / (n * Math.PI)) * (1 - Math.cos(2 * Math.PI * n * pw))) * v;
    }
    return this.ctx!.createPeriodicWave(real, imag, { disableNormalization: false });
  }

  /** Get or build cached pulse wave for current duty cycle */
  private getPulseWave(dutyCycle: number): PeriodicWave {
    const pw = Math.max(0.05, Math.min(0.95, dutyCycle));
    if (this.pulseWaveCache && Math.abs(this.pulseWaveCache.pw - pw) < 0.005) {
      return this.pulseWaveCache.wave;
    }
    const wave = this.buildPulseWave(pw);
    this.pulseWaveCache = { pw, wave };
    return wave;
  }

  /** Apply the appropriate analog waveform to an oscillator */
  private applyWaveform(osc: OscillatorNode) {
    const { waveform, pulseWidth } = this._state.vco;
    if (waveform === 'sawtooth') {
      osc.setPeriodicWave(this.analogSawWave!);
    } else {
      osc.setPeriodicWave(this.getPulseWave(pulseWidth));
    }
  }

  /** Create a WaveShaperNode with our soft-saturation curve */
  private createSaturator(): WaveShaperNode {
    const ws = this.ctx!.createWaveShaper();
    ws.curve = this.satCurve as Float32Array<ArrayBuffer>;
    ws.oversample = '4x';  // reduce aliasing from nonlinearity
    return ws;
  }

  private updateLive() {
    if (!this.voice || !this.ctx) return;
    const v = this.voice;
    const { vco, vcf, lfo } = this._state;
    const now = this.ctx.currentTime;
    this.applyWaveform(v.osc);
    const freq = mtof(v.note + octOff(vco.octave) + vco.tune * 2);
    v.osc.frequency.setValueAtTime(freq, now);
    v.subOsc.frequency.setValueAtTime(freq / 2, now);
    const cf = mapCutoff(vcf.cutoff);
    v.f1.frequency.setValueAtTime(cf, now);
    v.f1.Q.setValueAtTime(mapQ(vcf.resonance), now);
    v.f2.frequency.setValueAtTime(cf, now);
    v.f2.Q.setValueAtTime(mapQ(vcf.resonance) * 0.7, now);
    if (v.lfoOsc && v.lfoGain) {
      v.lfoOsc.frequency.setValueAtTime(mapLFOSpeed(lfo.speed), now);
      try { v.lfoOsc.type = lfo.waveform; } catch {}
      const depth = lfo.destination === 'vco' ? lfo.amount * 100 : lfo.amount * cf * 0.5;
      v.lfoGain.gain.setValueAtTime(depth, now);
    }
  }

  noteOn(midi: number) {
    if (!this.ctx || !this.master) return;
    this.resume();
    if (this.voice) { this.kill(this.voice); this.voice = null; }

    const c = this.ctx;
    const now = c.currentTime;
    const { vco, vcf, vca, lfo } = this._state;

    // ── VCO (Analog PeriodicWave) ──
    const osc = c.createOscillator();
    const freq = mtof(midi + octOff(vco.octave) + vco.tune * 2);
    osc.frequency.setValueAtTime(freq, now);
    this.applyWaveform(osc);

    // [ANALOG] Pitch drift — slow random detune to mimic VCO instability
    const driftLfo = c.createOscillator();
    driftLfo.type = 'sine';
    driftLfo.frequency.setValueAtTime(1 / DRIFT_INTERVAL, now);
    const driftGain = c.createGain();
    driftGain.gain.setValueAtTime(DRIFT_MAX_CENTS, now);
    driftLfo.connect(driftGain).connect(osc.detune);
    driftLfo.start(now);

    const oscGain = c.createGain();
    oscGain.gain.setValueAtTime(vco.level, now);

    // ── Sub-oscillator (1 octave below, sine wave for analog weight) ──
    const subOsc = c.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq / 2, now);
    const subGain = c.createGain();
    subGain.gain.setValueAtTime(vco.level * SUB_OSC_LEVEL, now);

    // [ANALOG] Soft saturation on oscillator output
    const oscSat = this.createSaturator();

    // ── VCF – cascade two 12dB/oct = 24dB/oct ──
    const f1 = c.createBiquadFilter(); f1.type = 'lowpass';
    const f2 = c.createBiquadFilter(); f2.type = 'lowpass';
    const cf = mapCutoff(vcf.cutoff);
    const q = mapQ(vcf.resonance);
    f1.frequency.setValueAtTime(cf, now); f1.Q.setValueAtTime(q, now);
    f2.frequency.setValueAtTime(cf, now); f2.Q.setValueAtTime(q * 0.7, now);

    // [ANALOG] Soft clipping between filter stages (simulates transistor ladder saturation)
    const filterSat = this.createSaturator();

    // VCF ADSR — exponential curves via setTargetAtTime
    if (vcf.envAmount > 0) {
      const peak = cf + vcf.envAmount * (20000 - cf);
      const sus = cf + vcf.envAmount * vcf.sustain * (20000 - cf);
      const aT = mapToTime(vcf.attack), dT = mapToTime(vcf.decay);
      for (const f of [f1, f2]) {
        f.frequency.setValueAtTime(cf, now);
        f.frequency.setTargetAtTime(peak, now, timeConstant(aT));
        f.frequency.setTargetAtTime(sus, now + aT, timeConstant(dT));
      }
    }

    // ── VCA ADSR — exponential curves ──
    const vcaN = c.createGain();
    const aT = mapToTime(vca.attack), dT = mapToTime(vca.decay);
    vcaN.gain.setValueAtTime(0.0001, now);
    // Attack: exponential rise to peak
    vcaN.gain.setTargetAtTime(vca.volume, now, timeConstant(aT));
    // Decay: exponential fall to sustain level
    vcaN.gain.setTargetAtTime(vca.volume * vca.sustain, now + aT, timeConstant(dT));

    // ── LFO ──
    let lfoOsc: OscillatorNode | null = null;
    let lfoGain: GainNode | null = null;
    if (lfo.amount > 0) {
      lfoOsc = c.createOscillator();
      lfoOsc.type = lfo.waveform;
      lfoOsc.frequency.setValueAtTime(mapLFOSpeed(lfo.speed), now);
      lfoGain = c.createGain();
      if (lfo.destination === 'vco') {
        lfoGain.gain.setValueAtTime(lfo.amount * 100, now);
        lfoOsc.connect(lfoGain).connect(osc.detune);
      } else {
        lfoGain.gain.setValueAtTime(lfo.amount * cf * 0.5, now);
        lfoOsc.connect(lfoGain).connect(f1.frequency);
      }
      lfoOsc.start(now);
    }

    // ── Signal chain ──
    // (Main VCO + Sub VCO) → Merge → Saturation → Filter1 → Saturation → Filter2 → VCA → Master
    const oscMerge = c.createGain();
    oscMerge.gain.setValueAtTime(1, now);
    osc.connect(oscGain).connect(oscMerge);
    subOsc.connect(subGain).connect(oscMerge);
    oscMerge.connect(oscSat).connect(f1);
    f1.connect(filterSat).connect(f2);
    f2.connect(vcaN).connect(this.master);
    osc.start(now);
    subOsc.start(now);

    this.voice = { osc, subOsc, f1, f2, vca: vcaN, lfoOsc, lfoGain, driftLfo, driftGain, note: midi, timer: null };
  }

  noteOff(midi: number) {
    if (!this.voice || !this.ctx || this.voice.note !== midi) return;
    const v = this.voice;
    const now = this.ctx.currentTime;
    const { vcf, vca } = this._state;
    const rVCA = mapToTime(vca.release);
    const rVCF = mapToTime(vcf.release);
    const cf = mapCutoff(vcf.cutoff);

    // VCA release — exponential decay to silence
    v.vca.gain.cancelScheduledValues(now);
    v.vca.gain.setValueAtTime(v.vca.gain.value, now);
    v.vca.gain.setTargetAtTime(0.0001, now, timeConstant(rVCA));

    // VCF release — exponential return to base cutoff
    for (const f of [v.f1, v.f2]) {
      f.frequency.cancelScheduledValues(now);
      f.frequency.setValueAtTime(f.frequency.value, now);
      f.frequency.setTargetAtTime(cf, now, timeConstant(rVCF));
    }

    // Schedule cleanup after release completes (~5τ = 99.3%)
    const cleanup = Math.max(rVCA, rVCF) * 1.7 + 0.1;
    v.timer = setTimeout(() => {
      this.kill(v);
      if (this.voice === v) this.voice = null;
    }, cleanup * 1000);
  }

  private kill(v: Voice) {
    if (v.timer) clearTimeout(v.timer);
    try { v.osc.stop(); } catch {}
    try { v.subOsc.stop(); } catch {}
    try { v.lfoOsc?.stop(); } catch {}
    try { v.driftLfo?.stop(); } catch {}
  }

  dispose() {
    if (this.voice) { this.kill(this.voice); this.voice = null; }
    this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.satCurve = null;
    this.analogSawWave = null;
    this.pulseWaveCache = null;
  }
}
