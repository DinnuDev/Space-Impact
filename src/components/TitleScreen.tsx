/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Flame, ShieldAlert, Crosshair, Sparkles } from 'lucide-react';
import { GameMode } from '../game/types';

interface TitleScreenProps {
  onStartGame: (mode: GameMode, chapter?: number) => void;
  onOpenArsenal: () => void;
  onOpenLeaderboard: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenArsenal,
  onOpenLeaderboard,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
      {/* Title Lockup */}
      <div className="max-w-xl mx-auto flex flex-col items-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-500/40 rounded-full text-cyan-300 text-[11px] font-mono tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Legendary 1999 Nokia Arcade Reimagined
        </div>
        <h1
          className="text-3xl sm:text-5xl font-black text-white tracking-wider mb-2"
          style={{ fontFamily: '"Chakra Petch", sans-serif' }}
        >
          SPACE IMPACT <span className="text-cyan-400">NEO</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md">
          Pilot the iconic interceptor, unleash missiles & piercing beams, and conquer the 4 legendary chapter bosses.
        </p>
      </div>

      {/* Mode Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-6">
        {/* Campaign Mode */}
        <button
          onClick={() => onStartGame('CAMPAIGN', 1)}
          className="group p-5 bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl transition-all shadow-xl hover:shadow-cyan-500/10 text-left flex flex-col justify-between active:scale-98 cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-cyan-400" />
            </div>
            <h3 className="font-mono font-bold text-sm text-white mb-1">CAMPAIGN STORY</h3>
            <p className="text-[11px] text-slate-400">
              4 distinct sectors from Asteroid Outpost to Titan Mothership with boss duels.
            </p>
          </div>
          <div className="mt-4 text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <span>Launch Sector 1</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Survival Endless */}
        <button
          onClick={() => onStartGame('SURVIVAL', 1)}
          className="group p-5 bg-slate-900/90 hover:bg-slate-800/90 border border-amber-500/30 hover:border-amber-400 rounded-2xl transition-all shadow-xl hover:shadow-amber-500/10 text-left flex flex-col justify-between active:scale-98 cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <h3 className="font-mono font-bold text-sm text-white mb-1">SURVIVAL RUN</h3>
            <p className="text-[11px] text-slate-400">
              Endless scaling waves of alien swarms and recurring bosses. Test your endurance.
            </p>
          </div>
          <div className="mt-4 text-xs font-semibold text-amber-400 flex items-center gap-1">
            <span>Endless Battle</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
      </div>

      {/* Control Schemes Bar */}
      <div className="w-full max-w-lg bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-around gap-2 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-white font-semibold">Move:</span>
          <span>WASD / Arrow Keys</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-semibold">Fire:</span>
          <span>Spacebar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-semibold">Specials:</span>
          <span>1 (Missile) · 2 (Beam) · 3 (Bomb)</span>
        </div>
      </div>
    </div>
  );
};
