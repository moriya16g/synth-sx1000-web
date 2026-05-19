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
function makeSaturationCurve(samples = 8192, drive = 1.5): Float32Array {
  const curve = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;          // -1 … +1
    curve[i] = Math.tanh(x * drive);           // tanh soft-clip
  }
  return curve;
}

/** Random ±cents drift, updated slowly — mimics analog VCO instability */
const DRIFT_MAX_CENTS = 6;     // ±6 cents max
const DRIFT_INTERVAL = 0.15;   // update every 150ms

interface Voice {
  osc: OscillatorNode;
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

  constructor(state: SynthState) {
    this._state = { ...state };
  }

  get state() { return this._state; }
  set state(s: SynthState) {
    this._state = s;
    this.updateLive();
  }

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(this.ctx.destination);
    this.satCurve = makeSaturationCurve();
  }

  /** iOS Safari requires resuming AudioContext on user gesture */
  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
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
    try { v.osc.type = vco.waveform; } catch {}
    const freq = mtof(v.note + octOff(vco.octave) + vco.tune * 2);
    v.osc.frequency.setValueAtTime(freq, now);
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

    // ── VCO ──
    const osc = c.createOscillator();
    osc.type = vco.waveform;
    osc.frequency.setValueAtTime(mtof(midi + octOff(vco.octave) + vco.tune * 2), now);

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
    // VCO → Level → Saturation → Filter1 → Saturation → Filter2 → VCA → Master
    osc.connect(oscGain).connect(oscSat).connect(f1);
    f1.connect(filterSat).connect(f2);
    f2.connect(vcaN).connect(this.master);
    osc.start(now);

    this.voice = { osc, f1, f2, vca: vcaN, lfoOsc, lfoGain, driftLfo, driftGain, note: midi, timer: null };
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
    try { v.lfoOsc?.stop(); } catch {}
    try { v.driftLfo?.stop(); } catch {}
  }

  dispose() {
    if (this.voice) { this.kill(this.voice); this.voice = null; }
    this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.satCurve = null;
  }
}
