import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { GameDataService } from '../../../services/game-data.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../services/audio.service';
import { SessionService } from '../../../services/session.service';
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
import { Path } from '../../../models/path.model';
import { MatchManagerService } from '../../../services/match-manager.service';
import { MatchGridComponent } from '../../../components/match-grid/match-grid.component';
import { CountdownCodyComponent } from '../../../components/countdown-cody/countdown-cody.component';

@Component({
  selector: 'app-match',
  imports: [
    CommonModule,
    MatchGridComponent,
    TranslateModule,
    DragDropModule,
    CountdownCodyComponent,
  ],
  templateUrl: './bootmp-match.component.html',
  styleUrls: ['./bootmp-match.component.scss'],
  standalone: true,
})
export class BootmpMatchComponent implements OnInit, OnDestroy {
  rows = 5;
  cols = 5;

  countdownInProgress = true;

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
    private audio: AudioService,
    private gameData: GameDataService,
    private path: PathService,
    private matchManager: MatchManagerService,
    private router: Router,
    private session: SessionService
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

    this.initializeTilesCss();

    if (this.botSetting !== 0) {
      this.enemyPath = this.path.calculateBotPath(this.botSetting);
      this.setupEnemyTrigger();
    }
  }

  ngOnDestroy(): void {
    this.matchManager.stopAll();
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
  startMatchTimers(): void {
    this.countdownInProgress = false;
    this.matchManager.startMatchTimers(
      this.general.botSetting,
      this.general.timerSetting,
      (ms) => this.updateUserTimer(ms),
      (ms) => this.updateEnemyTimer(ms),
      () => this.matchManager.handleUserTimeout(this.user)
    );
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

  onDragStarted() {
    this.isDragging = true;
    this.audio.playSound('roby-drag');
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

  skip(): void {
    this.audio.playSound('menu-click');
    this.quitGame();
    this.router.navigate(['/bootmp-aftermatch']);
  }
}
