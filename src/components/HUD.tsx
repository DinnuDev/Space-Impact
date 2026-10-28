/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Zap, Rocket, Disc3, Crosshair, Heart } from 'lucide-react';
import { PlayerStats, Boss, GameMode, DisplayTheme } from '../game/types';

interface HUDProps {
  stats: PlayerStats;
  score: number;
  combo: number;
  chapter: number;
  mode: GameMode;
  boss: Boss | null;
  theme: DisplayTheme;
  levelProgress: number; // 0 to 1
  onFireSecondary: (type: 'MISSILE' | 'LASER_BEAM' | 'BOMB') => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  score,
  combo,
  chapter,
  mode,
  boss,
  theme,
  levelProgress,
  onFireSecondary,
}) => {
  const isNokia = theme === 'NOKIA_3310';
  const isAmber = theme === 'AMBER_CRT';

  const chapterNames: Record<number, string> = {
    1: 'ASTEROID OUTPOST',
    2: 'XENO NEBULA',
    3: 'CYBER CORE',
    4: 'TITAN MOTHERSHIP',
  };

  return (
    <div className="w-full select-none">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2.5 px-4 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300">
        {/* Left: Mode & Lives & Health */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 font-mono text-cyan-400 font-semibold tracking-wider">
            <span>{mode === 'CAMPAIGN' ? `CH.0${chapter}` : 'SURVIVAL'}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">{mode === 'CAMPAIGN' ? chapterNames[chapter] : 'ENDLESS FLEET'}</span>
          </div>

          {/* Lives Remaining */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">LIVES:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 transition-opacity ${
                    i < stats.lives ? 'text-cyan-400 opacity-100' : 'text-slate-700 opacity-30'
                  }`}
                >
                  ▲
                </div>
              ))}
            </div>
          </div>

          {/* Health Gauge */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">SHIELD:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: stats.maxHp }).map((_, i) => {
                const filled = i < stats.hp;
                return (
                  <div
                    key={i}
                    className={`w-4 h-2.5 rounded-xs transition-all ${
                      filled
                        ? stats.hp === 1
                          ? 'bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse'
                          : stats.hp <= 2
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                        : 'bg-slate-800 border border-slate-700/50'
                    }`}
                  />
                );
              })}
            </div>
            <span className="font-mono text-slate-400 tabular-nums">
              {stats.hp}/{stats.maxHp}
            </span>
            {stats.shieldTimeRemaining > 0 && (
              <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-semibold animate-pulse">
                <Shield className="w-3 h-3" /> FORCEFIELD
              </span>
            )}
          </div>
        </div>

        {/* Right: Score & Multiplier */}
        <div className="flex items-center gap-4">
          {combo > 1 && (
            <div className="flex items-center gap-1 text-amber-400 font-bold tracking-wider font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>COMBO x{Math.min(5, 1 + Math.floor(combo / 3))}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-400">SCORE:</span>
            <span className="text-sm sm:text-base font-bold text-white tabular-nums tracking-widest">
              {score.toLocaleString().padStart(6, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Boss Health Bar (when Boss is Active) */}
      {boss && (
        <div className="px-4 py-2 bg-rose-950/40 border-b border-rose-500/30 flex flex-col gap-1 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <div className="flex items-center gap-2">
              <span className="text-rose-400">{boss.name}</span>
              <span className="text-slate-400 text-[11px] font-normal">// {boss.title}</span>
              {boss.rage && (
                <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded text-[10px] animate-pulse">
                  RAGE
                </span>
              )}
            </div>
            <span className="text-rose-300 tabular-nums">
              {Math.max(0, Math.ceil(boss.hp))} / {boss.maxHp} HP
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 border border-rose-900/50 rounded-sm overflow-hidden p-0.5">
            <div
              className={`h-full transition-all duration-150 rounded-xs ${
                boss.rage
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* Level Progress Line (if no boss yet) */}
      {!boss && (
        <div className="w-full h-1 bg-slate-800">
          <div
            className="h-full bg-cyan-400 transition-all duration-200"
            style={{ width: `${Math.min(100, levelProgress * 100)}%` }}
          />
        </div>
      )}

      {/* Weapons Arsenal Dock */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-950/90 border-b border-slate-800/80 text-xs">
        {/* Primary Laser Upgrade Gauge */}
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 flex items-center gap-1 font-mono">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> CANNON:
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((lvl) => (
              <span
                key={lvl}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                  stats.primaryLevel >= lvl
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}
              >
                LV.{lvl}
              </span>
            ))}
          </div>
          <span className="text-slate-500 hidden sm:inline text-[11px]">
            {stats.primaryLevel === 1 && 'Single Pulse'}
            {stats.primaryLevel === 2 && 'Dual Heavy'}
            {stats.primaryLevel === 3 && 'Triple Spread'}
            {stats.primaryLevel === 4 && 'Plasma Overdrive'}
          </span>
        </div>

        {/* Secondary Weapons Buttons */}
        <div className="flex items-center gap-2">
          {/* Missiles */}
          <button
            onClick={() => onFireSecondary('MISSILE')}
            disabled={stats.missiles <= 0}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-all ${
              stats.missiles > 0
                ? 'bg-amber-950/30 border-amber-600/40 text-amber-300 hover:bg-amber-900/40 hover:border-amber-500 cursor-pointer active:scale-95'
                : 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">Missiles [1/Q]</span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">×{stats.missiles}</span>
          </button>

          {/* Piercing Laser */}
          <button
            onClick={() => onFireSecondary('LASER_BEAM')}
            disabled={stats.lasers <= 0}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-all ${
              stats.lasers > 0
                ? 'bg-purple-950/30 border-purple-600/40 text-purple-300 hover:bg-purple-900/40 hover:border-purple-500 cursor-pointer active:scale-95'
                : 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold">Beam [2/E]</span>
            <span className="font-mono font-bold text-purple-400 tabular-nums">×{stats.lasers}</span>
          </button>

          {/* Mega Bomb */}
          <button
            onClick={() => onFireSecondary('BOMB')}
            disabled={stats.bombs <= 0}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-all ${
              stats.bombs > 0
                ? 'bg-rose-950/30 border-rose-600/40 text-rose-300 hover:bg-rose-900/40 hover:border-rose-500 cursor-pointer active:scale-95'
                : 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold">Mega Bomb [3/R]</span>
            <span className="font-mono font-bold text-rose-400 tabular-nums">×{stats.bombs}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
