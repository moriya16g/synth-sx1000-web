import type { SeqPattern } from '../types/sequencer';

/** Helper: create a note */
function n(midi: number, step: number, duration = 2): { midi: number; step: number; duration: number } {
  return { midi, step, duration };
}

// MIDI note constants
const C3 = 48, D3 = 50, E3 = 52, F3 = 53, G3 = 55, A3 = 57, B3 = 59;
const C4 = 60, D4 = 62, E4 = 64, F4 = 65, G4 = 67, A4 = 69;
const C5 = 72, D5 = 74, E5 = 76;
// Sharps
const Cs3 = 49, Eb3 = 51, Fs3 = 54, Ab3 = 56, Bb3 = 58;
const Cs4 = 61, Eb4 = 63, Fs4 = 66, Ab4 = 68, Bb4 = 70;
const _Cs5 = 73, Eb5 = 75;

// suppress unused warnings
void Cs3; void Fs3; void Ab3; void _Cs5;

/**
 * Demo 1: "Popcorn" style — a bouncy synth melody
 */
const POPCORN: SeqPattern = {
  name: '🍿 Popcorn',
  length: 64,
  notes: [
    // Bar 1
    n(E4, 0), n(D4, 2), n(E4, 4), n(C4, 6), n(A3, 8), n(C4, 10), n(A3, 12, 4),
    // Bar 2
    n(E4, 16), n(D4, 18), n(E4, 20), n(C4, 22), n(A3, 24), n(C4, 26), n(A3, 28, 4),
    // Bar 3
    n(E4, 32), n(F4, 34), n(G4, 36), n(G4, 38), n(F4, 40), n(E4, 42), n(F4, 44), n(E4, 46),
    // Bar 4
    n(E4, 48), n(F4, 50), n(G4, 52), n(G4, 54), n(F4, 56), n(E4, 58), n(D4, 60, 4),
  ],
};

/**
 * Demo 2: Acid bass line — 303-style
 */
const ACID_BASS: SeqPattern = {
  name: '🎸 Acid Line',
  length: 32,
  notes: [
    n(C3, 0, 1), n(C3, 2, 1), n(Eb3, 4, 2), n(C3, 6, 1),
    n(C3, 8, 1), n(Bb3, 10, 1), n(C3, 12, 2), n(Eb3, 14, 1),
    n(C3, 16, 1), n(C3, 18, 1), n(Eb3, 20, 2), n(F3, 22, 1),
    n(Eb3, 24, 1), n(C3, 26, 2), n(Bb3, 28, 1), n(C3, 30, 2),
  ],
};

/**
 * Demo 3: Synth arpeggiation — minor chord arpeggios
 */
const ARPEGGIO: SeqPattern = {
  name: '🎹 Arpeggio',
  length: 64,
  notes: [
    // Am arpeggio
    n(A3, 0), n(C4, 2), n(E4, 4), n(A4, 6),
    n(E4, 8), n(C4, 10), n(A3, 12), n(C4, 14),
    // Dm arpeggio
    n(D3, 16), n(F3, 18), n(A3, 20), n(D4, 22),
    n(A3, 24), n(F3, 26), n(D3, 28), n(F3, 30),
    // Em arpeggio
    n(E3, 32), n(G3, 34), n(B3, 36), n(E4, 38),
    n(B3, 40), n(G3, 42), n(E3, 44), n(G3, 46),
    // Am arpeggio (high)
    n(A3, 48), n(C4, 50), n(E4, 52), n(A4, 54),
    n(E5, 56), n(C5, 58), n(A4, 60), n(E4, 62),
  ],
};

/**
 * Demo 4: New Wave riff
 */
const NEW_WAVE: SeqPattern = {
  name: '🌊 New Wave',
  length: 64,
  notes: [
    // Bar 1 - Cm
    n(C4, 0, 1), n(Eb4, 2, 1), n(G4, 4, 4),
    n(C4, 8, 1), n(Eb4, 10, 1), n(G4, 12, 2), n(Eb4, 14, 2),
    // Bar 2 - Ab
    n(Ab4, 16, 2), n(Eb4, 18, 2), n(C4, 20, 4),
    n(Ab3, 24, 2), n(Eb4, 26, 2), n(C4, 28, 2), n(Eb4, 30, 2),
    // Bar 3 - Bb
    n(Bb3, 32, 1), n(D4, 34, 1), n(F4, 36, 4),
    n(Bb3, 40, 1), n(D4, 42, 1), n(F4, 44, 2), n(D4, 46, 2),
    // Bar 4 - G
    n(G3, 48, 2), n(B3, 50, 2), n(D4, 52, 4),
    n(G4, 56, 2), n(D4, 58, 2), n(B3, 60, 4),
  ],
};

/**
 * Demo 5: Pad/ambient sequence
 */
