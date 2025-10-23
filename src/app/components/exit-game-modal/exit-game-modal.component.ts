import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RabbitService } from '../../services/rabbit.service';
import { AudioService } from '../../services/audio.service';
import { NavigationService } from '../../services/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exit-game-modal',
  imports: [CommonModule, TranslateModule],
  standalone: true,
  templateUrl: './exit-game-modal.component.html',
  styleUrl: './exit-game-modal.component.scss',
})
export class ExitGameModalComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();

  constructor(
    private dialogRef: MatDialogRef<ExitGameModalComponent>,
    private audioHandler: AudioService,
    private rabbit: RabbitService,
    private navigation: NavigationService
  ) {}

  ngOnInit(): void {}

  stopExitGame(): void {
    this.audioHandler.playSound('menu-click');
    this.closed.emit();
    this.dialogRef.close(false);
  }

  continueExitGame(): void {
    this.audioHandler.playSound('menu-click');
    this.rabbit.sendPlayerQuitRequest();
    this.quitGame();
    this.navigation.goToPage('/home');
    this.dialogRef.close(true);
  }

  private quitGame(): void {
    console.log('Game quit!');
  }
}
