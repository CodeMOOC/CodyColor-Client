import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Subscription, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AudioService } from './audio.service';

@Injectable({ providedIn: 'root' })
export class VisibilityService implements OnDestroy {
  private backgroundTimer?: ReturnType<typeof setTimeout>;
  private deadlineCallback?: () => void;
  private visibilityChangeSub: Subscription;

  constructor(private audio: AudioService) {
    this.visibilityChangeSub = fromEvent(
      document,
      'visibilitychange'
    ).subscribe(() => this.handleVisibilityChange());
  }

  setDeadlineCallback(callback: () => void): void {
    this.deadlineCallback = callback;
  }

  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      if (this.backgroundTimer) {
        clearTimeout(this.backgroundTimer);
        this.backgroundTimer = undefined;
        this.audio.playAudioForeground(); // Assume this resumes music or sounds
      } else {
        this.audio.playAudioForeground();
      }
    } else {
      this.audio.stopAudioBackground(); // Assume this pauses or mutes audio
      this.backgroundTimer = setTimeout(() => {
        if (this.deadlineCallback) {
          this.deadlineCallback();
        }
      }, 15000);
    }
  }

  ngOnDestroy(): void {
    this.visibilityChangeSub.unsubscribe();
    if (this.backgroundTimer) {
      clearTimeout(this.backgroundTimer);
    }
  }
}
