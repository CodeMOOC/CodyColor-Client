import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';

import { GameDataService } from '../../../services/game-data.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../services/navigation.service';
import { AudioService } from '../../../services/audio.service';
import { SessionService } from '../../../services/session.service';
import { LanguageService } from '../../../services/language.service';
import { VisibilityService } from '../../../services/visibility.service';
import { PathService } from '../../../services/path.service';
import {
  CdkDrag,
  DragDropModule,
  CdkDropList,
  CdkDropListGroup,
  CdkDragMove,
} from '@angular/cdk/drag-drop';
import { Player } from '../../../models/player.model';
import { Match } from '../../../models/match.model';
import { Cell, EntryPoint, Side, Tile } from '../../../models/cell.model';
import { GeneralSettings } from '../../../models/game-data.model';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { RobyAnimationComponent } from '../../../components/roby-animation/roby-animation.component';
import { Path } from '../../../models/path.model';

@Component({
  selector: 'app-match',
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    TranslateModule,
    CdkDropListGroup,
    DragDropModule,
    RobyAnimationComponent,
  ],
  templateUrl: './bootmp-match.component.html',
  styleUrls: ['./bootmp-match.component.scss'],
  standalone: true,
})
export class BootmpMatchComponent implements OnInit, OnDestroy {
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;
  @ViewChild('player') playerAnim?: RobyAnimationComponent;
  @ViewChild('enemy') enemyAnim?: RobyAnimationComponent;

  connectedIds: any;

  rows = 5;
  cols = 5;

  countdownInProgress = true;
  startCountdownText = '';
  userLogged = false;

  showDraggableRoby = true;
  //dati di gioco
  user!: Player;
  enemy!: Player;
  general!: GeneralSettings;
  match!: Match;
  playerPath?: Path;
  enemyPath?: Path;

  //punti attuali
  userPoints = 0;
  enemyPoints = 0;
  // timer giocatori
  userTimerValue = 0;
  enemyTimerValue = 0;
  userTimerAnimation = '';
  enemyTimerAnimation = '';

  botSetting!: number;

  executeAnimation = false;

  // stili dinamici per griglia e frecce
  tilesCss: string[][] = [];
  startPositionsCss: string[][] = [];

  // flag per logica UI
  showCompleteGrid = false;
  showArrows = false;
  isAnimationReady = false;

  draggableRobyImage = 'roby-idle';
  exitGameModal = false;
  languageModal = false;
  basePlaying = false;

  isDragging = false;

  Side = Side; // expose enum to template

  arrowDropLists: string[] = [];

  private positionEnemyTrigger!: number;

  smallGrid: Cell[][] = [];
  grid: Tile[][] = [];
  entryPoints: EntryPoint[] = [];

  subs = new Subscription();

  @ViewChildren('arrowCell', { read: ElementRef })
  arrowElements!: QueryList<ElementRef>;

  currentSide: Side | null = null;
  currentIndex: number | null = null;
  rectCurrentArrow: any;

  isOverArrow = false;

  timerFormatter!: (time: number) => string;

  // create a calculator for side and distance
  listStartPosition = [{ side: 0, distance: 0 }];

  private destroy$ = new Subject<void>();

