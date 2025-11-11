import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GameDataService } from '../../../services/game-data.service';
import { AudioService } from '../../../services/audio.service';
import { SessionService } from '../../../services/session.service';
import { PathService } from '../../../services/path.service';
import { MatchManagerService } from '../../../services/match-manager.service';
import { MatchGridComponent } from '../../../components/match-grid/match-grid.component';
import { Player } from '../../../models/player.model';
import { Match, MatchResult } from '../../../models/match.model';
import { Cell, EntryPoint, Side, Tile } from '../../../models/cell.model';
import { Path } from '../../../models/path.model';
import { GeneralSettings } from '../../../models/game-data.model';
import { RabbitService } from '../../../services/rabbit.service';
import { ChatHandlerService } from '../../../services/chat.service';

@Component({
  selector: 'app-arcade-match',
  standalone: true,
  imports: [CommonModule, MatchGridComponent, TranslateModule],
  templateUrl: './arcade-match.component.html',
  styleUrls: ['./arcade-match.component.scss'],
})
export class ArcadeMatchComponent implements OnInit, OnDestroy {
  @ViewChild(MatchGridComponent) matchGrid!: MatchGridComponent;
  @ViewChildren('arrowCell', { read: ElementRef })
  arrowElements!: QueryList<ElementRef>;

  // Grid
  rows = 5;
  cols = 5;
  grid: Tile[][] = [];
  smallGrid: Cell[][] = [];
  entryPoints: EntryPoint[] = [];

  // Players & match
  user!: Player;
  enemy!: Player;
  userMatchResult!: MatchResult;
  enemyMatchResult!: MatchResult;
  match!: Match;
  playerPath?: Path;
  enemyPaths?: Path[];
  general!: GeneralSettings;

  // UI flags
  countdownInProgress = true;
  startCountdownText = '';
  showDraggableRoby = true;
  showArrows = false;
  draggableRobyImage = 'roby-idle';
  exitGameModal = false;
  forceExitModal = false;
  languageModal = false;
  basePlaying = false;

  isAnimationReady = false;

  executeAnimation = false;
  Side = Side; // expose enum to template

  // Timers
  userTimerValue = 0;
  enemyTimerValue = 0;
  userTimerAnimation = '';
  enemyTimerAnimation = '';

  timerFormatter: (time: number) => string = (t) => t.toString();

  startAnimation = false;
  currentSide: Side | null = null;
  currentIndex: number | null = null;
  isOverArrow = false;
  isDragging = false;
  positionEnemyTrigger = 0;
  forceExitText: string = '';

  // CSS
  tilesCss: string[][] = [];
  startPositionsCss: string[][] = [];

  subs = new Subscription();
  private destroy$ = new Subject<void>();

  constructor(
    private audio: AudioService,
    private chat: ChatHandlerService,
    private gameData: GameDataService,
    private path: PathService,
    private matchManager: MatchManagerService,
    private rabbit: RabbitService,
    private router: Router,
    private session: SessionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.session.isSessionInvalid()) {
      this.quitGame();
      this.router.navigate(['/']);
      return;
    }

    this.buildGrid();
    this.buildSmallGrid();
    this.buildEntryPoints();
    this.calculateAllStartPositionCss(false);

