/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NokiaBezelProps {
  children: React.ReactNode;
  onPressKey: (key: string, isDown: boolean) => void;
  onFireSecondary: (type: 'MISSILE' | 'LASER_BEAM' | 'BOMB') => void;
  onPause: () => void;
}

export const NokiaBezel: React.FC<NokiaBezelProps> = ({
  children,
  onPressKey,
  onFireSecondary,
  onPause,
}) => {
  return (
    <div className="relative mx-auto my-4 max-w-2xl bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-[50px] p-6 shadow-2xl border-4 border-slate-600/60 select-none">
      {/* Top Phone Header */}
      <div className="flex flex-col items-center justify-center mb-4">
        {/* Earpiece slit */}
        <div className="w-16 h-2 bg-slate-950 rounded-full border border-slate-600 mb-2.5"></div>
        {/* Nokia Logo */}
        <span className="font-bold text-slate-300 tracking-[0.25em] text-xs uppercase font-mono">
          NOKIA
        </span>
      </div>

      {/* Screen Frame Border */}
      <div className="relative rounded-2xl p-3 bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-slate-700/80 shadow-inner overflow-hidden">
        {/* Inner Glass Glow */}
        <div className="rounded-xl overflow-hidden shadow-2xl relative">
          {children}
        </div>
      </div>

      {/* Nokia 3310 Keypad Area */}
      <div className="mt-6 flex flex-col items-center">
        {/* Soft Keys Row */}
        <div className="w-full max-w-sm flex items-center justify-between px-6 mb-4">
          <button
            onClick={onPause}
            className="w-16 h-8 bg-slate-600 hover:bg-slate-500 active:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border-b-2 border-slate-800 shadow-md transition-all active:translate-y-0.5 flex items-center justify-center"
          >
            MENU
          </button>
          {/* Blue Navi-Key (Center Big Button) */}
          <button
            onMouseDown={() => onPressKey('Space', true)}
            onMouseUp={() => onPressKey('Space', false)}
            onTouchStart={() => onPressKey('Space', true)}
            onTouchEnd={() => onPressKey('Space', false)}
            className="w-20 h-9 bg-cyan-700 hover:bg-cyan-600 active:bg-cyan-800 text-white text-xs font-bold rounded-xl border-b-2 border-cyan-900 shadow-lg transition-all active:translate-y-0.5 flex items-center justify-center"
          >
            FIRE [5]
          </button>
          <button
            onClick={onPause}
            className="w-16 h-8 bg-slate-600 hover:bg-slate-500 active:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border-b-2 border-slate-800 shadow-md transition-all active:translate-y-0.5 flex items-center justify-center"
          >
            C / PAUSE
          </button>
        </div>

        {/* 12-Key Numeric Matrix */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs px-2">
          {/* Key 1: Special Missile */}
          <button
            onClick={() => onFireSecondary('MISSILE')}
            className="h-10 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 rounded-xl border-b-2 border-slate-900 shadow transition-all active:translate-y-0.5 flex flex-col items-center justify-center"
          >
            <span className="text-xs font-bold font-mono">1</span>
            <span className="text-[9px] text-amber-300">MISSILE</span>
          </button>

          {/* Key 2: UP */}
          <button
            onMouseDown={() => onPressKey('ArrowUp', true)}
            onMouseUp={() => onPressKey('ArrowUp', false)}
            onTouchStart={() => onPressKey('ArrowUp', true)}
            onTouchEnd={() => onPressKey('ArrowUp', false)}
            className="h-10 bg-slate-600 hover:bg-slate-500 active:bg-slate-800 text-slate-100 rounded-xl border-b-2 border-slate-900 shadow transition-all active:translate-y-0.5 flex flex-col items-center justify-center font-bold"
          >
            <span className="text-xs font-mono">2 ▲</span>
            <span className="text-[9px] text-slate-400">UP</span>
          </button>

          {/* Key 3: Special Laser Beam */}
          <button
            onClick={() => onFireSecondary('LASER_BEAM')}
            className="h-10 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 rounded-xl border-b-2 border-slate-900 shadow transition-all active:translate-y-0.5 flex flex-col items-center justify-center"
          >
            <span className="text-xs font-bold font-mono">3</span>
            <span className="text-[9px] text-purple-300">BEAM</span>
          </button>

          {/* Key 4: LEFT */}
          <button
            onMouseDown={() => onPressKey('ArrowLeft', true)}
            onMouseUp={() => onPressKey('ArrowLeft', false)}
            onTouchStart={() => onPressKey('ArrowLeft', true)}
            onTouchEnd={() => onPressKey('ArrowLeft', false)}
            className="h-10 bg-slate-600 hover:bg-slate-500 active:bg-slate-800 text-slate-100 rounded-xl border-b-2 border-slate-900 shadow transition-all active:translate-y-0.5 flex flex-col items-center justify-center font-bold"
          >
            <span className="text-xs font-mono">4 ◀</span>
            <span className="text-[9px] text-slate-400">LEFT</span>
          </button>

          {/* Key 5: PRIMARY FIRE */}
          <button
            onMouseDown={() => onPressKey('Space', true)}
            onMouseUp={() => onPressKey('Space', false)}
            onTouchStart={() => onPressKey('Space', true)}
            onTouchEnd={() => onPressKey('Space', false)}
            className="h-10 bg-cyan-700 hover:bg-cyan-600 active:bg-cyan-800 text-white rounded-xl border-b-2 border-cyan-950 shadow-md transition-all active:translate-y-0.5 flex flex-col items-center justify-center font-bold"
          >
            <span className="text-xs font-mono">5 ●</span>
            <span className="text-[9px] text-cyan-200">SHOOT</span>
          </button>

          {/* Key 6: RIGHT */}
          <button
            onMouseDown={() => onPressKey('ArrowRight', true)}
            onMouseUp={() => onPressKey('ArrowRight', false)}
            onTouchStart={() => onPressKey('ArrowRight', true)}
            onTouchEnd={() => onPressKey('ArrowRight', false)}
            className="h-10 bg-slate-600 hover:bg-slate-500 active:bg-slate-800 text-slate-100 rounded-xl border-b-2 border-slate-900 shadow transition-all active:translate-y-0.5 flex flex-col items-center justify-center font-bold"
          >
            <span className="text-xs font-mono">6 ▶</span>
            <span className="text-[9px] text-slate-400">RIGHT</span>
          </button>

          {/* Key 7: Special Mega Bomb */}
          <button
            onClick={() => onFireSecondary('BOMB')}
            className="h-10 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 rounded-xl border-b-2 border-slate-900 shadow transition-all active:translate-y-0.5 flex flex-col items-center justify-center"
          >
            <span className="text-xs font-bold font-mono">7</span>
            <span className="text-[9px] text-rose-300">BOMB</span>
          </button>

          {/* Key 8: DOWN */}
          <button
            onMouseDown={() => onPressKey('ArrowDown', true)}
            onMouseUp={() => onPressKey('ArrowDown', false)}
            onTouchStart={() => onPressKey('ArrowDown', true)}
            onTouchEnd={() => onPressKey('ArrowDown', false)}
            className="h-10 bg-slate-600 hover:bg-slate-500 active:bg-slate-800 text-slate-100 rounded-xl border-b-2 border-slate-900 shadow transition-all active:translate-y-0.5 flex flex-col items-center justify-center font-bold"
          >
            <span className="text-xs font-mono">8 ▼</span>
            <span className="text-[9px] text-slate-400">DOWN</span>
          </button>

          {/* Key 9 */}
          <button
            onClick={() => onFireSecondary('BOMB')}
            className="h-10 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 rounded-xl border-b-2 border-slate-900 shadow transition-all active:translate-y-0.5 flex flex-col items-center justify-center"
          >
            <span className="text-xs font-bold font-mono">9</span>
            <span className="text-[9px] text-slate-400">WXYZ</span>
          </button>
        </div>

        {/* Nostalgic microphone hole */}
        <div className="w-1.5 h-1.5 bg-slate-950 rounded-full mt-5"></div>
      </div>
    </div>
  );
};
