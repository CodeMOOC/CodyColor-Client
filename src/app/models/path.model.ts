import { EntryPoint, Tile } from './cell.model';

export interface Path {
  startPosition: EntryPoint;
  endPosition: EntryPoint;
  tilesCoords: Tile[];
  direction: number[];
  pathLength: number;
}
