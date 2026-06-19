import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown-cody',
  imports: [CommonModule],
  templateUrl: './countdown-cody.component.html',
  styleUrl: './countdown-cody.component.scss',
})
export class CountdownCodyComponent implements OnInit {
  @Output() startMatchTimers: EventEmitter<void> = new EventEmitter<void>();

  countdownInProgress = true;
  startCountdownText = '';

  constructor(private audio: AudioService) {}

  ngOnInit() {
    this.startCountdown();
  }

  private startCountdown() {
    let countdownValue = 3;
    this.countdownInProgress = true;
    this.startCountdownText = countdownValue.toString();
    this.audio.playSound('countdown');

    const intervalId = setInterval(() => {
      countdownValue--;
      if (countdownValue > 0) {
        this.startCountdownText = countdownValue.toString();
        this.audio.playSound('countdown');
      } else if (countdownValue === 0) {
        this.startCountdownText = "Let's Cody!";
        this.audio.playSound('start');
      } else {
        clearInterval(intervalId);
        this.countdownInProgress = false;
        this.startMatchTimers.emit();
      }
    }, 1000);
  }
}
