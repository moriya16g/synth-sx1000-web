import Knob from './Knob';
import { colors } from '../styles/theme';
import type { VCFParams } from '../types/synth';
import './Panel.css';

interface Props { params: VCFParams; onChange: (p: VCFParams) => void; }

export default function VCFPanel({ params, onChange }: Props) {
  const u = (p: Partial<VCFParams>) => onChange({ ...params, ...p });
  const c = colors.primary;
  return (
    <section className="panel-section">
      <h3 className="panel-title" style={{ color: c }}>VCF</h3>
      <div className="panel-content">
        <div className="panel-row">
          <Knob label="CUTOFF" value={params.cutoff} onChange={v => u({ cutoff: v })} color={c} />
          <Knob label="RESO" value={params.resonance} onChange={v => u({ resonance: v })} color={c} />
          <Knob label="ENV" value={params.envAmount} onChange={v => u({ envAmount: v })} color={c} />
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
