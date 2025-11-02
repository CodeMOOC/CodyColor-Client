import { Component, OnInit } from '@angular/core';
import { RabbitService } from '../../../services/rabbit.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GameDataService } from '../../../services/game-data.service';
import { NavigationService } from '../../../services/navigation.service';
import { LanguageService } from '../../../services/language.service';
import { AudioService } from '../../../services/audio.service';
import { SessionService } from '../../../services/session.service';
import { AuthService } from '../../../services/auth.service';
import { VisibilityService } from '../../../services/visibility.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../../models/player.model';
import { environment } from '../../../../environments/environment';
import { Bubble } from '../../../models/bubble.model';
import { ChatHandlerService } from '../../../services/chat.service';
import { ShareService } from '../../../services/share.service';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';

interface TimerSetting {
  text: string;
  value: number;
}

@Component({
  selector: 'app-custom-mmaking',
  imports: [CommonModule, FormsModule, TranslateModule, SpinnerComponent],
  standalone: true,
  templateUrl: './custom-mmaking.component.html',
  styleUrl: './custom-mmaking.component.scss',
})
export class CustomMmakingComponent implements OnInit {
  user!: Player;
  enemy!: Player;

  userLogged = false;
  userNickname = '';
  nickname = '';
  timerSettings: TimerSetting[] = [];
  currentTimerIndex = 1;

  creatingMatch = false;
  exitGameModal = false;
  forceExitModal = false;
  forceExitText = '';
  languageModal = false;

  screens = {
    loadingScreen: 'loadingScreen',
    joinMatch: 'joinMatch',
    nicknameSelection: 'nicknameSelection',
    waitingEnemy: 'waitingEnemy',
    waitingReady: 'waitingReady',
    enemyFound: 'enemyFound',
  };
  mmakingState: string = this.screens.joinMatch;
  mmakingRequested = false;
  enemyReady = false;
  readyClicked = false;
  playerValidated = false;

  linkCopied = false;
  codeCopied = false;

  codeValue: string = '';

  joinMessage = '';

  general: any;
  totTime: string = '';

  baseUrl: string = environment.webBaseUrl;
  matchUrl: string = '';

  bubble: Bubble = {
    id: '',
    body: '',
    sender: '',
  };
  chatVisible = false;
  chatBubbles: Bubble[] = [];
  chatHints: string[] = [];

  constructor(
    private auth: AuthService,
    private chatService: ChatHandlerService,
    private rabbit: RabbitService,
    private router: Router,
    private navigation: NavigationService,
    private translate: TranslateService,
    private audio: AudioService,
    private session: SessionService,
    private gameData: GameDataService,
    private authHandler: AuthService,
    private shareService: ShareService
  ) {}

