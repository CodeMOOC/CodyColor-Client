import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';
import { RabbitService } from '../../services/rabbit.service';
import { GameDataService } from '../../services/game-data.service';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { AudioService } from '../../services/audio.service';
import { SessionService } from '../../services/session.service';
import { VisibilityService } from '../../services/visibility.service';
import { Subscription } from 'rxjs';
import { ChatHandlerService } from '../../services/chat.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-random-mmaking',
  imports: [TranslateModule, CommonModule, FormsModule, SpinnerComponent],
  standalone: true,
  templateUrl: './random-mmaking.component.html',
  styleUrl: './random-mmaking.component.scss',
})
export class RandomMmakingComponent implements OnInit, OnDestroy {
  nickname: string = '';
  userNickname: string = '';
  userLogged: boolean = false;
  mmakingRequested: boolean = false;
  mmakingState: string = 'nicknameSelection';
  screens = {
    loadingScreen: 'loadingScreen',
    nicknameSelection: 'nicknameSelection',
    waitingEnemy: 'waitingEnemy',
    enemyFound: 'enemyFound',
    waitingReady: 'waitingReady',
  };

  // matchmakingTimer: interrompe la ricerca della partita nel caso in cui vada troppo per le lunghe
  mmakingTimerValue = 120000;
  enemy: any = {};
  enemyReady = false;
  chatBubbles: any[] = [];
  chatHints: string[] = [];
  readyClicked = false;

  exitGameModal = false;
  forceExitModal = false;
  forceExitText = '';
  languageModal = false;
  basePlaying: boolean = false;

  randomWaitingPlayers: string = '';
  private mmakingTimerId: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private authHandler: AuthService,
    private rabbit: RabbitService,
    private gameData: GameDataService,
    private router: Router,
    private navigation: NavigationService,
    private audio: AudioService,
    private visibility: VisibilityService,
    private chat: ChatHandlerService,
    private sessionHandler: SessionService,
    private translate: TranslateService,
    private translation: LanguageService
  ) {}

  ngOnInit(): void {
    this.initMatchmaking();
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private initMatchmaking(): void {
    const sub = this.gameData.gameData$.subscribe((data) => {
      this.enemy = this.gameData.value.enemy;
    });
    this.subscriptions.push(sub);
    this.gameData.value.general.gameType = this.gameData.getGameTypes().random;
    this.enemy = this.gameData.value.enemy;

    this.navigation.blockBackNavigation();
    if (this.sessionHandler.isSessionInvalid()) {
      this.quitGame();
      this.router.navigate(['/']);
      return;
    }

    this.visibility.setDeadlineCallback(() => {
      this.rabbit.sendPlayerQuitRequest();
      this.quitGame();
      this.translation
        .setTranslation('forceExitText', 'FORCE_EXIT')
        .then((translation) => {
          this.forceExitText = translation;
          this.forceExitModal = true;
        });
    });

    this.userLogged = this.authHandler.loginCompleted();
    if (this.userLogged) {
      const user = this.authHandler.currentUser?.serverData;

      this.nickname = this.userNickname = user?.nickname ? user.nickname : '';
    } else {
      this.translation
        .setTranslation('userNickname', 'NOT_LOGGED')
        .then((t) => {
          this.userNickname = t;
        });
    }

    this.changeScreen(this.screens.nicknameSelection);
    this.randomWaitingPlayers = this.sessionHandler
      .getRandomWaitingPlayers()
      .toString();
    this.chatBubbles = this.chat.getChatMessages();
    this.chatHints = this.chat.getChatHintsPreMatch();

    this.initPageCallbacks();
  }

  private changeScreen(newScreen: string): void {
    this.mmakingState = this.screens.loadingScreen;
    setTimeout(() => (this.mmakingState = newScreen), 200);
  }

  private initPageCallbacks(): void {
    this.rabbit.setPageCallbacks({
      onGeneralInfoMessage: () => {
        this.randomWaitingPlayers = this.sessionHandler
          .getRandomWaitingPlayers()
          .toString();
      },
      onGameRequestResponse: (message: any) => {
        this.gameData.update('general', message.general);
        this.gameData.update('user', message.user);
        this.gameData.update('enemy', message.enemy);

        this.rabbit.subscribeGameRoom();

        if (this.gameData.value.enemy.validated) {
          this.clearTimers();
          this.changeScreen(this.screens.enemyFound);
        } else {
          this.startMatchmakingTimer();
          this.changeScreen(this.screens.waitingEnemy);
        }
      },
      onPlayerAdded: (message: any) => {
        if (message.addedPlayerId !== this.gameData.value.user.playerId) {
          this.audio.playSound('enemy-found');
          this.gameData.update('enemy', message.addedPlayer);

          this.clearTimers();
          this.changeScreen(this.screens.enemyFound);
        }
      },
      onReadyMessage: () => (this.enemyReady = true),
      onStartMatch: (message: any) => {
        this.gameData.update('match', {
          tiles: this.gameData.formatMatchTiles(message.tiles),
        });
        this.router.navigate(['/arcade-match']);
      },
      onGameQuit: () => this.handleForcedExit('ENEMY_LEFT'),
      onConnectionLost: () => this.handleForcedExit('FORCE_EXIT'),
      onChatMessage: (message: any) => {
        this.audio.playSound('roby-over');
        this.chat.enqueueChatMessage(message);
        this.chatBubbles = this.chat.getChatMessages();
      },
    });
  }

  // update timer every second to quit the game if no enemy is found in time
  private startMatchmakingTimer(): void {
    this.clearTimers();
    this.mmakingTimerId = setInterval(() => {
      this.mmakingTimerValue -= 1000;
      if (this.mmakingTimerValue <= 0) {
        this.quitGame();
        this.translation.translateM('NO_NEW_ENEMY').then((text) => {
          this.forceExitText = text;
          this.forceExitModal = true;
        });
        this.clearTimers();
      }
    }, 1000);
  }

  private clearTimers(): void {
    if (this.mmakingTimerId) {
      clearInterval(this.mmakingTimerId);
      this.mmakingTimerId = null;
    }
  }

  private quitGame(): void {
    this.rabbit.quitGame();
    this.gameData.reset();
    this.chat.clearChat();
    this.clearTimers();
  }

  private handleForcedExit(messageKey: string): void {
    this.quitGame();
    this.translation.setTranslation('forceExitText', messageKey).then((t) => {
      this.forceExitText = t;
      this.forceExitModal = true;
    });
  }

  getBubbleStyle(bubble: any): string {
    return bubble.playerId === this.gameData.value.user.playerId
      ? 'chat--bubble-player'
      : 'chat--bubble-enemy';
  }

  sendChatMessage(message: string): void {
    this.audio.playSound('menu-click');
    const chatMsg = this.rabbit.sendChatMessage(message);
    this.chat.enqueueChatMessage(chatMsg);
    this.chatBubbles = this.chat.getChatMessages();
  }

  requestMMaking(): void {
    this.mmakingRequested = true;
    this.audio.playSound('menu-click');
    this.gameData.update('user', { nickname: this.nickname });
    this.rabbit.sendGameRequest(
      this.authHandler.currentUser?.firebaseUser?.uid ?? ''
    );
  }

  playerReady(): void {
    this.audio.playSound('menu-click');
    this.readyClicked = true;
    this.rabbit.sendReadyMessage();
    if (!this.enemyReady) this.changeScreen(this.screens.waitingReady);
  }

  exitGame(): void {
    this.audio.playSound('menu-click');
    this.exitGameModal = true;
  }
}
