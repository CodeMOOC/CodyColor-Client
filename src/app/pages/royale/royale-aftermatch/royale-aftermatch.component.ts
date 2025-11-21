import {
  Component,
  DestroyRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ChatHandlerService } from '../../../services/chat.service';
import { GameDataService } from '../../../services/game-data.service';
import { RabbitService } from '../../../services/rabbit.service';
import { AudioService } from '../../../services/audio.service';
import { AuthService } from '../../../services/auth.service';
import { NavigationService } from '../../../services/navigation.service';
import { SessionService } from '../../../services/session.service';
import { VisibilityService } from '../../../services/visibility.service';
import { LanguageService } from '../../../services/language.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChatComponent } from '../../../components/chat/chat.component';
import { Player } from '../../../models/player.model';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../services/modal-service.service';

@Component({
  selector: 'app-royale-aftermatch',
  imports: [ChatComponent, CommonModule, TranslateModule],
  standalone: true,
  templateUrl: './royale-aftermatch.component.html',
  styleUrl: './royale-aftermatch.component.scss',
})
export class RoyaleAftermatchComponent implements OnInit, OnDestroy {
  private rabbit = inject(RabbitService);
  private gameData = inject(GameDataService);
  private navigation = inject(NavigationService);
  private audio = inject(AudioService);
  private session = inject(SessionService);
  private chatHandler = inject(ChatHandlerService);
  private modalService = inject(ModalService);
  private translation = inject(LanguageService);
  private visibility = inject(VisibilityService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  private zone = inject(NgZone);

  // UI state
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

  // --- Chat ---
  chatBubbles: any[] = [];
  chatHints: any[] = [];

  // --- Game data ---
  user: Player | null = null;
  enemy: Player | null = null;
  winner: number | null = null;
  draw = false;
  matchCount = 0;
  userMatch: any;
  enemyMatch: any;
  userGlobal: any;
  enemyGlobal: any;
  general: any;

  matchRanking = signal<any[]>([]);
  globalRanking = signal<any[]>([]);

  userMatchResult = signal<any>(null);
  userGlobalResult = signal<any>(null);

  aggregated = signal<any>(null);

  sharedLegacy = signal<boolean>(false);

  private preventResetOnDestroy = false;

  private destroy$ = new Subject<void>();

  private newMatchTimer: any;

  timeFormatter = this.gameData.formatTimeDecimals;
  timeFormatterCountdown = this.gameData.formatTimeSeconds;

  constructor() {}

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

    this.registerRabbitCallbacks();

    this.basePlaying = this.audio.isEnabled();
  }

  ngOnDestroy(): void {
    if (!this.preventResetOnDestroy) {
      this.quitGame();
    }
  }
  // initialization
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
      this.winner = data.match.winnerId;
      this.matchCount = data.aggregated.matchCount;

      this.matchRanking.set(data.matchRanking);
      this.globalRanking.set(data.globalRanking);
      this.userMatchResult.set(data.userMatchResult);
      this.userGlobalResult.set(data.userGlobalResult);
      this.aggregated.set(data.aggregated);
    });

    // Play win/lose sounds
    if (this.winner?.toString() === this.user?.nickname)
      this.audio.playSound('win');
    else if (this.winner?.toString() === this.enemy?.nickname)
      this.audio.playSound('lost');
  }

  // countdown
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

  private clearNewMatchTimer() {
    if (this.newMatchTimer) {
      clearInterval(this.newMatchTimer);
      this.newMatchTimer = null;
    }
  }

  private registerRabbitCallbacks(): void {
    this.rabbit.setPageCallbacks({
      onReadyMessage: () => {
        this.zone.run(() => (this.enemyRequestNewMatch = true));
      },

      onStartMatch: (message: any) => {
        this.gameData.update('match', {
          tiles: this.gameData.formatMatchTiles(message.tiles),
        });
        this.preventResetOnDestroy = true;

        this.router.navigateByUrl('/royale-match');
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
          this.chatHandler.enqueueChatMessage(message);
          this.chatBubbles = this.chatHandler.getChatMessages();
        });
      },
    });

    this.chatBubbles = this.chatHandler.getChatMessages();
    this.chatHints = this.chatHandler.getChatHintsPreMatch();
  }

  handleMessageSend(body: string) {
    const chatMessage = this.rabbit.sendChatMessage(body);
    this.chatHandler.enqueueChatMessage(chatMessage);
    this.chatBubbles = this.chatHandler.getChatMessages();
  }

  // Returns true if current user is present in the match ranking
  userInMatchPodium(): boolean {
    const ranking = this.matchRanking();
    const me = this.user?.playerId;
    if (!ranking || me === undefined || me === null) return false;
    return ranking.some((player) => player.playerId === me);
  }

  // Returns true if current user is present in the global ranking
  userInGlobalPodium(): boolean {
    const ranking = this.globalRanking();
    const me = this.user?.playerId;
    if (!ranking || me === undefined || me === null) return false;
    return ranking.some((player) => player.playerId === me);
  }

  private quitGame() {
    this.rabbit.quitGame();
    this.gameData.initializeMatchData();
    this.chatHandler.clearChat();
    this.clearNewMatchTimer();
  }

  private async handleEnemyQuit(message: string) {
    this.quitGame();
    await this.modalService.showForceExitModal(message);
    this.router.navigate(['/home']);
  }

  newMatch() {
    this.audio.playSound('menu-click');
    this.gameData.update('aggregated', {
      readyPlayers: this.gameData.value.aggregated.readyPlayers + 1,
    });

    this.newMatchClicked = true;
    this.rabbit.sendReadyMessage();
  }

  share() {
    this.audio.playSound('menu-click');

    const text = `I took ${
      this.userMatchResult().pathLength
    } steps with my Roby in a ${this.general().gameType} match!`;

    if (navigator.share) {
      navigator.share({
        title: 'CodyColor Multiplayer',
        text,
        url: 'https://codycolor.codemooc.net',
      });
    } else {
      this.sharedLegacy.set(true);
      this.copyToClipboard(
        `${text} Play with me at https://codycolor.codemooc.net`
      );
    }
  }

  private copyToClipboard(text: string) {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);

    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
