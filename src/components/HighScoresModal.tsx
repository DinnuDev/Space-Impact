/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trophy, Medal } from 'lucide-react';
import { HighScoreEntry } from '../game/types';

interface HighScoresModalProps {
  scores: HighScoreEntry[];
  onClose: () => void;
}

export const HighScoresModal: React.FC<HighScoresModalProps> = ({ scores, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold font-mono tracking-wide text-white uppercase">
              Hall of Fame Leaderboard
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scores Table */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {scores.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No flight records logged yet. Go start a mission!
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[11px] font-mono font-semibold text-slate-400 px-3 pb-2 border-b border-slate-800">
                <span className="col-span-2">RANK</span>
                <span className="col-span-3">PILOT</span>
                <span className="col-span-4 text-right">SCORE</span>
                <span className="col-span-3 text-right">SECTOR</span>
              </div>

              {scores.map((entry, idx) => {
                const isGold = idx === 0;
                const isSilver = idx === 1;
                const isBronze = idx === 2;

                return (
                  <div
                    key={entry.id || idx}
                    className={`grid grid-cols-12 items-center px-3 py-2.5 rounded-xl border text-xs font-mono transition-colors ${
                      isGold
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : isSilver
                        ? 'bg-slate-800/40 border-slate-700/60 text-slate-200'
                        : isBronze
                        ? 'bg-orange-950/20 border-orange-700/30 text-orange-200'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <span className="col-span-2 font-bold flex items-center gap-1">
                      {isGold && <Medal className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      #{idx + 1}
                    </span>
                    <span className="col-span-3 font-bold tracking-widest text-cyan-400">
                      {entry.initials}
                    </span>
                    <span className="col-span-4 text-right font-bold tabular-nums text-white">
                      {entry.score.toLocaleString()}
                    </span>
                    <span className="col-span-3 text-right text-slate-400 text-[11px]">
                      CH.{entry.chapter}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
