import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GameDataService } from '../../services/game-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [TranslateModule, CommonModule],
  templateUrl: './spinner.component.html',
  standalone: true,
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  @Input() timerValue?: number;
  @Input() messageKey: string = 'LOADING';

  constructor(private gameData: GameDataService) {}

  get formattedTimer(): string {
    if (this.timerValue !== undefined) {
      return this.gameData.formatTimeSeconds(this.timerValue);
    }
    return '';
  }
}