  ngOnInit(): void {
    this.gameData.update('general', {
      gameType: this.gameData.getGameTypes().custom,
    });
    this.auth.authReady$.subscribe((ready) => {
      if (ready) {
        this.auth.user$.subscribe((appUser) => {
          this.userLogged = !!appUser.firebaseUser && !!appUser.serverData;
          this.userNickname = appUser.serverData?.nickname || '';
          this.nickname = this.userNickname;
        });
      }
    });

    this.loadTimerSettings();

    this.gameData.gameData$.subscribe((gameData) => {
      this.general = gameData.general;
      this.enemy = gameData.enemy;
    });

    this.chatBubbles = this.chatService.getChatMessages();
    this.chatHints = this.chatService.getChatHintsPreMatch();

    this.handleInitialGameRequest();

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

      onGameRequestResponse: (message: any) => {
        if (message.code.toString() === '0000') {
          // invalid match code
          this.mmakingRequested = false;
          this.translate.get('CODE_NOT_VALID').subscribe((text) => {
            this.joinMessage = text;
          });
          this.gameData.update('general', { code: '0000' });
        } else {
          // valid response from server
          this.gameData.update('general', message.general);
          this.gameData.update('user', message.user);
          this.gameData.update('enemy', message.enemy);

          this.matchUrl = `${this.baseUrl}/#!?custom=${message.general.code}`;
          this.rabbit.subscribeGameRoom();

          const formattedTranslateCode = this.gameData.formatTimeStatic(
            message.general.timerSetting
          );
          this.translate
            .get(formattedTranslateCode)
            .subscribe((res: string) => {
              this.totTime = res;
            });

          if (this.gameData.value.user.validated) {
            this.changeScreen(this.screens.waitingEnemy);
          } else {
            this.changeScreen(this.screens.nicknameSelection);
          }
        }
      },

      onPlayerAdded: (message: any) => {
        const user = this.gameData.value.user;
        if (message.addedPlayerId === user.playerId) {
          if (!user.validated) {
            this.changeScreen(this.screens.enemyFound);
          }
          this.gameData.update('user', message.addedPlayer);
        } else {
          this.audio.playSound('enemy-found');
          this.gameData.update('enemy', message.addedPlayer);
          this.changeScreen(this.screens.enemyFound);
        }
      },

      onReadyMessage: () => {
        this.enemyReady = true;
      },

      onStartMatch: (message: any) => {
        this.gameData.update('match', {
          tiles: this.gameData.formatMatchTiles(message.tiles),
        });
        this.navigation.goToPage('/arcade-match');
      },

      onGameQuit: () => {
        this.quitGame();
        this.translate.get('ENEMY_LEFT').subscribe((text) => {
          this.forceExitText = text;
          this.forceExitModal = true;
        });
      },

      onConnectionLost: () => {
        this.quitGame();
        this.translate.get('FORCE_EXIT').subscribe((text) => {
          this.forceExitText = text;
          this.forceExitModal = true;
        });
      },

      onChatMessage: (message: any) => {
        this.audio.playSound('roby-over');
        this.chatService.enqueueChatMessage(message);
        this.chatBubbles = this.chatService.getChatMessages();
      },
    });

    let formattedTranslateCode = this.gameData.formatTimeStatic(
      this.gameData.value.general.timerSetting
    );
    this.translate.get(formattedTranslateCode).subscribe((res: string) => {
      this.totTime = res;
    });
  }

  private handleInitialGameRequest() {
    const connected = this.rabbit.getBrokerConnectionState();

    if (!connected) {
      console.log('Broker not connected yet, connecting...');
      this.rabbit.connect();

      // Wait for connection and then send the request
      this.rabbit.waitForBrokerConnection().then(() => {
        console.log('Broker connected, sending delayed game request...');
        this.sendGameRequestIfNeeded();
      });
    } else {
      this.sendGameRequestIfNeeded();
    }
  }

  private sendGameRequestIfNeeded() {
    const general = this.gameData.value.general;
    const user = this.gameData.value.user;

    if (general.code !== '0000' || user.organizer) {
      console.log(
        'Sending initial game request... ',
        this.authHandler.currentUser?.firebaseUser?.uid
      );
      this.rabbit.sendGameRequest(
        this.authHandler.currentUser?.firebaseUser?.uid || ''
      );

      this.translate.get('SEARCH_MATCH_INFO').subscribe((text) => {
        this.joinMessage = text;
      });
    }
  }

  private quitGame() {
    this.rabbit.quitGame();
    this.gameData.reset();
  }

  getBubbleStyle(bubble: any) {
    return bubble.playerId === this.gameData.value.user.playerId
      ? 'chat--bubble-player'
      : 'chat--bubble-enemy';
  }

  sendChatMessage(messageBody: string) {
    this.audio.playSound('menu-click');
    const chatMessage = this.rabbit.sendChatMessage(messageBody);
    this.chatService.enqueueChatMessage(chatMessage);
    this.chatBubbles = this.chatService.getChatMessages();
  }

  goToCreateMatch() {
    this.audio.playSound('menu-click');
    this.navigation.goToPage('/custom-new-match');
  }

  joinGame(codeValue: string) {
    this.mmakingRequested = true;
    this.audio.playSound('menu-click');
    this.translate.get('SEARCH_MATCH_INFO').subscribe((text) => {
      this.joinMessage = text;
    });
    this.gameData.update('general', { code: codeValue });
    this.rabbit.sendGameRequest(
      this.authHandler.currentUser?.firebaseUser?.uid || ''
    );
  }

  playerReady() {
    this.readyClicked = true;
    this.rabbit.sendReadyMessage();
    if (!this.enemyReady) this.changeScreen(this.screens.waitingReady);
  }

  validPlayer() {
    this.playerValidated = true;
    this.gameData.update('user', { nickname: this.nickname });
    this.rabbit.sendValidationMessage();
    this.session.enableNoSleep();
    this.audio.splashStartBase();
  }

  copyLink() {
    this.audio.playSound('menu-click');
    this.shareService.copyTextToClipboard(this.matchUrl);
    this.linkCopied = true;
    this.codeCopied = false;
  }

  copyCode() {
    this.audio.playSound('menu-click');
    this.shareService.copyTextToClipboard(this.gameData.value.general.code);
    this.linkCopied = false;
    this.codeCopied = true;
  }

  changeScreen(newScreen: string) {
    this.mmakingState = this.screens.loadingScreen;
    setTimeout(() => {
      this.mmakingState = newScreen;
    }, 200);
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

  editTimer(increment: boolean) {
    this.audio.playSound('menu-click');
    if (increment) {
      this.currentTimerIndex = Math.min(this.currentTimerIndex + 1, 3);
    } else {
      this.currentTimerIndex = Math.max(this.currentTimerIndex - 1, 0);
    }
    this.gameData.update('general', {
      timerSetting: this.timerSettings[this.currentTimerIndex].value,
    });
  }

  requestMMaking() {
    this.audio.playSound('menu-click');
    this.creatingMatch = true;
    this.gameData.update('general', { code: '0000' });
    this.gameData.update('user', { nickname: this.nickname, organizer: true });
    this.router.navigate(['/custom-mmaking']);
  }
}
