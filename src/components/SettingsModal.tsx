/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Volume2, Monitor, Smartphone, Sliders } from 'lucide-react';
import { GameSettings, DisplayTheme } from '../game/types';
import { soundEngine } from '../game/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold font-mono tracking-wide text-white uppercase">
              Mission Control & Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Display Theme */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2.5">
              Display Mode / Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onUpdateSettings({ theme: 'NEO_CYBER' })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  settings.theme === 'NEO_CYBER'
                    ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-cyan-400" />
                <span className="text-xs">Neo Cyber</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ theme: 'NOKIA_3310' })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  settings.theme === 'NOKIA_3310'
                    ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-[#9dbf9e]" />
                <span className="text-xs">Nokia 3310</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ theme: 'AMBER_CRT' })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  settings.theme === 'AMBER_CRT'
                    ? 'bg-amber-950/40 border-amber-400 text-amber-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-amber-500" />
                <span className="text-xs">Amber CRT</span>
              </button>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-slate-300">Sound Effects Volume</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  {Math.round(settings.sfxVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings({ sfxVolume: val });
                  soundEngine.setSfxVolume(val);
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-slate-300">Chiptune Music Volume</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  {Math.round(settings.musicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings({ musicVolume: val });
                  soundEngine.setMusicVolume(val);
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Visual & Gameplay Toggles */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer">
              <span className="text-slate-300">Nokia 3310 Phone Bezel</span>
              <input
                type="checkbox"
                checked={settings.phoneBezel}
                onChange={(e) => onUpdateSettings({ phoneBezel: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer">
              <span className="text-slate-300">Continuous Auto-Fire</span>
              <input
                type="checkbox"
                checked={settings.autoFire}
                onChange={(e) => onUpdateSettings({ autoFire: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer">
              <span className="text-slate-300">Dynamic Screen Shake</span>
              <input
                type="checkbox"
                checked={settings.screenShake}
                onChange={(e) => onUpdateSettings({ screenShake: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer">
              <div className="flex flex-col">
                <span className="text-slate-300">Device Vibration Sensors</span>
                <span className="text-[10px] text-slate-500">Tactile haptic pulses for hits & boss defeats</span>
              </div>
              <input
                type="checkbox"
                checked={settings.vibrationEnabled}
                onChange={(e) => onUpdateSettings({ vibrationEnabled: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer">
              <span className="text-slate-300">CRT Scanline Filter</span>
              <input
                type="checkbox"
                checked={settings.crtFilter}
                onChange={(e) => onUpdateSettings({ crtFilter: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>
          </div>

        </div>
      </div>
    </div>
  );
};
