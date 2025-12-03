import { Component, OnInit, OnDestroy, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';

import { RabbitService } from '../../../services/rabbit.service';
import { GameDataService } from '../../../services/game-data.service';
import { AudioService } from '../../../services/audio.service';
import { SessionService } from '../../../services/session.service';
import { ChatHandlerService } from '../../../services/chat.service';
import { ShareService } from '../../../services/share.service';
import { VisibilityService } from '../../../services/visibility.service';
import { AuthService } from '../../../services/auth.service';
import { PathService } from '../../../services/path.service';
import { MatchManagerService } from '../../../services/match-manager.service';
import { ChatComponent } from '../../../components/chat/chat.component';
import { ModalService } from '../../../services/modal-service.service';

@Component({
  selector: 'app-arcade-aftermatch',
  standalone: true,
  imports: [ChatComponent, CommonModule, TranslateModule],
  templateUrl: './arcade-aftermatch.component.html',
  styleUrls: ['./arcade-aftermatch.component.scss'],
})
export class ArcadeAftermatchComponent implements OnInit, OnDestroy {
  // State
  userLogged = false;
  userNickname = '';
  newMatchTimerValue = 60000;
  newMatchClicked = false;
  enemyRequestNewMatch = false;
  exitGameModal = false;
  forceExitModal = false;
  forceExitText = '';
  languageModal = false;
  basePlaying = false;

  // Chat
  chatBubbles: any[] = [];
  chatHints: any[] = [];

  // Game data
  user: any;
  enemy: any;
  winner: string = '';
  draw = false;
  matchCount = 0;
  userMatch: any;
  enemyMatch: any;
  userGlobal: any;
  enemyGlobal: any;
  general: any;

  shareCopied: boolean = false;

  private preventResetOnDestroy = false;

  private destroy$ = new Subject<void>();
  private gameData = inject(GameDataService);

  private newMatchTimer?: any;
  private subs = new Subscription();

  constructor(
    private rabbit: RabbitService,
    private audio: AudioService,
    private router: Router,
    private session: SessionService,
    private chat: ChatHandlerService,
    private modalService: ModalService,
    private translate: TranslateService,
    private path: PathService,
    private matchManager: MatchManagerService,
    private zone: NgZone,
    private share: ShareService,
    private visibility: VisibilityService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    if (this.session.isSessionInvalid()) {
      this.quitGame();
      this.router.navigate(['/']);
      return;
    }

    this.userLogin();
    this.initMatchData();
    this.registerRabbitCallbacks();
    this.startNewMatchCountdown();

    this.visibility.setDeadlineCallback(() => {
      this.rabbit.sendPlayerQuitRequest();
      this.zone.run(() => {
        this.quitGame();
        this.forceExitText = this.translate.instant('FORCE_EXIT');
        this.forceExitModal = true;
      });
    });
  }

  ngOnDestroy(): void {
    if (!this.preventResetOnDestroy) {
      this.quitGame();
    }
    this.subs.unsubscribe();
  }

  // Helpers
  private quitGame(): void {
    this.rabbit.quitGame();
    this.gameData.reset();
    this.chat.clearChat();
    if (this.newMatchTimer) {
      clearInterval(this.newMatchTimer);
      this.newMatchTimer = undefined;
    }
  }

  userLogin(): void {
    this.auth.user$.subscribe(() => {
      const appUser = this.auth.currentUser;

      this.userLogged = !!appUser.firebaseUser && !!appUser.serverData;

      if (this.userLogged && appUser.serverData) {
        this.userNickname = appUser.serverData.nickname;
      } else {
        this.translate.get('NOT_LOGGED').subscribe((res: string) => {
          this.userNickname = res;
        });
      }
    });
    this.basePlaying = this.audio.isEnabled();
  }

  private initMatchData(): void {
    this.gameData.gameData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.user = data.user;
      this.enemy = data.enemy;
      this.general = data.general;
      this.draw = data.match.winnerId === -1;
      this.winner = this.gameData.getMatchWinner().nickname;
      this.matchCount = data.aggregated.matchCount;
      this.userGlobal = data.userGlobalResult;
      this.userMatch = data.userMatchResult;
      this.enemyMatch = data.enemyMatchResult;
      this.enemyGlobal = data.enemyGlobalResult;
    });

    // Play win/lose sounds
    if (this.winner === this.user.nickname) this.audio.playSound('win');
    else if (this.winner === this.enemy.nickname) this.audio.playSound('lost');
  }

  private startNewMatchCountdown(): void {
    this.newMatchTimerValue = 60000;
    this.newMatchTimer = setInterval(() => {
      this.zone.run(() => {
        if (this.newMatchTimerValue <= 0) {
          this.newMatchTimerValue = 0;
          clearInterval(this.newMatchTimer);
          this.newMatchTimer = undefined;
          if (!this.newMatchClicked) {
            this.newMatchClicked = true;

            this.newMatch();
          }
        } else {
          this.newMatchTimerValue -= 1000;
        }
      });
    }, 1000);
  }

  newMatch(): void {
    this.audio.playSound('menu-click');
    this.newMatchClicked = true;
    this.gameData.initializeMatchData();
    this.path.reset();
    this.matchManager.resetMatchState();

    this.rabbit.sendReadyMessage();
  }

  shareResult(): void {
    this.audio.playSound('menu-click');
    this.shareCopied = true;
    const text = `I took ${this.gameData.value.userMatchResult.pathLength} steps with my Roby in a ${this.gameData.value.general.gameType} match!`;
    this.share.shareText(
      'CodyColor Multiplayer',
      text,
      '[https://codycolor.codemooc.net](https://codycolor.codemooc.net)'
    );
  }

  // Rabbit callbacks
  private registerRabbitCallbacks(): void {
    this.rabbit.setPageCallbacks({
      onReadyMessage: () => {
        console.log('Enemy is ready for new match');
        this.zone.run(() => (this.enemyRequestNewMatch = true));
      },

      onStartMatch: (message: any) => {
        this.gameData.update('match', {
          tiles: this.gameData.formatMatchTiles(message.tiles),
        });
        this.preventResetOnDestroy = true;

        this.router.navigate(['/arcade-match']);
      },

      onGameQuit: () => {
        this.handleEnemyQuit('ENEMY_LEFT');
      },

      onConnectionLost: () => {
        this.handleEnemyQuit('FORCE_EXIT');
      },

      onChatMessage: (message: any) => {
        this.zone.run(() => {
          this.audio.playSound('roby-over');
          this.chat.enqueueChatMessage(message);
          this.chatBubbles = this.chat.getChatMessages();
        });
      },
    });

    this.chatBubbles = this.chat.getChatMessages();
    this.chatHints = this.chat.getChatHintsPreMatch();
  }

  // Chat

  timeFormatter = this.gameData.formatTimeDecimals;

  handleMessageSend(messageBody: string): void {
    this.audio.playSound('menu-click');
    const chatMessage = this.rabbit.sendChatMessage(messageBody);
    this.chat.enqueueChatMessage(chatMessage);
    this.chatBubbles = this.chat.getChatMessages();
  }

  private async handleEnemyQuit(message: string) {
    this.quitGame();
    await this.modalService.showForceExitModal(message);
    this.router.navigate(['/home']);
  }
}
