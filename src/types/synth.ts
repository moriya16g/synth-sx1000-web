export type WaveformType = 'sawtooth' | 'square';
export type OctaveFootage = '32' | '16' | '8' | '4';
export type LFOWaveform = 'sine' | 'triangle' | 'square' | 'sawtooth';
export type LFODestination = 'vco' | 'vcf';

export interface VCOParams {
  waveform: WaveformType;
  octave: OctaveFootage;
  tune: number;
  pulseWidth: number;
  pwmAmount: number;
  level: number;
}

export interface VCFParams {
  cutoff: number;
  resonance: number;
  envAmount: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface VCAParams {
  volume: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface LFOParams {
  speed: number;
  waveform: LFOWaveform;
  destination: LFODestination;
  amount: number;
}

export interface SynthState {
  vco: VCOParams;
  vcf: VCFParams;
  vca: VCAParams;
  lfo: LFOParams;
}

export const DEFAULT_SYNTH_STATE: SynthState = {
  vco: {
    waveform: 'sawtooth',
    octave: '8',
    tune: 0,
    pulseWidth: 0.5,
    pwmAmount: 0,
    level: 0.8,
  },
  vcf: {
    cutoff: 0.7,
    resonance: 0.2,
    envAmount: 0.3,
    attack: 0.01,
    decay: 0.3,
    sustain: 0.6,
    release: 0.2,
  },
  vca: {
    volume: 0.7,
    attack: 0.01,
    decay: 0.2,
    sustain: 0.7,
    release: 0.3,
  },
  lfo: {
    speed: 0.3,
    waveform: 'sine',
    destination: 'vco',
    amount: 0.2,
  },
};
