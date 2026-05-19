import type { SynthState, OctaveFootage } from '../types/synth';

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

interface Voice {
  osc: OscillatorNode;
  f1: BiquadFilterNode;
  f2: BiquadFilterNode;
  vca: GainNode;
  lfoOsc: OscillatorNode | null;
  lfoGain: GainNode | null;
  note: number;
  timer: ReturnType<typeof setTimeout> | null;
}

export class SynthEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private voice: Voice | null = null;
  private _state: SynthState;

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
  }

  /** iOS Safari requires resuming AudioContext on user gesture */
  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
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

    // VCO
    const osc = c.createOscillator();
    osc.type = vco.waveform;
    osc.frequency.setValueAtTime(mtof(midi + octOff(vco.octave) + vco.tune * 2), now);

    const oscGain = c.createGain();
    oscGain.gain.setValueAtTime(vco.level, now);

    // VCF – cascade two 12dB/oct = 24dB/oct
    const f1 = c.createBiquadFilter(); f1.type = 'lowpass';
    const f2 = c.createBiquadFilter(); f2.type = 'lowpass';
    const cf = mapCutoff(vcf.cutoff);
    const q = mapQ(vcf.resonance);
    f1.frequency.setValueAtTime(cf, now); f1.Q.setValueAtTime(q, now);
    f2.frequency.setValueAtTime(cf, now); f2.Q.setValueAtTime(q * 0.7, now);

    // VCF ADSR
    if (vcf.envAmount > 0) {
      const peak = cf + vcf.envAmount * (20000 - cf);
      const sus = cf + vcf.envAmount * vcf.sustain * (20000 - cf);
      const a = mapToTime(vcf.attack), d = mapToTime(vcf.decay);
      for (const f of [f1, f2]) {
        f.frequency.setValueAtTime(cf, now);
        f.frequency.linearRampToValueAtTime(peak, now + a);
        f.frequency.linearRampToValueAtTime(sus, now + a + d);
      }
    }

    // VCA ADSR
    const vcaN = c.createGain();
    const aT = mapToTime(vca.attack), dT = mapToTime(vca.decay);
    vcaN.gain.setValueAtTime(0.0001, now);
    vcaN.gain.linearRampToValueAtTime(vca.volume, now + aT);
    vcaN.gain.linearRampToValueAtTime(vca.volume * vca.sustain, now + aT + dT);

    // LFO
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

    // Signal chain
    osc.connect(oscGain).connect(f1);
    f1.connect(f2).connect(vcaN).connect(this.master);
    osc.start(now);

    this.voice = { osc, f1, f2, vca: vcaN, lfoOsc, lfoGain, note: midi, timer: null };
  }

  noteOff(midi: number) {
    if (!this.voice || !this.ctx || this.voice.note !== midi) return;
    const v = this.voice;
    const now = this.ctx.currentTime;
    const { vcf, vca } = this._state;
    const rVCA = mapToTime(vca.release);
    const rVCF = mapToTime(vcf.release);
    const cf = mapCutoff(vcf.cutoff);

    v.vca.gain.cancelScheduledValues(now);
    v.vca.gain.setValueAtTime(v.vca.gain.value, now);
    v.vca.gain.linearRampToValueAtTime(0.0001, now + rVCA);

    for (const f of [v.f1, v.f2]) {
      f.frequency.cancelScheduledValues(now);
      f.frequency.setValueAtTime(f.frequency.value, now);
      f.frequency.linearRampToValueAtTime(cf, now + rVCF);
    }

    v.timer = setTimeout(() => {
      this.kill(v);
      if (this.voice === v) this.voice = null;
    }, Math.max(rVCA, rVCF) * 1000 + 100);
  }

  private kill(v: Voice) {
    if (v.timer) clearTimeout(v.timer);
    try { v.osc.stop(); } catch {}
    try { v.lfoOsc?.stop(); } catch {}
  }

  dispose() {
    if (this.voice) { this.kill(this.voice); this.voice = null; }
    this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