  constructor(
    private gameData: GameDataService,
    private path: PathService,
    private audio: AudioService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Costruisce griglia statica
    this.buildGrid();
    // Celle con frecce
    this.buildEntryPoints();
    this.buildSmallGrid();

    this.executeAnimation = false;

    this.subs.add(
      this.gameData.gameData$
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.user = data.user;
          this.enemy = data.enemy;
          this.general = data.general;
          this.match = data.match;
          this.userPoints = data.userGlobalResult.points;
          this.enemyPoints = data.enemyGlobalResult.points;
        })
    );

    this.path.path$.subscribe((p) => {
      this.playerPath = p;

      if (this.playerPath.startPosition.side !== Side.None) {
        this.executeAnimation = true;
      }
    });

    this.botSetting = this.gameData.value.general.botSetting;
    this.timerFormatter =
      this.botSetting !== 0
        ? this.gameData.formatTimeDecimals
        : this.gameData.formatTimeMatchClock;

    if (this.session.isSessionInvalid()) {
      this.quitGame();
      this.router.navigate(['/']);
      return;
    }

    this.initializeTilesCss();

    // TO UNCOMMENT AFTER TESTING
    // this.startCountdown();
    this.countdownInProgress = false; // TO REMOVE AFTER TESTING
    // Recupera timer e dati dal servizio
    this.startMatchTimers();

    if (this.botSetting !== 0) {
      this.enemyPath = this.path.calculateBotPath(this.botSetting);
      this.setupEnemyTrigger();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
    this.gameData.stopTimer();
  }

  private quitGame(): void {
    // this.path.quitGame();
    this.gameData.reset();
  }

  private buildGrid() {
    //{ length: this.rows } dice quante celle creare e (_, row) calcola il contenuto
    this.grid = Array.from({ length: this.rows }, (_, row) =>
      Array.from({ length: this.cols }, (_, col) => ({ row, col }))
    );
  }

  // mappa di gioco con celle start e celle giocabili con bordi e placeholder
  buildSmallGrid(): void {
    const placeholder = { placeholder: true } as Cell;
    const numRows = this.rows;
    const numCols = this.cols;

    this.smallGrid = [];

    // Top border
    this.smallGrid.push([
      placeholder,
      ...Array.from({ length: numCols }, (_, col) => ({
        id: `start-0${col}`,
        start: true,
      })),
      placeholder,
    ]);

    // Playable rows
    for (let row = 0; row < numRows; row++) {
      const newRow: Cell[] = [];
      newRow.push({ id: `start-3${row}`, start: true }); // left
      for (let col = 0; col < numCols; col++)
        newRow.push({ tile: { row, col } });
      newRow.push({ id: `start-1${row}`, start: true }); // right
      this.smallGrid.push(newRow);
    }

    // Bottom border
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
    // posizioni di ingresso del robot ai bordi della griglia
    this.entryPoints = [];

    // Top
    for (let col = 0; col < this.cols; col++) {
      this.entryPoints.push({ side: Side.Top, distance: col });
    }

    // Bottom
    for (let col = 0; col < this.cols; col++) {
      this.entryPoints.push({ side: Side.Bottom, distance: col });
    }

    // Left
    for (let row = 0; row < this.rows; row++) {
      this.entryPoints.push({ side: Side.Left, distance: row });
    }

    // Right
    for (let row = 0; row < this.rows; row++) {
      this.entryPoints.push({ side: Side.Right, distance: row });
    }
  }

  // change arrow icon based on position
  getArrowIcon(side: Side): string {
    switch (side) {
      case Side.Top:
        return 'keyboard_arrow_down';
      case Side.Bottom:
        return 'keyboard_arrow_up';
      case Side.Left:
        return 'keyboard_arrow_right';
      case Side.Right:
        return 'keyboard_arrow_left';
      default:
        return '';
    }
  }

  // assegna classi CSS alle celle della griglia
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

  // tempo di gioco del bot basato sulla difficoltà selezionata
  private setupEnemyTrigger(): void {
    const tm = this.general.timerSetting;
    const bot = this.general.botSetting;
    this.positionEnemyTrigger = tm * (bot / (bot + 1));
  }

  // avvia i timer per visualizzare tempo rimanente di giocatore e avversario; questo timer non utilizza
  // direttamente la funzione setInterval(), ma implementa un procedimento per evitare l'interruzione del tempo
  // a tab inattivo
  private startMatchTimers(): void {
    // Start the shared timer inside the service
    this.gameData.startTimer(this.general.timerSetting);

    // React to the user countdown
    this.subs.add(
      this.gameData.getUserTimer().subscribe((ms) => {
        if (this.isAnimationReady) return; // stop updates once the end sequence starts
        if (!this.match.positioned) {
          // se sotto i dieci secondi animazione di allarme
          if (ms < 10000) this.userTimerAnimation = 'clock-ending-animation';
          this.userTimerValue = ms;
        }
        // se il tempo è finito
        if (ms <= 0) this.handleUserTimeout();
      })
    );

    // React to the enemy countdown (for bot only)
    if (this.general.botSetting !== 0) {
      this.subs.add(
        this.gameData.getEnemyTimer().subscribe((ms) => {
          if (this.isAnimationReady) return;
          if (!this.match.enemyPositioned) {
            if (ms < 10000) this.enemyTimerAnimation = 'clock-ending-animation';

            // auto-position the bot when the trigger time is reached
            if (ms <= this.positionEnemyTrigger) {
              const botPath = this.path.calculateBotPath(
                this.general.botSetting
              );
              this.gameData.update('match', {
                enemyPositioned: true,
                enemyTime: this.positionEnemyTrigger,
                enemyStartPosition: botPath.startPosition,
              });
              this.enemyTimerAnimation = 'clock--end';
            }

            this.enemyTimerValue = ms;
          }
        })
      );
    }
  }

  // giocatore non piazza il suo personaggio in tempo
  private handleUserTimeout(): void {
    if (!this.match.positioned) {
      this.gameData.update('match', {
        positioned: true,
        time: 0,
        startPosition: { side: -1, distance: -1 },
      });
      this.userTimerAnimation = 'clock--end';

      this.gameData.update('userMatchResult', {
        nickname: this.user.nickname,
        playerId: this.user.playerId,
        pathLength: 0,
        time: 0,
        points: 0,
        startPosition: { side: -1, distance: -1 },
      });
    }
    this.executeEndSequence();
  }

  private playerAnimationDone = false;
  private enemyAnimationDone = false;

  // cosa fare una volta terminata senza intoppi la partita; mostra la schermata aftermatch
  executeEndSequence(playerType?: string): void {
    // 2. trigger the child’s animation
    if (playerType === 'player') {
      this.playerAnim?.play();
      this.playerAnimationDone = true;
    }
    if (playerType === 'enemy') {
      this.enemyAnim?.play();
      this.enemyAnimationDone = true;
    }

    // !playerType: è scaduto il tempo quindi si passa alla nuova schermata
    if (
      !playerType ||
      this.botSetting === 0 ||
      (this.playerAnimationDone && this.enemyAnimationDone)
    ) {
      // prevent double execution
      if (this.isAnimationReady) return;
      this.isAnimationReady = true;

      const current = this.gameData.value; // safe for reading only

      // Handle enemy result if a bot is active
      if (current.general.botSetting !== 0 && this.enemyPath) {
        this.gameData.update('enemyMatchResult', {
          nickname: current.enemy.nickname,
          playerId: current.enemy.playerId,
          pathLength: this.enemyPath.pathLength,
          time: current.match.enemyTime,
          startPosition: current.match.enemyStartPosition,
        });
      }

      // Increment aggregated match counter
      this.gameData.update('aggregated', {
        matchCount: current.aggregated.matchCount + 1,
      });

      // Determine winner
      const winner = this.gameData.getMatchWinner();
      this.gameData.update('match', { winnerId: winner.playerId });
      //Scoring
      if (winner.playerId === current.user.playerId) {
        const userPoints =
          this.gameData.calculateMatchPoints(
            this.gameData.value.userMatchResult.pathLength
          ) +
          this.gameData.calculateWinnerBonusPoints(
            this.gameData.value.userMatchResult.time
          );

        this.gameData.update('userMatchResult', { points: userPoints });
        this.gameData.update('userGlobalResult', {
          points: current.userGlobalResult.points + userPoints,
          wonMatches: current.userGlobalResult.wonMatches + 1,
        });
      } else if (winner.playerId === current.enemy.playerId) {
        const enemyPoints =
          this.gameData.calculateMatchPoints(
            this.gameData.value.enemyMatchResult.pathLength
          ) +
          this.gameData.calculateWinnerBonusPoints(
            this.gameData.value.enemyMatchResult.time
          );

        this.gameData.update('enemyMatchResult', { points: enemyPoints });
        this.gameData.update('enemyGlobalResult', {
          points: current.enemyGlobalResult.points + enemyPoints,
          wonMatches: current.enemyGlobalResult.wonMatches + 1,
        });
      }

      // navigate to aftermatch screen
      this.router.navigate(['/bootmp-aftermatch']);
    }
  }

  onDragStarted(event: any) {
    this.isDragging = true;
    this.audio.playSound('roby-drag');
    this.showCompleteGrid = true;
    this.draggableRobyImage = 'roby-dragging-trasp';
    this.showArrows = true;
  }

  onDragEnded() {
    if (this.isOverArrow) {
      if (this.currentSide !== null && this.currentIndex !== null) {
        this.onTileDropped(this.currentSide, this.currentIndex);
      }
    }
  }

  //...a meno che, non venga rilasciato in una posizione valida. In quel caso, viene utilizzata un secondo tag
  // img, per mostrare roby nella sua posizione di partenza. Viene inoltre fermato il timer, e notificato
  // l'avversario dell'avvenuta presa di posizione
  onTileDropped(sideValue: Side, distanceValue: number): void {
    this.audio.playSound('roby-positioned');
    this.showCompleteGrid = true;

    if (!this.isAnimationReady) {
      const finalUserTime = this.gameData.getUserFinalTime();
      // aggiorna i dati della partita
      this.gameData.update('match', {
        positioned: true,
        time: finalUserTime,
        startPosition: {
          side: sideValue,
          distance: distanceValue,
        },
      });

      this.showDraggableRoby = false;
      this.userTimerAnimation = 'clock--end';
      this.userTimerValue = this.gameData.value.match.time;

      // calcolo risultato giocatore
      this.path.computePath(this.gameData.value.match.startPosition);

      this.gameData.update('userMatchResult', {
        nickname: this.gameData.value.user.nickname,
        playerId: this.gameData.value.user.playerId,
        pathLength: this.path.value.pathLength,
        time: this.gameData.value.match.time,
        startPosition: this.gameData.value.match.startPosition,
      });

      // posizionamento avversario (bot)
      if (
        !this.gameData.value.match.enemyPositioned &&
        this.gameData.value.general.botSetting !== 0
      ) {
        const botPath = this.path.calculateBotPath(
          this.gameData.value.general.botSetting
        );

        this.gameData.update('match', {
          enemyPositioned: true,
          enemyTime: this.positionEnemyTrigger,
          enemyStartPosition: botPath.startPosition,
        });

        this.enemyTimerValue = this.gameData.value.match.enemyTime;
        this.enemyTimerAnimation = 'clock--end';
      }
    }
  }

  onDragMoved(event: CdkDragMove) {
    const pointerX = event.pointerPosition.x;
    const pointerY = event.pointerPosition.y;

    let found = false;
    const arrowEls = document.querySelectorAll('.arrow-cell');
    arrowEls.forEach((el: any) => {
      const rect = el.getBoundingClientRect();
      if (
        pointerX >= rect.left &&
        pointerX <= rect.right &&
        pointerY >= rect.top &&
        pointerY <= rect.bottom
      ) {
        this.isOverArrow = true;

        this.currentSide = Number(el.dataset.side) as Side;
        this.currentIndex = Number(el.dataset.index);
        this.rectCurrentArrow = rect;

        found = true;
      }
    });

    if (!found) {
      // Pointer is over empty surface
      if (this.isOverArrow) {
        this.onEmptySurfaceHover();
      }

      this.isOverArrow = false;
      this.currentSide = null;
      this.currentIndex = null;
    }
  }

  onEmptySurfaceHover() {
    this.isOverArrow = false;
  }

  skip(): void {
    this.audio.playSound('menu-click');
    this.quitGame();
    this.router.navigate(['/bootmp-aftermatch']);
  }
}
