/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, ArrowRight, Shield, Crosshair } from 'lucide-react';

interface LevelClearModalProps {
  chapter: number;
  score: number;
  lives: number;
  shotsFired: number;
  shotsHit: number;
  onNextChapter: () => void;
}

export const LevelClearModal: React.FC<LevelClearModalProps> = ({
  chapter,
  score,
  lives,
  shotsFired,
  shotsHit,
  onNextChapter,
}) => {
  const accuracy = shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 0;
  const livesBonus = lives * 1000;
  const accuracyBonus = accuracy >= 75 ? 2000 : 1000;

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4 text-emerald-400">
          <Award className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold font-mono tracking-wider text-emerald-400 mb-1">
          CHAPTER {chapter} CLEARED!
        </h2>
        <p className="text-xs text-slate-400 mb-6">Sector secured. Hostile fleet neutralized.</p>

        {/* Stats breakdown */}
        <div className="w-full bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3 mb-6 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-cyan-400" /> Accuracy Rating:
            </span>
            <span className="font-mono font-bold text-white tabular-nums">
              {accuracy}% (+{accuracyBonus} pts)
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Lives Preserved:
            </span>
            <span className="font-mono font-bold text-white tabular-nums">
              {lives} (+{livesBonus} pts)
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-slate-300 font-semibold">Total Combat Score:</span>
            <span className="font-mono font-bold text-lg text-cyan-400 tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={onNextChapter}
          className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 active:scale-95"
        >
          <span>PROCEED TO CHAPTER {chapter + 1}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
