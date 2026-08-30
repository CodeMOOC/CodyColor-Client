import { EntryPoint } from './cell.model';

export interface Match {
  tiles: string[][];
  startPosition: EntryPoint;
  positioned: boolean;
  time: number;
  enemyStartPosition: EntryPoint;
  enemyPositioned: boolean;
  enemyTime: number;
  winnerId: number;
}

export interface MatchResult {
  nickname: string;
  playerId: number;
  time: number;
  points: number;
  pathLength: number;
  startPosition: EntryPoint;
}

export interface Roby {
  show: boolean;
  animationFinished: boolean;
  image: string;
  positionedImage: string;
  walkingImages: string[];
  brokenImage: string;
  startPosition: EntryPoint;
}
