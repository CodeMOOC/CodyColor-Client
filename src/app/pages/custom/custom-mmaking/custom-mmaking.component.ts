import { Component } from '@angular/core';
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

interface TimerSetting {
  text: string;
  value: number;
}

@Component({
  selector: 'app-custom-mmaking',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './custom-mmaking.component.html',
  styleUrl: './custom-mmaking.component.scss',
})
export class CustomMmakingComponent {
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
  basePlaying = false;

  screens = {
    loadingScreen: 'loadingScreen',
    joinMatch: 'joinMatch',
    nicknameSelection: 'nicknameSelection',
    waitingEnemy: 'waitingEnemy',
    waitingReady: 'waitingReady',
    enemyFound: 'enemyFound',
  };
  mmakingState = this.screens.loadingScreen;
  mmakingRequested = false;
  enemyReady = false;
  readyClicked = false;
  playerValidated = false;

  linkCopied = false;
  codeCopied = false;

  codeValue: string = '';

  joinMessage = ''; //TO DEFINE

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
    private chatService: ChatHandlerService,
    private rabbit: RabbitService,
    private router: Router,
    private navigation: NavigationService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private audio: AudioService,
    private session: SessionService,
    private gameData: GameDataService,
    private authHandler: AuthService,
    private shareService: ShareService,
    private visibilityHandler: VisibilityService
  ) {}

  ngOnInit(): void {
    this.initializeSession();
    this.setupUser();
    this.loadTimerSettings();
    this.basePlaying = this.audio.isEnabled();

    this.general = this.gameData.value.general;

    this.chatBubbles = this.chatService.getChatMessages();
    this.chatHints = this.chatService.getChatHintsPreMatch();

    this.rabbit.setPageCallbacks({
      onGameRequestResponse: (message: any) => {
        if (message.code.toString() !== '0000') {
          this.gameData.update('general', message.general);
          this.matchUrl = `${this.baseUrl}/#!?custom=${message.general.code}`;

          this.rabbit.subscribeGameRoom();
        }
      },
      onConnectionLost: () => this.handleForceExit(),
    });

    this.visibilityHandler.setDeadlineCallback(() => this.handleForceExit());
    let formattedTranslateCode = this.gameData.formatTimeStatic(
      this.gameData.value.general.timerSetting
    );
    this.translate.get(formattedTranslateCode).subscribe((res: string) => {
      this.totTime = res;
    });
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
  private initializeSession() {
    this.navigation.allowBackNavigationOnce();

    if (this.session.isSessionInvalid()) {
      this.quitGame();
      this.router.navigate(['/']);
    }
  }

  joinGame(codeValue: string) {
    this.mmakingRequested = true;
    this.audio.playSound('menu-click');
    this.translate.get('SEARCH_MATCH_INFO').subscribe((text) => {
      this.joinMessage = text;
    });
    this.gameData.update('general', { code: codeValue });
    this.rabbit.sendGameRequest();
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
  private setupUser() {
    this.userLogged = this.authHandler.loginCompleted();

    if (this.userLogged) {
      const userData = this.authHandler.getServerUserData();
      this.userNickname = userData.nickname;
      this.nickname = userData.nickname;
    } else {
      this.languageService.setTranslation('userNickname', 'NOT_LOGGED');
    }
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

  exitGame() {
    this.audio.playSound('menu-click');
    this.exitGameModal = true;
  }

  continueExitGame() {
    this.audio.playSound('menu-click');
    this.rabbit.sendPlayerQuitRequest();
    this.quitGame();
    this.router.navigate(['/home']);
  }

  stopExitGame() {
    this.audio.playSound('menu-click');
    this.exitGameModal = false;
  }

  handleForceExit() {
    this.quitGame();

    //force exit text
    this.forceExitModal = true;
  }

  continueForceExit() {
    this.audio.playSound('menu-click');
    this.router.navigate(['/home']);
  }

  openLanguageModal() {
    this.languageModal = true;
    this.audio.playSound('menu-click');
  }

  closeLanguageModal() {
    this.languageModal = false;
    this.audio.playSound('menu-click');
  }

  changeLanguage(langKey: string) {
    this.translate.use(langKey);
    this.languageModal = false;
    this.loadTimerSettings();

    if (!this.authHandler.loginCompleted()) {
      this.languageService
        .setTranslation('userNickname', 'NOT_LOGGED')
        .then((t) => {
          this.userNickname = t;
        });
    }

    this.audio.playSound('menu-click');
  }

  toggleBase() {
    this.audio.toggleBase();
    this.basePlaying = this.audio.isEnabled();
  }
}
