import { useState, useCallback, useRef, useEffect } from 'react';
import type { SeqNote, SeqPattern } from '../types/sequencer';
import './PianoRoll.css';

interface Props {
  pattern: SeqPattern;
  currentStep: number;
  playing: boolean;
  onChange: (pattern: SeqPattern) => void;
}

/** Note names for the piano keys (bottom = low, top = high) */
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const isBlack = (midi: number) => [1, 3, 6, 8, 10].includes(midi % 12);

/** Range: C3 (48) to B5 (83) = 3 octaves */
const MIN_NOTE = 48;
const MAX_NOTE = 83;

const DEFAULT_DURATION = 2; // 2 steps = 8th note

export default function PianoRoll({ pattern, currentStep, playing, onChange }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<'draw' | 'erase'>('draw');
  const drawingRef = useRef(false);

  // Auto-scroll to follow playhead
  useEffect(() => {
    if (!playing || !gridRef.current) return;
    const container = gridRef.current;
    const stepWidth = 20;
    const scrollLeft = currentStep * stepWidth - container.clientWidth / 2;
    container.scrollLeft = Math.max(0, scrollLeft);
  }, [currentStep, playing]);

  const toggleNote = useCallback((midi: number, step: number) => {
    const existing = pattern.notes.find(n =>
      n.midi === midi && step >= n.step && step < n.step + n.duration
    );
    if (existing || tool === 'erase') {
      // Remove
      const newNotes = pattern.notes.filter(n => n !== existing);
      onChange({ ...pattern, notes: newNotes });
    } else {
      // Add
      const newNote: SeqNote = { midi, step, duration: DEFAULT_DURATION };
      onChange({ ...pattern, notes: [...pattern.notes, newNote] });
    }
  }, [pattern, onChange, tool]);

  const handlePointerDown = useCallback((midi: number, step: number) => {
    drawingRef.current = true;
    toggleNote(midi, step);
  }, [toggleNote]);

  const handlePointerEnter = useCallback((midi: number, step: number) => {
    if (!drawingRef.current) return;
    toggleNote(midi, step);
  }, [toggleNote]);

  useEffect(() => {
    const up = () => { drawingRef.current = false; };
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, []);

  // Build note lookup: "midi-step" -> SeqNote
  const noteMap = new Map<string, SeqNote>();
  for (const n of pattern.notes) {
    for (let s = n.step; s < n.step + n.duration; s++) {
      noteMap.set(`${n.midi}-${s % pattern.length}`, n);
    }
  }

  const rows: number[] = [];
  for (let midi = MAX_NOTE; midi >= MIN_NOTE; midi--) rows.push(midi);

  return (
    <div className="piano-roll">
      <div className="pr-toolbar">
        <button
          className={`pr-tool ${tool === 'draw' ? 'active' : ''}`}
          onClick={() => setTool('draw')}
        >✏️ Draw</button>
        <button
          className={`pr-tool ${tool === 'erase' ? 'active' : ''}`}
          onClick={() => setTool('erase')}
        >🗑️ Erase</button>
        <button
          className="pr-tool"
          onClick={() => onChange({ ...pattern, notes: [] })}
        >Clear</button>
      </div>
      <div className="pr-body">
        <div className="pr-keys">
          {rows.map(midi => {
            const name = NOTE_NAMES[midi % 12];
            const oct = Math.floor(midi / 12) - 1;
            return (
              <div
                key={midi}
                className={`pr-key ${isBlack(midi) ? 'black' : 'white'}`}
              >
                {name === 'C' ? `C${oct}` : name}
              </div>
            );
          })}
        </div>
        <div className="pr-grid-wrapper" ref={gridRef}>
          <div
            className="pr-grid"
            style={{ width: pattern.length * 20 }}
          >
            {/* Beat markers */}
            {Array.from({ length: pattern.length }, (_, s) => (
              <div
                key={`beat-${s}`}
                className={`pr-beat-line ${s % 16 === 0 ? 'bar' : s % 4 === 0 ? 'beat' : ''}`}
                style={{ left: s * 20 }}
              />
            ))}

            {/* Playhead */}
            {playing && (
              <div
                className="pr-playhead"
                style={{ left: currentStep * 20 }}
              />
            )}

            {/* Cells */}
            {rows.map(midi => (
              <div
                key={midi}
                className={`pr-row ${isBlack(midi) ? 'black' : 'white'}`}
              >
                {Array.from({ length: pattern.length }, (_, step) => {
                  const key = `${midi}-${step}`;
                  const note = noteMap.get(key);
                  const isStart = note && note.step === step;
                  return (
                    <div
                      key={step}
                      className={`pr-cell${note ? ' filled' : ''}${isStart ? ' start' : ''}${step % 4 === 0 ? ' beat-edge' : ''}`}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        handlePointerDown(midi, step);
                      }}
                      onPointerEnter={() => handlePointerEnter(midi, step)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
