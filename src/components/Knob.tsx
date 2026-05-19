import { useRef, useCallback } from 'react';
import { colors } from '../styles/theme';
import './Knob.css';

interface KnobProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  size?: number;
  color?: string;
}

const MIN_A = -135;
const MAX_A = 135;

export default function Knob({ label, value, onChange, size = 52, color = colors.textLabel }: KnobProps) {
  const valRef = useRef(value);
  valRef.current = value;
  const startY = useRef(0);
  const startVal = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    startVal.current = valRef.current;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!(e.target as HTMLElement).hasPointerCapture(e.pointerId)) return;
    const dy = startY.current - e.clientY;
    const next = Math.max(0, Math.min(1, startVal.current + dy * 0.005));
    onChange(next);
  }, [onChange]);

  const angle = MIN_A + (MAX_A - MIN_A) * value;

  return (
    <div className="knob-wrap" style={{ width: size + 16 }}>
      <div
        className="knob-outer"
        style={{ width: size, height: size, borderRadius: size / 2, background: colors.knobShadow }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        role="slider"
        aria-valuenow={Math.round(value * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        tabIndex={0}
      >
        <div
          className="knob-inner"
          style={{
            width: size - 6,
            height: size - 6,
            borderRadius: (size - 6) / 2,
            transform: `rotate(${angle}deg)`,
          }}
        >
          <div className="knob-indicator" style={{ background: color }} />
        </div>
      </div>
      <span className="knob-label" style={{ color }}>{label}</span>
    </div>
  );
}
