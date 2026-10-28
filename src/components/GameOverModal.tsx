/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RotateCcw, Skull, Trophy, Check } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  chapter: number;
  onRestart: () => void;
  onSaveScore: (initials: string) => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  chapter,
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
      <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mb-4 text-rose-500">
          <Skull className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold font-mono tracking-wider text-rose-400 mb-1">
          MISSION FAILED
        </h2>
        <p className="text-xs text-slate-400 mb-5">Your ship was overwhelmed in Sector {chapter}.</p>

        {/* Final Score Display */}
        <div className="w-full bg-slate-950/80 rounded-xl p-4 border border-slate-800 mb-6">
          <span className="text-xs text-slate-400 block mb-1">FINAL SCORE</span>
          <span className="text-2xl font-bold font-mono text-cyan-400 tracking-wider tabular-nums">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Arcade Initials Entry */}
        {!saved ? (
          <form onSubmit={handleSave} className="w-full mb-6">
            <label className="text-xs text-slate-300 block mb-2 flex items-center justify-center gap-1.5 font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Enter Arcade Initials:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={3}
                placeholder="ACE"
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-lg tracking-widest text-cyan-300 uppercase outline-none"
              />
              <button
                type="submit"
                disabled={!initials.trim()}
                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition-colors shrink-0"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full mb-6 py-2 px-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-center gap-1.5 font-medium">
            <Check className="w-4 h-4" /> Score Saved to Leaderboard!
          </div>
        )}

        {/* Try Again Button */}
        <button
          onClick={onRestart}
          className="w-full py-3 px-6 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>TRY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
