import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  inject,
  signal,
  Signal,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { RabbitService } from '../../../services/rabbit.service';
import { GameDataService } from '../../../services/game-data.service';
import { AudioService } from '../../../services/audio.service';
import { SessionService } from '../../../services/session.service';
import { ChatHandlerService } from '../../../services/chat.service';
import { ShareService } from '../../../services/share.service';
import { VisibilityService } from '../../../services/visibility.service';
import { AuthService } from '../../../services/auth.service';
import { SettingsService } from '../../../services/settings.service';
import { NavigationService } from '../../../services/navigation.service';
import { TimerSetting } from '../../../models/timerSetting.model';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ModalService } from '../../../services/modal-service.service';

@Component({
  selector: 'app-royale-mmaking',
  templateUrl: './royale-mmaking.component.html',
  styleUrls: ['./royale-mmaking.component.scss'],
  imports: [CommonModule, FormsModule, TranslateModule],
  standalone: true,
})
export class RoyaleMmakingComponent implements OnInit, OnDestroy {
  // --- Component state ---
  userLogged = false;
  userNickname = '';
  nickname = '';
  mmakingState = '';
  screens = {
    loadingScreen: 'loadingScreen',
    joinMatch: 'joinMatch',
    nicknameSelection: 'nicknameSelection',
    waitingEnemies: 'waitingEnemies',
  };
  mmakingRequested = false;
  readyClicked = false;
  playerValidated = false;
  exitGameModal = false;
  forceExitModal = false;
  forceExitText = '';
  languageModal = false;
  basePlaying = false;

  chatBubbles: any[] = [];
  chatHints: any[] = [];
  joinMessage = '';
  matchUrl = '';

  private mmakingTimerId: any;

  startMatchTimerValue = signal(0);
  relativeStartDate = signal(0);

  timerSettings: TimerSetting[] = [];

  private startMatchTimer?: any;
  private subs = new Subscription();

  linkCopied = false;
  codeCopied = false;
  general: GameDataService['value']['general'] = {
    code: '0000',
    gameType: undefined,
    scheduledStart: false,
    gameRoomId: 0,
    timerSetting: 30000,
    maxPlayersSetting: 2,
    botSetting: 0,
  };
  enemy: GameDataService['value']['enemy'] = {
    playerId: 0,
    nickname: '',
    organizer: false,
    validated: false,
  };

  aggregated: GameDataService['value']['aggregated'] = {
    connectedPlayers: 0,
    positionedPlayers: 0,
    readyPlayers: 0,
    matchCount: 0,
  };

  user: GameDataService['value']['user'] = {
    playerId: 0,
    nickname: '',
    organizer: false,
    validated: false,
  };

  codeValue: string = '';

  battleTime: number = 30000;

  // --- Services ---
  private rabbit = inject(RabbitService);
  private authHandler = inject(AuthService);
  private gameData = inject(GameDataService);
  private audio = inject(AudioService);
  private router = inject(Router);
  private session = inject(SessionService);
  private chat = inject(ChatHandlerService);
  private translate = inject(TranslateService);
  private share = inject(ShareService);
  private visibility = inject(VisibilityService);
  private modalService = inject(ModalService);
  private auth = inject(AuthService);
  private settings = inject(SettingsService);
  private navigation = inject(NavigationService);
  private zone = inject(NgZone);
  private translation = inject(LanguageService);

