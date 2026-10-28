/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Smartphone, Monitor } from 'lucide-react';
import { soundEngine } from '../game/audio';
import { DisplayTheme } from '../game/types';

interface NavbarProps {
  onOpenArsenal: () => void;
  onOpenHighScores: () => void;
  onOpenSettings: () => void;
  onNewGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  phoneBezel: boolean;
  onTogglePhoneBezel: () => void;
  currentTheme: DisplayTheme;
  onSelectTheme: (theme: DisplayTheme) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArsenal,
  onOpenHighScores,
  onOpenSettings,
  onNewGame,
  isMuted,
  onToggleMute,
  phoneBezel,
  onTogglePhoneBezel,
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="/"
          className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
          style={{ fontFamily: '"Chakra Petch", sans-serif' }}
        >
          <span className="w-2.5 h-2.5 bg-cyan-400 rotate-45 inline-block"></span>
          SPACE IMPACT <span className="text-cyan-400">NEO</span>
        </a>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={onOpenArsenal}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
        >
          Arsenal
        </button>
        <button
          onClick={onOpenHighScores}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
        >
          Leaderboard
        </button>
        <button
          onClick={onOpenSettings}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
        >
          Settings
        </button>
        
        {/* Theme quick switch buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => onSelectTheme('NEO_CYBER')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              currentTheme === 'NEO_CYBER'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Neo
          </button>
          <button
            onClick={() => onSelectTheme('NOKIA_3310')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              currentTheme === 'NOKIA_3310'
                ? 'bg-emerald-900/60 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Nokia 3310
          </button>
          <button
            onClick={() => onSelectTheme('AMBER_CRT')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              currentTheme === 'AMBER_CRT'
                ? 'bg-amber-900/50 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Amber CRT
          </button>
        </div>
      </nav>

      {/* Zone 3: 1 primary action cluster */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Toggle Bezel */}
        <button
          onClick={onTogglePhoneBezel}
          title={phoneBezel ? 'Switch to Fullscreen Widescreen' : 'Switch to Nokia 3310 Phone Mockup'}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
        >
          {phoneBezel ? (
            <>
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Wide Mode</span>
            </>
          ) : (
            <>
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Nokia 3310</span>
            </>
          )}
        </button>

        {/* Mute button */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Primary CTA */}
        <button
          onClick={onNewGame}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-95 rounded-lg transition-all shadow-sm shadow-cyan-500/20 whitespace-nowrap shrink-0"
        >
          New Mission
        </button>
      </div>
    </header>
  );
};
