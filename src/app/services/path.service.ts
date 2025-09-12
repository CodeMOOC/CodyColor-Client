import { Injectable, OnDestroy } from '@angular/core';
import { GameDataService } from './game-data.service';
import { EntryPoint, Side } from '../models/cell.model';

interface CellCoord {
  side: any;
  distance: number;
}

interface TileCoord {
  x: number;
  y: number;
}

interface RobotState {
  show: boolean;
  animationFinished: boolean;
  startPosition: CellCoord;
  endPosition: CellCoord;
  tilesCoords: CellCoord[];
  direction: number[];
  pathLength: number;
  walkingTimer?: any;
  image: string;
  positionedImage: string;
  walkingImages: string[];
  brokenImage: string;
  changeImage: (img: string) => void;
}

/*
 * RobyMoveHandler: servizio che permette di gestire i robot nella scacchiera, calcolando il percorso che
 * ogni robot robot deve compiere, animandoli a comando, e calcolandone il percorso
 */
@Injectable({ providedIn: 'root' })
export class PathService implements OnDestroy {
  private playerRoby!: RobotState;
  private enemiesRoby!: RobotState[][];
  private startTiles!: HTMLElement[][];
  private completeTiles!: HTMLElement[][];

  constructor(private gameData: GameDataService) {}

  ngOnDestroy(): void {
    this.quitGame();
  }

  // permette di uscire dal gioco in modo sicuro, interrompendo tutti i timers e pulendo le variabili
  quitGame(): void {
    this.cleanupTimers(this.playerRoby);
    this.enemiesRoby?.flat().forEach((enemy) => this.cleanupTimers(enemy));
    this.playerRoby = {} as any;
    this.enemiesRoby = [];
  }

  getPlayerRoby(): RobotState {
    return this.playerRoby;
  }
  getEnemiesRoby(): RobotState[][] {
    return this.enemiesRoby;
  }

  initialize(elementsProvider: {
    startTiles: HTMLElement[][];
    completeTiles: HTMLElement[][];
  }): void {
    this.startTiles = elementsProvider.startTiles;
    this.completeTiles = elementsProvider.completeTiles;
    this.initializePlayer();
    this.initializeEnemies();
  }

  private initializePlayer() {
    this.playerRoby = {
      show: false,
      animationFinished: false,
      startPosition: { side: -1, distance: -1 },
      endPosition: { side: -1, distance: -1 },
      tilesCoords: [],
      direction: [],
      pathLength: 0,
      positionedImage: 'roby-positioned',
      walkingImages: ['roby-walking-1', 'roby-walking-2'],
      brokenImage: 'roby-broken',
      image: 'roby-positioned',
      changeImage: (img: string) => (this.playerRoby.image = img),
    };
  }

  private initializeEnemies() {
    this.enemiesRoby = Array.from({ length: 4 }, (_, side) =>
      Array.from({ length: 5 }, (_, dist) => ({
        show: false,
        animationFinished: false,
        startPosition: { side, distance: dist },
        endPosition: { side: -1, distance: -1 },
        tilesCoords: [],
        direction: [],
        pathLength: 0,
        positionedImage: 'enemy-positioned',
        walkingImages: ['enemy-walking-1', 'enemy-walking-2'],
        brokenImage: 'enemy-broken',
        image: 'enemy-positioned',
        changeImage: (img: string) => {
          this.enemiesRoby[side][dist].image = img;
        },
      }))
    );
  }

  // funzione d'appoggio per posizionare tutti i roby passati dal server a fine match
  positionAllEnemies(
    startPositions: { position: CellCoord; playerCount: number }[]
  ): void {
    const userStart = this.gameData.value.match.startPosition;
    startPositions.forEach((item) => {
      if (
        item.playerCount > 1 ||
        item.position.side !== userStart.side ||
        item.position.distance !== userStart.distance
      ) {
        this.positionRoby(false, item.position);
      }
    });
  }

  // pone un roby in posizione (senza animazione), sulla casella passata in ingresso dall'utente,
  // quindi calcola e prepara il percorso; ritorna il path del robot
  positionRoby(isPlayer: boolean, selectedStart: CellCoord): any {
    const path = this.calculatePath(selectedStart);
    if (selectedStart.side >= 0) {
      const roby = isPlayer
        ? this.playerRoby
        : this.enemiesRoby[selectedStart.side][selectedStart.distance];

      roby.show = true;
      const tileEl =
        this.startTiles[selectedStart.side][selectedStart.distance];
      const coords = tileEl.getBoundingClientRect();
      const angle = this.getAngle((selectedStart.side + 2) % 4);

      roby.changeImage(roby.positionedImage);
      // set style and path data...
      Object.assign(roby, path);
    }
    return path;
  }

  animateActiveRobys(endCallback: () => void): void {
    console.log('Animating active Robys');

    this.animateRoby(this.playerRoby, endCallback, true);
    this.enemiesRoby?.forEach((row) =>
      row.forEach((enemy) => {
        if (enemy.show) this.animateRoby(enemy, endCallback, false);
      })
    );
  }