  ngOnInit(): void {
    this.gameData.gameData$.subscribe((gameData) => {
      this.general = gameData.general;
      this.enemy = gameData.enemy;
      this.aggregated = gameData.aggregated;
      this.user = gameData.user;
    });

    // set game type
    this.gameData.update('general', {
      gameType: this.gameData.getGameTypes().royale,
    });

    // session validation
    this.auth.authReady$.subscribe((ready) => {
      if (ready) {
        this.auth.user$.subscribe((appUser) => {
          this.userLogged = !!appUser.firebaseUser && !!appUser.serverData;
          this.userNickname = appUser.serverData?.nickname || '';
          this.nickname = this.userNickname;
        });
      } else {
        this.translate
          .get('NOT_LOGGED')
          .subscribe((text) => (this.userNickname = text));
      }
    });

    this.loadTimerSettings();

    // visibility callback
    this.visibility.setDeadlineCallback(() => {
      this.rabbit.sendPlayerQuitRequest();
      this.quitGame();
      this.forceExitText = this.translate.instant('FORCE_EXIT');
      this.forceExitModal = true;
    });

    // initial screen
    this.changeScreen(this.screens.joinMatch);

    // chat initialization
    this.chatBubbles = this.chat.getChatMessages();
    this.chatHints = this.chat.getChatHintsPreMatch();

    // try connecting to Rabbit broker
    let requiredDelayedGameRequest = false;
    if (!this.rabbit.getBrokerConnectionState()) {
      this.rabbit.connect();
      requiredDelayedGameRequest = true;
    } else if (
      this.gameData.value.general.code !== '0000' ||
      this.gameData.value.user.organizer
    ) {
      this.rabbit.sendGameRequest(
        this.authHandler.currentUser?.firebaseUser?.uid ?? ''
      );

      this.translate
        .get('SEARCH_MATCH_INFO')
        .subscribe((text) => (this.joinMessage = text));
    }

    this.registerRabbitCallbacks(requiredDelayedGameRequest);
    this.basePlaying = this.audio.isEnabled();
  }

  ngOnDestroy(): void {
    if (this.startMatchTimer) clearInterval(this.startMatchTimer);
    this.subs.unsubscribe();
  }

  private quitGame(): void {
    this.rabbit.quitGame();
    this.gameData.reset();
    this.chat.clearChat();
    if (this.startMatchTimer) {
      clearInterval(this.startMatchTimer);
      this.startMatchTimer = undefined;
    }
  }

  private changeScreen(newScreen: string): void {
    this.mmakingState = this.screens.loadingScreen;
    setTimeout(() => {
      this.mmakingState = newScreen;
    }, 200);
  }

  goToCreateMatch(): void {
    this.audio.playSound('menu-click');
    this.navigation.goToPage('/royale-new-match');
  }

