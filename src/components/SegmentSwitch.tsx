import { colors } from '../styles/theme';
import './SegmentSwitch.css';

interface Props {
  label: string;
  options: string[];
  selectedIndex: number;
  onChange: (i: number) => void;
  color?: string;
}

export default function SegmentSwitch({ label, options, selectedIndex, onChange, color = colors.textLabel }: Props) {
  return (
    <div className="seg-wrap">
      <span className="seg-label" style={{ color }}>{label}</span>
      <div className="seg-row">
        {options.map((o, i) => (
          <button
            key={o}
            className={`seg-btn${i === selectedIndex ? ' seg-active' : ''}`}
            style={i === selectedIndex ? { borderColor: color, color } : undefined}
            onClick={() => onChange(i)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
