import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RabbitService } from '../../services/rabbit.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
    private rabbit: RabbitService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  continueExitGame(): void {
    this.dialogRef.close(true);
  }

  stopExitGame(): void {
    this.dialogRef.close(false);
  }

  private quitGame(): void {
    console.log('Game quit!');
  }
}
