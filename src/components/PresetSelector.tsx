import { useState, useCallback } from 'react';
import { PRESETS, PRESET_CATEGORIES } from '../data/presets';
import type { SynthState } from '../types/synth';
import './PresetSelector.css';

interface Props {
  onSelect: (state: SynthState) => void;
}

export default function PresetSelector({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>('ALL');

  const filtered = category === 'ALL'
    ? PRESETS
    : PRESETS.filter(p => p.category === category);

  const handleSelect = useCallback((state: SynthState) => {
    onSelect(state);
    setOpen(false);
  }, [onSelect]);

  return (
    <div className="preset-selector">
      <button className="preset-toggle" onClick={() => setOpen(o => !o)}>
        PRESETS ▾
      </button>
      {open && (
        <div className="preset-panel">
          <div className="preset-categories">
            <button
              className={`preset-cat ${category === 'ALL' ? 'active' : ''}`}
              onClick={() => setCategory('ALL')}
            >
              ALL
            </button>
            {PRESET_CATEGORIES.filter(c => c !== 'INIT').map(cat => (
              <button
                key={cat}
                className={`preset-cat ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="preset-list">
            {filtered.map((p, i) => (
              <button
                key={`${p.category}-${p.name}-${i}`}
                className="preset-item"
                onClick={() => handleSelect(p.state)}
              >
                <span className="preset-cat-tag">{p.category}</span>
                <span className="preset-name">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
