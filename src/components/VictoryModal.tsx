/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, Check, RotateCcw, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  score: number;
  onRestart: () => void;
  onSaveScore: (initials: string) => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  onRestart,
  onSaveScore,
}) => {
  const [initials, setInitials] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initials.trim() || saved) return;
    onSaveScore(initials);
    setSaved(true);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-4 text-amber-400 animate-bounce">
          <Trophy className="w-9 h-9" />
        </div>

        <h2 className="text-xl font-bold font-mono tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-5 h-5" /> GALAXY SAVED! <Sparkles className="w-5 h-5" />
        </h2>
        <p className="text-xs text-slate-300 mb-5">
          You destroyed the Titan Dreadnought and liberated the quadrant!
        </p>

        {/* Final Score Display */}
        <div className="w-full bg-slate-950/80 rounded-xl p-4 border border-slate-800 mb-6">
          <span className="text-xs text-slate-400 block mb-1">SUPREME CHAMPION SCORE</span>
          <span className="text-3xl font-bold font-mono text-cyan-400 tracking-wider tabular-nums">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Arcade Initials Entry */}
        {!saved ? (
          <form onSubmit={handleSave} className="w-full mb-6">
            <label className="text-xs text-slate-300 block mb-2 font-medium">
              Enter initials for the Hall of Fame:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={3}
                placeholder="ACE"
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-lg tracking-widest text-amber-300 uppercase outline-none"
              />
              <button
                type="submit"
                disabled={!initials.trim()}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition-colors shrink-0"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full mb-6 py-2 px-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-center gap-1.5 font-medium">
            <Check className="w-4 h-4" /> Score Saved to Hall of Fame!
          </div>
        )}

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full py-3 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
