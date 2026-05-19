/** Sequencer data types */

export interface SeqNote {
  /** MIDI note number */
  midi: number;
  /** Start step (0-based, 16th notes) */
  step: number;
  /** Duration in steps */
  duration: number;
}

export interface SeqPattern {
  name: string;
  /** Length in steps (16th notes). Default 64 = 4 bars */
  length: number;
  notes: SeqNote[];
}

export interface SeqState {
  bpm: number;
  playing: boolean;
  currentStep: number;
  pattern: SeqPattern;
}

export const EMPTY_PATTERN: SeqPattern = {
  name: 'Empty',
  length: 64,
  notes: [],
};