  private animateRoby(
    roby: RobotState,
    endCallback: () => void,
    isPlayer: boolean
  ): void {
    if (!roby || roby.startPosition.side < 0) {
      roby.animationFinished = true;
      endCallback();
      return;
    }

    // animation logic using requestAnimationFrame or CSS transitions
    // cycling walkingImages, moving DOM element positions from completeTiles path coords
    // clearing walkingTimer at completion, marking animationFinished
  }

  mod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }

  calculateBotPath(difficulty: number): any {
    const all = [];
    for (let side = 0; side < 4; side++) {
      for (let dist = 0; dist < 5; dist++) {
        all.push(this.calculatePath({ side, distance: dist }));
      }
    }
    all.sort((a, b) => a.pathLength - b.pathLength);
    // pick based on difficulty
    if (difficulty === 1) return all[Math.floor(Math.random() * 10)];
    if (difficulty === 2) return all[Math.floor(Math.random() * 10) + 10];
    return all[19];
  }

  // algoritmo per il calcolo del percorso di uno dei roby, salvandone un oggetto che lo descrive
  // return: il path corrispondente
  calculatePath(startPosition: EntryPoint) {
    // oggetto da memorizzare nel roby per attuare il percorso
    const path = {
      startPosition,
      endPosition: { side: Side.None, distance: -1 },
      tilesCoords: [] as TileCoord[],
      direction: [] as number[],
      pathLength: 0,
    };

    // roby non posizionato entro il tempo limite
    if (path.startPosition.distance === -1 && path.startPosition.side === -1) {
      return path;
    }

    // ottieni primo elemento
    switch (path.startPosition.side) {
      case 0:
        path.tilesCoords.push({ x: 0, y: path.startPosition.distance });
        break;
      case 1:
        path.tilesCoords.push({ x: path.startPosition.distance, y: 4 });
        break;
      case 2:
        path.tilesCoords.push({ x: 4, y: path.startPosition.distance });
        break;
      case 3:
        path.tilesCoords.push({ x: path.startPosition.distance, y: 0 });
        break;
    }
    path.direction.push(this.mod(path.startPosition.side + 2, 4));

    path.pathLength++;

    // ottieni elementi successivi tramite while
    let endOfThePath = false;
    while (!endOfThePath) {
      let lastTileCoords = path.tilesCoords[path.pathLength - 1];
      let lastTileDirection = path.direction[path.pathLength - 1];
      let nextTileCoords = { x: -1, y: -1 };
      let nextTileDirection = -1;

      // 1. trova la prossima direction
      const tileValue =
        this.gameData.value.match.tiles[lastTileCoords.x][lastTileCoords.y];

      switch (tileValue) {
        case 'Y':
          // vai verso sinistra
          nextTileDirection = this.mod(lastTileDirection - 1, 4);
          break;
        case 'R':
          // vai verso destra
          nextTileDirection = this.mod(lastTileDirection + 1, 4);
          break;
        case 'G':
          // vai dritto
          nextTileDirection = lastTileDirection;
          break;
      }

      // 2. trova la prossima tile
      switch (nextTileDirection) {
        case 0:
          // verso l'alto
          nextTileCoords.x = lastTileCoords.x - 1;
          nextTileCoords.y = lastTileCoords.y;
          break;
        case 1:
          // verso destra
          nextTileCoords.x = lastTileCoords.x;
          nextTileCoords.y = lastTileCoords.y + 1;
          break;
        case 2:
          // verso il basso
          nextTileCoords.x = lastTileCoords.x + 1;
          nextTileCoords.y = lastTileCoords.y;
          break;
        case 3:
          // verso sinistra
          nextTileCoords.x = lastTileCoords.x;
          nextTileCoords.y = lastTileCoords.y - 1;
          break;
      }

      // exit checks
      if (nextTileDirection === 0 && nextTileCoords.x < 0) {
        // uscita dal lato in alto
        path.endPosition.side = 0;
        path.endPosition.distance = nextTileCoords.y;
        endOfThePath = true;
      } else if (nextTileDirection === 1 && nextTileCoords.y > 4) {
        // uscita dal lato destro
        path.endPosition.side = 1;
        path.endPosition.distance = nextTileCoords.x;
        endOfThePath = true;
      } else if (nextTileDirection === 2 && nextTileCoords.x > 4) {
        // uscita dal lato in basso
        path.endPosition.side = 2;
        path.endPosition.distance = nextTileCoords.y;
        endOfThePath = true;
      } else if (nextTileDirection === 3 && nextTileCoords.y < 0) {
        // uscita dal lato sinistro
        path.endPosition.side = 3;
        path.endPosition.distance = nextTileCoords.x;
        endOfThePath = true;
      }

      // la prossima tile è valida: aggiungila alla struttura dati
      if (endOfThePath === false) {
        path.pathLength++;
        path.direction.push(nextTileDirection);
        path.tilesCoords.push(nextTileCoords);
      }
    }

    return path;
  }

  private cleanupTimers(roby?: Partial<RobotState>) {
    if (roby?.walkingTimer) {
      clearInterval(roby.walkingTimer);
      roby.walkingTimer = undefined;
    }
  }

  private getAngle(direction: number): number {
    return [0, 90, 180, 270][direction] ?? 0;
  }
}