    this.subs.add(
      this.gameData.gameData$.subscribe((data) => {
        this.user = data.user;
        this.enemy = data.enemy;
        this.userMatchResult = data.userMatchResult;
        this.enemyMatchResult = data.enemyMatchResult;
        this.general = data.general;
        this.match = data.match;
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
    this.timerFormatter = this.gameData.formatTimeMatchClock;

    this.startCountdown();
    this.initializeTilesCss();
    this.registerRabbitCallbacks();
  }

  ngOnDestroy(): void {
    this.matchManager.stopAll();
    this.subs.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
    this.gameData.stopTimer();
    this.executeAnimation = false;
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

  private startCountdown() {
    let countdownValue = 3;
    this.countdownInProgress = true;
    this.startCountdownText = countdownValue.toString();
    this.audio.playSound('countdown');

    const intervalId = setInterval(() => {
      countdownValue--;
      if (countdownValue > 0) {
        this.startCountdownText = countdownValue.toString();
        this.audio.playSound('countdown');
      } else if (countdownValue === 0) {
        this.startCountdownText = "Let's Cody!";
        this.audio.playSound('start');
      } else {
        clearInterval(intervalId);
        this.countdownInProgress = false;
        this.startMatchTimers();
      }
    }, 1000);
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

  private startMatchTimers(): void {
    this.matchManager.startMatchTimers(
      0, // No bot
      this.general.timerSetting,
      (ms) => this.updateUserTimer(ms),
      (ms) => this.updateEnemyTimer(ms),
      () => this.matchManager.handleUserTimeout(this.user)
    );
  }

  // metodo per terminare la partita in modo sicuro, disattivando i timer,
  // interrompendo animazioni e connessioni con il server
  private quitGame(): void {
    this.gameData.reset();
    if (this.startCountdownText !== '') {
      this.startCountdownText = '';
    }

    if (this.userTimerValue !== 0) {
      this.userTimerValue = 0;
    }

    if (this.enemyTimerValue !== 0) {
      this.enemyTimerValue = 0;
    }

    this.rabbit.quitGame();
    // this.path.quitGame();
    this.chat.clearChat();
    this.gameData.initializeMatchData();
  }

  private registerRabbitCallbacks(): void {
    this.rabbit.setPageCallbacks({
      onEnemyPositioned: (message: any) => {
        this.gameData.update('match', {
          enemyTime: message.matchTime,
          enemyPositioned: true,
        });
        this.enemyTimerAnimation = 'clock--end';
        this.enemyTimerValue = message.matchTime;

        if (this.match?.positioned) {
          this.executeAnimation = true;
          this.isAnimationReady = true;
          // Trigger visual animation sequence in MatchGrid
          this.matchGrid.executeEndSequence('enemy');
        }
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

      onStartAnimation: (message: any) => {
        // this.matchManager.startMatchTimers(
        //   0, // No bot
        //   this.general.timerSetting,
        //   (ms) => this.updateUserTimer(ms),
        //   (ms) => this.updateEnemyTimer(ms),
        //   () => this.matchManager.handleUserTimeout(this.user)
        // );

        this.executeAnimation = true;
        this.path.positionAllEnemies(message.startPositions);
      },

      onEndMatch: (message: any) => {
        this.gameData.update('aggregated', message.aggregated);
        this.gameData.update('match', { winnerId: message.winnerId });
        this.gameData.updateMatchRanking(message.matchRanking);
        this.gameData.updateGlobalRanking(message.globalRanking);

        if (!this.forceExitModal) {
          this.router.navigate(['/arcade-aftermatch']);
        }
      },
    });
  }

  updateUserTimer(ms: number) {
    if (this.isAnimationReady || this.match.positioned) return;
    if (ms < 10000) this.userTimerAnimation = 'clock-ending-animation';
    this.userTimerValue = ms;
  }

  updateEnemyTimer(ms: number) {
    if (this.isAnimationReady || this.match.enemyPositioned) return;
    if (ms < 10000) this.enemyTimerAnimation = 'clock-ending-animation';
    this.enemyTimerValue = ms;
  }

  // Drag events
  onDragStarted() {
    this.isDragging = true;
    this.audio.playSound('roby-drag');
    this.draggableRobyImage = 'roby-dragging-trasp';
    this.showArrows = true;
    this.calculateAllStartPositionCss(false);
  }

  onRobyOver(side: Side, distance: number) {
    this.audio.playSound('roby-over');
    this.draggableRobyImage = 'roby-over';
    this.setArrowCss(side, distance, true);
  }

  onRobyOut(side: Side, distance: number) {
    this.draggableRobyImage = 'roby-dragging-trasp';
    this.setArrowCss(side, distance, false);
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

  endDragging() {
    this.audio.playSound('roby-drop');
    this.showArrows = false;
    this.draggableRobyImage = 'roby-idle';
    this.calculateAllStartPositionCss(false);
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

  skip() {
    this.audio.playSound('menu-click');
    this.quitGame();
    // wait for the enemy animation to end or skip it
    this.rabbit.sendEndAnimationMessage();
  }

  exitGame() {
    this.audio.playSound('menu-click');
    this.exitGameModal = true;
  }

  continueExitGame() {
    this.audio.playSound('menu-click');
    this.quitGame();
    this.router.navigate(['/home']);
  }

  stopExitGame() {
    this.audio.playSound('menu-click');
    this.exitGameModal = false;
  }
}
