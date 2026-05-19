import { useCallback } from 'react';
import type { SeqPattern } from '../types/sequencer';
import { DEMO_SONGS } from '../data/demoSongs';
import { EMPTY_PATTERN } from '../types/sequencer';
import './SequencerPanel.css';

interface Props {
  playing: boolean;
  bpm: number;
  onPlay: () => void;
  onStop: () => void;
  onBpmChange: (bpm: number) => void;
  onLoadPattern: (pattern: SeqPattern) => void;
}

export default function SequencerPanel({ playing, bpm, onPlay, onStop, onBpmChange, onLoadPattern }: Props) {
  const handleBpm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBpmChange(Number(e.target.value));
  }, [onBpmChange]);

  return (
    <div className="seq-panel">
      <div className="seq-transport">
        <button
          className={`seq-btn ${playing ? 'stop' : 'play'}`}
          onClick={playing ? onStop : onPlay}
        >
          {playing ? '⏹ STOP' : '▶ PLAY'}
        </button>
        <div className="seq-tempo">
          <label className="seq-tempo-label">BPM</label>
          <input
            type="range"
            className="seq-tempo-slider"
            min={40}
            max={300}
            value={bpm}
            onChange={handleBpm}
          />
          <span className="seq-tempo-value">{bpm}</span>
        </div>
      </div>
      <div className="seq-songs">
        <button
          className="seq-song-btn"
          onClick={() => onLoadPattern(EMPTY_PATTERN)}
        >
          🆕 New
        </button>
        {DEMO_SONGS.map((song, i) => (
          <button
            key={i}
            className="seq-song-btn"
            onClick={() => onLoadPattern(song)}
          >
            {song.name}
          </button>
        ))}
      </div>
    </div>
  );
}
