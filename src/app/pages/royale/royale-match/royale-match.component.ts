import {
  Component,
  computed,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ChatHandlerService } from '../../../services/chat.service';
import { GameDataService } from '../../../services/game-data.service';
import { RabbitService } from '../../../services/rabbit.service';
import { PathService } from '../../../services/path.service';
import { NavigationService } from '../../../services/navigation.service';
import { AudioService } from '../../../services/audio.service';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import { VisibilityService } from '../../../services/visibility.service';
import { LanguageService } from '../../../services/language.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatchGridComponent } from '../../../components/match-grid/match-grid.component';
import { Cell, EntryPoint, Side, Tile } from '../../../models/cell.model';
import { Path } from '../../../models/path.model';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal-service.service';
import {
  Aggregated,
  createDefaultAggregated,
} from '../../../models/game-data.model';
import { createDefaultPlayer, Player } from '../../../models/player.model';
import { CountdownCodyComponent } from '../../../components/countdown-cody/countdown-cody.component';
import { MatchManagerService } from '../../../services/match-manager.service';

@Component({
  selector: 'app-royale-match',
  imports: [
    MatchGridComponent,
    CommonModule,
    TranslateModule,
    CountdownCodyComponent,
  ],
  standalone: true,
  templateUrl: './royale-match.component.html',
  styleUrl: './royale-match.component.scss',
})
export class RoyaleMatchComponent implements OnInit, OnDestroy {
  private rabbit = inject(RabbitService);
  private gameData = inject(GameDataService);

  private path = inject(PathService);
  private chat = inject(ChatHandlerService);
  private navigation = inject(NavigationService);
  private audio = inject(AudioService);
  private modalService = inject(ModalService);
  private session = inject(SessionService);
  private translate = inject(TranslateService);
  private auth = inject(AuthService);
  private visibility = inject(VisibilityService);
  private router = inject(Router);
  private zone = inject(NgZone);
  private matchManager = inject(MatchManagerService);

  // Timers
  private startCountdownTimer: any;
  private gameTimer: any;
  private nextGameTimerValue: number = 0;

  // Template-bound fields (formerly $scope)
  userLogged: boolean = false;
  userNickname: string = '';
  gameTimerValue = signal(0);
  showDraggableRoby = true;
  general: any;
  aggregated: Aggregated = createDefaultAggregated();
  user: Player = createDefaultPlayer();
  match: any;
  playerPath?: Path;
  enemyPaths?: Path[];

  timerFormatter: any;
  finalTimeFormatter: any;
  playerRoby: any;
  enemiesRoby: any;
  clockAnimation: string = '';

  nickname: string = '';
  tilesCss: string[][] = [];
  startPositionsCss: string[][] = [];

  showCompleteGrid = false;
  showArrows = false;
  draggableRobyImage = 'roby-idle';

  countdownInProgress = true;

  exitGameModal = false;
  forceExitModal = false;
  languageModal = false;
  askedForSkip = false;

  basePlaying: boolean;

  executeAnimation: boolean = false;

  // Grid
  rows = 5;
  cols = 5;
  entryPoints: EntryPoint[] = [];
  grid: Tile[][] = [];

  smallGrid: Cell[][] = [];
  Side = Side; // expose enum to template

  // Timers
  userTimerValue = 0;
  enemyTimerValue = 0;
  userTimerAnimation = '';
  enemyTimerAnimation = '';

  startAnimation = false;
  currentSide: Side | null = null;
  currentIndex: number | null = null;
  isOverArrow = false;
  isDragging = false;

  subs = new Subscription();

  @ViewChild(MatchGridComponent) matchGrid!: MatchGridComponent;

  constructor() {
    this.basePlaying = this.audio.isEnabled();
  }

