import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  AfterViewInit,
  NgZone,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';

import { GameDataService } from '../../../services/game-data.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../services/navigation.service';
import { AudioService } from '../../../services/audio.service';
import { SessionService } from '../../../services/session.service';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
import { VisibilityService } from '../../../services/visibility.service';
import { PathService } from '../../../services/path.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnd,
  CdkDragEnter,
  CdkDragExit,
  DragDropModule,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Player } from '../../../models/player.model';
import { GameSettings } from '../../../models/gameSettings.model';
import { Match } from '../../../models/match.model';
import { Cell, EntryPoint, Side, Tile } from '../../../models/cell.model';
import { sideToString } from '../../../utils/side.utils';
import { GeneralSettings } from '../../../models/game-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ExitGameModalComponent } from '../../../components/exit-game-modal/exit-game-modal.component';
import { Subscription } from 'rxjs';
import { RobyAnimationComponent } from '../../../components/roby-animation/roby-animation.component';

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
})
export class BootmpMatchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;

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

  //punti attuali
  userPoints = 0;
  enemyPoints = 0;
  // timer giocatori
  userTimerValue = 0;
  enemyTimerValue = 0;
  userTimerAnimation = '';
  enemyTimerAnimation = '';

  // stili dinamici per griglia e frecce
  tilesCss: string[][] = [];
  startPositionsCss: string[][] = [];

  // flag per logica UI
  showCompleteGrid = false;
  showArrows = false;
  startAnimation = false;

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

  userTimeLeft: any;
  enemyTimeLeft: any;

  subs = new Subscription();

  timerFormatter!: (time: number) => string;
  finalTimeFormatter!: (time: number) => string;

  draggable = {
    data: 'myDragData',
    effectAllowed: 'all',
    disable: false,
    handle: false,
  };

  // create a calculator for side and distance
  listStartPosition = [{ side: 0, distance: 0 }];

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  constructor(
    private cdr: ChangeDetectorRef,
    private gameData: GameDataService,
    private path: PathService,
    private navigation: NavigationService,
    private audio: AudioService,
    private session: SessionService,
    private auth: AuthService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private translation: LanguageService,
    private visibility: VisibilityService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.userTimeLeft = this.gameData.getUserTimer();
    this.enemyTimeLeft = this.gameData.getEnemyTimer();
  }

  ngOnInit(): void {
    console.log('Match component initialized');
    // Recupera timer e dati dal servizio
    this.subs.add(
      this.gameData.getUserTimer().subscribe((ms) => {
        this.userTimerValue = ms;
      })
    );

    this.subs.add(
      this.gameData.gameData$.subscribe((data) => {
        this.user = data.user;
        this.enemy = data.enemy;
        this.general = data.general;
        this.match = data.match;
      })
    );

    // Costruisce griglia statica
    this.buildGrid();
    // Celle con frecce
    this.buildEntryPoints();
    this.buildSmallGrid();

    if (this.session.isSessionInvalid()) {
      this.quitGame();
      this.router.navigate(['/']);
      return;
    }

    this.user = this.gameData.value.user;
    this.enemy = this.gameData.value.enemy;
    this.general = this.gameData.value.general;
    this.match = this.gameData.value.match;

    console.log('Match data:', this.match);
    this.userPoints = this.gameData.value.userGlobalResult.points;
    this.enemyPoints = this.gameData.value.enemyGlobalResult.points;

    this.initializeTilesCss();

    // TO UNCOMMENT AFTER TESTING
    // this.startCountdown();
    this.countdownInProgress = false; // TO REMOVE AFTER TESTING
    this.startMatchTimers(); // TO REMOVE AFTER TESTING

    this.setupEnemyTrigger();

    const botSetting = this.gameData.value.general.botSetting;

    this.timerFormatter =
      botSetting !== 0
        ? this.gameData.formatTimeDecimals
        : this.gameData.formatTimeMatchClock;

    this.finalTimeFormatter = this.gameData.formatTimeDecimals;
  }

  ngAfterViewInit() {
    // initialize once after view is ready
    this.updateConnectedIds();
    // Aggiorna le connessioni tra le drop list (appare la griglia)
    this.dropLists.changes.subscribe(() => this.updateConnectedIds());
    this.cdr.detectChanges();
  }

  // popola l'array connectedIds con gli id di tutte le drop list
  private updateConnectedIds() {
    setTimeout(() => {
      // array di tutti gli ID delle drop list presenti nella vista
      this.connectedIds = this.dropLists.map((dl) => dl.id);
      console.log('Connected IDs:', this.connectedIds);
    });
  }

  ngOnDestroy(): void {
    this.gameData.stopTimer();
  }

  private refreshDropConnections() {
    const dropListIds = this.dropLists.map((dl) => dl.id);
    this.dropLists.forEach((dl) => {
      dl.connectedTo = dropListIds;
    });
    this.arrowDropLists = dropListIds;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  @ViewChild('player') player!: any;

  movePlayer() {
    // esempio: muove il robottino da (0,0) a (3,2)
    const newX = 3 * 5;
    const newY = 2 * 5;
    const newAngle = 90;
    this.player.moveTo(newX, newY, newAngle);
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

  private quitGame(): void {
    this.path.quitGame();
    this.gameData.reset();
  }

  //...a meno che, non venga rilasciato in una posizione valida. In quel caso, viene utilizzata un secondo tag
  // img, per mostrare roby nella sua posizione di partenza. Viene inoltre fermato il timer, e notificato
  // l'avversario dell'avvenuta presa di posizione
  onTileDropped(
    event: CdkDragDrop<any>,
    sideValue: Side,
    distanceValue: number
  ): void {
    console.log('Tile dropped on side', sideValue, 'distance', distanceValue);
    this.audio.playSound('roby-positioned');
    this.showCompleteGrid = true;

    if (!this.startAnimation) {
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
      const playerResult = this.path.positionRoby(
        true,
        this.gameData.value.match.startPosition
      );

      this.gameData.update('userMatchResult', {
        nickname: this.gameData.value.user.nickname,
        playerId: this.gameData.value.user.playerId,
        pathLength: playerResult.pathLength,
        time: this.gameData.value.match.time,
        startPosition: this.gameData.value.match.startPosition,
      });

      console.log(
        'Final position set to:',
        this.gameData.value.userMatchResult
      );

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

      // DA RIMETTERE
      // this.startAnimationSequence();
    }
  }

  // private buildArrowCss(side: number, distance: number, over: boolean): string {
  //   console.log('Building arrow CSS for ', side, distance, over);
  //   const sides = ['down', 'left', 'up', 'right'];
  //   const arrowSide = sides[side] ?? '';
  //   let cls = over
  //     ? `fas fa-chevron-circle-${arrowSide} playground--arrow-over`
  //     : `fas fa-angle-${arrowSide} playground--arrow`;
  //   if (this.showArrows) cls += ` floating-${arrowSide}-animation`;
  //   return cls;
  // }

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

  // il tempo di gioco dell'avversario, che viene fissato a seconda della difficoltà (botSetting)
  private setupEnemyTrigger(): void {
    const tm = this.general.timerSetting;
    this.positionEnemyTrigger =
      (tm / (this.general.botSetting || 2)) * (this.general.botSetting / 1);
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
        if (this.startAnimation) return; // stop updates once the end sequence starts
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
          if (this.startAnimation) return;
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

  // cosa fare una volta terminata senza intoppi la partita; mostra la schermata aftermatch
  private executeEndSequence(): void {
    // prevent double execution
    if (this.startAnimation) return;
    this.startAnimation = true;

    const current = this.gameData.value; // safe for reading only

    // Handle enemy result if a bot is active
    if (current.general.botSetting !== 0) {
      const enemyResult = this.path.positionRoby(
        false,
        current.match.enemyStartPosition
      );

      this.gameData.update('enemyMatchResult', {
        nickname: current.enemy.nickname,
        playerId: current.enemy.playerId,
        pathLength: enemyResult.pathLength,
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

    // Animate and navigate
    this.path.animateActiveRobys(() => {
      this.router.navigate(['/bootmp-aftermatch']);
    });
  }

  onDragStarted(event: any) {
    this.isDragging = true;
    this.audio.playSound('roby-drag');
    this.showCompleteGrid = true;
    this.draggableRobyImage = 'roby-dragging-trasp';
    this.showArrows = true;

    // after grid is shown, update connections again
    setTimeout(() => this.updateConnectedIds());
  }

  // endDragging(): void {
  //   this.audioHandler.playSound('roby-drop');

  //   if (!this.startAnimation) {
  //     this.showArrows = false;
  //     this.showCompleteGrid = false;
  //     this.draggableRobyImage = 'roby-idle';
  //     this.startPositionsCss(false);
  //   }
  // }

  onDragEnded(event: any) {
    console.log('Drag ended', event);
    console.log(this.startAnimation);
    this.isDragging = false;
    this.draggableRobyImage = 'roby-idle';
    this.audio.playSound('roby-positioned');
    this.showCompleteGrid = true;

    if (!this.startAnimation) {
      // this.gameData.editMatch({
      //   positioned: true,
      //   time: this.nextGameTimerValue,
      //   startPosition: { side, distance },
      // });
      this.showDraggableRoby = false;
      this.userTimerAnimation = 'clock--end';
      this.userTimerValue = this.match.time;

      console.log('Final position set to:', this.match);
      const result = this.path.positionRoby(true, this.match.startPosition);
      this.gameData.update('userMatchResult', {
        nickname: this.user.nickname,
        playerId: this.user.playerId,
        pathLength: result.pathLength,
        time: this.match.time,
        startPosition: this.match.startPosition,
      });
      if (!this.match.enemyPositioned && this.general.botSetting !== 0) {
        const botPath = this.path.calculateBotPath(this.general.botSetting);
        this.gameData.update('match', {
          enemyPositioned: true,
          enemyTime: this.positionEnemyTrigger,
          enemyStartPosition: botPath.startPosition,
        });

        this.enemyTimerValue = this.match.enemyTime;
        this.enemyTimerAnimation = 'clock--end';
      }
      this.executeEndSequence();
    }
  }

  // onTileDropped(event: CdkDragDrop<any>) {
  //   const { row, col } = event.container.data;
  //   console.log('Dropped on', row, col);
  //   // do your placement logic
  // }

  canDropRobot = (drag: any, drop: any) => {
    console.log(drag);
    // Only allow dropping robot on "start" arrow cells
    return drop.data.start === true;
  };

  logEvent(name: string, event: any) {
    console.log('DropList event:', name, event);
  }

  // onTileDropped(event: CdkDragDrop<any>, side: string, distance: number) {
  //   const nativeEvent = event.event as MouseEvent | TouchEvent;
  //   console.log('Drop event', side, distance);

  //   // get pointer coordinates
  //   const x = (nativeEvent as MouseEvent).clientX || 0;
  //   const y = (nativeEvent as MouseEvent).clientY || 0;

  //   const tableElement = event.container.element.nativeElement as HTMLElement;
  //   const cells = Array.from(tableElement.querySelectorAll('td'));

  //   const droppedCell = cells.find((cell) => {
  //     const rect = cell.getBoundingClientRect();
  //     return (
  //       x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
  //     );
  //   });

  //   if (droppedCell) {
  //     console.log('Dropped on cell id', droppedCell.id);
  //     // Do placement logic here
  //   }
  // }

  onTileOver(event: CdkDragEnter<any>) {
    const { row, col } = event.container.data;
    console.log('Roby over', row, col);
    this.draggableRobyImage = 'roby-over';
  }

  onTileOut(event: CdkDragExit<any>) {
    const { row, col } = event.container.data;
    console.log('Roby out', row, col);
    this.draggableRobyImage = 'roby-dragging-trasp';
  }

  // onTileDropped(rowIndex: number, colIndex: number): void {
  //   this.robyDropped(rowIndex, colIndex);
  // }

  // onTileOver(rowIndex: number, colIndex: number): void {
  //   this.robyOver(rowIndex, colIndex);
  // }

  // onTileOut(rowIndex: number, colIndex: number): void {
  //   this.robyOut(rowIndex, colIndex);
  // }

  onRobyOver(side: number, distance: number): void {
    this.audio.playSound('roby-over');
    this.draggableRobyImage = 'roby-over';
  }

  onRobyOut(): void {
    this.draggableRobyImage = 'roby-dragging-trasp';
  }

  onRobyDropped(side: number, distance: number): void {
    this.audio.playSound('roby-positioned');
    this.showCompleteGrid = true;
    if (!this.startAnimation) {
      const finalUserTime = this.gameData.getUserFinalTime();
      this.gameData.update('match', {
        positioned: true,
        time: finalUserTime,
        startPosition: { side, distance },
      });
      this.showDraggableRoby = false;
      this.userTimerAnimation = 'clock--end';
      this.userTimerValue = this.match.time;

      const result = this.path.positionRoby(true, this.match.startPosition);
      this.gameData.update('userMatchResult', {
        nickname: this.user.nickname,
        playerId: this.user.playerId,
        pathLength: result.pathLength,
        time: this.match.time,
        startPosition: this.match.startPosition,
      });
      if (!this.match.enemyPositioned && this.general.botSetting !== 0) {
        const botPath = this.path.calculateBotPath(this.general.botSetting);
        this.gameData.update('match', {
          enemyPositioned: true,
          enemyTime: this.positionEnemyTrigger,
          enemyStartPosition: botPath.startPosition,
        });
        this.enemyTimerValue = this.match.enemyTime;
        this.enemyTimerAnimation = 'clock--end';
      }
      this.executeEndSequence();
    }
  }

  skip(): void {
    this.audio.playSound('menu-click');
    this.quitGame();
    this.router.navigate(['/bootmp-aftermatch']);
  }

  dropListId(rowIndex: number, colIndex: number): string {
    return `drop-${rowIndex}-${colIndex}`;
  }

  robyOver(row: number, col: number): void {}

  robyOut(row: number, col: number): void {}
}