const AMBIENT: SeqPattern = {
  name: '🌙 Ambient',
  length: 64,
  notes: [
    // Long sustained chords (single notes — monophonic)
    n(A3, 0, 8),
    n(E4, 8, 8),
    n(C4, 16, 8),
    n(G3, 24, 4), n(A3, 28, 4),
    n(F3, 32, 8),
    n(C4, 40, 8),
    n(D4, 48, 8),
    n(A3, 56, 8),
  ],
};

/**
 * Demo 6: Funky bass groove
 */
const FUNK: SeqPattern = {
  name: '🎷 Funk Bass',
  length: 32,
  notes: [
    n(C3, 0, 1), n(C3, 3, 1), n(Eb3, 4, 2),
    n(F3, 7, 1), n(F3, 8, 2), n(Eb3, 11, 1),
    n(C3, 12, 1), n(C3, 14, 1), n(Bb3, 15, 1),
    n(C3, 16, 1), n(C3, 19, 1), n(Eb3, 20, 2),
    n(F3, 23, 1), n(G3, 24, 2), n(Eb3, 27, 1),
    n(C3, 28, 1), n(Eb3, 30, 2),
  ],
};

/**
 * Demo 7: "On the Run" style sequencer pattern
 */
const SEQUENCER_CLASSIC: SeqPattern = {
  name: '🏃 Sequencer',
  length: 32,
  notes: [
    n(E4, 0, 1), n(G4, 2, 1), n(A4, 4, 1), n(G4, 6, 1),
    n(E4, 8, 1), n(D4, 10, 1), n(C4, 12, 1), n(D4, 14, 1),
    n(E4, 16, 1), n(G4, 18, 1), n(A4, 20, 1), n(G4, 22, 1),
    n(D5, 24, 1), n(C5, 26, 1), n(A4, 28, 1), n(E4, 30, 1),
  ],
};

/**
 * Demo 8: Horror / Suspense
 */
const HORROR: SeqPattern = {
  name: '👻 Horror',
  length: 64,
  notes: [
    n(E3, 0, 4), n(F3, 4, 4),
    n(E3, 8, 4), n(Cs4, 12, 4),
    n(D4, 16, 4), n(Bb3, 20, 4),
    n(A3, 24, 8),
    n(E3, 32, 4), n(F3, 36, 4),
    n(Ab4, 40, 4), n(G4, 44, 4),
    n(Fs4, 48, 4), n(F4, 52, 4),
    n(E4, 56, 8),
  ],
};

/**
 * Demo 9: Italo Disco bassline
 */
const ITALO: SeqPattern = {
  name: '🇮🇹 Italo Disco',
  length: 32,
  notes: [
    n(A3, 0, 1), n(A3, 2, 1), n(E4, 4, 2),
    n(A3, 6, 1), n(A3, 8, 1), n(Cs4, 10, 2),
    n(D4, 12, 1), n(Cs4, 14, 1), n(A3, 16, 1),
    n(A3, 18, 1), n(E4, 20, 2), n(A3, 22, 1),
    n(A3, 24, 1), n(D4, 26, 2), n(Cs4, 28, 1),
    n(B3, 30, 2),
  ],
};

/**
 * Demo 10: Kraftwerk-style minimal
 */
const MINIMAL: SeqPattern = {
  name: '🤖 Minimal',
  length: 32,
  notes: [
    n(E3, 0, 2), n(E3, 4, 1), n(E3, 6, 1),
    n(E4, 8, 2), n(E3, 12, 1), n(E3, 14, 1),
    n(E3, 16, 2), n(D4, 20, 1), n(E3, 22, 1),
    n(E4, 24, 1), n(Eb4, 26, 1), n(E3, 28, 2), n(E3, 30, 1),
  ],
};

/**
 * Demo 11: Sci-fi arpeggio
 */
const SCIFI: SeqPattern = {
  name: '🚀 Sci-Fi',
  length: 64,
  notes: [
    n(C4, 0, 1), n(Eb4, 2, 1), n(G4, 4, 1), n(Bb4, 6, 1),
    n(C5, 8, 1), n(Bb4, 10, 1), n(G4, 12, 1), n(Eb4, 14, 1),
    n(D4, 16, 1), n(F4, 18, 1), n(Ab4, 20, 1), n(C5, 22, 1),
    n(D5, 24, 1), n(C5, 26, 1), n(Ab4, 28, 1), n(F4, 30, 1),
    n(Eb4, 32, 1), n(G4, 34, 1), n(Bb4, 36, 1), n(D5, 38, 1),
    n(Eb5, 40, 1), n(D5, 42, 1), n(Bb4, 44, 1), n(G4, 46, 1),
    n(C4, 48, 1), n(E4, 50, 1), n(G4, 52, 1), n(C5, 54, 1),
    n(E5, 56, 2), n(C5, 58, 2), n(G4, 60, 2), n(E4, 62, 2),
  ],
};

export const DEMO_SONGS: SeqPattern[] = [
  POPCORN,
  ACID_BASS,
  ARPEGGIO,
  NEW_WAVE,
  AMBIENT,
  FUNK,
  SEQUENCER_CLASSIC,
  HORROR,
  ITALO,
  MINIMAL,
  SCIFI,
];