  private loadTimerSettings() {
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

  joinGame(codeValue: string): void {
    this.mmakingRequested = true;
    this.audio.playSound('menu-click');
    this.translate
      .get('SEARCH_MATCH_INFO')
      .subscribe((text) => (this.joinMessage = text));
    this.gameData.update('general', { code: codeValue });

    this.rabbit.sendGameRequest(
      this.authHandler.currentUser?.firebaseUser?.uid ?? ''
    );
  }

  playerReady(): void {
    this.audio.playSound('menu-click');
    this.rabbit.sendReadyMessage();
    this.readyClicked = true;
  }

  validPlayer(): void {
    this.audio.playSound('menu-click');
    this.playerValidated = true;
    this.gameData.update('user', { nickname: this.nickname });
    this.rabbit.sendValidationMessage();
    this.session.enableNoSleep();
    this.audio.splashStartBase();
  }

  sendChatMessage(messageBody: string): void {
    this.audio.playSound('menu-click');
    const chatMessage = this.rabbit.sendChatMessage(messageBody);
    this.chat.enqueueChatMessage(chatMessage);
    this.chatBubbles = this.chat.getChatMessages();
  }

  getBubbleStyle(chatMessage: any): string {
    return chatMessage.playerId === this.gameData.value.user.playerId
      ? 'chat--bubble-player'
      : 'chat--bubble-enemy';
  }

  copyLink() {
    this.audio.playSound('menu-click');
    this.share.copyTextToClipboard(this.matchUrl);
    this.linkCopied = true;
    this.codeCopied = false;
  }

  copyCode() {
    this.audio.playSound('menu-click');
    this.share.copyTextToClipboard(this.gameData.value.general.code);
    this.linkCopied = false;
    this.codeCopied = true;
  }

  private registerRabbitCallbacks(requiredDelayedGameRequest: boolean): void {
    this.rabbit.setPageCallbacks({
      onGeneralInfoMessage: () => {
        if (!this.session.isClientVersionValid()) {
          this.quitGame();
          this.translate.get('OUTDATED_VERSION_DESC').subscribe((text) => {
            this.forceExitText = text;
            this.forceExitModal = true;
          });
        }
      },
      onConnected: () => {
        if (requiredDelayedGameRequest) {
          if (
            this.gameData.value.general.code !== '0000' ||
            this.gameData.value.user.organizer
          ) {
            this.rabbit.sendGameRequest(
              this.authHandler.currentUser?.firebaseUser?.uid ?? ''
            );
            this.translate
              .get('SEARCH_MATCH_INFO')
              .subscribe((text) => (this.joinMessage = text));
          }
        }
      },
      onGameRequestResponse: (message: any) => {
        if (message.code === '0000') {
          this.mmakingRequested = false;
          this.translate
            .get('CODE_NOT_VALID')
            .subscribe((text) => (this.joinMessage = text));
          this.gameData.update('general', { code: '0000' });
        } else {
          this.gameData.update('general', message.general);
          this.gameData.update('aggregated', message.aggregated);
          this.gameData.update('user', message.user);

          this.matchUrl = `${environment.webBaseUrl}/#!?royale=${message.general.code}`;
          this.rabbit.subscribeGameRoom();

          // if (this.gameData.value.general.scheduledStart) {
          //   this.startMatchTimerValue = message.msToStart;
          //   this.relativeStartDate = Date.now() + message.msToStart;

          //   this.startMatchTimer = setInterval(() => {
          //     const remaining = this.relativeStartDate - Date.now();
          //     this.startMatchTimerValue = remaining > 0 ? remaining : 0;
          //     if (remaining <= 0 && this.startMatchTimer) {
          //       clearInterval(this.startMatchTimer);
          //       this.startMatchTimer = undefined;
          //     }
          //   }, 1000);
          // }

          if (this.gameData.value.general.scheduledStart) {
            this.startMatchTimerValue.set(message.msToStart);
            this.relativeStartDate.set(Date.now() + message.msToStart);

            this.startMatchTimer = setInterval(() => {
              const remaining = this.relativeStartDate() - Date.now();
              this.startMatchTimerValue.set(remaining > 0 ? remaining : 0);

              if (remaining <= 0 && this.startMatchTimer) {
                clearInterval(this.startMatchTimer);
                this.startMatchTimer = undefined;
                // this.handleEnemyQuit(this.translate.instant('TIME_BATTLE_IS_OVER'));
              }
            }, 1000);
          }

          if (this.gameData.value.user.validated)
            this.changeScreen(this.screens.waitingEnemies);
          else this.changeScreen(this.screens.nicknameSelection);
        }
      },
      onStartMatch: (message: any) => {
        this.gameData.update('aggregated', message.aggregated);
        this.gameData.update('match', {
          tiles: this.gameData.formatMatchTiles(message.tiles),
        });

        if (this.startMatchTimer) {
          clearInterval(this.startMatchTimer);
          this.startMatchTimer = undefined;
        }
        this.navigation.goToPage('/royale-match');
      },
      onGameQuit: () => this.quitGameWithMessage('ENEMY_LEFT'),
      onConnectionLost: () => this.quitGameWithMessage('FORCE_EXIT'),
      onChatMessage: (message: any) => {
        this.audio.playSound('roby-over');
        this.chat.enqueueChatMessage(message);
        this.chatBubbles = this.chat.getChatMessages();
      },
      onPlayerAdded: (message: any) => {
        if (message.addedPlayerId === this.gameData.value.user.playerId) {
          if (!this.gameData.value.user.validated)
            this.changeScreen(this.screens.waitingEnemies);
          this.gameData.update('user', message.addedPlayer);
        }

        this.gameData.update('aggregated', message.aggregated);
      },
      onPlayerRemoved: (message: any) => {
        if (message.removedPlayerId === this.gameData.value.user.playerId) {
          this.quitGameWithMessage('ENEMY_LEFT');
        } else {
          this.gameData.update('aggregated', message.aggregated);
        }
      },
    });
  }

  private quitGameWithMessage(messageKey: string): void {
    this.quitGame();
    this.translate
      .get(messageKey)
      .subscribe((text) => (this.forceExitText = text));
    this.forceExitModal = true;
  }

  private async handleEnemyQuit(message: string) {
    this.quitGame();
    await this.modalService.showForceExitModal(message);
    this.router.navigate(['/home']);
  }

  formattedStartTimer = computed(() =>
    this.gameData.formatTimeSeconds(this.startMatchTimerValue())
  );
}
