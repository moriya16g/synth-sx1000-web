import Knob from './Knob';
import { colors } from '../styles/theme';
import type { VCAParams } from '../types/synth';
import './Panel.css';

interface Props { params: VCAParams; onChange: (p: VCAParams) => void; }

export default function VCAPanel({ params, onChange }: Props) {
  const u = (p: Partial<VCAParams>) => onChange({ ...params, ...p });
  const c = colors.tertiary;
  return (
    <section className="panel-section">
      <h3 className="panel-title" style={{ color: c }}>VCA</h3>
      <div className="panel-content">
        <div className="panel-row">
          <Knob label="VOLUME" value={params.volume} onChange={v => u({ volume: v })} color={c} />
        </div>
        <div className="panel-row">
          <Knob label="A" value={params.attack} onChange={v => u({ attack: v })} color={c} size={42} />
          <Knob label="D" value={params.decay} onChange={v => u({ decay: v })} color={c} size={42} />
          <Knob label="S" value={params.sustain} onChange={v => u({ sustain: v })} color={c} size={42} />
          <Knob label="R" value={params.release} onChange={v => u({ release: v })} color={c} size={42} />
        </div>
      </div>
    </section>
  );
}
