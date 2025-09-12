import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GameDataService } from '../../../services/game-data.service';
import { AuthService } from '../../../services/auth.service';
import { AudioService } from '../../../services/audio.service';
import { NavigationService } from '../../../services/navigation.service';
import { SessionService } from '../../../services/session.service';
import { VisibilityService } from '../../../services/visibility.service';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bootmp-mmaking',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './bootmp-mmaking.component.html',
  styleUrl: './bootmp-mmaking.component.scss',
})
export class BootmpMmakingComponent implements OnInit {
  nickname: string = '';
  userNickname: string = '';
  userLogged = false;
  pageReady = false;

  botSettings: { text: string; value: number }[] = [];
  currentBotSettingIndex = 0;

  timerSettings: { text: string; value: number }[] = [];
  currentTimerIndex = 1;

  exitGameModal = false;
  forceExitModal = false;
  forceExitText = '';

  languageModal = false;
  basePlaying = false;

  constructor(
    private gameData: GameDataService,
    private auth: AuthService,
    private audio: AudioService,
    private translate: TranslateService,
    private translation: LanguageService,
    private router: Router,
    private navigation: NavigationService,
    private session: SessionService,
    private visibility: VisibilityService
  ) {}

  ngOnInit(): void {
    this.gameData.update('general', {
      gameType: this.gameData.getGameTypes().bootmp,
    });

    if (this.session.isSessionInvalid()) {
      this.quitGame();
      this.router.navigateByUrl('/');
      return;
    }

    setTimeout(() => {
      this.pageReady = true;
    }, 200);

    this.loadTimerSettings();
    this.loadBotSettings();

    this.basePlaying = this.audio.isEnabled();
  }

  private quitGame(): void {
    this.gameData.reset();
  }

  editTimer(increment: boolean): void {
    this.audio.playSound('menu-click');

    if (increment) {
      this.currentTimerIndex = Math.min(
        this.currentTimerIndex + 1,
        this.timerSettings.length - 1
      );
    } else {
      this.currentTimerIndex = Math.max(this.currentTimerIndex - 1, 0);
    }

    this.gameData.update('general', {
      timerSetting: this.timerSettings[this.currentTimerIndex].value,
    });
  }

  editBotSetting(increment: boolean): void {
    if (increment) {
      this.currentBotSettingIndex = Math.min(
        this.currentBotSettingIndex + 1,
        this.botSettings.length - 1
      );
    } else {
      this.currentBotSettingIndex = Math.max(
        this.currentBotSettingIndex - 1,
        0
      );
    }

    this.gameData.update('general', {
      botSetting: this.botSettings[this.currentBotSettingIndex].value,
    });
  }

  createBootcamp(): void {
    this.gameData.update('user', { nickname: this.nickname, playerId: 0 });
    this.gameData.update('enemy', { nickname: 'CodyColor', playerId: 1 });
    this.gameData.setNewMatchTiles();

    this.router.navigateByUrl('/bootmp-match');
  }

  toggleBase(): void {
    this.audio.toggleBase();
    this.basePlaying = this.audio.isEnabled();
  }

  private loadTimerSettings(): void {
    this.translate
      .get(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES'])
      .subscribe((translations) => {
        this.timerSettings = [
          { text: translations['15_SECONDS'], value: 15000 },
          { text: translations['30_SECONDS'], value: 30000 },
          { text: translations['1_MINUTE'], value: 60000 },
          { text: translations['2_MINUTES'], value: 120000 },
        ];
      });
  }

  private loadBotSettings(): void {
    this.translate
      .get(['NO_ENEMY', 'AI_EASY', 'AI_MEDIUM', 'AI_HARD'])
      .subscribe((translations) => {
        this.botSettings = [
          { text: translations['NO_ENEMY'], value: 0 },
          { text: translations['AI_EASY'], value: 1 },
          { text: translations['AI_MEDIUM'], value: 2 },
          { text: translations['AI_HARD'], value: 3 },
        ];
        this.gameData.update('general', { botSetting: 0 });
      });
  }
}
