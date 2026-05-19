import { useState, useCallback, useEffect, useRef } from 'react';
import VCOPanel from './components/VCOPanel';
import VCFPanel from './components/VCFPanel';
import VCAPanel from './components/VCAPanel';
import LFOPanel from './components/LFOPanel';
import Keyboard from './components/Keyboard';
import PresetSelector from './components/PresetSelector';
import SequencerPanel from './components/SequencerPanel';
import PianoRoll from './components/PianoRoll';
import { SynthEngine } from './engine/SynthEngine';
import { SequencerEngine } from './engine/SequencerEngine';
import {
  DEFAULT_SYNTH_STATE,
  type SynthState,
  type VCOParams,
  type VCFParams,
  type VCAParams,
  type LFOParams,
} from './types/synth';
import { EMPTY_PATTERN, type SeqPattern } from './types/sequencer';
import './App.css';

export default function App() {
  const [synthState, setSynthState] = useState<SynthState>(DEFAULT_SYNTH_STATE);
  const [showSequencer, setShowSequencer] = useState(false);
  const [seqPlaying, setSeqPlaying] = useState(false);
  const [seqBpm, setSeqBpm] = useState(120);
  const [seqStep, setSeqStep] = useState(0);
  const [seqPattern, setSeqPattern] = useState<SeqPattern>(EMPTY_PATTERN);
  const engineRef = useRef<SynthEngine | null>(null);
  const seqRef = useRef<SequencerEngine | null>(null);

  useEffect(() => {
    const engine = new SynthEngine(DEFAULT_SYNTH_STATE);
    engineRef.current = engine;
    const seq = new SequencerEngine();
    seqRef.current = seq;
    return () => {
      seq.dispose();
      engine.dispose();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) engineRef.current.state = synthState;
  }, [synthState]);

  // Bind sequencer callbacks
  useEffect(() => {
    const seq = seqRef.current;
    const engine = engineRef.current;
    if (!seq || !engine) return;
    seq.bind(
      (midi) => {
        engine.init();
        engine.resume();
        engine.noteOn(midi);
      },
      (midi) => engine.noteOff(midi),
      (step) => setSeqStep(step),
    );
  }, []);

  // Sync bpm
  useEffect(() => {
    if (seqRef.current) seqRef.current.bpm = seqBpm;
  }, [seqBpm]);

  // Sync pattern
  useEffect(() => {
    if (seqRef.current) seqRef.current.pattern = seqPattern;
  }, [seqPattern]);

  const ensureAudio = useCallback(() => {
    engineRef.current?.init();
    engineRef.current?.resume();
    // Give sequencer access to AudioContext for timing
    const ctx = engineRef.current?.audioContext;
    if (ctx && seqRef.current) seqRef.current.setContext(ctx);
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

  const handleSeqPlay = useCallback(() => {
    ensureAudio();
    seqRef.current?.play();
    setSeqPlaying(true);
  }, [ensureAudio]);

  const handleSeqStop = useCallback(() => {
    seqRef.current?.stop();
    setSeqPlaying(false);
    setSeqStep(0);
  }, []);

  const handleLoadPattern = useCallback((p: SeqPattern) => {
    if (seqPlaying) {
      seqRef.current?.stop();
      setSeqPlaying(false);
      setSeqStep(0);
    }
    setSeqPattern({ ...p, notes: [...p.notes] });
  }, [seqPlaying]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div className="header-title">
            <div className="brand">JEN</div>
            <div className="model">SX-1000</div>
          </div>
          <PresetSelector onSelect={handlePreset} />
          <button
            className="seq-toggle"
            onClick={() => setShowSequencer(s => !s)}
          >
            {showSequencer ? '🎹 KEYS' : '🎼 SEQ'}
          </button>
        </div>
        <div className="subtitle">ANALOG SYNTHESIZER</div>
      </header>

      <div className="controls">
        <VCOPanel params={synthState.vco} onChange={handleVCO} />
        <VCFPanel params={synthState.vcf} onChange={handleVCF} />
        <VCAPanel params={synthState.vca} onChange={handleVCA} />
        <LFOPanel params={synthState.lfo} onChange={handleLFO} />
      </div>

      {showSequencer ? (
        <div className="sequencer-area">
          <SequencerPanel
            playing={seqPlaying}
            bpm={seqBpm}
            onPlay={handleSeqPlay}
            onStop={handleSeqStop}
            onBpmChange={setSeqBpm}
            onLoadPattern={handleLoadPattern}
          />
          <div className="piano-roll-wrapper">
            <PianoRoll
              pattern={seqPattern}
              currentStep={seqStep}
              playing={seqPlaying}
              onChange={setSeqPattern}
            />
          </div>
        </div>
      ) : (
        <div className="keyboard-area">
          <Keyboard onNoteOn={noteOn} onNoteOff={noteOff} startOctave={3} numOctaves={3} />
        </div>
      )}
    </div>
  );
}
