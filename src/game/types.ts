/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DisplayTheme = 'NOKIA_3310' | 'NEO_CYBER' | 'AMBER_CRT';

export type GameMode = 'CAMPAIGN' | 'SURVIVAL';

export type GameStatus =
  | 'MENU'
  | 'PLAYING'
  | 'BOSS_WARNING'
  | 'BOSS_FIGHT'
  | 'LEVEL_CLEAR'
  | 'GAME_OVER'
  | 'VICTORY'
  | 'PAUSED';

export type SecondaryWeaponType = 'MISSILE' | 'LASER_BEAM' | 'BOMB';

export interface PlayerStats {
  hp: number;
  maxHp: number;
  lives: number;
  primaryLevel: number; // 1 to 4
  missiles: number;
  lasers: number;
  bombs: number;
  selectedSecondary: SecondaryWeaponType;
  shieldTimeRemaining: number; // Invulnerability seconds
  respawnInvulnRemaining: number;
}

export type PowerUpType =
  | 'PRIMARY_UPGRADE'
  | 'AMMO_MISSILE'
  | 'AMMO_LASER'
  | 'AMMO_BOMB'
  | 'HEALTH_REPAIR'
  | 'ENERGY_SHIELD';

export interface PowerUpItem {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: PowerUpType;
  radius: number;
  lifeTime: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  isEnemy: boolean;
  color?: string;
  type?: 'NORMAL' | 'MISSILE' | 'PIERCING' | 'ACID' | 'ENERGY_RING';
  piercing?: boolean;
  trail?: { x: number; y: number }[];
  targetId?: number; // for homing missiles
}

export interface LaserBeamEffect {
  active: boolean;
  duration: number;
  width: number;
  damagePerTick: number;
}

export interface BombEffect {
  active: boolean;
  radius: number;
  maxRadius: number;
  x: number;
  y: number;
}

export type EnemyType =
  | 'SCOUT'
  | 'BIO_POD'
  | 'MINE'
  | 'TURRET'
  | 'KAMIKAZE'
  | 'GUNSHIP'
  | 'SEEKER'
  | 'TANK'
  | 'SPLITTER'
  | 'SPLITTER_MINI';


export interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  points: number;
  shootCooldown: number;
  shootInterval: number;
  age: number;
  stateData?: Record<string, number>;
  dropsPowerup?: PowerUpType;
}

export interface BossSegment {
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  isHead?: boolean;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  chapter: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  phase: number;
  attackTimer: number;
  attackInterval: number;
  rage: boolean;
  subSystems?: { name: string; hp: number; maxHp: number; destroyed: boolean; xOff: number; yOff: number }[];
  segments?: BossSegment[]; // For centipede
  shieldAngle?: number; // For rotating shields
  shieldNodes?: { x: number; y: number; hp: number; destroyed: boolean }[];
  specialAttackState?: {
    charging: boolean;
    chargeTimer: number;
    firingBeam: boolean;
    beamTimer: number;
    beamY: number;
  };
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  decay: number;
  type?: 'PIXEL' | 'SMOKE' | 'SPARK' | 'SHOCKWAVE' | 'RING';
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  duration: number;
}

export interface HighScoreEntry {
  id: string;
  initials: string;
  score: number;
  chapter: number;
  mode: GameMode;
  date: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  theme: DisplayTheme;
  crtFilter: boolean;
  phoneBezel: boolean;
  autoFire: boolean;
  screenShake: boolean;
  vibrationEnabled: boolean;
}

