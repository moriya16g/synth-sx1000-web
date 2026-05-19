import { useCallback, useRef } from 'react';
import './Keyboard.css';

interface Props {
  onNoteOn: (n: number) => void;
  onNoteOff: (n: number) => void;
  startOctave?: number;
  numOctaves?: number;
}

const W_OFF = [0, 2, 4, 5, 7, 9, 11];
const B_OFF = [1, 3, -1, 6, 8, 10];
const B_POS = [0, 1, -1, 3, 4, 5];

export default function Keyboard({ onNoteOn, onNoteOff, startOctave = 3, numOctaves = 2 }: Props) {
  const activeRef = useRef<number | null>(null);

  const whites: { note: number; idx: number }[] = [];
  const blacks: { note: number; wIdx: number }[] = [];

  for (let oct = 0; oct < numOctaves; oct++) {
    const base = (startOctave + oct) * 12 + 12;
    const wBase = oct * 7;
    for (let i = 0; i < 7; i++) whites.push({ note: base + W_OFF[i], idx: wBase + i });
    for (let i = 0; i < B_OFF.length; i++) {
      if (B_OFF[i] === -1) continue;
      blacks.push({ note: base + B_OFF[i], wIdx: wBase + B_POS[i] });
    }
  }
  // final C
  whites.push({ note: (startOctave + numOctaves) * 12 + 12, idx: numOctaves * 7 });

  const totalWhites = whites.length;

  const down = useCallback((note: number) => {
    if (activeRef.current !== null && activeRef.current !== note) onNoteOff(activeRef.current);
    activeRef.current = note;
    onNoteOn(note);
  }, [onNoteOn, onNoteOff]);

  const up = useCallback((note: number) => {
    if (activeRef.current === note) { onNoteOff(note); activeRef.current = null; }
  }, [onNoteOff]);

  const wPct = 100 / totalWhites;
  const bW = wPct * 0.6;

  return (
    <div className="kb-container" style={{ '--wPct': `${wPct}%`, '--bW': `${bW}%` } as React.CSSProperties}>
      {whites.map(({ note, idx }) => (
        <div
          key={`w${note}`}
          className="kb-white"
          style={{ left: `${idx * wPct}%`, width: `${wPct}%` }}
          onPointerDown={() => down(note)}
          onPointerUp={() => up(note)}
          onPointerLeave={() => up(note)}
          onPointerCancel={() => up(note)}
        />
      ))}
      {blacks.map(({ note, wIdx }) => (
        <div
          key={`b${note}`}
          className="kb-black"
          style={{ left: `${(wIdx + 1) * wPct - bW / 2}%`, width: `${bW}%` }}
          onPointerDown={(e) => { e.stopPropagation(); down(note); }}
          onPointerUp={() => up(note)}
          onPointerLeave={() => up(note)}
          onPointerCancel={() => up(note)}
        />
      ))}
    </div>
  );
}
