import Knob from './Knob';
import SegmentSwitch from './SegmentSwitch';
import { colors } from '../styles/theme';
import type { LFOParams, LFOWaveform, LFODestination } from '../types/synth';
import './Panel.css';

const WAVES: LFOWaveform[] = ['sine', 'triangle', 'square', 'sawtooth'];
const WAVE_L = ['SIN', 'TRI', 'SQR', 'SAW'];
const DESTS: LFODestination[] = ['vco', 'vcf'];
const DEST_L = ['VCO', 'VCF'];

interface Props { params: LFOParams; onChange: (p: LFOParams) => void; }

export default function LFOPanel({ params, onChange }: Props) {
  const u = (p: Partial<LFOParams>) => onChange({ ...params, ...p });
  const c = colors.quaternary;
  return (
    <section className="panel-section">
      <h3 className="panel-title" style={{ color: c }}>LFO</h3>
      <div className="panel-content">
        <SegmentSwitch label="WAVE" options={WAVE_L} selectedIndex={WAVES.indexOf(params.waveform)} onChange={i => u({ waveform: WAVES[i] })} color={c} />
        <SegmentSwitch label="DEST" options={DEST_L} selectedIndex={DESTS.indexOf(params.destination)} onChange={i => u({ destination: DESTS[i] })} color={c} />
        <Knob label="SPEED" value={params.speed} onChange={v => u({ speed: v })} color={c} />
        <Knob label="AMOUNT" value={params.amount} onChange={v => u({ amount: v })} color={c} />
      </div>
    </section>
  );
}
