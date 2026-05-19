import { useState, useCallback, useEffect, useRef } from 'react';
import VCOPanel from './components/VCOPanel';
import VCFPanel from './components/VCFPanel';
import VCAPanel from './components/VCAPanel';
import LFOPanel from './components/LFOPanel';
import Keyboard from './components/Keyboard';
import PresetSelector from './components/PresetSelector';
import { SynthEngine } from './engine/SynthEngine';
import {
  DEFAULT_SYNTH_STATE,
  type SynthState,
  type VCOParams,
  type VCFParams,
  type VCAParams,
  type LFOParams,
} from './types/synth';
import './App.css';

export default function App() {
  const [synthState, setSynthState] = useState<SynthState>(DEFAULT_SYNTH_STATE);
  const engineRef = useRef<SynthEngine | null>(null);

  useEffect(() => {
    const engine = new SynthEngine(DEFAULT_SYNTH_STATE);
    engineRef.current = engine;
    return () => engine.dispose();
  }, []);

  useEffect(() => {
    if (engineRef.current) engineRef.current.state = synthState;
  }, [synthState]);

  const ensureAudio = useCallback(() => {
    engineRef.current?.init();
    engineRef.current?.resume();
  }, []);

  const handleVCO = useCallback((vco: VCOParams) => setSynthState(s => ({ ...s, vco })), []);
  const handleVCF = useCallback((vcf: VCFParams) => setSynthState(s => ({ ...s, vcf })), []);
  const handleVCA = useCallback((vca: VCAParams) => setSynthState(s => ({ ...s, vca })), []);
  const handleLFO = useCallback((lfo: LFOParams) => setSynthState(s => ({ ...s, lfo })), []);
  const handlePreset = useCallback((state: SynthState) => setSynthState(state), []);

  const noteOn = useCallback((n: number) => {
    ensureAudio();
    engineRef.current?.noteOn(n);
  }, [ensureAudio]);

  const noteOff = useCallback((n: number) => {
    engineRef.current?.noteOff(n);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div className="header-title">
            <div className="brand">JEN</div>
            <div className="model">SX-1000</div>
          </div>
          <PresetSelector onSelect={handlePreset} />
        </div>
        <div className="subtitle">ANALOG SYNTHESIZER</div>
      </header>

      <div className="controls">
        <VCOPanel params={synthState.vco} onChange={handleVCO} />
        <VCFPanel params={synthState.vcf} onChange={handleVCF} />
        <VCAPanel params={synthState.vca} onChange={handleVCA} />
        <LFOPanel params={synthState.lfo} onChange={handleLFO} />
      </div>

      <div className="keyboard-area">
        <Keyboard onNoteOn={noteOn} onNoteOff={noteOff} startOctave={3} numOctaves={3} />
      </div>
    </div>
  );
}
