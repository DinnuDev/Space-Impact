/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gameEngine } from './game/engine';
import { soundEngine } from './game/audio';
import { vibrationManager } from './game/vibration';
import { Navbar } from './components/Navbar';
import { HUD } from './components/HUD';
import { NokiaBezel } from './components/NokiaBezel';
import { TouchControls } from './components/TouchControls';
import { TitleScreen } from './components/TitleScreen';
import { LevelClearModal } from './components/LevelClearModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { ArsenalModal } from './components/ArsenalModal';
import { HighScoresModal } from './components/HighScoresModal';
import { SettingsModal } from './components/SettingsModal';
import { DisplayTheme, GameMode, GameSettings } from './game/types';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Shield, Award, Zap, Crosshair } from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state from engine
  const [engineState, setEngineState] = useState(() => ({
    status: gameEngine.status,
    mode: gameEngine.mode,
    chapter: gameEngine.chapter,
    score: gameEngine.score,
    combo: gameEngine.combo,
    shotsFired: gameEngine.shotsFired,
    shotsHit: gameEngine.shotsHit,
    levelProgress: gameEngine.levelDistance / gameEngine.levelMaxDistance,
    stats: { ...gameEngine.stats },
    boss: gameEngine.boss ? { ...gameEngine.boss } : null,
  }));

  const [settings, setSettings] = useState<GameSettings>(gameEngine.settings);
  const [isMuted, setIsMuted] = useState(false);

  // Modals
  const [showArsenal, setShowArsenal] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Sync callback
  const handleEngineChange = useCallback(() => {
    setEngineState({
      status: gameEngine.status,
      mode: gameEngine.mode,
      chapter: gameEngine.chapter,
      score: gameEngine.score,
      combo: gameEngine.combo,
      shotsFired: gameEngine.shotsFired,
      shotsHit: gameEngine.shotsHit,
      levelProgress: Math.min(1, gameEngine.levelDistance / gameEngine.levelMaxDistance),
      stats: { ...gameEngine.stats },
      boss: gameEngine.boss ? { ...gameEngine.boss } : null,
    });
  }, []);

  // Initialize Canvas & Engine
  useEffect(() => {
    if (canvasRef.current) {
      gameEngine.init(canvasRef.current);
      gameEngine.onStateChange = handleEngineChange;
    }

    const onKeyDown = (e: KeyboardEvent) => gameEngine.handleKeyDown(e);
    const onKeyUp = (e: KeyboardEvent) => gameEngine.handleKeyUp(e);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      gameEngine.stop();
    };
  }, [handleEngineChange]);

  // Actions
  const handleStartGame = (mode: GameMode = 'CAMPAIGN', chapter: number = 1) => {
    gameEngine.startNewGame(mode, chapter);
  };

  const handleNextChapter = () => {
    gameEngine.startNextChapter();
  };

  const handleRestart = () => {
    gameEngine.startNewGame(engineState.mode, 1);
  };

  const handleSaveScore = (initials: string) => {
    gameEngine.saveScore(initials);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    setSettings((prev) => ({ ...prev, soundEnabled: !muted }));
  };

  const handleTogglePhoneBezel = () => {
    const next = !settings.phoneBezel;
    gameEngine.settings.phoneBezel = next;
    setSettings((prev) => ({ ...prev, phoneBezel: next }));
  };

  const handleSelectTheme = (theme: DisplayTheme) => {
    gameEngine.settings.theme = theme;
    setSettings((prev) => ({ ...prev, theme }));
  };

  const handleUpdateSettings = (partial: Partial<GameSettings>) => {
    const updated = { ...settings, ...partial };
    gameEngine.settings = updated;
    if (partial.vibrationEnabled !== undefined) {
      vibrationManager.enabled = partial.vibrationEnabled;
    }
    setSettings(updated);
  };

  const handlePressKey = (key: string, isDown: boolean) => {
    if (isDown) {
      vibrationManager.triggerKeyTap();
    }
    if (key === 'Space') {
      gameEngine.keys['Space'] = isDown;
    } else {
      gameEngine.keys[key] = isDown;
    }
  };


  const handleFireSecondary = (type: 'MISSILE' | 'LASER_BEAM' | 'BOMB') => {
    gameEngine.fireSecondary(type);
  };

  const handlePause = () => {
    gameEngine.pauseGame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar Contract */}
      <Navbar
        onOpenArsenal={() => setShowArsenal(true)}
        onOpenHighScores={() => setShowHighScores(true)}
        onOpenSettings={() => setShowSettings(true)}
        onNewGame={() => handleStartGame('CAMPAIGN', 1)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        phoneBezel={settings.phoneBezel}
        onTogglePhoneBezel={handleTogglePhoneBezel}
        currentTheme={settings.theme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Main Game Stage Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-6xl mx-auto w-full">
        {settings.phoneBezel ? (
          // Nokia 3310 Phone Mode
          <NokiaBezel
            onPressKey={handlePressKey}
            onFireSecondary={handleFireSecondary}
            onPause={handlePause}
          >
            <div className="relative w-full max-w-[640px] aspect-[16/9] bg-black overflow-hidden flex flex-col">
              <HUD
                stats={engineState.stats}
                score={engineState.score}
                combo={engineState.combo}
                chapter={engineState.chapter}
                mode={engineState.mode}
                boss={engineState.boss}
                theme={settings.theme}
                levelProgress={engineState.levelProgress}
                onFireSecondary={handleFireSecondary}
              />
              <div className="relative flex-1 w-full h-full">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain block image-rendering-pixelated"
                />
                {engineState.status === 'MENU' && (
                  <TitleScreen
                    onStartGame={handleStartGame}
                    onOpenArsenal={() => setShowArsenal(true)}
                    onOpenLeaderboard={() => setShowHighScores(true)}
                  />
                )}
                {engineState.status === 'LEVEL_CLEAR' && (
                  <LevelClearModal
                    chapter={engineState.chapter}
                    score={engineState.score}
                    lives={engineState.stats.lives}
                    shotsFired={engineState.shotsFired}
                    shotsHit={engineState.shotsHit}
                    onNextChapter={handleNextChapter}
                  />
                )}
                {engineState.status === 'GAME_OVER' && (
                  <GameOverModal
                    score={engineState.score}
                    chapter={engineState.chapter}
                    onRestart={handleRestart}
                    onSaveScore={handleSaveScore}
                  />
                )}
                {engineState.status === 'VICTORY' && (
                  <VictoryModal
                    score={engineState.score}
                    onRestart={handleRestart}
                    onSaveScore={handleSaveScore}
                  />
                )}
                {engineState.status === 'PAUSED' && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
                    <h2 className="text-2xl font-bold font-mono text-cyan-400">MISSION PAUSED</h2>
                    <button
                      onClick={handlePause}
                      className="px-6 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      RESUME FLIGHT
                    </button>
                  </div>
                )}
              </div>
            </div>
          </NokiaBezel>
        ) : (
          // Modern Widescreen Neo-Arcade Cabinet Mode
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <HUD
              stats={engineState.stats}
              score={engineState.score}
              combo={engineState.combo}
              chapter={engineState.chapter}
              mode={engineState.mode}
              boss={engineState.boss}
              theme={settings.theme}
              levelProgress={engineState.levelProgress}
              onFireSecondary={handleFireSecondary}
            />

            <div className="relative w-full aspect-[16/9] bg-black overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full block object-contain"
                style={{ imageRendering: settings.theme === 'NOKIA_3310' ? 'pixelated' : 'auto' }}
              />

              {engineState.status === 'MENU' && (
                <TitleScreen
                  onStartGame={handleStartGame}
                  onOpenArsenal={() => setShowArsenal(true)}
                  onOpenLeaderboard={() => setShowHighScores(true)}
                />
              )}

              {engineState.status === 'LEVEL_CLEAR' && (
                <LevelClearModal
                  chapter={engineState.chapter}
                  score={engineState.score}
                  lives={engineState.stats.lives}
                  shotsFired={engineState.shotsFired}
                  shotsHit={engineState.shotsHit}
                  onNextChapter={handleNextChapter}
                />
              )}

              {engineState.status === 'GAME_OVER' && (
                <GameOverModal
                  score={engineState.score}
                  chapter={engineState.chapter}
                  onRestart={handleRestart}
                  onSaveScore={handleSaveScore}
                />
              )}

              {engineState.status === 'VICTORY' && (
                <VictoryModal
                  score={engineState.score}
                  onRestart={handleRestart}
                  onSaveScore={handleSaveScore}
                />
              )}

              {engineState.status === 'PAUSED' && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
                  <h2 className="text-2xl font-bold font-mono text-cyan-400">MISSION PAUSED</h2>
                  <button
                    onClick={handlePause}
                    className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                  >
                    RESUME FLIGHT
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Touch Controls when on touch/mobile */}
            <TouchControls
              onPressKey={handlePressKey}
              onFireSecondary={handleFireSecondary}
              missiles={engineState.stats.missiles}
              lasers={engineState.stats.lasers}
              bombs={engineState.stats.bombs}
            />
          </div>
        )}

        {/* Tactical Overview / Boss Dossier Section */}
        <section className="w-full max-w-4xl mt-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: '"Chakra Petch", sans-serif' }}>
                <span className="w-2 h-2 bg-rose-500 rotate-45 inline-block"></span>
                TARGET BOSS INTELLIGENCE
              </h2>
              <p className="text-xs text-slate-400">
                Primary chapter bosses reconstructed from the legendary Space Impact missions.
              </p>
            </div>
            <button
              onClick={() => setShowArsenal(true)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              View Full Arsenal & Tactics →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Boss 1: Crab-X9 */}
            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl hover:border-pink-500/40 transition-colors">
              <div className="flex items-center justify-between mb-1.5 font-mono">
                <span className="font-bold text-pink-400">CH.1 // CRAB-X9</span>
                <span className="text-slate-500">320 HP</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">Armored Bio-Crab</span>
              <p className="text-slate-400 text-[11px]">
                Armored pincers shield its core. Fires 3-to-5 spread plasma bursts. Target core when claws open.
              </p>
            </div>

            {/* Boss 2: Xeno-Worm */}
            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between mb-1.5 font-mono">
                <span className="font-bold text-emerald-400">CH.2 // XENO-WORM</span>
                <span className="text-slate-500">420 HP</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">Sub-Orbital Centipede</span>
              <p className="text-slate-400 text-[11px]">
                8 linked articulating body segments swimming in sine waves. Spews clustered acid bursts.
              </p>
            </div>

            {/* Boss 3: Oculus-Prime */}
            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between mb-1.5 font-mono">
                <span className="font-bold text-purple-400">CH.3 // OCULUS-PRIME</span>
                <span className="text-slate-500">520 HP</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">Dread-Core Eye</span>
              <p className="text-slate-400 text-[11px]">
                Orbiting defense satellite shields + sweeping horizontal optic death beam. Destroy satellites first.
              </p>
            </div>

            {/* Boss 4: Titan Mothership */}
            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between mb-1.5 font-mono">
                <span className="font-bold text-amber-400">CH.4 // TITAN CARRIER</span>
                <span className="text-slate-500">680 HP</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">Supreme Flagship</span>
              <p className="text-slate-400 text-[11px]">
                Twin missile battery decks, nose plasma cannon, and multi-deck damage states.
              </p>
            </div>
          </div>
        </section>

        {/* Hostile Archetypes Quick Overview */}
        <section className="w-full max-w-4xl p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse"></span>
            <span className="text-cyan-300 font-semibold font-mono">SEEKER:</span>
            <span>Homing predator that actively matches player Y coordinates</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
            <span className="text-amber-300 font-semibold font-mono">TANK:</span>
            <span>Heavy armored juggernaut absorbing multiple ordnance hits</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 inline-block"></span>
            <span className="text-fuchsia-300 font-semibold font-mono">SPLITTER:</span>
            <span>Divides into 2 high-speed agile mini-drones upon destruction</span>
          </div>
        </section>

        {/* Weapons & Scoring Quick Strip */}
        <section className="w-full max-w-4xl p-4 bg-slate-900/50 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 mb-8">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-semibold">Primary Lasers:</span>
            <span>Single · Dual Heavy · Triple Spread · Plasma Overdrive</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-semibold">Special Ordnance:</span>
            <span>Missiles [1/Q] · Piercing Beam [2/E] · Mega Bomb [3/R]</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-semibold">Scoring Multiplier:</span>
            <span>Up to 5x for continuous rapid target destructions</span>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Space Impact Neo · A tribute to the classic 1999 Nokia 3310 mobile arcade shooter.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setShowArsenal(true)} className="hover:text-cyan-400 transition-colors">
              Arsenal
            </button>
            <button onClick={() => setShowHighScores(true)} className="hover:text-cyan-400 transition-colors">
              High Scores
            </button>
            <button onClick={() => setShowSettings(true)} className="hover:text-cyan-400 transition-colors">
              Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showArsenal && <ArsenalModal onClose={() => setShowArsenal(false)} />}
      {showHighScores && (
        <HighScoresModal
          scores={gameEngine.highScores}
          onClose={() => setShowHighScores(false)}
        />
      )}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
