/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Rocket, Zap, Disc3, Shield, Crosshair, Skull } from 'lucide-react';

interface ArsenalModalProps {
  onClose: () => void;
}

export const ArsenalModal: React.FC<ArsenalModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'weapons' | 'powerups' | 'enemies' | 'bosses'>('weapons');

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-400 rotate-45 inline-block" />
            <h3 className="text-base font-bold font-mono tracking-wide text-white uppercase">
              Tactical Dossier & Arsenal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Filter Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800/80 bg-slate-900">
          <button
            onClick={() => setTab('weapons')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'weapons'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weapons Systems
          </button>
          <button
            onClick={() => setTab('powerups')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'powerups'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Power-Up Capsules
          </button>
          <button
            onClick={() => setTab('enemies')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'enemies'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Enemy Archetypes
          </button>
          <button
            onClick={() => setTab('bosses')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'bosses'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hostile Bosses
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {tab === 'weapons' && (
            <div className="space-y-4">
              {/* Primary Weapon Upgrade Levels */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
                  <Crosshair className="w-4 h-4" /> PRIMARY LASER CANNONS (Levels 1–4)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="font-mono text-cyan-400 font-semibold block mb-0.5">LV.1 Single Pulse</span>
                    Standard single high-speed energy bolt. Reliable rapid firing.
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="font-mono text-cyan-400 font-semibold block mb-0.5">LV.2 Dual Heavy</span>
                    Parallel twin blaster bolts covering a wider horizontal trajectory.
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="font-mono text-cyan-400 font-semibold block mb-0.5">LV.3 Triple Spread</span>
                    Forward bolt + diagonal wing lasers to clear swarming flanks.
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="font-mono text-cyan-400 font-semibold block mb-0.5">LV.4 Plasma Overdrive</span>
                    Heavy piercing twin bolts cutting through shields and armored drones.
                  </div>
                </div>
              </div>

              {/* Special Secondary Weapons */}
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold text-amber-300 mb-1">
                      MISSILES [Key 1 / Q]
                    </h4>
                    <p className="text-slate-300">
                      Launches dual accelerated warheads with proximity target tracking. Deals heavy burst explosive damage on contact. Perfect for heavy gunships and boss targets.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold text-purple-300 mb-1">
                      PIERCING LASER BEAM [Key 2 / E]
                    </h4>
                    <p className="text-slate-300">
                      Discharges a sustained hyper-concentrated laser beam straight across the entire screen for 1.6 seconds. Pierces through infinite regular enemies in its path.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400 shrink-0">
                    <Disc3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold text-rose-300 mb-1">
                      SCREEN MEGA BOMB [Key 3 / R]
                    </h4>
                    <p className="text-slate-300">
                      Detonates an expansive EMP shockwave from your ship. Instantly clears all incoming enemy projectiles, destroys all light alien drones, and deals massive trauma to bosses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'powerups' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-400 font-mono font-bold text-cyan-300 flex items-center justify-center shrink-0">
                  [P]
                </div>
                <div>
                  <h5 className="font-semibold text-white">Weapon Upgrade</h5>
                  <p className="text-slate-400">Upgrades primary laser cannon to next tier.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-400 font-mono font-bold text-amber-300 flex items-center justify-center shrink-0">
                  [M]
                </div>
                <div>
                  <h5 className="font-semibold text-white">Missile Ammo</h5>
                  <p className="text-slate-400">Restocks +3 explosive homing rockets.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-950 border border-purple-400 font-mono font-bold text-purple-300 flex items-center justify-center shrink-0">
                  [L]
                </div>
                <div>
                  <h5 className="font-semibold text-white">Laser Beam Ammo</h5>
                  <p className="text-slate-400">Adds +2 continuous piercing laser charges.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-950 border border-rose-400 font-mono font-bold text-rose-300 flex items-center justify-center shrink-0">
                  [B]
                </div>
                <div>
                  <h5 className="font-semibold text-white">Mega Bomb</h5>
                  <p className="text-slate-400">Adds +1 full-screen EMP blast.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-400 font-mono font-bold text-emerald-300 flex items-center justify-center shrink-0">
                  [+]
                </div>
                <div>
                  <h5 className="font-semibold text-white">Shield Repair</h5>
                  <p className="text-slate-400">Restores up to 2 shield health points.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-950 border border-teal-400 font-mono font-bold text-teal-300 flex items-center justify-center shrink-0">
                  [S]
                </div>
                <div>
                  <h5 className="font-semibold text-white">Energy Forcefield</h5>
                  <p className="text-slate-400">7 seconds of total invulnerability.</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'enemies' && (
            <div className="space-y-3">
              {/* Highlight the 3 new requested archetypes with high-priority callout */}
              <div className="p-3.5 bg-cyan-950/30 border border-cyan-500/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-400">SEEKER DRONE (Hunter)</span>
                  <span className="text-slate-400 font-mono">12+ HP · 220 PTS</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-200 block">Dynamic Player Tracking</span>
                <p className="text-slate-300">
                  Agile predatory drone with red optic sensors that actively calculates and pursues player coordinates in real time. Fires high-speed directed sniper lasers. Maneuver vertically to break its line of fire.
                </p>
              </div>

              <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400">TANK FORTRESS UNIT (Juggernaut)</span>
                  <span className="text-slate-400 font-mono">60+ HP · 450 PTS</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-200 block">Heavy Armor & Deflect Plating</span>
                <p className="text-slate-300">
                  Massive heavily reinforced dreadnought that absorbs heavy laser and missile fire before detonating with a powerful shockwave. Fires twin heavy plasma spheres. Weak to Piercing Beam and Mega Bombs. Guaranteed ordnance drop.
                </p>
              </div>

              <div className="p-3.5 bg-fuchsia-950/30 border border-fuchsia-500/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-fuchsia-400">SPLITTER CLUSTER (Cellular Matrix)</span>
                  <span className="text-slate-400 font-mono">22+ HP · 260 PTS</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-200 block">Mitotic Multiplication</span>
                <p className="text-slate-300">
                  Unstable bio-mechanical cluster. Upon destruction, its outer membrane ruptures and divides into 2 agile Mini-Splitters that dart in opposite angles across the screen! Destroy the fragments before they flank you.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-300">SCOUT & BIO-POD</span>
                  <span className="text-slate-500 font-mono">8–14 HP</span>
                </div>
                <p className="text-slate-400">
                  Standard swarming drones flying in harmonic sine waves and wavering biological pods that drop powerups.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-300">SPACE MINE & KAMIKAZE</span>
                  <span className="text-slate-500 font-mono">6–18 HP</span>
                </div>
                <p className="text-slate-400">
                  Rotating spiked proximity mines that absorb stray fire, and high-velocity delta darts that accelerate straight toward your cockpit.
                </p>
              </div>
            </div>
          )}

          {tab === 'bosses' && (

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-pink-400">CH.1 // CRAB-X9 (Mecha-Crab)</span>
                  <span className="text-slate-500 font-mono">320 HP</span>
                </div>
                <p className="text-slate-300">
                  Guards with heavy armored pincers. Enters Rage Mode below 40% HP to fire 5-way plasma spreads and lunge forward. Time your shots between claw sweeps.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-emerald-400">CH.2 // XENO-WORM (Cyber-Centipede)</span>
                  <span className="text-slate-500 font-mono">420 HP</span>
                </div>
                <p className="text-slate-300">
                  8-segment sub-orbital serpent swimming in harmonic sine waves. Segments spew venomous acid clusters. Aim for the armored head or weaken individual nodes.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-purple-400">CH.3 // OCULUS-PRIME (Dread-Core Eye)</span>
                  <span className="text-slate-500 font-mono">520 HP</span>
                </div>
                <p className="text-slate-300">
                  Shielded by 4 orbiting defense satellites. Charges a devastating horizontal death ray that cuts across the arena. Destroy satellites first to expose the pupil.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-amber-400">CH.4 // VALKYRIE DREADNOUGHT</span>
                  <span className="text-slate-500 font-mono">680 HP</span>
                </div>
                <p className="text-slate-300">
                  Supreme Flagship Carrier. Fires double missile salvos from upper/lower launch bays and a central plasma battery. Dodge missile arcs and use Mega Bombs to counter salvos.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
