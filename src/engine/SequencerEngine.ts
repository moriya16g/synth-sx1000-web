import type { SeqNote, SeqPattern } from '../types/sequencer';

/**
 * SequencerEngine — step-based sequencer using Web Audio API scheduling.
 * Drives noteOn/noteOff callbacks at precise timing using AudioContext.
 */
export class SequencerEngine {
  private ctx: AudioContext | null = null;
  private timerId: number | null = null;
  private _bpm = 120;
  private _playing = false;
  private _currentStep = 0;
  private _pattern: SeqPattern = { name: '', length: 64, notes: [] };

  /** Callbacks */
  private onNoteOn: ((midi: number) => void) | null = null;
  private onNoteOff: ((midi: number) => void) | null = null;
  private onStepChange: ((step: number) => void) | null = null;

  /** Scheduling state */
  private nextStepTime = 0;
  private activeNotes: Map<number, number> = new Map(); // midi -> end step

  get bpm() { return this._bpm; }
  set bpm(v: number) { this._bpm = Math.max(40, Math.min(300, v)); }

  get playing() { return this._playing; }
  get currentStep() { return this._currentStep; }

  set pattern(p: SeqPattern) { this._pattern = p; }
  get pattern() { return this._pattern; }

  bind(
    noteOn: (midi: number) => void,
    noteOff: (midi: number) => void,
    onStep: (step: number) => void,
  ) {
    this.onNoteOn = noteOn;
    this.onNoteOff = noteOff;
    this.onStepChange = onStep;
  }

  setContext(ctx: AudioContext) {
    this.ctx = ctx;
  }

  play() {
    if (this._playing || !this.ctx) return;
    this._playing = true;
    this.nextStepTime = this.ctx.currentTime + 0.01;
    this.scheduler();
  }

  stop() {
    this._playing = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    // Kill all active notes
    for (const midi of this.activeNotes.keys()) {
      this.onNoteOff?.(midi);
    }
    this.activeNotes.clear();
    this._currentStep = 0;
    this.onStepChange?.(0);
  }

  private get stepDuration(): number {
    // Duration of one 16th note in seconds
    return 60 / this._bpm / 4;
  }

  private scheduler = () => {
    if (!this._playing || !this.ctx) return;

    const lookAhead = 0.1; // schedule 100ms ahead
    const interval = 25;   // check every 25ms

    while (this.nextStepTime < this.ctx.currentTime + lookAhead) {
      this.processStep(this._currentStep, this.nextStepTime);
      this.nextStepTime += this.stepDuration;
      this._currentStep = (this._currentStep + 1) % this._pattern.length;
    }

    this.timerId = window.setTimeout(this.scheduler, interval);
  };

  private processStep(step: number, _time: number) {
    this.onStepChange?.(step);

    // Check for notes that should end
    for (const [midi, endStep] of this.activeNotes) {
      if (step === endStep % this._pattern.length) {
        this.onNoteOff?.(midi);
        this.activeNotes.delete(midi);
      }
    }

    // Check for notes that start on this step
    const notesOnStep = this._pattern.notes.filter((n: SeqNote) => n.step === step);
    for (const note of notesOnStep) {
      // If same note is already playing, stop it first
      if (this.activeNotes.has(note.midi)) {
        this.onNoteOff?.(note.midi);
      }
      this.onNoteOn?.(note.midi);
      this.activeNotes.set(note.midi, (step + note.duration) % this._pattern.length);
    }
  }

  dispose() {
    this.stop();
    this.onNoteOn = null;
    this.onNoteOff = null;
    this.onStepChange = null;
  }
}