  ngOnInit(): void {
    this.buildGrid();
    this.buildSmallGrid();
    this.buildEntryPoints();
    this.calculateAllStartPositionCss(false);
    this.subs.add(
      this.gameData.gameData$.subscribe(() => {
        // Initialize UI data
        this.general = this.gameData.value.general;
        this.aggregated = this.gameData.value.aggregated;
        this.user = this.gameData.value.user;
        this.match = this.gameData.value.match;

        this.gameTimerValue.set(this.general.timerSetting);
        this.nextGameTimerValue = this.general.timerSetting;

        this.timerFormatter = this.gameData.formatTimeMatchClock;
        this.finalTimeFormatter = this.gameData.formatTimeDecimals;

        //  this.playerRoby = this.path.getPlayerRoby();
        //  this.enemiesRoby = this.path.getEnemiesRoby();
      })
    );

    this.subs.add(
      this.path.path$.subscribe((p) => {
        this.playerPath = p;
      })
    );

    this.subs.add(
      this.path.enemiesPaths$.subscribe((paths) => {
        this.enemyPaths = paths;
      })
    );

    this.basePlaying = this.audio.isEnabled();

    this.setupRabbitCallbacks();
    this.initializeTilesCss();
  }

  ngOnDestroy(): void {
    this.quitGame();
    this.rabbit.quitGame();
  }

  // -------------------------------
  // UTILITY / INIT
  // -------------------------------

  private quitGame() {
    if (this.startCountdownTimer) {
      clearInterval(this.startCountdownTimer);
      this.startCountdownTimer = undefined;
    }

    if (this.gameTimer) {
      clearTimeout(this.gameTimer);
      this.gameTimer = undefined;
    }

    this.rabbit.quitGame();
    // this.path.quitGame();
    this.chat.clearChat();
    this.gameData.initializeMatchData();
  }

  private buildGrid() {
    this.grid = Array.from({ length: this.rows }, (_, row) =>
      Array.from({ length: this.cols }, (_, col) => ({ row, col }))
    );
  }

  private buildSmallGrid(): void {
    const placeholder = { placeholder: true } as Cell;
    const numRows = this.rows;
    const numCols = this.cols;

    this.smallGrid = [];

    this.smallGrid.push([
      placeholder,
      ...Array.from({ length: numCols }, (_, col) => ({
        id: `start-0${col}`,
        start: true,
      })),
      placeholder,
    ]);

    for (let row = 0; row < numRows; row++) {
      const newRow: Cell[] = [];
      newRow.push({ id: `start-3${row}`, start: true });
      for (let col = 0; col < numCols; col++)
        newRow.push({ tile: { row, col } });
      newRow.push({ id: `start-1${row}`, start: true });
      this.smallGrid.push(newRow);
    }

    this.smallGrid.push([
      placeholder,
      ...Array.from({ length: numCols }, (_, col) => ({
        id: `start-2${col}`,
        start: true,
      })),
      placeholder,
    ]);
  }

  private buildEntryPoints() {
    this.entryPoints = [];
    for (let col = 0; col < this.cols; col++) {
      this.entryPoints.push({ side: Side.Top, distance: col });
      this.entryPoints.push({ side: Side.Bottom, distance: col });
    }
    for (let row = 0; row < this.rows; row++) {
      this.entryPoints.push({ side: Side.Left, distance: row });
      this.entryPoints.push({ side: Side.Right, distance: row });
    }
  }

  private calculateAllStartPositionCss(over = false) {
    this.startPositionsCss = Array.from({ length: 4 }, () =>
      Array.from({ length: this.cols }, () => '')
    );

    for (let side = 0; side < 4; side++) {
      for (let distance = 0; distance < this.cols; distance++) {
        this.setArrowCss(side, distance, over);
      }
    }
  }

  private setArrowCss(side: Side, distance: number, over: boolean) {
    let arrowSide = '';
    switch (side) {
      case Side.Top:
        arrowSide = 'down';
        break;
      case Side.Left:
        arrowSide = 'left';
        break;
      case Side.Bottom:
        arrowSide = 'up';
        break;
      case Side.Right:
        arrowSide = 'right';
        break;
    }

    let finalResult = over
      ? `fas fa-chevron-circle-${arrowSide} playground--arrow-over`
      : `fas fa-angle-${arrowSide} playground--arrow`;

    if (this.showArrows) finalResult += ` floating-${arrowSide}-animation`;
    this.startPositionsCss[side][distance] = finalResult;
  }

