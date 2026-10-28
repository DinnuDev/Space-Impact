/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DisplayTheme, Enemy, Boss, PowerUpItem, Bullet } from './types';

export class SpriteRenderer {
  // Theme colors
  public getThemeColors(theme: DisplayTheme) {
    switch (theme) {
      case 'NOKIA_3310':
        return {
          bg: '#9dbf9e',
          bgGrid: '#92b393',
          dark: '#14261a',
          mid: '#2b4d37',
          light: '#7ea37f',
          player: '#14261a',
          bullet: '#14261a',
          enemy: '#14261a',
          boss: '#14261a',
          powerup: '#14261a',
          accent: '#14261a',
        };
      case 'AMBER_CRT':
        return {
          bg: '#120a02',
          bgGrid: '#1a1005',
          dark: '#3d2000',
          mid: '#b36b00',
          light: '#ffb020',
          player: '#ffa500',
          bullet: '#ffcc00',
          enemy: '#ff7700',
          boss: '#ff3300',
          powerup: '#ffd700',
          accent: '#ff8800',
        };
      case 'NEO_CYBER':
      default:
        return {
          bg: '#050814',
          bgGrid: '#0f172a',
          dark: '#1e293b',
          mid: '#38bdf8',
          light: '#f8fafc',
          player: '#00e5ff',
          bullet: '#38bdf8',
          enemy: '#f43f5e',
          boss: '#ec4899',
          powerup: '#fbbf24',
          accent: '#10b981',
        };
    }
  }

