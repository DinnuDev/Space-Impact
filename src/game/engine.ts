/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { soundEngine } from './audio';
import { spriteRenderer } from './sprites';
import { vibrationManager } from './vibration';
import {
  DisplayTheme,
  GameMode,
  GameStatus,
  PlayerStats,
  Enemy,
  Boss,
  Bullet,
  PowerUpItem,
  Particle,
  FloatingText,
  LaserBeamEffect,
  BombEffect,
  HighScoreEntry,
  GameSettings,
} from './types';

interface SpaceAsteroid {
  x: number;
  y: number;
  vx: number;
  size: number;
  rot: number;
  vRot: number;
}

interface NebulaCloud {
  x: number;
  y: number;
  vx: number;
  radius: number;
  color: string;
}

export class GameEngine {
  public canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  // Virtual resolution
  public readonly width = 800;
  public readonly height = 450;

  // Game Loop
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  public isRunning: boolean = false;

  // Game State
  public status: GameStatus = 'MENU';
  public mode: GameMode = 'CAMPAIGN';
  public chapter: number = 1;
  public maxChapters: number = 4;
  public score: number = 0;
  public combo: number = 0;
  public comboTimer: number = 0;
  public shotsFired: number = 0;
  public shotsHit: number = 0;

  // Level Progression
  public levelDistance: number = 0;
  public levelMaxDistance: number = 1800; // Spawns boss when reached
  public bossWarningTimer: number = 0;

  // Entities
  public player = {
    x: 80,
    y: 225,
    vx: 0,
    vy: 0,
    speed: 280,
    radius: 16,
  };

  public stats: PlayerStats = {
    hp: 4,
    maxHp: 4,
    lives: 3,
    primaryLevel: 1,
    missiles: 3,
    lasers: 2,
    bombs: 1,
    selectedSecondary: 'MISSILE',
    shieldTimeRemaining: 0,
    respawnInvulnRemaining: 0,
  };

