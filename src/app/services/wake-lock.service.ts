import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WakeLockService {
  private wakeLock: any;

  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          console.log('Wake Lock was released');
        });
      } else {
        console.warn('Wake Lock API not supported');
        // Optional: fallback to NoSleep.js if needed
      }
    } catch (err: any) {
      console.error(`Wake Lock failed: ${err.name}, ${err.message}`);
    }
  }

  releaseWakeLock() {
    this.wakeLock?.release();
    this.wakeLock = null;
  }
}
