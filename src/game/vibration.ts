/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class VibrationManager {
  private isSupported: boolean = false;
  public enabled: boolean = true;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator;
  }

  public vibrate(pattern: number | number[]): boolean {
    if (!this.enabled || !this.isSupported) return false;
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }

  // Heavy visceral damage pulse (sharp double-impact)
  public triggerDamage() {
    this.vibrate([60, 40, 80]);
  }

  // Catastrophic destruction vibration
  public triggerDeath() {
    this.vibrate([120, 50, 180, 50, 260]);
  }

  // Triumphant rumbling crescendo when defeating a boss!
  public triggerBossDefeat() {
    this.vibrate([80, 50, 120, 50, 180, 60, 320]);
  }

  // Alarm alert pulses when a boss appears
  public triggerBossWarning() {
    this.vibrate([160, 90, 160, 90, 240]);
  }

  // Missile launch kick
  public triggerMissile() {
    this.vibrate([35]);
  }

  // Continuous piercing laser buzz
  public triggerLaserBeam() {
    this.vibrate([20, 30, 20]);
  }

  // Screen Mega Bomb shockwave
  public triggerBomb() {
    this.vibrate([160, 60, 240]);
  }

  // Subtle pickup click
  public triggerPowerUp() {
    this.vibrate([25]);
  }

  // UI Keypad / Button touch click
  public triggerKeyTap() {
    this.vibrate([15]);
  }
}

export const vibrationManager = new VibrationManager();