  public enemies: Enemy[] = [];
  public boss: Boss | null = null;
  public bullets: Bullet[] = [];
  public powerups: PowerUpItem[] = [];
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];

  // Special Weapon Effects
  public laserBeam: LaserBeamEffect = {
    active: false,
    duration: 0,
    width: 14,
    damagePerTick: 3,
  };

  public bombEffect: BombEffect = {
    active: false,
    radius: 0,
    maxRadius: 550,
    x: 0,
    y: 0,
  };

  // Visceral Trauma & Screen Shake
  public trauma: number = 0; // 0 to 1 non-linear trauma
  public traumaDecay: number = 1.5;
  public maxShakeOffset: number = 22; // max pixels
  public maxShakeRoll: number = 0.055; // max radians
  public currentShake = { x: 0, y: 0, rot: 0 };
  public damageFlashTimer: number = 0;

  // Environment & Parallax Space Objects
  private stars: { x: number; y: number; speed: number; size: number; alpha: number }[] = [];
  private asteroids: SpaceAsteroid[] = [];
  private nebulae: NebulaCloud[] = [];

  // Input State
  public keys: Record<string, boolean> = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false,
    Space: false,
    KeyQ: false,
    KeyW: false,
    KeyE: false,
  };

  private lastShootTime: number = 0;
  private shootCooldown: number = 0.16; // 6 shots/sec

  // Settings
  public settings: GameSettings = {
    soundEnabled: true,
    musicEnabled: true,
    sfxVolume: 0.6,
    musicVolume: 0.35,
    theme: 'NEO_CYBER',
    crtFilter: false,
    phoneBezel: false,
    autoFire: false,
    screenShake: true,
    vibrationEnabled: true,
  };

  // Leaderboard
  public highScores: HighScoreEntry[] = [];

  // React listener callback
  public onStateChange: (() => void) | null = null;

  constructor() {
    this.initEnvironment();
    this.loadHighScores();
  }

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.resizeCanvas();
  }

  public resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  private initEnvironment() {
    // Parallax Starfields
    this.stars = [];
    for (let i = 0; i < 95; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        speed: 15 + Math.random() * 85,
        size: Math.random() > 0.85 ? 2.5 : Math.random() > 0.5 ? 1.5 : 1,
        alpha: 0.3 + Math.random() * 0.7,
      });
    }

    // Floating Midground Space Asteroids
    this.asteroids = [];
    for (let i = 0; i < 5; i++) {
      this.asteroids.push({
        x: Math.random() * this.width,
        y: 30 + Math.random() * (this.height - 60),
        vx: -15 - Math.random() * 25,
        size: 14 + Math.random() * 22,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.8,
      });
    }

    // Distant Cosmic Nebulae
    this.nebulae = [
      { x: 150, y: 120, vx: -6, radius: 180, color: 'rgba(56, 189, 248, 0.04)' },
      { x: 600, y: 320, vx: -8, radius: 220, color: 'rgba(168, 85, 247, 0.05)' },
      { x: 850, y: 160, vx: -5, radius: 190, color: 'rgba(236, 72, 153, 0.035)' },
    ];
  }

  // --- High Scores ---
  private loadHighScores() {
    try {
      const stored = localStorage.getItem('space_impact_neo_scores');
      if (stored) {
        this.highScores = JSON.parse(stored);
      } else {
        this.highScores = [
          { id: '1', initials: 'ACE', score: 38500, chapter: 4, mode: 'CAMPAIGN', date: '2000-09-01' },
          { id: '2', initials: 'NEO', score: 26400, chapter: 3, mode: 'CAMPAIGN', date: '2000-09-02' },
          { id: '3', initials: 'NOK', score: 18200, chapter: 2, mode: 'CAMPAIGN', date: '2000-09-03' },
          { id: '4', initials: 'PIL', score: 12500, chapter: 2, mode: 'CAMPAIGN', date: '2000-09-04' },
          { id: '5', initials: 'RET', score: 8900, chapter: 1, mode: 'CAMPAIGN', date: '2000-09-05' },
        ];
      }
    } catch {
      // ignore
    }
  }

  public saveScore(initials: string) {
    const cleanInitials = (initials || 'AAA').toUpperCase().slice(0, 3);
    const newEntry: HighScoreEntry = {
      id: Date.now().toString(),
      initials: cleanInitials,
      score: this.score,
      chapter: this.chapter,
      mode: this.mode,
      date: new Date().toISOString().split('T')[0],
    };

    this.highScores.push(newEntry);
    this.highScores.sort((a, b) => b.score - a.score);
    this.highScores = this.highScores.slice(0, 10);

    try {
      localStorage.setItem('space_impact_neo_scores', JSON.stringify(this.highScores));
    } catch {
      // ignore
    }
    this.notifyState();
  }

  public startNewGame(mode: GameMode = 'CAMPAIGN', chapter: number = 1) {
    this.mode = mode;
    this.chapter = chapter;
    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.levelDistance = 0;
    this.bossWarningTimer = 0;
    this.trauma = 0;
    this.damageFlashTimer = 0;

    this.player.x = 80;
    this.player.y = this.height / 2;
    this.player.vx = 0;
    this.player.vy = 0;

    this.stats = {
      hp: 4,
      maxHp: 4,
      lives: 3,
      primaryLevel: 1,
      missiles: 3,
      lasers: 2,
      bombs: 1,
      selectedSecondary: 'MISSILE',
      shieldTimeRemaining: 0,
      respawnInvulnRemaining: 2.0,
    };

    this.enemies = [];
    this.boss = null;
    this.bullets = [];
    this.powerups = [];
    this.particles = [];
    this.floatingTexts = [];
    this.laserBeam.active = false;
    this.bombEffect.active = false;

    this.status = 'PLAYING';
    soundEngine.startMusic(false);

    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.animFrameId = requestAnimationFrame(this.loop.bind(this));
    }
    this.notifyState();
  }

  public startNextChapter() {
    this.chapter += 1;
    this.levelDistance = 0;
    this.boss = null;
    this.bossWarningTimer = 0;
    this.enemies = [];
    this.bullets = [];
    this.powerups = [];
    this.particles = [];
    this.floatingTexts = [];
    this.laserBeam.active = false;
    this.bombEffect.active = false;
    this.trauma = 0;
    this.damageFlashTimer = 0;

    this.player.x = 80;
    this.player.y = this.height / 2;
    this.stats.hp = this.stats.maxHp;
    this.stats.respawnInvulnRemaining = 2.0;

    this.status = 'PLAYING';
    soundEngine.setBossMusic(false);
    soundEngine.startMusic(false);
    this.notifyState();
  }

  public pauseGame() {
    if (this.status === 'PLAYING' || this.status === 'BOSS_FIGHT') {
      this.status = 'PAUSED';
      this.notifyState();
    } else if (this.status === 'PAUSED') {
      this.status = this.boss ? 'BOSS_FIGHT' : 'PLAYING';
      this.notifyState();
    }
  }

  // --- Input Handling ---
  public handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'KeyP' || e.code === 'Escape') {
      this.pauseGame();
      return;
    }

    if (e.code in this.keys) {
      this.keys[e.code] = true;
      e.preventDefault();
    }
    if (e.key === 'w' || e.key === 'W') this.keys['w'] = true;
    if (e.key === 's' || e.key === 'S') this.keys['s'] = true;
    if (e.key === 'a' || e.key === 'A') this.keys['a'] = true;
    if (e.key === 'd' || e.key === 'D') this.keys['d'] = true;
    if (e.code === 'Space') this.keys['Space'] = true;

    // Secondary weapon triggers (Keys 1, 2, 3 or Q, E, R)
    if (e.key === '1' || e.code === 'KeyQ') {
      this.fireSecondary('MISSILE');
    }
    if (e.key === '2' || e.code === 'KeyE') {
      this.fireSecondary('LASER_BEAM');
    }
    if (e.key === '3' || e.code === 'KeyR') {
      this.fireSecondary('BOMB');
    }
  }

  public handleKeyUp(e: KeyboardEvent) {
    if (e.code in this.keys) {
      this.keys[e.code] = false;
    }
    if (e.key === 'w' || e.key === 'W') this.keys['w'] = false;
    if (e.key === 's' || e.key === 'S') this.keys['s'] = false;
    if (e.key === 'a' || e.key === 'A') this.keys['a'] = false;
    if (e.key === 'd' || e.key === 'D') this.keys['d'] = false;
    if (e.code === 'Space') this.keys['Space'] = false;
  }

  // --- Secondary Weapons Action with Haptics ---
  public fireSecondary(type: 'MISSILE' | 'LASER_BEAM' | 'BOMB') {
    if (this.status !== 'PLAYING' && this.status !== 'BOSS_FIGHT') return;

    if (type === 'MISSILE') {
      if (this.stats.missiles <= 0) return;
      this.stats.missiles--;
      soundEngine.playMissileLaunch();
      vibrationManager.triggerMissile();
      this.addTrauma(0.15);

      // Launch 2 staggered missiles
      this.bullets.push({
        id: Math.random(),
        x: this.player.x + 12,
        y: this.player.y - 8,
        vx: 360,
        vy: -20,
        radius: 4,
        damage: 18,
        isEnemy: false,
        type: 'MISSILE',
      });
      this.bullets.push({
        id: Math.random(),
        x: this.player.x + 12,
        y: this.player.y + 8,
        vx: 360,
        vy: 20,
        radius: 4,
        damage: 18,
        isEnemy: false,
        type: 'MISSILE',
      });
      this.notifyState();
    } else if (type === 'LASER_BEAM') {
      if (this.stats.lasers <= 0 || this.laserBeam.active) return;
      this.stats.lasers--;
      soundEngine.playLaserBeam();
      vibrationManager.triggerLaserBeam();
      this.addTrauma(0.2);
      this.laserBeam.active = true;
      this.laserBeam.duration = 1.6;
      this.notifyState();
    } else if (type === 'BOMB') {
      if (this.stats.bombs <= 0 || this.bombEffect.active) return;
      this.stats.bombs--;
      soundEngine.playBombExplosion();
      vibrationManager.triggerBomb();
      this.addTrauma(0.85);

      this.bombEffect.active = true;
      this.bombEffect.radius = 10;
      this.bombEffect.x = this.player.x;
      this.bombEffect.y = this.player.y;

      // Eliminate all enemy projectiles immediately!
      this.bullets = this.bullets.filter((b) => !b.isEnemy);

      // Damage all enemies on screen
      this.enemies.forEach((e) => {
        this.damageEnemy(e, 50);
      });

      // Damage boss heavily
      if (this.boss) {
        this.damageBoss(75);
      }
      this.notifyState();
    }
  }

  // --- Main Primary Fire ---
  private shootPrimary() {
    const now = performance.now() / 1000;
    if (now - this.lastShootTime < this.shootCooldown) return;
    this.lastShootTime = now;
    this.shotsFired++;

    soundEngine.playLaser(this.stats.primaryLevel);

    const px = this.player.x + 18;
    const py = this.player.y;

    if (this.stats.primaryLevel === 1) {
      this.bullets.push({
        id: Math.random(),
        x: px,
        y: py,
        vx: 520,
        vy: 0,
        radius: 3,
        damage: 5,
        isEnemy: false,
      });
    } else if (this.stats.primaryLevel === 2) {
      this.bullets.push({
        id: Math.random(),
        x: px,
        y: py - 6,
        vx: 540,
        vy: 0,
        radius: 3,
        damage: 5,
        isEnemy: false,
      });
      this.bullets.push({
        id: Math.random(),
        x: px,
        y: py + 6,
        vx: 540,
        vy: 0,
        radius: 3,
        damage: 5,
        isEnemy: false,
      });
    } else if (this.stats.primaryLevel === 3) {
      this.bullets.push({
        id: Math.random(),
        x: px,
        y: py,
        vx: 550,
        vy: 0,
        radius: 3,
        damage: 6,
        isEnemy: false,
      });
      this.bullets.push({
        id: Math.random(),
        x: px - 2,
        y: py - 7,
        vx: 530,
        vy: -90,
        radius: 3,
        damage: 5,
        isEnemy: false,
      });
      this.bullets.push({
        id: Math.random(),
        x: px - 2,
        y: py + 7,
        vx: 530,
        vy: 90,
        radius: 3,
        damage: 5,
        isEnemy: false,
      });
    } else {
      this.bullets.push({
        id: Math.random(),
        x: px,
        y: py - 5,
        vx: 560,
        vy: 0,
        radius: 4,
        damage: 8,
        isEnemy: false,
        type: 'PIERCING',
      });
      this.bullets.push({
        id: Math.random(),
        x: px,
        y: py + 5,
        vx: 560,
        vy: 0,
        radius: 4,
        damage: 8,
        isEnemy: false,
        type: 'PIERCING',
      });
      this.bullets.push({
        id: Math.random(),
        x: px - 2,
        y: py - 10,
        vx: 520,
        vy: -110,
        radius: 3,
        damage: 6,
        isEnemy: false,
      });
      this.bullets.push({
        id: Math.random(),
        x: px - 2,
        y: py + 10,
        vx: 520,
        vy: 110,
        radius: 3,
        damage: 6,
        isEnemy: false,
      });
    }
  }

  // --- Visceral Trauma-Based Screen Shake System ---
  public addTrauma(amount: number) {
    if (!this.settings.screenShake) return;
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public triggerScreenShake(duration: number, intensity: number, traumaBoost: number = 0.5) {
    if (!this.settings.screenShake) return;
    this.maxShakeOffset = Math.max(16, intensity);
    this.addTrauma(traumaBoost);
  }

  // --- Spawn Enemy Waves ---
  private updateWaveSpawning(dt: number) {
    if (this.boss || this.status === 'BOSS_WARNING' || this.status === 'BOSS_FIGHT') return;

    this.levelDistance += dt * 75;

    // Check if reached boss distance
    if (this.levelDistance >= this.levelMaxDistance) {
      this.triggerBossEncounter();
      return;
    }

    const spawnRate = this.mode === 'SURVIVAL' ? 0.045 : 0.028 + this.chapter * 0.007;

    if (Math.random() < spawnRate && this.enemies.length < 8 + this.chapter * 2) {
      this.spawnRandomEnemy();
    }
  }

  private spawnRandomEnemy() {
    const roll = Math.random();
    const spawnY = 40 + Math.random() * (this.height - 80);

    let enemyType: Enemy['type'] = 'SCOUT';
    let hp = 10 + this.chapter * 4;
    let points = 100;
    let width = 24;
    let height = 24;
    let vx = -90 - Math.random() * 40;
    let vy = 0;
    let dropsPowerup: PowerUpItem['type'] | undefined;
    let shootInterval = 1.8 + Math.random() * 1.5;

    // Base chance to drop power-up
    if (Math.random() < 0.24) {
      const pRoll = Math.random();
      if (pRoll < 0.3) dropsPowerup = 'PRIMARY_UPGRADE';
      else if (pRoll < 0.5) dropsPowerup = 'AMMO_MISSILE';
      else if (pRoll < 0.7) dropsPowerup = 'AMMO_LASER';
      else if (pRoll < 0.85) dropsPowerup = 'HEALTH_REPAIR';
      else dropsPowerup = 'AMMO_BOMB';
    }

    if (roll < 0.22) {
      enemyType = 'SCOUT';
      hp = 8 + this.chapter * 2;
      points = 100;
      vx = -100 - Math.random() * 30;
    } else if (roll < 0.38) {
      enemyType = 'BIO_POD';
      hp = 14 + this.chapter * 3;
      points = 150;
      vx = -80 - Math.random() * 25;
    } else if (roll < 0.50) {
      // SEEKER: Homing predator drone that tracks player position
      enemyType = 'SEEKER';
      hp = 12 + this.chapter * 3;
      points = 220;
      width = 24;
      height = 20;
      vx = -110 - Math.random() * 25;
      shootInterval = 1.5 + Math.random();
    } else if (roll < 0.62) {
      // SPLITTER: Cluster that divides into 2 agile mini-drones upon destruction
      enemyType = 'SPLITTER';
      hp = 22 + this.chapter * 5;
      points = 260;
      width = 32;
      height = 32;
      vx = -75 - Math.random() * 20;
      shootInterval = 2.0;
    } else if (roll < 0.74) {
      // TANK: Massive armored dreadnought that absorbs immense damage
      enemyType = 'TANK';
      hp = 60 + this.chapter * 18;
      points = 450;
      width = 44;
      height = 38;
      vx = -45 - Math.random() * 15;
      shootInterval = 2.4;
      // Tanks carry guaranteed ordnance
      dropsPowerup = Math.random() > 0.5 ? 'AMMO_MISSILE' : 'PRIMARY_UPGRADE';
    } else if (roll < 0.84) {
      enemyType = 'MINE';
      hp = 18 + this.chapter * 4;
      points = 200;
      vx = -60 - Math.random() * 20;
    } else if (roll < 0.92) {
      enemyType = 'KAMIKAZE';
      hp = 6 + this.chapter * 2;
      points = 180;
      vx = -220;
    } else {
      enemyType = 'GUNSHIP';
      hp = 35 + this.chapter * 8;
      points = 350;
      width = 36;
      height = 26;
      vx = -70;
      dropsPowerup = 'AMMO_MISSILE';
    }

    this.enemies.push({
      id: Math.random(),
      type: enemyType,
      x: this.width + 30,
      y: spawnY,
      vx,
      vy,
      width,
      height,
      hp,
      maxHp: hp,
      points,
      shootCooldown: 0,
      shootInterval,
      age: 0,
      dropsPowerup,
      stateData: { hitFlash: 0 },
    });
  }

  // --- Boss Encounter ---
  private triggerBossEncounter() {
    this.status = 'BOSS_WARNING';
    this.bossWarningTimer = 3.0;
    soundEngine.playBossWarning();
    vibrationManager.triggerBossWarning();
    this.addTrauma(0.3);
    this.notifyState();
  }

  private spawnBoss() {
    this.status = 'BOSS_FIGHT';
    soundEngine.setBossMusic(true);
    this.addTrauma(0.4);

    const chapter = this.chapter;
    let name = 'CRAB-X9';
    let title = 'ARMORED BIO-CRUSTACEAN';
    let maxHp = 320;

    if (chapter === 2) {
      name = 'XENO-WORM';
      title = 'SUB-ORBITAL CENTIPEDE';
      maxHp = 420;
    } else if (chapter === 3) {
      name = 'OCULUS-PRIME';
      title = 'CYBERNETIC DREAD-CORE';
      maxHp = 520;
    } else if (chapter >= 4) {
      name = 'VALKYRIE DREADNOUGHT';
      title = 'SUPREME FLAGSHIP CARRIER';
      maxHp = 680;
    }

    const newBoss: Boss = {
      id: 'boss_' + chapter,
      name,
      title,
      chapter,
      x: this.width + 60,
      y: this.height / 2,
      vx: -60,
      vy: 40,
      width: 70,
      height: 70,
      hp: maxHp,
      maxHp,
      phase: 1,
      attackTimer: 0,
      attackInterval: 2.2,
      rage: false,
      specialAttackState: {
        charging: false,
        chargeTimer: 0,
        firingBeam: false,
        beamTimer: 0,
        beamY: 0,
      },
    };

    if (chapter === 2) {
      newBoss.segments = [];
      for (let i = 0; i < 7; i++) {
        newBoss.segments.push({
          x: newBoss.x + (i + 1) * 26,
          y: newBoss.y,
          radius: 14,
          hp: 40,
          maxHp: 40,
        });
      }
    } else if (chapter === 3) {
      newBoss.shieldAngle = 0;
      newBoss.shieldNodes = [
        { x: 0, y: -45, hp: 50, destroyed: false },
        { x: 45, y: 0, hp: 50, destroyed: false },
        { x: 0, y: 45, hp: 50, destroyed: false },
        { x: -45, y: 0, hp: 50, destroyed: false },
      ];
    }

    this.boss = newBoss;
    this.notifyState();
  }

  // --- Boss AI & Combat ---
  private updateBoss(dt: number) {
    if (!this.boss) return;
    const b = this.boss;

    if (b.x > this.width - 120) {
      b.x += b.vx * dt;
      return;
    }

    if (b.hp <= b.maxHp * 0.4 && !b.rage) {
      b.rage = true;
      this.addTrauma(0.6);
      vibrationManager.vibrate([100, 50, 100]);
      this.addFloatingText('BOSS ENRAGED!', b.x - 20, b.y - 40, '#ef4444');
    }

    b.y += b.vy * (b.rage ? 1.6 : 1.0) * dt;
    if (b.y < 80) {
      b.y = 80;
      b.vy = Math.abs(b.vy);
    } else if (b.y > this.height - 80) {
      b.y = this.height - 80;
      b.vy = -Math.abs(b.vy);
    }

    b.attackTimer += dt;

    if (b.chapter === 1) {
      if (b.attackTimer >= b.attackInterval) {
        b.attackTimer = 0;
        const bulletsCount = b.rage ? 5 : 3;
        for (let i = 0; i < bulletsCount; i++) {
          const angle = Math.PI - 0.4 + (i * 0.8) / (bulletsCount - 1);
          const speed = 190;
          this.bullets.push({
            id: Math.random(),
            x: b.x - 30,
            y: b.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 4,
            damage: 1,
            isEnemy: true,
          });
        }
      }
    }

    if (b.chapter === 2 && b.segments) {
      b.y += Math.sin(performance.now() * 0.003) * 60 * dt;

      let prevX = b.x;
      let prevY = b.y;
      b.segments.forEach((seg) => {
        const dx = prevX - seg.x;
        const dy = prevY - seg.y;
        const dist = Math.hypot(dx, dy);
        const targetDist = 24;
        if (dist > targetDist) {
          const ratio = (dist - targetDist) / dist;
          seg.x += dx * ratio * 0.2;
          seg.y += dy * ratio * 0.2;
        }
        prevX = seg.x;
        prevY = seg.y;

        if (Math.random() < 0.008) {
          this.bullets.push({
            id: Math.random(),
            x: seg.x,
            y: seg.y,
            vx: -180,
            vy: (Math.random() - 0.5) * 80,
            radius: 4,
            damage: 1,
            isEnemy: true,
          });
        }
      });

      if (b.attackTimer >= b.attackInterval) {
        b.attackTimer = 0;
        for (let i = 0; i < 4; i++) {
          this.bullets.push({
            id: Math.random(),
            x: b.x - 24,
            y: b.y,
            vx: -220,
            vy: -80 + i * 50,
            radius: 5,
            damage: 1,
            isEnemy: true,
          });
        }
      }
    }

    if (b.chapter === 3) {
      if (b.shieldAngle !== undefined) {
        b.shieldAngle += (b.rage ? 2.5 : 1.5) * dt;
        const radius = 55;
        b.shieldNodes?.forEach((node, i) => {
          const a = b.shieldAngle! + (i * Math.PI) / 2;
          node.x = Math.cos(a) * radius;
          node.y = Math.sin(a) * radius;
        });
      }

      const state = b.specialAttackState!;
      if (!state.charging && !state.firingBeam && b.attackTimer >= b.attackInterval) {
        state.charging = true;
        state.chargeTimer = 1.2;
        state.beamY = this.player.y;
        this.addTrauma(0.2);
      }

      if (state.charging) {
        state.chargeTimer -= dt;
        if (state.chargeTimer <= 0) {
          state.charging = false;
          state.firingBeam = true;
          state.beamTimer = 1.0;
          soundEngine.playLaserBeam();
          this.addTrauma(0.6);
          vibrationManager.vibrate([40, 20, 60]);
        }
      } else if (state.firingBeam) {
        state.beamTimer -= dt;
        if (Math.abs(this.player.y - state.beamY) < 26 && this.player.x < b.x) {
          this.damagePlayer(1);
        }
        if (state.beamTimer <= 0) {
          state.firingBeam = false;
          b.attackTimer = 0;
        }
      } else {
        if (Math.random() < 0.04) {
          this.bullets.push({
            id: Math.random(),
            x: b.x - 35,
            y: b.y + (Math.random() - 0.5) * 40,
            vx: -210,
            vy: (Math.random() - 0.5) * 60,
            radius: 4,
            damage: 1,
            isEnemy: true,
          });
        }
      }
    }

    if (b.chapter >= 4) {
      if (b.attackTimer >= b.attackInterval) {
        b.attackTimer = 0;
        this.bullets.push({
          id: Math.random(),
          x: b.x - 30,
          y: b.y - 35,
          vx: -180,
          vy: -60,
          radius: 5,
          damage: 1,
          isEnemy: true,
        });
        this.bullets.push({
          id: Math.random(),
          x: b.x - 30,
          y: b.y + 35,
          vx: -180,
          vy: 60,
          radius: 5,
          damage: 1,
          isEnemy: true,
        });
        this.bullets.push({
          id: Math.random(),
          x: b.x - 45,
          y: b.y,
          vx: -260,
          vy: 0,
          radius: 7,
          damage: 2,
          isEnemy: true,
        });
      }
    }
  }

  private damageBoss(dmg: number) {
    if (!this.boss) return;
    this.boss.hp -= dmg;
    this.shotsHit++;
    soundEngine.playHit();
    this.createExplosion(this.boss.x - 20, this.boss.y + (Math.random() - 0.5) * 40, 4, false);

    if (this.boss.hp <= 0) {
      this.bossDefeated();
    }
  }

  // --- Boss Defeated: Monumental Screen Shake & Haptic Crescendo ---
  private bossDefeated() {
    if (!this.boss) return;
    soundEngine.playEnemyExplosion(true);
    soundEngine.playVictoryFanfare();

    // Trigger powerful visceral screen shake and haptic rumbling
    this.trauma = 1.0;
    this.maxShakeOffset = 26;
    vibrationManager.triggerBossDefeat();

    const bonus = 5000 + this.chapter * 1500;
    this.score += bonus;
    this.addFloatingText(`BOSS DOWN! +${bonus}`, this.boss.x - 40, this.boss.y, '#10b981');

    // Cascading multi-stage explosion sequence with periodic aftershocks
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        if (!this.boss) return;
        this.createExplosion(
          this.boss.x + (Math.random() - 0.5) * 90,
          this.boss.y + (Math.random() - 0.5) * 90,
          18,
          true
        );
        // Aftershock tremors
        if (i % 3 === 0) {
          this.addTrauma(0.35);
          vibrationManager.vibrate(30);
        }
      }, i * 75);
    }

    setTimeout(() => {
      this.boss = null;
      if (this.mode === 'CAMPAIGN' && this.chapter >= this.maxChapters) {
        this.status = 'VICTORY';
      } else {
        this.status = 'LEVEL_CLEAR';
      }
      this.notifyState();
    }, 1850);
  }

  private damageEnemy(e: Enemy, dmg: number) {
    e.hp -= dmg;
    this.shotsHit++;
    if (e.stateData) e.stateData.hitFlash = 3;
    soundEngine.playHit();

    if (e.hp <= 0) {
      this.killEnemy(e);
    }
  }

  private killEnemy(e: Enemy) {
    const isHeavy = e.type === 'GUNSHIP' || e.type === 'TANK';
    soundEngine.playEnemyExplosion(isHeavy);

    this.combo++;
    this.comboTimer = 2.5;
    const mult = Math.min(5, 1 + Math.floor(this.combo / 3));
    const finalPoints = e.points * mult;
    this.score += finalPoints;

    this.addFloatingText(
      mult > 1 ? `+${finalPoints} (x${mult})` : `+${finalPoints}`,
      e.x,
      e.y,
      mult > 1 ? '#f59e0b' : '#38bdf8'
    );

    // Enhanced particle bursts based on unit scale
    const explosionCount = e.type === 'TANK' ? 24 : isHeavy ? 16 : e.type === 'SPLITTER' ? 14 : 9;
    this.createExplosion(e.x, e.y, explosionCount, isHeavy);

    if (e.type === 'TANK') {
      this.addTrauma(0.35);
      vibrationManager.vibrate([30, 20, 40]);
    }

    // SPLITTER DIVIDES INTO SMALLER MINIS UPON DESTRUCTION!
    if (e.type === 'SPLITTER') {
      this.addTrauma(0.2);
      vibrationManager.vibrate([25, 20, 25]);
      this.addFloatingText('SPLIT!', e.x, e.y - 12, '#ec4899');

      // Spawn 2 agile mini splitters that scatter outward in opposite Y trajectories
      const splitDirections = [-1, 1];
      for (let i = 0; i < splitDirections.length; i++) {
        const dir = splitDirections[i];
        this.enemies.push({
          id: Math.random(),
          type: 'SPLITTER_MINI',
          x: e.x,
          y: e.y + dir * 10,
          vx: -130 - Math.random() * 30,
          vy: dir * (90 + Math.random() * 40),
          width: 14,
          height: 14,
          hp: 10 + this.chapter * 2,
          maxHp: 10 + this.chapter * 2,
          points: 80,
          shootCooldown: 0,
          shootInterval: 2.2 + Math.random(),
          age: 0,
          stateData: { hitFlash: 0 },
        });
      }
    }

    if (e.dropsPowerup) {
      this.powerups.push({
        id: Math.random(),
        x: e.x,
        y: e.y,
        vx: -40,
        vy: (Math.random() - 0.5) * 20,
        type: e.dropsPowerup,
        radius: 12,
        lifeTime: 12,
      });
    }

    this.enemies = this.enemies.filter((item) => item.id !== e.id);
  }

  // --- Player Damage: Visceral Screen Shake, Red Vignette, Haptics ---
  public damagePlayer(dmg: number) {
    if (this.stats.shieldTimeRemaining > 0 || this.stats.respawnInvulnRemaining > 0) {
      return;
    }

    this.stats.hp -= dmg;
    soundEngine.playHit();

    // Trigger Visceral Screen Shake and Device Vibration!
    this.addTrauma(0.7);
    this.damageFlashTimer = 0.35;
    vibrationManager.triggerDamage();

    if (this.stats.hp <= 0) {
      this.playerDied();
    } else {
      this.stats.respawnInvulnRemaining = 1.0;
    }
    this.notifyState();
  }

  private playerDied() {
    soundEngine.playEnemyExplosion(true);
    this.createExplosion(this.player.x, this.player.y, 28, true);
    this.stats.lives--;

    // Heavy death trauma and catastrophic vibration
    this.trauma = 1.0;
    this.damageFlashTimer = 0.6;
    vibrationManager.triggerDeath();

    this.stats.primaryLevel = Math.max(1, this.stats.primaryLevel - 1);

    if (this.stats.lives <= 0) {
      this.status = 'GAME_OVER';
      soundEngine.stopMusic();
      soundEngine.playGameOver();
    } else {
      this.stats.hp = this.stats.maxHp;
      this.stats.respawnInvulnRemaining = 3.0;
      this.player.x = 80;
      this.player.y = this.height / 2;
      this.player.vx = 0;
      this.player.vy = 0;
      this.addFloatingText('RESPAWN!', this.player.x, this.player.y - 25, '#38bdf8');
    }
    this.notifyState();
  }

  // --- Particles & FX ---
  private createExplosion(x: number, y: number, count: number, isLarge: boolean) {
    const colors =
      this.settings.theme === 'NOKIA_3310'
        ? ['#14261a', '#2b4d37']
        : this.settings.theme === 'AMBER_CRT'
        ? ['#ffaa00', '#ff5500', '#ffea00']
        : ['#f43f5e', '#fbbf24', '#38bdf8', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (isLarge ? 40 : 25) + Math.random() * (isLarge ? 190 : 120);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() > 0.6 ? 3 : 2,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.35,
        decay: 1,
      });
    }
  }

  public addFloatingText(text: string, x: number, y: number, color: string) {
    this.floatingTexts.push({
      id: Math.random(),
      text,
      x,
      y,
      vy: -35,
      color,
      size: 11,
      alpha: 1.0,
      duration: 1.2,
    });
  }

  // --- Main Update Loop ---
  public update(dt: number) {
    if (this.status === 'PAUSED' || this.status === 'MENU') return;

    // Decay trauma smoothly
    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * this.traumaDecay);
    }

    // Damage flash timer decay
    if (this.damageFlashTimer > 0) {
      this.damageFlashTimer = Math.max(0, this.damageFlashTimer - dt);
    }

    // Parallax Stars
    this.stars.forEach((s) => {
      s.x -= s.speed * dt;
      if (s.x < 0) {
        s.x = this.width;
        s.y = Math.random() * this.height;
      }
    });

    // Space Asteroids drift & rotate
    this.asteroids.forEach((ast) => {
      ast.x += ast.vx * dt;
      ast.rot += ast.vRot * dt;
      if (ast.x < -40) {
        ast.x = this.width + 40;
        ast.y = 30 + Math.random() * (this.height - 60);
      }
    });

    // Cosmic Nebulae drift
    this.nebulae.forEach((neb) => {
      neb.x += neb.vx * dt;
      if (neb.x < -neb.radius) {
        neb.x = this.width + neb.radius;
      }
    });

    // Combo decay
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
      }
    }

    // Status: Boss Warning Countdown
    if (this.status === 'BOSS_WARNING') {
      this.bossWarningTimer -= dt;
      if (this.bossWarningTimer <= 0) {
        this.spawnBoss();
      }
    }

    if (this.status === 'LEVEL_CLEAR' || this.status === 'GAME_OVER' || this.status === 'VICTORY') {
      this.updateParticles(dt);
      return;
    }

    // Invulnerability Timers
    if (this.stats.shieldTimeRemaining > 0) {
      this.stats.shieldTimeRemaining -= dt;
    }
    if (this.stats.respawnInvulnRemaining > 0) {
      this.stats.respawnInvulnRemaining -= dt;
    }

    // Player Movement
    let dx = 0;
    let dy = 0;
    if (this.keys['ArrowUp'] || this.keys['w']) dy -= 1;
    if (this.keys['ArrowDown'] || this.keys['s']) dy += 1;
    if (this.keys['ArrowLeft'] || this.keys['a']) dx -= 1;
    if (this.keys['ArrowRight'] || this.keys['d']) dx += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    this.player.vx = dx * this.player.speed;
    this.player.vy = dy * this.player.speed;

    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;

    this.player.x = Math.max(24, Math.min(this.width - 40, this.player.x));
    this.player.y = Math.max(24, Math.min(this.height - 24, this.player.y));

    // Player Shooting
    if (this.keys['Space'] || this.settings.autoFire) {
      this.shootPrimary();
    }

    // Piercing Laser Beam Update
    if (this.laserBeam.active) {
      this.laserBeam.duration -= dt;
      const beamY = this.player.y;
      this.enemies.forEach((e) => {
        if (e.x > this.player.x && Math.abs(e.y - beamY) < 16) {
          this.damageEnemy(e, this.laserBeam.damagePerTick);
        }
      });
      if (this.boss && Math.abs(this.boss.y - beamY) < 32 && this.boss.x > this.player.x) {
        this.damageBoss(1.8);
      }
      if (this.laserBeam.duration <= 0) {
        this.laserBeam.active = false;
      }
    }

    // Screen Bomb Expanding Ring Update
    if (this.bombEffect.active) {
      this.bombEffect.radius += 540 * dt;
      if (this.bombEffect.radius >= this.bombEffect.maxRadius) {
        this.bombEffect.active = false;
      }
    }

    this.updateWaveSpawning(dt);
    this.updateEnemies(dt);

    if (this.boss) {
      this.updateBoss(dt);
    }

    this.updateBullets(dt);
    this.updatePowerUps(dt);
    this.updateParticles(dt);
  }

  private updateEnemies(dt: number) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.age += dt;

      if (e.stateData && e.stateData.hitFlash > 0) {
        e.stateData.hitFlash -= 1;
      }

      if (e.type === 'SCOUT') {
        e.x += e.vx * dt;
        e.y += Math.sin(e.age * 3.5) * 75 * dt;
      } else if (e.type === 'BIO_POD') {
        e.x += e.vx * dt;
        e.y += (Math.sin(e.age * 2.0) * 50) * dt;
      } else if (e.type === 'KAMIKAZE') {
        const dy = this.player.y - e.y;
        e.y += Math.sign(dy) * 90 * dt;
        e.x += e.vx * dt;
      } else if (e.type === 'SEEKER') {
        // SEEKER: Dynamically follows and hunts player movement in real-time
        const dy = this.player.y - e.y;
        const targetVy = Math.sign(dy) * Math.min(170, Math.abs(dy) * 3.5);
        e.vy += (targetVy - e.vy) * Math.min(1, dt * 5.0);
        e.y += e.vy * dt;
        e.x += e.vx * dt;
      } else if (e.type === 'TANK') {
        // TANK: Armored juggernaut advancing forward with heavy inertia
        e.x += e.vx * dt;
        e.y += Math.sin(e.age * 0.7) * 18 * dt;
      } else if (e.type === 'SPLITTER') {
        // SPLITTER: Cluster wavering along an undulating frequency
        e.x += e.vx * dt;
        e.y += Math.sin(e.age * 2.6) * 45 * dt;
      } else if (e.type === 'SPLITTER_MINI') {
        // SPLITTER_MINI: Agile scattered shard ricocheting off upper and lower bounds
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        if (e.y < 35) {
          e.y = 35;
          e.vy = Math.abs(e.vy);
        } else if (e.y > this.height - 35) {
          e.y = this.height - 35;
          e.vy = -Math.abs(e.vy);
        }
      } else {
        e.x += e.vx * dt;
      }

      e.shootCooldown += dt;
      if (e.shootCooldown >= e.shootInterval && e.x < this.width - 20) {
        e.shootCooldown = 0;
        if (e.type === 'TANK') {
          // Tank fires twin heavy plasma orbs!
          this.bullets.push({
            id: Math.random(),
            x: e.x - 30,
            y: e.y - 8,
            vx: -220,
            vy: 0,
            radius: 5.5,
            damage: 2,
            isEnemy: true,
          });
          this.bullets.push({
            id: Math.random(),
            x: e.x - 30,
            y: e.y + 8,
            vx: -220,
            vy: 0,
            radius: 5.5,
            damage: 2,
            isEnemy: true,
          });
        } else if (e.type === 'SEEKER') {
          // Seeker locks onto player coordinate with high-velocity homing laser
          const dx = this.player.x - e.x;
          const dy = this.player.y - e.y;
          const dist = Math.hypot(dx, dy);
          const speed = 240;
          this.bullets.push({
            id: Math.random(),
            x: e.x - 14,
            y: e.y,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            radius: 3.5,
            damage: 1,
            isEnemy: true,
          });
        } else if (e.type === 'SCOUT' || e.type === 'TURRET' || e.type === 'GUNSHIP' || e.type === 'SPLITTER') {
          const dx = this.player.x - e.x;
          const dy = this.player.y - e.y;
          const dist = Math.hypot(dx, dy);
          const speed = 210;
          this.bullets.push({
            id: Math.random(),
            x: e.x - 12,
            y: e.y,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            radius: 3.5,
            damage: 1,
            isEnemy: true,
          });
        }
      }

      const distToPlayer = Math.hypot(e.x - this.player.x, e.y - this.player.y);
      if (distToPlayer < this.player.radius + e.width / 2) {
        this.damagePlayer(1);
        this.killEnemy(e);
        continue;
      }

      if (e.x < -40) {
        this.enemies.splice(i, 1);
      }
    }
  }

  private updateBullets(dt: number) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];

      if (b.type === 'MISSILE') {
        let nearestEnemy: Enemy | Boss | null = this.boss;
        if (!nearestEnemy && this.enemies.length > 0) {
          nearestEnemy = this.enemies[0];
        }
        if (nearestEnemy && nearestEnemy.x > b.x) {
          const dy = nearestEnemy.y - b.y;
          b.vy += Math.sign(dy) * 240 * dt;
        }
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (!b.isEnemy) {
        let bulletDestroyed = false;

        if (this.boss && Math.hypot(b.x - this.boss.x, b.y - this.boss.y) < 45) {
          this.damageBoss(b.damage);
          if (b.type !== 'PIERCING') {
            bulletDestroyed = true;
          }
        }

        if (this.boss && this.boss.shieldNodes && !bulletDestroyed) {
          for (const node of this.boss.shieldNodes) {
            if (node.destroyed) continue;
            const worldX = this.boss.x + node.x;
            const worldY = this.boss.y + node.y;
            if (Math.hypot(b.x - worldX, b.y - worldY) < 14) {
              node.hp -= b.damage;
              soundEngine.playHit();
              if (node.hp <= 0) {
                node.destroyed = true;
                this.createExplosion(worldX, worldY, 10, false);
                this.addFloatingText('SHIELD DOWN!', worldX, worldY, '#38bdf8');
                this.addTrauma(0.3);
                vibrationManager.vibrate(30);
              }
              bulletDestroyed = true;
              break;
            }
          }
        }

        if (!bulletDestroyed) {
          for (const e of this.enemies) {
            if (Math.hypot(b.x - e.x, b.y - e.y) < b.radius + e.width / 2) {
              this.damageEnemy(e, b.damage);
              if (b.type !== 'PIERCING') {
                bulletDestroyed = true;
                break;
              }
            }
          }
        }

        if (bulletDestroyed || b.x > this.width + 40 || b.y < -20 || b.y > this.height + 20) {
          this.bullets.splice(i, 1);
          continue;
        }
      } else {
        const dist = Math.hypot(b.x - this.player.x, b.y - this.player.y);
        if (dist < b.radius + this.player.radius) {
          this.damagePlayer(b.damage);
          this.bullets.splice(i, 1);
          continue;
        }

        if (b.x < -20 || b.y < -20 || b.y > this.height + 20) {
          this.bullets.splice(i, 1);
        }
      }
    }
  }

  private updatePowerUps(dt: number) {
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.lifeTime -= dt;

      const dist = Math.hypot(p.x - this.player.x, p.y - this.player.y);
      if (dist < p.radius + this.player.radius) {
        this.collectPowerUp(p);
        this.powerups.splice(i, 1);
        continue;
      }

      if (p.lifeTime <= 0 || p.x < -30) {
        this.powerups.splice(i, 1);
      }
    }
  }

  private collectPowerUp(p: PowerUpItem) {
    soundEngine.playPowerUp();
    vibrationManager.triggerPowerUp();
    this.score += 100;

    let text = '+100';
    switch (p.type) {
      case 'PRIMARY_UPGRADE':
        this.stats.primaryLevel = Math.min(4, this.stats.primaryLevel + 1);
        text = 'PRIMARY UPGRADE!';
        break;
      case 'AMMO_MISSILE':
        this.stats.missiles += 3;
        text = '+3 MISSILES';
        break;
      case 'AMMO_LASER':
        this.stats.lasers += 2;
        text = '+2 PIERCING LASERS';
        break;
      case 'AMMO_BOMB':
        this.stats.bombs += 1;
        text = '+1 MEGA BOMB';
        break;
      case 'HEALTH_REPAIR':
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + 2);
        text = '+REPAIR SHIELD';
        break;
      case 'ENERGY_SHIELD':
        this.stats.shieldTimeRemaining = 7.0;
        text = 'FORCEFIELD ACTIVE!';
        break;
    }

    this.addFloatingText(text, this.player.x, this.player.y - 20, '#10b981');
    this.notifyState();
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.duration -= dt;
      ft.alpha = ft.duration / 1.2;
      if (ft.duration <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  // --- Rendering Loop with Visceral Screen Shake & Vignette ---
  public render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const theme = this.settings.theme;
    const colors = spriteRenderer.getThemeColors(theme);

    ctx.save();

    // Calculate Visceral Trauma Screen Shake (Non-linear trauma^2)
    let sx = 0;
    let sy = 0;
    let sRot = 0;
    if (this.settings.screenShake && this.trauma > 0) {
      const shakeFactor = this.trauma * this.trauma;
      const t = performance.now() * 0.04;
      sx = this.maxShakeOffset * shakeFactor * (Math.sin(t * 1.8) * 0.7 + Math.cos(t * 2.4) * 0.3);
      sy = this.maxShakeOffset * shakeFactor * (Math.cos(t * 1.6) * 0.7 + Math.sin(t * 2.9) * 0.3);
      sRot = this.maxShakeRoll * shakeFactor * Math.sin(t * 1.3);
    }
    this.currentShake = { x: sx, y: sy, rot: sRot };

    // Apply Screen Shake (Pivot on Center)
    if (sx !== 0 || sy !== 0 || sRot !== 0) {
      ctx.translate(this.width / 2, this.height / 2);
      ctx.rotate(sRot);
      ctx.translate(-this.width / 2 + sx, -this.height / 2 + sy);
    }

    // 1. Draw Clean Background Surface
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Multi-Tier Cosmic Parallax Background
    if (theme === 'NOKIA_3310') {
      ctx.fillStyle = colors.bgGrid;
      for (let x = 0; x < this.width; x += 4) {
        ctx.fillRect(x, 0, 1, this.height);
      }
      for (let y = 0; y < this.height; y += 4) {
        ctx.fillRect(0, y, this.width, 1);
      }
    } else {
      // Cosmic Nebulae
      this.nebulae.forEach((neb) => {
        const grad = ctx.createRadialGradient(neb.x, neb.y, 10, neb.x, neb.y, neb.radius);
        grad.addColorStop(0, neb.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Distant Asteroids
      this.asteroids.forEach((ast) => {
        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.rot);
        ctx.fillStyle = theme === 'AMBER_CRT' ? '#261403' : '#141d33';
        ctx.beginPath();
        for (let i = 0; i < 7; i++) {
          const a = (i * Math.PI * 2) / 7;
          const r = ast.size * (0.8 + ((i % 3) * 0.15));
          if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // Parallax Stars
      this.stars.forEach((s) => {
        ctx.fillStyle = theme === 'AMBER_CRT' ? '#b36b00' : '#e2e8f0';
        ctx.globalAlpha = s.alpha;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.globalAlpha = 1.0;
    }

    // 3. Piercing Laser Beam Effect
    if (this.laserBeam.active) {
      ctx.save();
      const beamY = this.player.y;
      const pulse = Math.sin(Date.now() * 0.05) * 4;

      if (theme === 'NOKIA_3310') {
        ctx.fillStyle = colors.player;
        ctx.fillRect(this.player.x + 16, beamY - 6, this.width, 12);
      } else {
        const grad = ctx.createLinearGradient(0, beamY - 14, 0, beamY + 14);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, theme === 'AMBER_CRT' ? 'rgba(255, 170, 0, 0.85)' : 'rgba(56, 189, 248, 0.9)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(this.player.x + 18, beamY - 16 - pulse, this.width, 32 + pulse * 2);

        // Core white laser beam
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = theme === 'AMBER_CRT' ? '#ffaa00' : '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.fillRect(this.player.x + 18, beamY - 3, this.width, 6);
      }
      ctx.restore();
    }

    // 4. Screen Bomb Shockwave
    if (this.bombEffect.active) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.bombEffect.x, this.bombEffect.y, this.bombEffect.radius, 0, Math.PI * 2);
      if (theme === 'NOKIA_3310') {
        ctx.strokeStyle = colors.player;
        ctx.setLineDash([8, 8]);
        ctx.lineWidth = 4;
        ctx.stroke();
      } else {
        ctx.strokeStyle = theme === 'AMBER_CRT' ? '#ffaa00' : '#38bdf8';
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 18;
        ctx.lineWidth = 6;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Boss Dread-Core Sweeping Death Beam (Chapter 3)
    if (this.boss && this.boss.specialAttackState?.firingBeam) {
      ctx.save();
      const beamY = this.boss.specialAttackState.beamY;
      ctx.fillStyle = theme === 'NOKIA_3310' ? colors.boss : '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 24;
      ctx.fillRect(0, beamY - 14, this.boss.x, 28);
      ctx.restore();
    }

    // 6. Draw Bullets
    this.bullets.forEach((b) => {
      spriteRenderer.drawBullet(ctx, b, theme);
    });

    // 7. Draw Power-Ups
    this.powerups.forEach((p) => {
      spriteRenderer.drawPowerUp(ctx, p, theme);
    });

    // 8. Draw Enemies
    this.enemies.forEach((e) => {
      spriteRenderer.drawEnemy(ctx, e, theme);
    });

    // 9. Draw Boss
    if (this.boss) {
      spriteRenderer.drawBoss(ctx, this.boss, theme);
    }

    // 10. Draw Player Ship
    if (this.status !== 'GAME_OVER') {
      spriteRenderer.drawPlayer(
        ctx,
        this.player.x,
        this.player.y,
        theme,
        this.player.vy,
        this.stats.shieldTimeRemaining > 0,
        this.stats.respawnInvulnRemaining > 0,
        this.stats.primaryLevel
      );
    }

    // 11. Draw Particles
    this.particles.forEach((p) => {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 1.0 - p.life / p.maxLife;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.restore();
    });

    // 12. Floating Score Texts
    this.floatingTexts.forEach((ft) => {
      spriteRenderer.drawFloatingText(ctx, ft.text, ft.x, ft.y, ft.color, ft.alpha);
    });

    // 13. Visceral Red Damage Flash Vignette on Screen Edges
    if (this.damageFlashTimer > 0 && theme !== 'NOKIA_3310') {
      ctx.save();
      const flashAlpha = Math.min(0.7, (this.damageFlashTimer / 0.35) * 0.7);
      const radGrad = ctx.createRadialGradient(
        this.width / 2,
        this.height / 2,
        this.width * 0.28,
        this.width / 2,
        this.height / 2,
        this.width * 0.65
      );
      radGrad.addColorStop(0, 'transparent');
      radGrad.addColorStop(0.7, `rgba(239, 68, 68, ${flashAlpha * 0.4})`);
      radGrad.addColorStop(1, `rgba(220, 38, 38, ${flashAlpha})`);
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }

    // 14. Boss Warning Banner Overlay
    if (this.status === 'BOSS_WARNING') {
      ctx.save();
      const flash = Math.floor(Date.now() / 200) % 2 === 0;
      ctx.fillStyle = flash ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, this.height / 2 - 40, this.width, 80);

      ctx.font = 'bold 18px "Press Start 2P", monospace';
      ctx.fillStyle = flash ? '#ffffff' : '#ef4444';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('! WARNING: HOSTILE BOSS DETECTED !', this.width / 2, this.height / 2);
      ctx.restore();
    }

    // 15. CRT Scanlines Overlay
    if (this.settings.crtFilter && theme !== 'NOKIA_3310') {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let y = 0; y < this.height; y += 3) {
        ctx.fillRect(0, y, this.width, 1);
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // --- Main Animation Frame Loop ---
  private loop(time: number) {
    if (!this.isRunning) return;

    const dt = Math.min(0.06, (time - this.lastTime) / 1000);
    this.lastTime = time;

    this.update(dt);
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    soundEngine.stopMusic();
  }

  private notifyState() {
    if (this.onStateChange) {
      this.onStateChange();
    }
  }
}

export const gameEngine = new GameEngine();