  // inizializzazione tiles
  private initializeTilesCss(): void {
    const tiles = this.match.tiles;
    this.tilesCss = tiles.map((row: string[], x: number) =>
      row.map((cell, y) => {
        switch (cell) {
          case 'Y':
            return 'playground--tile-yellow';
          case 'R':
            return 'playground--tile-red';
          case 'G':
            return 'playground--tile-gray';
          default:
            return '';
        }
      })
    );
  }

  // -------------------------------
  // MATCH TIMER
  // -------------------------------

  startMatchTimer() {
    this.countdownInProgress = false;
    const interval = 10;
    let expected = Date.now() + interval;

    const step = () => {
      const drift = Date.now() - expected;

      this.nextGameTimerValue -= interval + drift;

      if (this.nextGameTimerValue > 0) {
        if (this.nextGameTimerValue < 10000) {
          this.clockAnimation = 'clock-ending-animation';
        }

        this.gameTimerValue.set(this.nextGameTimerValue);

        if (!this.startAnimation) {
          expected = Date.now() + interval;
          this.gameTimer = setTimeout(step, interval);
        } else {
          this.clockAnimation = 'clock--end';
        }
      } else {
        this.gameTimerValue.set(0);
        this.clockAnimation = 'clock--end';

        if (!this.gameData.value.match.positioned) {
          this.gameData.update('match', {
            positioned: true,
            time: 0,
            startPosition: { side: -1, distance: -1 },
          });

          this.gameData.update('userMatchResult', {
            nickname: this.user.nickname,
            playerId: this.user.playerId,
            time: 0,
            pathLength: 0,
            startPosition: { side: -1, distance: -1 },
            points: 0,
          });

          this.gameData.update('aggregated', {
            positionedPlayers: this.aggregated.positionedPlayers + 1,
          });

          this.showCompleteGrid = true;
          this.showArrows = false;
          this.showDraggableRoby = false;
          this.calculateAllStartPositionCss(false);
          this.rabbit.sendPlayerPositionedMessage();
        }
      }
    };

    this.gameTimer = setTimeout(step, interval);
  }

  // -------------------------------
  // DRAG / DROP
  // -------------------------------

  startDragging() {
    this.audio.playSound('roby-drag');
    this.showCompleteGrid = true;
    this.draggableRobyImage = 'roby-dragging-trasp';
    this.showArrows = true;
    this.calculateAllStartPositionCss(false);
  }

  robyOver(side: number, distance: number) {
    this.audio.playSound('roby-over');
    this.draggableRobyImage = 'roby-over';
    this.setArrowCss(side, distance, true);
  }

  robyOut(side: number, distance: number) {
    this.draggableRobyImage = 'roby-dragging-trasp';
    this.setArrowCss(side, distance, false);
  }

  endDragging() {
    this.audio.playSound('roby-drop');
    if (!this.startAnimation) {
      this.showArrows = false;
      this.showCompleteGrid = false;
      this.draggableRobyImage = 'roby-idle';
      this.calculateAllStartPositionCss(false);
    }
  }

  robyDropped(side: number, distance: number) {
    this.audio.playSound('roby-positioned');
    this.showDraggableRoby = false;
    this.showCompleteGrid = true;

    if (!this.startAnimation) {
      this.gameData.update('match', {
        positioned: true,
        time: this.nextGameTimerValue,
        startPosition: { side, distance },
      });

      this.path.computePath(this.gameData.value.match.startPosition);

      this.gameData.update('userMatchResult', {
        nickname: this.user.nickname,
        playerId: this.user.playerId,
        time: this.gameData.value.match.time,
        pathLength: this.path.value.pathLength,
        startPosition: this.gameData.value.match.startPosition,
        points: this.gameData.calculateMatchPoints(this.path.value.pathLength),
      });

      this.gameData.update('aggregated', {
        positionedPlayers: this.aggregated.positionedPlayers + 1,
      });

      this.rabbit.sendPlayerPositionedMessage();
    }
  }

