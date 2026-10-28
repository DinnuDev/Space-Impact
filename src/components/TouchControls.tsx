/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Crosshair, Rocket, Zap, Disc3 } from 'lucide-react';

interface TouchControlsProps {
  onPressKey: (key: string, isDown: boolean) => void;
  onFireSecondary: (type: 'MISSILE' | 'LASER_BEAM' | 'BOMB') => void;
  missiles: number;
  lasers: number;
  bombs: number;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onPressKey,
  onFireSecondary,
  missiles,
  lasers,
  bombs,
}) => {
  return (
    <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/90 border-t border-slate-800/80 select-none md:hidden">
      {/* Virtual D-Pad */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Up */}
        <button
          onTouchStart={() => onPressKey('ArrowUp', true)}
          onTouchEnd={() => onPressKey('ArrowUp', false)}
          onMouseDown={() => onPressKey('ArrowUp', true)}
          onMouseUp={() => onPressKey('ArrowUp', false)}
          className="absolute top-1 w-11 h-11 bg-slate-800 active:bg-cyan-700 text-slate-300 active:text-white rounded-lg flex items-center justify-center border border-slate-700 active:scale-95 transition-all shadow-md"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Down */}
        <button
          onTouchStart={() => onPressKey('ArrowDown', true)}
          onTouchEnd={() => onPressKey('ArrowDown', false)}
          onMouseDown={() => onPressKey('ArrowDown', true)}
          onMouseUp={() => onPressKey('ArrowDown', false)}
          className="absolute bottom-1 w-11 h-11 bg-slate-800 active:bg-cyan-700 text-slate-300 active:text-white rounded-lg flex items-center justify-center border border-slate-700 active:scale-95 transition-all shadow-md"
        >
          <ArrowDown className="w-5 h-5" />
        </button>

        {/* Left */}
        <button
          onTouchStart={() => onPressKey('ArrowLeft', true)}
          onTouchEnd={() => onPressKey('ArrowLeft', false)}
          onMouseDown={() => onPressKey('ArrowLeft', true)}
          onMouseUp={() => onPressKey('ArrowLeft', false)}
          className="absolute left-1 w-11 h-11 bg-slate-800 active:bg-cyan-700 text-slate-300 active:text-white rounded-lg flex items-center justify-center border border-slate-700 active:scale-95 transition-all shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Right */}
        <button
          onTouchStart={() => onPressKey('ArrowRight', true)}
          onTouchEnd={() => onPressKey('ArrowRight', false)}
          onMouseDown={() => onPressKey('ArrowRight', true)}
          onMouseUp={() => onPressKey('ArrowRight', false)}
          className="absolute right-1 w-11 h-11 bg-slate-800 active:bg-cyan-700 text-slate-300 active:text-white rounded-lg flex items-center justify-center border border-slate-700 active:scale-95 transition-all shadow-md"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Center Pivot */}
        <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700/60 pointer-events-none" />
      </div>

      {/* Action Fire Cluster */}
      <div className="flex flex-col items-end gap-2.5">
        {/* Secondary Weapons Row */}
        <div className="flex items-center gap-2">
          {/* Missiles */}
          <button
            onClick={() => onFireSecondary('MISSILE')}
            disabled={missiles <= 0}
            className={`w-11 h-11 rounded-full flex flex-col items-center justify-center border transition-all active:scale-95 ${
              missiles > 0
                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-40'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span className="text-[9px] font-mono font-bold leading-none">{missiles}</span>
          </button>

          {/* Piercing Beam */}
          <button
            onClick={() => onFireSecondary('LASER_BEAM')}
            disabled={lasers <= 0}
            className={`w-11 h-11 rounded-full flex flex-col items-center justify-center border transition-all active:scale-95 ${
              lasers > 0
                ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-40'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="text-[9px] font-mono font-bold leading-none">{lasers}</span>
          </button>

          {/* Screen Bomb */}
          <button
            onClick={() => onFireSecondary('BOMB')}
            disabled={bombs <= 0}
            className={`w-11 h-11 rounded-full flex flex-col items-center justify-center border transition-all active:scale-95 ${
              bombs > 0
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-40'
            }`}
          >
            <Disc3 className="w-4 h-4" />
            <span className="text-[9px] font-mono font-bold leading-none">{bombs}</span>
          </button>
        </div>

        {/* Primary Shoot Button */}
        <button
          onTouchStart={() => onPressKey('Space', true)}
          onTouchEnd={() => onPressKey('Space', false)}
          onMouseDown={() => onPressKey('Space', true)}
          onMouseUp={() => onPressKey('Space', false)}
          className="w-20 h-16 bg-cyan-600 active:bg-cyan-500 text-slate-950 font-bold rounded-2xl flex flex-col items-center justify-center border-2 border-cyan-400 active:scale-95 transition-all shadow-lg shadow-cyan-900/40"
        >
          <Crosshair className="w-6 h-6 text-slate-950" />
          <span className="text-[10px] uppercase font-mono tracking-wider">FIRE</span>
        </button>
      </div>
    </div>
  );
};
