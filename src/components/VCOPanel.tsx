import Knob from './Knob';
import SegmentSwitch from './SegmentSwitch';
import { colors } from '../styles/theme';
import type { VCOParams, WaveformType, OctaveFootage } from '../types/synth';
import './Panel.css';

const WAVES: WaveformType[] = ['sawtooth', 'square'];
const WAVE_L = ['SAW', 'SQR'];
const OCTS: OctaveFootage[] = ['32', '16', '8', '4'];
const OCT_L = ["32'", "16'", "8'", "4'"];

interface Props { params: VCOParams; onChange: (p: VCOParams) => void; }

export default function VCOPanel({ params, onChange }: Props) {
  const u = (p: Partial<VCOParams>) => onChange({ ...params, ...p });
  const c = colors.secondary;
  return (
    <section className="panel-section">
      <h3 className="panel-title" style={{ color: c }}>VCO</h3>
      <div className="panel-content">
        <SegmentSwitch label="WAVE" options={WAVE_L} selectedIndex={WAVES.indexOf(params.waveform)} onChange={i => u({ waveform: WAVES[i] })} color={c} />
        <SegmentSwitch label="OCTAVE" options={OCT_L} selectedIndex={OCTS.indexOf(params.octave)} onChange={i => u({ octave: OCTS[i] })} color={c} />
        <Knob label="TUNE" value={(params.tune + 1) / 2} onChange={v => u({ tune: v * 2 - 1 })} color={c} />
        <Knob label="P.W." value={params.pulseWidth} onChange={v => u({ pulseWidth: v })} color={c} />
        <Knob label="PWM" value={params.pwmAmount} onChange={v => u({ pwmAmount: v })} color={c} />
        <Knob label="LEVEL" value={params.level} onChange={v => u({ level: v })} color={c} />
      </div>
    </section>
  );
}