  onDragStarted() {
    this.isDragging = true;
    this.audio.playSound('roby-drag');
    this.draggableRobyImage = 'roby-dragging-trasp';
    this.showArrows = true;
    this.calculateAllStartPositionCss(false);
  }

  onDragEnded() {
    if (
      this.isOverArrow &&
      this.currentSide !== null &&
      this.currentIndex !== null
    ) {
      this.onTileDropped(this.currentSide, this.currentIndex);
    } else {
      this.endDragging();
    }
  }

  onTileDropped(sideValue: Side, distanceValue: number) {
    this.audio.playSound('roby-positioned');
    this.showArrows = false;
    this.draggableRobyImage = 'roby-idle';
    this.showDraggableRoby = false;

    // Update match
    this.gameData.update('match', {
      positioned: true,
      time: this.userTimerValue,
      startPosition: { side: sideValue, distance: distanceValue },
    });

    // Compute path
    this.path.computePath(this.gameData.value.match.startPosition);

    // notify opponent via Rabbit
    this.rabbit.sendPlayerPositionedMessage();
  }

  // rabbit callbacks
  private setupRabbitCallbacks() {
    this.rabbit.setPageCallbacks({
      onEnemyPositioned: () => {
        this.gameData.update('aggregated', {
          positionedPlayers: this.aggregated.positionedPlayers + 1,
        });
      },

      onPlayerRemoved: (msg: any) => {
        if (msg.removedPlayerId === this.user.playerId) {
          this.quitGame();
          this.handleEnemyQuit(this.translate.instant('ENEMY_LEFT'));
        } else {
          this.gameData.update('aggregated', msg.aggregated);
        }
      },

      onGameQuit: () => {
        this.handleEnemyQuit(this.translate.instant('ENEMY_LEFT'));
      },

      onConnectionLost: () => {
        this.quitGame();
        this.handleEnemyQuit(this.translate.instant('ENEMY_LEFT'));
      },

      onStartAnimation: (msg: any) => {
        this.startAnimation = true;
        this.clockAnimation = 'clock--end';
        this.gameTimerValue.set(msg.matchTime);
        this.gameData.update('aggregated', msg.aggregated);
        this.executeAnimation = true;

        this.path.positionAllEnemies(msg.startPositions);
      },

      onEndMatch: (msg: any) => {
        // this.matchManager.determineWinner();
        this.gameData.update('aggregated', msg.aggregated);
        this.gameData.update('match', { winnerId: msg.winnerId });
        this.gameData.update('matchRanking', msg.matchRanking);
        this.gameData.update('globalRanking', msg.globalRanking);

        if (msg.winnerId === this.user.playerId) {
          this.gameData.update('userMatchResult', {
            points:
              this.gameData.value.userMatchResult.points +
              this.gameData.calculateWinnerBonusPoints(
                this.gameData.value.userMatchResult.time
              ),
          });
        }

        this.gameData.update('userGlobalResult', {
          nickname: this.user.nickname,
          playerId: this.user.playerId,
          points:
            this.gameData.value.userMatchResult.points +
            this.gameData.value.userGlobalResult.points,
        });

        // this.path.quitGame();

        if (!this.forceExitModal) {
          this.router.navigate(['/royale-aftermatch'], {
            state: {
              matchRanking: msg.matchRanking,
              globalRanking: msg.globalRanking,
              userMatchResult: this.gameData.value.userMatchResult,
              userGlobalResult: this.gameData.value.userGlobalResult,
              aggregated: msg.aggregated,
            },
          });
        }
      },
    });
  }

  skip() {
    this.audio.playSound('menu-click');
    this.quitGame();
    // wait for the enemy animation to end or skip it
    this.rabbit.sendEndAnimationMessage();
  }

  private async handleEnemyQuit(message: string) {
    this.quitGame();
    await this.modalService.showForceExitModal(message);
    this.router.navigate(['/home']);
  }

  formattedStartTimer = computed(() =>
    this.gameData.formatTimeSeconds(this.gameTimerValue())
  );
}