  // --- Draw Player Ship ---
  public drawPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    theme: DisplayTheme,
    vy: number,
    hasShield: boolean,
    isInvuln: boolean,
    primaryLevel: number
  ) {
    if (isInvuln && Math.floor(Date.now() / 55) % 2 === 0) {
      return; // Flash effect during invulnerability
    }

    const colors = this.getThemeColors(theme);
    ctx.save();
    ctx.translate(x, y);

    // Smooth banking rotation based on vertical velocity
    const tilt = Math.max(-0.25, Math.min(0.25, vy * 0.04));
    ctx.rotate(tilt);

    if (theme === 'NOKIA_3310') {
      // Authentic pixel-grid Nokia 3310 Space Impact ship
      ctx.fillStyle = colors.player;
      // Fuselage & Wing geometry
      ctx.beginPath();
      ctx.moveTo(18, 0); // nose tip
      ctx.lineTo(8, -6);
      ctx.lineTo(-4, -8);
      ctx.lineTo(-12, -14); // upper wing fin
      ctx.lineTo(-10, -5);
      ctx.lineTo(-16, -5); // upper engine
      ctx.lineTo(-14, 0); // rear center
      ctx.lineTo(-16, 5); // lower engine
      ctx.lineTo(-10, 5);
      ctx.lineTo(-12, 14); // lower wing fin
      ctx.lineTo(-4, 8);
      ctx.lineTo(8, 6);
      ctx.closePath();
      ctx.fill();

      // Cockpit cutout
      ctx.fillStyle = colors.bg;
      ctx.fillRect(-2, -2, 6, 4);
      ctx.fillStyle = colors.player;
      ctx.fillRect(0, -1, 3, 2);

      // Blinking engine exhaust
      if (Math.random() > 0.2) {
        ctx.fillStyle = colors.player;
        ctx.fillRect(-20, -3, 5, 2);
        ctx.fillRect(-20, 2, 5, 2);
      }
    } else {
      // Modern High-Fidelity Neo-Cyber / Amber CRT Ship
      const isAmber = theme === 'AMBER_CRT';

      // Twin Dynamic Thruster Exhaust Plumes
      const flameLength = 14 + Math.random() * 8;
      const flamePuff = Math.sin(Date.now() * 0.03) * 1.5;

      // Upper engine plume
      let flameGrad = ctx.createLinearGradient(-14, -5, -14 - flameLength, -5);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.25, isAmber ? '#ffdd44' : '#00f0ff');
      flameGrad.addColorStop(0.7, isAmber ? '#ff6600' : '#3b82f6');
      flameGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-13, -7);
      ctx.lineTo(-14 - flameLength, -5 + flamePuff);
      ctx.lineTo(-13, -3);
      ctx.closePath();
      ctx.fill();

      // Lower engine plume
      flameGrad = ctx.createLinearGradient(-14, 5, -14 - flameLength, 5);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.25, isAmber ? '#ffdd44' : '#00f0ff');
      flameGrad.addColorStop(0.7, isAmber ? '#ff6600' : '#3b82f6');
      flameGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-13, 3);
      ctx.lineTo(-14 - flameLength, 5 - flamePuff);
      ctx.lineTo(-13, 7);
      ctx.closePath();
      ctx.fill();

      // Wingtip Vortices / Energy Streaks
      ctx.strokeStyle = isAmber ? 'rgba(255, 170, 0, 0.4)' : 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-14, -15);
      ctx.lineTo(-24, -15);
      ctx.moveTo(-14, 15);
      ctx.lineTo(-24, 15);
      ctx.stroke();

      // Main Outer Hull
      ctx.fillStyle = isAmber ? '#4d2600' : '#0b1329';
      ctx.strokeStyle = colors.player;
      ctx.lineWidth = 2;
      ctx.shadowColor = colors.player;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(22, 0); // Nose tip
      ctx.lineTo(8, -6);
      ctx.lineTo(-4, -9);
      ctx.lineTo(-14, -16); // Wing fin tip
      ctx.lineTo(-10, -6);
      ctx.lineTo(-16, -6); // Upper engine block
      ctx.lineTo(-12, 0);
      ctx.lineTo(-16, 6); // Lower engine block
      ctx.lineTo(-10, 6);
      ctx.lineTo(-14, 16); // Wing fin tip
      ctx.lineTo(-4, 9);
      ctx.lineTo(8, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner Armor Panels
      ctx.fillStyle = isAmber ? '#733900' : '#1e293b';
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(4, -4);
      ctx.lineTo(-4, -6);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-4, 6);
      ctx.lineTo(4, 4);
      ctx.closePath();
      ctx.fill();

      // Sleek Glowing Cockpit Canopy
      ctx.shadowBlur = 8;
      ctx.fillStyle = isAmber ? '#ffcc00' : '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(3, 0, 7, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Canopy Glass Specular Highlight
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 2;
      ctx.beginPath();
      ctx.ellipse(4, -1, 3, 1, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Wing Cannons According to Weapon Level
      if (primaryLevel >= 2) {
        ctx.fillStyle = colors.player;
        ctx.fillRect(-3, -15, 9, 2.5);
        ctx.fillRect(-3, 12.5, 9, 2.5);
      }
      if (primaryLevel >= 3) {
        ctx.fillStyle = isAmber ? '#ff9900' : '#f59e0b';
        ctx.fillRect(8, -1.5, 12, 3);
      }
      if (primaryLevel >= 4) {
        // Plasma pods
        ctx.fillStyle = '#a855f7';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(-2, -10, 3, 0, Math.PI * 2);
        ctx.arc(-2, 10, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Energy Shield Barrier
    if (hasShield) {
      const shieldRadius = 26;
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
      if (theme === 'NOKIA_3310') {
        ctx.strokeStyle = colors.player;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        const pulse = Math.sin(Date.now() * 0.009) * 0.15 + 0.85;
        ctx.strokeStyle = theme === 'AMBER_CRT' ? '#ffd700' : '#10b981';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 14 * pulse;
        ctx.fillStyle = theme === 'AMBER_CRT' ? 'rgba(255, 215, 0, 0.18)' : 'rgba(16, 185, 129, 0.18)';
        ctx.fill();
        ctx.stroke();

        // Hexagonal energy grid nodes
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3 + Date.now() * 0.002;
          const nx = Math.cos(a) * shieldRadius;
          const ny = Math.sin(a) * shieldRadius;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(nx, ny, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // --- Draw Bullets ---
  public drawBullet(ctx: CanvasRenderingContext2D, b: Bullet, theme: DisplayTheme) {
    const colors = this.getThemeColors(theme);
    ctx.save();

    if (theme === 'NOKIA_3310') {
      ctx.fillStyle = colors.bullet;
      if (b.type === 'MISSILE') {
        ctx.fillRect(b.x - 7, b.y - 3, 14, 6);
        ctx.fillRect(b.x - 9, b.y - 5, 3, 10);
        ctx.fillRect(b.x + 7, b.y - 1, 3, 2);
      } else if (b.type === 'PIERCING') {
        ctx.fillRect(b.x - 14, b.y - 2.5, 28, 5);
      } else {
        ctx.fillRect(b.x - 3.5, b.y - 2, 7, 4);
      }
    } else {
      if (b.isEnemy) {
        const bulletColor = theme === 'AMBER_CRT' ? '#ff3b30' : '#f43f5e';
        ctx.fillStyle = bulletColor;
        ctx.shadowColor = bulletColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Core white-hot center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else {
        if (b.type === 'MISSILE') {
          // Missile with detailed warhead and fiery exhaust
          ctx.fillStyle = theme === 'AMBER_CRT' ? '#ffaa00' : '#f59e0b';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 10;

          // Rocket Body
          ctx.beginPath();
          ctx.moveTo(b.x + 10, b.y);
          ctx.lineTo(b.x - 6, b.y - 4.5);
          ctx.lineTo(b.x - 4, b.y);
          ctx.lineTo(b.x - 6, b.y + 4.5);
          ctx.closePath();
          ctx.fill();

          // Nose warhead tip
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(b.x + 9, b.y, 2, 0, Math.PI * 2);
          ctx.fill();

          // Rocket Thruster Plume
          const grad = ctx.createLinearGradient(b.x - 4, b.y, b.x - 14, b.y);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.5, '#ef4444');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(b.x - 4, b.y - 2.5);
          ctx.lineTo(b.x - 12, b.y);
          ctx.lineTo(b.x - 4, b.y + 2.5);
          ctx.closePath();
          ctx.fill();
        } else if (b.type === 'PIERCING') {
          // Heavy Piercing bolt with corona
          ctx.fillStyle = theme === 'AMBER_CRT' ? '#ffea00' : '#a855f7';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.ellipse(b.x, b.y, 16, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Core lightning white spine
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(b.x, b.y, 12, 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Regular sleek laser bolt with aerodynamic glow tail
          ctx.fillStyle = theme === 'AMBER_CRT' ? '#ffd700' : '#38bdf8';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.ellipse(b.x, b.y, 8, 3, 0, 0, Math.PI * 2);
          ctx.fill();

          // White center
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(b.x + 2, b.y, 5, 1.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  // --- Draw Power-Up Capsules ---
  public drawPowerUp(ctx: CanvasRenderingContext2D, p: PowerUpItem, theme: DisplayTheme) {
    const colors = this.getThemeColors(theme);
    ctx.save();
    ctx.translate(p.x, p.y);

    const pulse = Math.sin(Date.now() * 0.007) * 2;
    const size = p.radius * 2;

    let letter = 'P';
    let labelColor = '#38bdf8';
    switch (p.type) {
      case 'PRIMARY_UPGRADE':
        letter = 'P';
        labelColor = '#38bdf8';
        break;
      case 'AMMO_MISSILE':
        letter = 'M';
        labelColor = '#f59e0b';
        break;
      case 'AMMO_LASER':
        letter = 'L';
        labelColor = '#a855f7';
        break;
      case 'AMMO_BOMB':
        letter = 'B';
        labelColor = '#ef4444';
        break;
      case 'HEALTH_REPAIR':
        letter = '+';
        labelColor = '#10b981';
        break;
      case 'ENERGY_SHIELD':
        letter = 'S';
        labelColor = '#06b6d4';
        break;
    }

    if (theme === 'NOKIA_3310') {
      ctx.fillStyle = colors.powerup;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.fillStyle = colors.bg;
      ctx.fillRect(-size / 2 + 2, -size / 2 + 2, size - 4, size - 4);
      ctx.fillStyle = colors.powerup;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter, 0, 1);
    } else {
      ctx.shadowColor = labelColor;
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#090d1a';
      ctx.strokeStyle = labelColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-size / 2, -size / 2, size, size, 5);
      ctx.fill();
      ctx.stroke();

      // Outer glowing halo ring
      ctx.strokeStyle = `${labelColor}44`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.75 + pulse * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = labelColor;
      ctx.font = 'bold 12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter, 0, 1);
    }

    ctx.restore();
  }

  // --- Draw Regular Enemies with Enhanced Vector Art ---
  public drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, theme: DisplayTheme) {
    const colors = this.getThemeColors(theme);
    ctx.save();
    ctx.translate(e.x, e.y);

    const hitFlash = e.stateData?.hitFlash && e.stateData.hitFlash > 0;
    const fillStyle = hitFlash
      ? '#ffffff'
      : theme === 'NOKIA_3310'
      ? colors.enemy
      : theme === 'AMBER_CRT'
      ? '#ff7700'
      : colors.enemy;

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = fillStyle;

    switch (e.type) {
      case 'SCOUT': {
        // High-tech insectoid drone with vibrating wings
        const wingOffset = Math.sin(e.age * 0.3) * 4;
        if (theme === 'NOKIA_3310') {
          ctx.beginPath();
          ctx.moveTo(-10, 0);
          ctx.lineTo(-2, -6 - wingOffset);
          ctx.lineTo(8, -4);
          ctx.lineTo(12, 0);
          ctx.lineTo(8, 4);
          ctx.lineTo(-2, 6 + wingOffset);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = colors.bg;
          ctx.fillRect(-4, -1, 3, 2);
        } else {
          ctx.shadowColor = fillStyle;
          ctx.shadowBlur = 8;

          // Main body
          ctx.fillStyle = '#1e1022';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-14, 0);
          ctx.lineTo(-2, -8);
          ctx.lineTo(10, -5);
          ctx.lineTo(14, 0);
          ctx.lineTo(10, 5);
          ctx.lineTo(-2, 8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Translucent energy wings
          ctx.fillStyle = `${fillStyle}66`;
          ctx.beginPath();
          ctx.ellipse(0, -9 - wingOffset, 8, 3, -0.2, 0, Math.PI * 2);
          ctx.ellipse(0, 9 + wingOffset, 8, 3, 0.2, 0, Math.PI * 2);
          ctx.fill();

          // Optic targeting sensor
          ctx.fillStyle = '#00f0ff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(-8, 0, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'BIO_POD': {
        // Bio-Jelly organism with undulating bell and tentacles
        const pulse = Math.sin(e.age * 0.14) * 2.5;
        if (theme === 'NOKIA_3310') {
          ctx.beginPath();
          ctx.arc(0, 0, 10 + pulse * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(-14, -6, 6, 2);
          ctx.fillRect(-14, 0, 6, 2);
          ctx.fillRect(-14, 6, 6, 2);
          ctx.fillStyle = colors.bg;
          ctx.fillRect(0, -2, 4, 4);
        } else {
          ctx.shadowColor = fillStyle;
          ctx.shadowBlur = 10;

          // Bio-bell
          ctx.fillStyle = '#2d0b1a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(2, 0, 12 + pulse, -Math.PI / 2, Math.PI / 2);
          ctx.lineTo(-10, 8);
          ctx.lineTo(-8, 0);
          ctx.lineTo(-10, -8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Undulating tentacles
          ctx.strokeStyle = fillStyle;
          ctx.lineWidth = 1.5;
          for (let i = -1; i <= 1; i++) {
            const ty = i * 6;
            const wave = Math.sin(e.age * 0.2 + i) * 3;
            ctx.beginPath();
            ctx.moveTo(-10, ty);
            ctx.quadraticCurveTo(-16, ty + wave, -22, ty - wave);
            ctx.stroke();
          }

          // Glowing nucleus core
          ctx.fillStyle = '#fde047';
          ctx.shadowColor = '#fde047';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(2, 0, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'MINE': {
        // Spiked heavy space mine with rotating core
        const rot = e.age * 0.05;
        ctx.rotate(rot);
        if (theme === 'NOKIA_3310') {
          ctx.fillRect(-6, -6, 12, 12);
          ctx.fillRect(-10, -2, 20, 4);
          ctx.fillRect(-2, -10, 4, 20);
        } else {
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#291807';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;

          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Spikes
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * 9, Math.sin(a) * 9);
            ctx.lineTo(Math.cos(a) * 16, Math.sin(a) * 16);
            ctx.lineWidth = 3;
            ctx.stroke();
          }

          // Flashing core warning LED
          const flash = Math.sin(Date.now() * 0.01) > 0;
          ctx.fillStyle = flash ? '#ef4444' : '#f59e0b';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'TURRET': {
        if (theme === 'NOKIA_3310') {
          ctx.fillRect(-8, -8, 16, 16);
          ctx.fillRect(-14, -2, 8, 4);
          ctx.fillStyle = colors.bg;
          ctx.fillRect(-4, -4, 8, 8);
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-10, -10, 20, 20, 4);
          ctx.fill();
          ctx.stroke();

          // Barrel
          ctx.fillStyle = fillStyle;
          ctx.fillRect(-16, -3, 10, 6);

          // Turret cupola dome
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'KAMIKAZE': {
        // Sleek delta stealth interceptor with afterburner
        if (theme === 'NOKIA_3310') {
          ctx.beginPath();
          ctx.moveTo(-14, 0);
          ctx.lineTo(8, -8);
          ctx.lineTo(4, 0);
          ctx.lineTo(8, 8);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;

          // Blazing rocket exhaust
          const thruster = 8 + Math.random() * 6;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(8, -4);
          ctx.lineTo(8 + thruster, 0);
          ctx.lineTo(8, 4);
          ctx.closePath();
          ctx.fill();

          // Delta Arrowhead Body
          ctx.fillStyle = '#260a0a';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-18, 0);
          ctx.lineTo(10, -10);
          ctx.lineTo(6, 0);
          ctx.lineTo(10, 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        break;
      }

      case 'GUNSHIP': {
        // Armored Dual-Hull Dread Cruiser
        if (theme === 'NOKIA_3310') {
          ctx.fillRect(-18, -12, 36, 24);
          ctx.fillRect(-24, -6, 8, 4);
          ctx.fillRect(-24, 2, 8, 4);
          ctx.fillStyle = colors.bg;
          ctx.fillRect(-10, -6, 16, 12);
        } else {
          ctx.fillStyle = '#111827';
          ctx.strokeStyle = fillStyle;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = fillStyle;
          ctx.shadowBlur = 12;

          ctx.beginPath();
          ctx.roundRect(-22, -15, 44, 30, 6);
          ctx.fill();
          ctx.stroke();

          // Bridge window
          ctx.fillStyle = '#00f0ff';
          ctx.fillRect(-8, -4, 16, 8);

          // Dual heavy cannons
          ctx.fillStyle = fillStyle;
          ctx.fillRect(-28, -9, 10, 5);
          ctx.fillRect(-28, 4, 10, 5);
        }
        break;
      }

      case 'SEEKER': {
        // Homing Hunter-Seeker Drone that tracks player
        const rot = Math.sin(e.age * 0.2) * 0.15;
        ctx.rotate(rot);

        if (theme === 'NOKIA_3310') {
          // Sharp delta tracking claw
          ctx.beginPath();
          ctx.moveTo(-16, 0);
          ctx.lineTo(8, -10);
          ctx.lineTo(2, -3);
          ctx.lineTo(8, 0);
          ctx.lineTo(2, 3);
          ctx.lineTo(8, 10);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = colors.bg;
          ctx.fillRect(-6, -2, 4, 4);
        } else {
          const seekerColor = theme === 'AMBER_CRT' ? '#ff9900' : '#06b6d4';
          ctx.shadowColor = seekerColor;
          ctx.shadowBlur = 12;

          // Vectored thrusters
          const thruster = 6 + Math.random() * 5;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(8, -5);
          ctx.lineTo(8 + thruster, -5);
          ctx.lineTo(8, -2);
          ctx.moveTo(8, 2);
          ctx.lineTo(8 + thruster, 5);
          ctx.lineTo(8, 5);
          ctx.fill();

          // Main predatory airframe
          ctx.fillStyle = '#082f49';
          ctx.strokeStyle = seekerColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-18, 0); // Front scanner needle
          ctx.lineTo(6, -11);
          ctx.lineTo(2, -4);
          ctx.lineTo(8, 0);
          ctx.lineTo(2, 4);
          ctx.lineTo(6, 11);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Red Cyclops Targeting Sensor
          const pulse = Math.sin(Date.now() * 0.015) * 1.5;
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(-8, 0, 3 + pulse * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'TANK': {
        // Heavy Armored Behemoth with Front Shield Plating
        if (theme === 'NOKIA_3310') {
          // Bulky octagonal armored plate
          ctx.fillRect(-22, -18, 44, 36);
          ctx.fillStyle = colors.bg;
          ctx.fillRect(-16, -12, 32, 24);
          ctx.fillStyle = colors.enemy;
          ctx.fillRect(-26, -4, 10, 8); // Cannon
          ctx.fillRect(-10, -6, 20, 12);
        } else {
          const tankColor = theme === 'AMBER_CRT' ? '#f59e0b' : '#64748b';
          const armorGlow = theme === 'AMBER_CRT' ? '#ffaa00' : '#38bdf8';

          ctx.shadowColor = armorGlow;
          ctx.shadowBlur = 14;

          // Main heavy reinforced chassis
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = tankColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(-24, -20, 48, 40, 8);
          ctx.fill();
          ctx.stroke();

          // Heavy front armor ram plate
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = armorGlow;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-24, -18);
          ctx.lineTo(-32, -12);
          ctx.lineTo(-32, 12);
          ctx.lineTo(-24, 18);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Heavy dual plasma cannons
          ctx.fillStyle = '#475569';
          ctx.fillRect(-34, -10, 10, 5);
          ctx.fillRect(-34, 5, 10, 5);

          // Glowing energy reactor core
          const corePulse = Math.sin(Date.now() * 0.008) * 2;
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(4, 0, 8 + corePulse * 0.5, 0, Math.PI * 2);
          ctx.fill();

          // Front shield energy arc
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(-30, 0, 22, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();

          // Mini HP indicator above tank
          const hpPercent = Math.max(0, e.hp / e.maxHp);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          ctx.fillRect(-20, -28, 40, 4);
          ctx.fillStyle = hpPercent > 0.4 ? '#10b981' : '#ef4444';
          ctx.fillRect(-20, -28, 40 * hpPercent, 4);
        }
        break;
      }

      case 'SPLITTER': {
        // Bio-mechanical or Crystal Cluster that divides into smaller units
        const pulse = Math.sin(e.age * 0.15) * 2;
        if (theme === 'NOKIA_3310') {
          // Quad-orb cluster
          ctx.fillRect(-14, -14, 12, 12);
          ctx.fillRect(2, -14, 12, 12);
          ctx.fillRect(-14, 2, 12, 12);
          ctx.fillRect(2, 2, 12, 12);
          ctx.fillStyle = colors.bg;
          ctx.fillRect(-4, -4, 8, 8);
        } else {
          ctx.shadowColor = '#d946ef';
          ctx.shadowBlur = 16;

          // Central energy vesicle
          ctx.fillStyle = '#2e1065';
          ctx.strokeStyle = '#d946ef';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, 16 + pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // 3 visible sub-nuclei ready to split
          const subColors = ['#f43f5e', '#a855f7', '#ec4899'];
          for (let i = 0; i < 3; i++) {
            const a = (i * Math.PI * 2) / 3 + e.age * 0.08;
            const subX = Math.cos(a) * (8 + pulse * 0.5);
            const subY = Math.sin(a) * (8 + pulse * 0.5);
            ctx.fillStyle = subColors[i];
            ctx.shadowColor = subColors[i];
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(subX, subY, 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Outer orbiting filament
          ctx.strokeStyle = 'rgba(217, 70, 239, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 22 + pulse, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      }

      case 'SPLITTER_MINI': {
        // Fast agile mini-shard from a Splitter
        const miniPulse = Math.sin(e.age * 0.3) * 1.5;
        if (theme === 'NOKIA_3310') {
          ctx.fillRect(-6, -6, 12, 12);
          ctx.fillStyle = colors.bg;
          ctx.fillRect(-2, -2, 4, 4);
        } else {
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#701a75';
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 2;

          ctx.beginPath();
          ctx.moveTo(-10, 0);
          ctx.lineTo(6, -7);
          ctx.lineTo(4, 0);
          ctx.lineTo(6, 7);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Mini core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 2.5 + miniPulse * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

    }

    ctx.restore();
  }

  // --- Draw Iconic Bosses with High-Fidelity Artwork ---
  public drawBoss(ctx: CanvasRenderingContext2D, boss: Boss, theme: DisplayTheme) {
    const colors = this.getThemeColors(theme);
    ctx.save();
    ctx.translate(boss.x, boss.y);

    const hitFlash = boss.attackTimer % 4 < 2 && boss.rage;
    const bossColor = hitFlash ? '#ffffff' : theme === 'NOKIA_3310' ? colors.boss : colors.boss;

    switch (boss.chapter) {
      // ----------------------------------------------------
      // CHAPTER 1 BOSS: MECHA-CRAB ("CRAB-X9")
      // ----------------------------------------------------
      case 1: {
        const pincerSweep = Math.sin(boss.attackTimer * 0.08) * 14;

        if (theme === 'NOKIA_3310') {
          ctx.fillStyle = colors.boss;
          ctx.beginPath();
          ctx.ellipse(0, 0, 36, 26, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = colors.bg;
          ctx.fillRect(-14, -8, 12, 16);
          ctx.fillStyle = colors.boss;
          ctx.fillRect(-10, -4, 6, 8);

          // Claws
          ctx.beginPath();
          ctx.moveTo(10, -20);
          ctx.lineTo(-14, -34 + pincerSweep);
          ctx.lineTo(-30, -20 + pincerSweep);
          ctx.lineTo(-10, -16);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(10, 20);
          ctx.lineTo(-14, 34 - pincerSweep);
          ctx.lineTo(-30, 20 - pincerSweep);
          ctx.lineTo(-10, 16);
          ctx.closePath();
          ctx.fill();
        } else {
          // Neo-Cyber Crab with layered chitin plates & hydraulic pistons
          ctx.shadowColor = boss.rage ? '#ef4444' : '#ec4899';
          ctx.shadowBlur = 18;

          // Main Heavy Carapace
          ctx.fillStyle = '#24081c';
          ctx.strokeStyle = bossColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(0, 0, 42, 32, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Chitinous armor grooves
          ctx.strokeStyle = `${bossColor}88`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(8, 0, 24, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();

          // Glowing central bio-core / eye
          const coreGlow = boss.rage ? '#ef4444' : '#00e5ff';
          ctx.fillStyle = coreGlow;
          ctx.shadowColor = coreGlow;
          ctx.shadowBlur = boss.rage ? 24 : 14;
          ctx.beginPath();
          ctx.arc(-12, 0, 13, 0, Math.PI * 2);
          ctx.fill();

          // Inner eye lens
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-13, 0, 5, 0, Math.PI * 2);
          ctx.fill();

          // Top Articulated Claw
          ctx.fillStyle = '#3f0d2d';
          ctx.strokeStyle = bossColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(15, -24);
          ctx.lineTo(-16, -44 + pincerSweep);
          ctx.lineTo(-38, -24 + pincerSweep);
          ctx.lineTo(-12, -18);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Hydraulic piston on claw
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(-6, -30 + pincerSweep * 0.5, 14, 4);

          // Bottom Articulated Claw
          ctx.fillStyle = '#3f0d2d';
          ctx.beginPath();
          ctx.moveTo(15, 24);
          ctx.lineTo(-16, 44 - pincerSweep);
          ctx.lineTo(-38, 24 - pincerSweep);
          ctx.lineTo(-12, 18);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(-6, 26 - pincerSweep * 0.5, 14, 4);
        }
        break;
      }

      // ----------------------------------------------------
      // CHAPTER 2 BOSS: CYBER-CENTIPEDE ("XENO-WORM")
      // ----------------------------------------------------
      case 2: {
        // Draw undulating segments first
        if (boss.segments) {
          boss.segments.forEach((seg, idx) => {
            ctx.save();
            // Position relative to boss head
            const sx = seg.x - boss.x;
            const sy = seg.y - boss.y;
            ctx.translate(sx, sy);

            if (theme === 'NOKIA_3310') {
              ctx.fillStyle = colors.boss;
              ctx.beginPath();
              ctx.arc(0, 0, seg.radius, 0, Math.PI * 2);
              ctx.fill();
              // Segment spikes
              ctx.fillRect(-4, -seg.radius - 4, 8, 4);
              ctx.fillRect(-4, seg.radius, 8, 4);
            } else {
              ctx.shadowColor = '#10b981';
              ctx.shadowBlur = 12;

              // Wriggling chitinous legs on each segment
              const legWave = Math.sin(Date.now() * 0.008 + idx * 0.8) * 6;
              ctx.strokeStyle = '#34d399';
              ctx.lineWidth = 2;
              // Upper leg
              ctx.beginPath();
              ctx.moveTo(0, -seg.radius);
              ctx.lineTo(4, -seg.radius - 8 + legWave);
              ctx.lineTo(8, -seg.radius - 12 + legWave);
              ctx.stroke();
              // Lower leg
              ctx.beginPath();
              ctx.moveTo(0, seg.radius);
              ctx.lineTo(4, seg.radius + 8 - legWave);
              ctx.lineTo(8, seg.radius + 12 - legWave);
              ctx.stroke();

              // Segment Carapace
              ctx.fillStyle = '#064e3b';
              ctx.strokeStyle = '#34d399';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.arc(0, 0, seg.radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              // Glowing Bio-luminescent venom sac
              ctx.fillStyle = '#6ee7b7';
              ctx.shadowColor = '#6ee7b7';
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(0, 0, seg.radius * 0.5, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          });
        }

        // Draw Horned Head
        if (theme === 'NOKIA_3310') {
          ctx.fillStyle = colors.boss;
          ctx.beginPath();
          ctx.arc(0, 0, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(-28, -12, 12, 6);
          ctx.fillRect(-28, 6, 12, 6);
          ctx.fillStyle = colors.bg;
          ctx.fillRect(-8, -6, 5, 4);
          ctx.fillRect(-8, 2, 5, 4);
        } else {
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 18;
          ctx.fillStyle = '#064e3b';
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, 25, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Serrated Mandibles
          ctx.fillStyle = '#a7f3d0';
          ctx.beginPath();
          ctx.moveTo(-20, -12);
          ctx.lineTo(-36, -20);
          ctx.lineTo(-26, 0);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(-20, 12);
          ctx.lineTo(-36, 20);
          ctx.lineTo(-26, 0);
          ctx.closePath();
          ctx.fill();

          // Glowing multi-eyes
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(-8, -9, 4.5, 0, Math.PI * 2);
          ctx.arc(-8, 9, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      // ----------------------------------------------------
      // CHAPTER 3 BOSS: DREAD-CORE EYE ("OCULUS-PRIME")
      // ----------------------------------------------------
      case 3: {
        const eyePupilX = Math.sin(boss.attackTimer * 0.05) * 4;

        if (theme === 'NOKIA_3310') {
          ctx.fillStyle = colors.boss;
          ctx.beginPath();
          ctx.arc(0, 0, 36, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = colors.bg;
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = colors.boss;
          ctx.beginPath();
          ctx.arc(-6 + eyePupilX, 0, 12, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.shadowColor = '#8b5cf6';
          ctx.shadowBlur = 22;

          // Mechanical Iris ring with aperture notches
          ctx.fillStyle = '#170f2e';
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, 42, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Sclera void
          ctx.fillStyle = '#090514';
          ctx.beginPath();
          ctx.arc(0, 0, 30, 0, Math.PI * 2);
          ctx.fill();

          // Bio-optical eye pupil with dilation
          const isCharging = boss.specialAttackState?.charging;
          const chargeGlow = isCharging ? 30 : 12;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = chargeGlow;
          ctx.fillStyle = isCharging ? '#ffffff' : '#ef4444';
          ctx.beginPath();
          ctx.arc(-8 + eyePupilX, 0, isCharging ? 18 : 14, 0, Math.PI * 2);
          ctx.fill();

          // Retinal targeting reticle
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(-8 + eyePupilX, 0, 22, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Orbiting Defense Satellites with connecting energy filaments
        if (boss.shieldNodes) {
          boss.shieldNodes.forEach((node) => {
            if (node.destroyed) return;
            ctx.save();
            ctx.translate(node.x, node.y);

            if (theme === 'NOKIA_3310') {
              ctx.fillStyle = colors.boss;
              ctx.fillRect(-6, -6, 12, 12);
            } else {
              // Energy filament to core
              ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(-node.x, -node.y);
              ctx.stroke();

              ctx.shadowColor = '#38bdf8';
              ctx.shadowBlur = 10;
              ctx.fillStyle = '#0284c7';
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(0, 0, 8, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(0, 0, 3, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          });
        }
        break;
      }

      // ----------------------------------------------------
      // CHAPTER 4 BOSS: TITAN MOTHERSHIP ("VALKYRIE MOTHERSHIP")
      // ----------------------------------------------------
      case 4:
      default: {
        if (theme === 'NOKIA_3310') {
          ctx.fillStyle = colors.boss;
          ctx.beginPath();
          ctx.moveTo(35, -45);
          ctx.lineTo(-20, -50);
          ctx.lineTo(-40, -30);
          ctx.lineTo(-25, -15);
          ctx.lineTo(-45, 0);
          ctx.lineTo(-25, 15);
          ctx.lineTo(-40, 30);
          ctx.lineTo(-20, 50);
          ctx.lineTo(35, 45);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = colors.bg;
          ctx.fillRect(-5, -20, 18, 12);
          ctx.fillRect(-5, 8, 18, 12);
          ctx.fillStyle = colors.boss;
          ctx.fillRect(-2, -17, 12, 6);
          ctx.fillRect(-2, 11, 12, 6);
        } else {
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 26;

          // Main Capital Hull
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3.5;

          ctx.beginPath();
          ctx.moveTo(42, -58);
          ctx.lineTo(-26, -64);
          ctx.lineTo(-52, -38);
          ctx.lineTo(-32, -20);
          ctx.lineTo(-60, 0); // Primary nose cannon
          ctx.lineTo(-32, 20);
          ctx.lineTo(-52, 38);
          ctx.lineTo(-26, 64);
          ctx.lineTo(42, 58);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Illuminated Hangar Decks & Runway Lights
          ctx.fillStyle = boss.rage ? '#ef4444' : '#38bdf8';
          ctx.shadowBlur = 12;
          ctx.fillRect(-10, -28, 28, 16);
          ctx.fillRect(-10, 12, 28, 16);

          // Command Bridge Tower
          ctx.fillStyle = '#334155';
          ctx.fillRect(12, -12, 18, 24);
          ctx.fillStyle = '#fde047';
          ctx.fillRect(16, -8, 8, 16);

          // Central hyper cannon emitter
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(-50, 0, 9, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
    }

    ctx.restore();
  }

  // --- Draw Floating Combat Text ---
  public drawFloatingText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, alpha: number) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.font = 'bold 12px "Press Start 2P", monospace';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}

export const spriteRenderer = new SpriteRenderer();
