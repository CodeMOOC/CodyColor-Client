import { Injectable, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly MUSIC_SRC = 'assets/audio/music.mp3'; // adjust path as needed
  private musicBase = new Audio(this.MUSIC_SRC);
  private isAudioEnabled: boolean | undefined = false;

  constructor(private cookies: CookieService) {
    this.musicBase.loop = true;
    this.ensureAudioCookie();
    if (this.isAudioEnabled) {
      this.musicBase
        .play()
        .catch((err) => console.warn('Autoplay blocked:', err));
    }
  }

  private ensureAudioCookie(): void {
    if (this.isAudioEnabled === undefined) {
      const cookieValue = this.cookies.get('audioEnabled');
      if (!cookieValue) {
        this.cookies.set('audioEnabled', 'true');
        this.isAudioEnabled = true;
      } else {
        this.isAudioEnabled = cookieValue === 'true';
      }
    }
  }

  isEnabled(): boolean {
    return this.isAudioEnabled === true;
  }

  toggleBase(): void {
    if (!this.isEnabled()) {
      console.log('Enabling audio');
      this.isAudioEnabled = true;
      this.cookies.set('audioEnabled', 'true');
      this.musicBase.play();
    } else {
      console.log('Disabling audio');
      this.isAudioEnabled = false;
      this.cookies.set('audioEnabled', 'false');
      this.musicBase.pause();
    }
  }

  stopAudioBackground(): void {
    if (this.isEnabled()) {
      this.isAudioEnabled = false;
      this.musicBase.pause();
    }
  }

  playAudioForeground(): void {
    if (!this.isEnabled() && this.cookies.get('audioEnabled') === 'true') {
      this.isAudioEnabled = true;
      this.musicBase.play();
    }
  }

  splashStartBase(): void {
    if (this.isEnabled() && this.musicBase.paused) {
      this.musicBase.play();
    }
  }

  playSound(soundName: string): void {
    if (this.isEnabled()) {
      const sound = new Audio(`assets/audio/${soundName}.mp3`);
      sound.play().catch((err) => console.warn('Sound play failed:', err));
    }
  }
}
