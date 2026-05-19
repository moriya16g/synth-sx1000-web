import type { SynthState } from '../types/synth';

export interface Preset {
  name: string;
  category: string;
  state: SynthState;
}

export const PRESET_CATEGORIES = [
  'INIT',
  'BASS',
  'LEAD',
  'PAD',
  'KEY',
  'BRASS',
  'STRING',
  'SFX',
] as const;

export const PRESETS: Preset[] = [
  // ── INIT ──
  {
    name: 'Init',
    category: 'INIT',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.7, resonance: 0.2, envAmount: 0.3, attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.2 },
      vca: { volume: 0.7, attack: 0.01, decay: 0.2, sustain: 0.7, release: 0.3 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },

  // ── BASS ──
  {
    name: 'Fat Bass',
    category: 'BASS',
    state: {
      vco: { waveform: 'sawtooth', octave: '16', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.9 },
      vcf: { cutoff: 0.35, resonance: 0.3, envAmount: 0.4, attack: 0.0, decay: 0.25, sustain: 0.0, release: 0.08 },
      vca: { volume: 0.8, attack: 0.0, decay: 0.3, sustain: 0.7, release: 0.1 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },
  {
    name: 'Sub Bass',
    category: 'BASS',
    state: {
      vco: { waveform: 'square', octave: '32', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 1.0 },
      vcf: { cutoff: 0.25, resonance: 0.1, envAmount: 0.2, attack: 0.0, decay: 0.2, sustain: 0.0, release: 0.1 },
      vca: { volume: 0.85, attack: 0.0, decay: 0.15, sustain: 0.8, release: 0.15 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },
  {
    name: 'Acid Bass',
    category: 'BASS',
    state: {
      vco: { waveform: 'sawtooth', octave: '16', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.9 },
      vcf: { cutoff: 0.2, resonance: 0.7, envAmount: 0.7, attack: 0.0, decay: 0.15, sustain: 0.0, release: 0.05 },
      vca: { volume: 0.75, attack: 0.0, decay: 0.2, sustain: 0.0, release: 0.08 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },
  {
    name: 'Pluck Bass',
    category: 'BASS',
    state: {
      vco: { waveform: 'sawtooth', octave: '16', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.85 },
      vcf: { cutoff: 0.4, resonance: 0.15, envAmount: 0.5, attack: 0.0, decay: 0.12, sustain: 0.0, release: 0.05 },
      vca: { volume: 0.75, attack: 0.0, decay: 0.25, sustain: 0.0, release: 0.08 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },
  {
    name: 'Funky Bass',
    category: 'BASS',
    state: {
      vco: { waveform: 'square', octave: '16', tune: 0, pulseWidth: 0.3, pwmAmount: 0, level: 0.85 },
      vcf: { cutoff: 0.3, resonance: 0.45, envAmount: 0.55, attack: 0.0, decay: 0.18, sustain: 0.1, release: 0.08 },
      vca: { volume: 0.75, attack: 0.0, decay: 0.2, sustain: 0.6, release: 0.12 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },
  {
    name: 'Round Bass',
    category: 'BASS',
    state: {
      vco: { waveform: 'sawtooth', octave: '16', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.28, resonance: 0.1, envAmount: 0.15, attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.15 },
      vca: { volume: 0.7, attack: 0.01, decay: 0.25, sustain: 0.65, release: 0.2 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },

  // ── LEAD ──
  {
    name: 'Classic Lead',
    category: 'LEAD',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.6, resonance: 0.25, envAmount: 0.3, attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.2 },
      vca: { volume: 0.7, attack: 0.01, decay: 0.15, sustain: 0.8, release: 0.2 },
      lfo: { speed: 0.4, waveform: 'sine', destination: 'vco', amount: 0.15 },
    },
  },
  {
    name: 'Screaming Lead',
    category: 'LEAD',
    state: {
      vco: { waveform: 'sawtooth', octave: '4', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.9 },
      vcf: { cutoff: 0.75, resonance: 0.5, envAmount: 0.2, attack: 0.0, decay: 0.2, sustain: 0.7, release: 0.15 },
      vca: { volume: 0.7, attack: 0.0, decay: 0.1, sustain: 0.85, release: 0.15 },
      lfo: { speed: 0.5, waveform: 'sine', destination: 'vco', amount: 0.2 },
    },
  },
  {
    name: 'Square Lead',
    category: 'LEAD',
    state: {
      vco: { waveform: 'square', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.55, resonance: 0.2, envAmount: 0.25, attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.2 },
      vca: { volume: 0.7, attack: 0.01, decay: 0.1, sustain: 0.85, release: 0.2 },
      lfo: { speed: 0.35, waveform: 'sine', destination: 'vco', amount: 0.12 },
    },
  },
  {
    name: 'Portamento Lead',
    category: 'LEAD',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.85 },
      vcf: { cutoff: 0.65, resonance: 0.3, envAmount: 0.35, attack: 0.02, decay: 0.25, sustain: 0.55, release: 0.25 },
      vca: { volume: 0.7, attack: 0.03, decay: 0.15, sustain: 0.8, release: 0.25 },
      lfo: { speed: 0.45, waveform: 'sine', destination: 'vco', amount: 0.18 },
    },
  },
  {
    name: 'Nasal Lead',
    category: 'LEAD',
    state: {
      vco: { waveform: 'square', octave: '8', tune: 0, pulseWidth: 0.2, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.45, resonance: 0.55, envAmount: 0.2, attack: 0.0, decay: 0.15, sustain: 0.7, release: 0.15 },
      vca: { volume: 0.65, attack: 0.0, decay: 0.1, sustain: 0.8, release: 0.15 },
      lfo: { speed: 0.4, waveform: 'triangle', destination: 'vco', amount: 0.1 },
    },
  },

  // ── PAD ──
  {
    name: 'Warm Pad',
    category: 'PAD',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0.3, level: 0.7 },
      vcf: { cutoff: 0.4, resonance: 0.15, envAmount: 0.1, attack: 0.5, decay: 0.5, sustain: 0.8, release: 0.6 },
      vca: { volume: 0.6, attack: 0.6, decay: 0.4, sustain: 0.8, release: 0.7 },
      lfo: { speed: 0.15, waveform: 'sine', destination: 'vco', amount: 0.08 },
    },
  },
  {
    name: 'Square Pad',
    category: 'PAD',
    state: {
      vco: { waveform: 'square', octave: '8', tune: 0, pulseWidth: 0.45, pwmAmount: 0.4, level: 0.7 },
      vcf: { cutoff: 0.45, resonance: 0.1, envAmount: 0.08, attack: 0.55, decay: 0.5, sustain: 0.85, release: 0.65 },
      vca: { volume: 0.55, attack: 0.65, decay: 0.45, sustain: 0.8, release: 0.75 },
      lfo: { speed: 0.12, waveform: 'sine', destination: 'vco', amount: 0.06 },
    },
  },
  {
    name: 'Dark Pad',
    category: 'PAD',
    state: {
      vco: { waveform: 'sawtooth', octave: '16', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.75 },
      vcf: { cutoff: 0.25, resonance: 0.1, envAmount: 0.05, attack: 0.7, decay: 0.6, sustain: 0.9, release: 0.8 },
      vca: { volume: 0.55, attack: 0.8, decay: 0.5, sustain: 0.85, release: 0.9 },
      lfo: { speed: 0.1, waveform: 'sine', destination: 'vcf', amount: 0.15 },
    },
  },
  {
    name: 'Shimmer Pad',
    category: 'PAD',
    state: {
      vco: { waveform: 'sawtooth', octave: '4', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.65 },
      vcf: { cutoff: 0.5, resonance: 0.35, envAmount: 0.15, attack: 0.6, decay: 0.5, sustain: 0.7, release: 0.7 },
      vca: { volume: 0.5, attack: 0.7, decay: 0.4, sustain: 0.75, release: 0.8 },
      lfo: { speed: 0.2, waveform: 'triangle', destination: 'vcf', amount: 0.2 },
    },
  },
  {
    name: 'PWM Pad',
    category: 'PAD',
    state: {
      vco: { waveform: 'square', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0.6, level: 0.7 },
      vcf: { cutoff: 0.5, resonance: 0.12, envAmount: 0.1, attack: 0.5, decay: 0.4, sustain: 0.8, release: 0.65 },
      vca: { volume: 0.55, attack: 0.55, decay: 0.35, sustain: 0.8, release: 0.7 },
      lfo: { speed: 0.18, waveform: 'sine', destination: 'vco', amount: 0.05 },
    },
  },

  // ── KEY ──
  {
    name: 'Electric Piano',
    category: 'KEY',
    state: {
      vco: { waveform: 'square', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.75 },
      vcf: { cutoff: 0.5, resonance: 0.1, envAmount: 0.4, attack: 0.0, decay: 0.2, sustain: 0.0, release: 0.15 },
      vca: { volume: 0.65, attack: 0.0, decay: 0.4, sustain: 0.3, release: 0.25 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0.05 },
    },
  },
  {
    name: 'Clav',
    category: 'KEY',
    state: {
      vco: { waveform: 'square', octave: '8', tune: 0, pulseWidth: 0.3, pwmAmount: 0, level: 0.85 },
      vcf: { cutoff: 0.6, resonance: 0.3, envAmount: 0.5, attack: 0.0, decay: 0.1, sustain: 0.0, release: 0.05 },
      vca: { volume: 0.7, attack: 0.0, decay: 0.2, sustain: 0.0, release: 0.08 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },
  {
    name: 'Harpsichord',
    category: 'KEY',
    state: {
      vco: { waveform: 'sawtooth', octave: '4', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.55, resonance: 0.2, envAmount: 0.6, attack: 0.0, decay: 0.08, sustain: 0.0, release: 0.05 },
      vca: { volume: 0.65, attack: 0.0, decay: 0.3, sustain: 0.0, release: 0.1 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },
  {
    name: 'Organ',
    category: 'KEY',
    state: {
      vco: { waveform: 'square', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.6, resonance: 0.05, envAmount: 0.0, attack: 0.0, decay: 0.1, sustain: 1.0, release: 0.05 },
      vca: { volume: 0.65, attack: 0.01, decay: 0.05, sustain: 0.9, release: 0.05 },
      lfo: { speed: 0.4, waveform: 'sine', destination: 'vco', amount: 0.08 },
    },
  },

  // ── BRASS ──
  {
    name: 'Synth Brass',
    category: 'BRASS',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.85 },
      vcf: { cutoff: 0.3, resonance: 0.15, envAmount: 0.6, attack: 0.05, decay: 0.3, sustain: 0.3, release: 0.15 },
      vca: { volume: 0.7, attack: 0.04, decay: 0.2, sustain: 0.75, release: 0.15 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },
  {
    name: 'Trumpet',
    category: 'BRASS',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.85 },
      vcf: { cutoff: 0.35, resonance: 0.2, envAmount: 0.55, attack: 0.03, decay: 0.25, sustain: 0.35, release: 0.12 },
      vca: { volume: 0.7, attack: 0.03, decay: 0.15, sustain: 0.8, release: 0.12 },
      lfo: { speed: 0.4, waveform: 'sine', destination: 'vco', amount: 0.1 },
    },
  },
  {
    name: 'Muted Brass',
    category: 'BRASS',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.22, resonance: 0.25, envAmount: 0.4, attack: 0.04, decay: 0.3, sustain: 0.25, release: 0.15 },
      vca: { volume: 0.65, attack: 0.04, decay: 0.2, sustain: 0.7, release: 0.15 },
      lfo: { speed: 0.35, waveform: 'sine', destination: 'vco', amount: 0.05 },
    },
  },
  {
    name: 'French Horn',
    category: 'BRASS',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.75 },
      vcf: { cutoff: 0.28, resonance: 0.1, envAmount: 0.35, attack: 0.08, decay: 0.35, sustain: 0.4, release: 0.2 },
      vca: { volume: 0.6, attack: 0.08, decay: 0.25, sustain: 0.7, release: 0.25 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0.06 },
    },
  },

  // ── STRING ──
  {
    name: 'Synth Strings',
    category: 'STRING',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0.35, level: 0.7 },
      vcf: { cutoff: 0.45, resonance: 0.1, envAmount: 0.15, attack: 0.4, decay: 0.4, sustain: 0.7, release: 0.5 },
      vca: { volume: 0.6, attack: 0.45, decay: 0.3, sustain: 0.8, release: 0.5 },
      lfo: { speed: 0.35, waveform: 'sine', destination: 'vco', amount: 0.1 },
    },
  },
  {
    name: 'Cello',
    category: 'STRING',
    state: {
      vco: { waveform: 'sawtooth', octave: '16', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.75 },
      vcf: { cutoff: 0.35, resonance: 0.12, envAmount: 0.2, attack: 0.15, decay: 0.35, sustain: 0.6, release: 0.4 },
      vca: { volume: 0.6, attack: 0.15, decay: 0.25, sustain: 0.75, release: 0.4 },
      lfo: { speed: 0.35, waveform: 'sine', destination: 'vco', amount: 0.12 },
    },
  },
  {
    name: 'Violin',
    category: 'STRING',
    state: {
      vco: { waveform: 'sawtooth', octave: '4', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.7 },
      vcf: { cutoff: 0.5, resonance: 0.15, envAmount: 0.2, attack: 0.12, decay: 0.3, sustain: 0.65, release: 0.35 },
      vca: { volume: 0.55, attack: 0.12, decay: 0.2, sustain: 0.8, release: 0.35 },
      lfo: { speed: 0.45, waveform: 'sine', destination: 'vco', amount: 0.15 },
    },
  },
  {
    name: 'Pizzicato',
    category: 'STRING',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.5, resonance: 0.15, envAmount: 0.4, attack: 0.0, decay: 0.08, sustain: 0.0, release: 0.05 },
      vca: { volume: 0.65, attack: 0.0, decay: 0.15, sustain: 0.0, release: 0.08 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },

  // ── SFX ──
  {
    name: 'Laser',
    category: 'SFX',
    state: {
      vco: { waveform: 'sawtooth', octave: '4', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.9 },
      vcf: { cutoff: 0.9, resonance: 0.85, envAmount: 0.9, attack: 0.0, decay: 0.1, sustain: 0.0, release: 0.05 },
      vca: { volume: 0.6, attack: 0.0, decay: 0.15, sustain: 0.0, release: 0.05 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },
  {
    name: 'Siren',
    category: 'SFX',
    state: {
      vco: { waveform: 'square', octave: '4', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.7, resonance: 0.15, envAmount: 0.0, attack: 0.0, decay: 0.1, sustain: 1.0, release: 0.1 },
      vca: { volume: 0.5, attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.2 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0.8 },
    },
  },
  {
    name: 'Wah',
    category: 'SFX',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.3, resonance: 0.6, envAmount: 0.0, attack: 0.0, decay: 0.1, sustain: 1.0, release: 0.1 },
      vca: { volume: 0.6, attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.2 },
      lfo: { speed: 0.25, waveform: 'sine', destination: 'vcf', amount: 0.7 },
    },
  },
  {
    name: 'Alien',
    category: 'SFX',
    state: {
      vco: { waveform: 'sawtooth', octave: '4', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.75 },
      vcf: { cutoff: 0.5, resonance: 0.7, envAmount: 0.5, attack: 0.3, decay: 0.4, sustain: 0.3, release: 0.5 },
      vca: { volume: 0.55, attack: 0.2, decay: 0.3, sustain: 0.5, release: 0.5 },
      lfo: { speed: 0.6, waveform: 'square', destination: 'vcf', amount: 0.6 },
    },
  },
  {
    name: 'Wind',
    category: 'SFX',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.5 },
      vcf: { cutoff: 0.15, resonance: 0.8, envAmount: 0.0, attack: 0.0, decay: 0.1, sustain: 1.0, release: 0.5 },
      vca: { volume: 0.4, attack: 0.8, decay: 0.3, sustain: 0.6, release: 0.9 },
      lfo: { speed: 0.08, waveform: 'sine', destination: 'vcf', amount: 0.5 },
    },
  },
  {
    name: 'Zap',
    category: 'SFX',
    state: {
      vco: { waveform: 'square', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.9 },
      vcf: { cutoff: 0.8, resonance: 0.6, envAmount: 0.8, attack: 0.0, decay: 0.05, sustain: 0.0, release: 0.02 },
      vca: { volume: 0.65, attack: 0.0, decay: 0.08, sustain: 0.0, release: 0.03 },
      lfo: { speed: 0.3, waveform: 'sine', destination: 'vco', amount: 0 },
    },
  },
  {
    name: 'Resonance Sweep',
    category: 'SFX',
    state: {
      vco: { waveform: 'sawtooth', octave: '8', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.8 },
      vcf: { cutoff: 0.3, resonance: 0.75, envAmount: 0.7, attack: 0.5, decay: 0.8, sustain: 0.2, release: 0.6 },
      vca: { volume: 0.55, attack: 0.3, decay: 0.5, sustain: 0.6, release: 0.5 },
      lfo: { speed: 0.15, waveform: 'triangle', destination: 'vcf', amount: 0.3 },
    },
  },
  {
    name: 'Bubbles',
    category: 'SFX',
    state: {
      vco: { waveform: 'square', octave: '4', tune: 0, pulseWidth: 0.5, pwmAmount: 0, level: 0.7 },
      vcf: { cutoff: 0.6, resonance: 0.85, envAmount: 0.3, attack: 0.0, decay: 0.08, sustain: 0.1, release: 0.1 },
      vca: { volume: 0.5, attack: 0.0, decay: 0.1, sustain: 0.0, release: 0.1 },
      lfo: { speed: 0.7, waveform: 'sawtooth', destination: 'vcf', amount: 0.5 },
    },
  },
];
