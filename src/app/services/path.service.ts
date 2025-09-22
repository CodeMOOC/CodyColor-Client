import { Injectable, OnDestroy } from '@angular/core';
import { GameDataService } from './game-data.service';
import { EntryPoint, Side, Tile } from '../models/cell.model';
import { Path } from '../models/path.model';
import { BehaviorSubject } from 'rxjs';

/*
 * RobyMoveHandler: servizio che permette di gestire i robot nella scacchiera, calcolando il percorso che
 * ogni robot robot deve compiere, animandoli a comando, e calcolandone il percorso
 */
@Injectable({ providedIn: 'root' })
export class PathService {
  private pathSubject = new BehaviorSubject<Path>(this.emptyPath());
  public readonly path$ = this.pathSubject.asObservable();

  constructor(private gameData: GameDataService) {}

  /**
   * Calculate a path starting from `start` and emit it so that
   * any animation component can subscribe and animate.
   */
  public computePath(start: EntryPoint): void {
    const path = this.calculatePath(start);
    this.pathSubject.next(path);
  }

  emptyPath(): Path {
    return {
      startPosition: { side: Side.None, distance: -1 },
      endPosition: { side: Side.None, distance: -1 },
      tilesCoords: [],
      direction: [],
      pathLength: 0,
    };
  }

  /** current snapshot */
  get value(): Path {
    return this.pathSubject.value;
  }

  calculateBotPath(difficulty: number): any {
    const all: Path[] = [];
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
  private calculatePath(startPosition: EntryPoint): Path {
    // oggetto da memorizzare nel roby per attuare il percorso
    const path: Path = {
      startPosition,
      endPosition: { side: Side.None, distance: -1 },
      tilesCoords: [],
      direction: [],
      pathLength: 0,
    };

    // roby non posizionato entro il tempo limite
    if (path.startPosition.distance === -1 && path.startPosition.side === -1) {
      return path;
    }

    // ottieni primo elemento
    switch (path.startPosition.side) {
      case 0:
        console.log('top');
        path.tilesCoords.push({ row: 0, col: path.startPosition.distance });
        break;
      case 1:
        console.log('right');
        path.tilesCoords.push({ row: path.startPosition.distance, col: 4 });
        break;
      case 2:
        console.log('Bottom');
        path.tilesCoords.push({ row: 4, col: path.startPosition.distance });
        break;
      case 3:
        console.log('left');
        path.tilesCoords.push({ row: path.startPosition.distance, col: 0 });
        break;
    }

    // la prima direction è sempre opposta al lato di entrata
    path.direction.push(this.mod(path.startPosition.side + 2, 4));
    path.pathLength++;

    // ottieni elementi successivi tramite while
    let endOfPath = false;
    while (!endOfPath) {
      let lastTileCoords = path.tilesCoords[path.pathLength - 1];
      let lastTileDirection = path.direction[path.pathLength - 1];
      let nextTileCoords: Tile = { row: -1, col: -1 };
      let nextTileDirection = -1;

      // 1. trova la prossima direction
      const tileValue =
        this.gameData.value.match.tiles[lastTileCoords.row][lastTileCoords.col];

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
          nextTileCoords.row = lastTileCoords.row - 1;
          nextTileCoords.col = lastTileCoords.col;
          break;
        case 1:
          // verso destra
          nextTileCoords.row = lastTileCoords.row;
          nextTileCoords.col = lastTileCoords.col + 1;
          break;
        case 2:
          // verso il basso
          nextTileCoords.row = lastTileCoords.row + 1;
          nextTileCoords.col = lastTileCoords.col;
          break;
        case 3:
          // verso sinistra
          nextTileCoords.row = lastTileCoords.row;
          nextTileCoords.col = lastTileCoords.col - 1;
          break;
      }

      // exit checks
      if (nextTileDirection === 0 && nextTileCoords.row < 0) {
        // uscita dal lato in alto
        path.endPosition.side = 0;
        path.endPosition.distance = nextTileCoords.col;
        endOfPath = true;
      } else if (nextTileDirection === 1 && nextTileCoords.col > 4) {
        // uscita dal lato destro
        path.endPosition.side = 1;
        path.endPosition.distance = nextTileCoords.row;
        endOfPath = true;
      } else if (nextTileDirection === 2 && nextTileCoords.row > 4) {
        // uscita dal lato in basso
        path.endPosition.side = 2;
        path.endPosition.distance = nextTileCoords.col;
        endOfPath = true;
      } else if (nextTileDirection === 3 && nextTileCoords.col < 0) {
        // uscita dal lato sinistro
        path.endPosition.side = 3;
        path.endPosition.distance = nextTileCoords.row;
        endOfPath = true;
      }

      // la prossima tile è valida: aggiungila alla struttura dati
      if (endOfPath === false) {
        path.pathLength++;
        path.direction.push(nextTileDirection);
        path.tilesCoords.push(nextTileCoords);
      }
    }
    return path;
  }

  public reset(): void {
    this.pathSubject.next(this.emptyPath());
  }

  private mod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }
}
