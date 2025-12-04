import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { AudioService } from '../../../services/audio.service';
import { AuthService } from '../../../services/auth.service';
import { GameDataService } from '../../../services/game-data.service';
import { ModalService } from '../../../services/modal-service.service';
import { NavigationService } from '../../../services/navigation.service';
import { RabbitService } from '../../../services/rabbit.service';
import { VisibilityService } from '../../../services/visibility.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-royale-new-match',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './royale-new-match.component.html',
  styleUrl: './royale-new-match.component.scss',
})
export class RoyaleNewMatchComponent implements OnInit, OnDestroy {
  private rabbit = inject(RabbitService);
  private navigation = inject(NavigationService);
  private session = inject(SessionService);
  private gameData = inject(GameDataService);
  private auth = inject(AuthService);
  private audio = inject(AudioService);
  private visibility = inject(VisibilityService);
  private modal = inject(ModalService);
  private translate = inject(TranslateService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private subs: Subscription[] = [];

  // --------------------------
  // FORM
  // --------------------------
  form = this.fb.group({
    gameName: ['', [Validators.required, Validators.maxLength(22)]],
    nickname: ['', [Validators.required, Validators.maxLength(22)]],
    hours: [0],
    minutes: [0],
  });

  // --------------------------
  // UI STATE
  // --------------------------
  exitGameModal = false;
  forceExitModal = false;
  languageModal = false;
  forceExitText = '';

  creatingMatch = false;

  userLogged = false;
  userNickname = '';
  nickname = '';
  basePlaying = false;

  // --------------------------
  // MATCH SETTINGS
  // --------------------------
  timerSettings: { text: string; value: number }[] = [];
  maxPlayersSettings: { text: string; value: number }[] = [];
  startSettings: { text: string; value: number }[] = [];

  currentTimerIndex = 1;
  currentMaxPlayersIndex = 1;
  currentStartIndex = 0;

  settingsTimerReady = false;
  settingsMaxPlayersReady = false;
  settingsStartReady = false;

  ngOnInit(): void {
    // Set game mode in gameData
    this.gameData.update('general', {
      gameType: this.gameData.getGameTypes().royale,
    });

    // VISIBILITY HANDLER - force exit
    this.visibility.setDeadlineCallback(() => {
      this.quitGame();
      this.forceExitText = this.translate.instant('FORCE_EXIT');
      this.forceExitModal = true;
    });

    // check auth state
    this.auth.authReady$.subscribe((ready) => {
      if (ready) {
        this.auth.user$.subscribe((appUser) => {
          this.userLogged = !!appUser.firebaseUser && !!appUser.serverData;
          this.userNickname = appUser.serverData?.nickname || '';

          this.form.patchValue({
            nickname: this.userNickname,
          });
        });
      }
    });

    // Time fields
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    this.form.patchValue({
      hours: now.getHours(),
      minutes: now.getMinutes(),
    });

    // Load select options
    this.loadTimerSettings();
    this.loadMaxPlayerSettings();
    this.loadStartSettings();

    console.log('ROYAL NEW MATCH COMPONENT INIT');
    console.log(this.timerSettings);
    // RABBIT CALLBACKS
    this.rabbit.setPageCallbacks({
      onConnectionLost: () => {
        this.quitGame();
        this.forceExitText = this.translate.instant('FORCE_EXIT');
        this.forceExitModal = true;
      },
    });

    // Audio
    this.basePlaying = this.audio.isEnabled();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  // -------------------------------------------------------
  // LOAD TRANSLATED SETTINGS
  // -------------------------------------------------------
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

        this.settingsTimerReady = true;
      });
  }

  private loadMaxPlayerSettings() {
    this.translate
      .get(['PLAYERS_10', 'PLAYERS_20', 'PLAYERS_40', 'PLAYERS_60'])
      .subscribe((translations) => {
        this.maxPlayersSettings = [
          { text: translations['PLAYERS_10'], value: 10 },
          { text: translations['PLAYERS_20'], value: 20 },
          { text: translations['PLAYERS_40'], value: 40 },
          { text: translations['PLAYERS_60'], value: 60 },
        ];

        this.settingsMaxPlayersReady = true;
      });
  }

  private async loadStartSettings() {
    this.translate.get(['IN_DATE', 'MANUAL']).subscribe((translations) => {
      this.startSettings = [
        { text: translations['IN_DATE'], value: 0 },
        { text: translations['MANUAL'], value: 1 },
      ];
      this.settingsStartReady = true;
    });
  }

  // -------------------------------------------------------
  // SELECTORS
  // -------------------------------------------------------
  editTimer(increment: boolean) {
    this.audio.playSound('menu-click');
    const next = this.currentTimerIndex + (increment ? 1 : -1);
    this.currentTimerIndex = Math.min(
      Math.max(next, 0),
      this.timerSettings.length - 1
    );

    this.gameData.update('general', {
      timerSetting: this.timerSettings[this.currentTimerIndex].value,
    });
  }

  editMaxPlayers(increment: boolean) {
    this.audio.playSound('menu-click');
    const next = this.currentMaxPlayersIndex + (increment ? 1 : -1);
    this.currentMaxPlayersIndex = Math.min(
      Math.max(next, 0),
      this.maxPlayersSettings.length - 1
    );

    this.gameData.update('general', {
      maxPlayersSetting:
        this.maxPlayersSettings[this.currentMaxPlayersIndex].value,
    });
  }

  editStartMode() {
    this.audio.playSound('menu-click');
    this.currentStartIndex = this.currentStartIndex === 0 ? 1 : 0;
  }

  // -------------------------------------------------------
  // REQUEST MATCH MAKING
  // -------------------------------------------------------
  requestMMaking() {
    this.audio.playSound('menu-click');
    if (this.form.invalid) return;

    const { nickname, gameName, hours, minutes } = this.form.value;

    if (this.currentStartIndex === 0) {
      if (!this.matchDateValid(hours!, minutes!)) return;

      const start = new Date();
      start.setHours(hours!, minutes!);

      this.gameData.update('general', {
        startDate: start.getTime(),
      });
    }

    this.gameData.update('general', {
      gameName: gameName!,
      code: '0000',
    });

    this.gameData.update('user', {
      nickname: nickname!,
      organizer: true,
    });

    this.router.navigate(['/royale-mmaking']);
  }

  private matchDateValid(hours: number, minutes: number): boolean {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();

    if (hours > h) return true;
    if (hours === h && minutes > m) return true;

    return false;
  }

  private quitGame() {
    this.rabbit.quitGame();
    this.gameData.reset();
  }
}
