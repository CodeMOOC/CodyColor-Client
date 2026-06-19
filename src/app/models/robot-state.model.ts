import { EntryPoint } from './cell.model';

export interface RobotState {
  show: boolean;
  animationFinished: boolean;
  startPosition: EntryPoint;
  endPosition: EntryPoint;
  tilesCoords: EntryPoint[];
  direction: number[];
  pathLength: number;
  walkingTimer?: any;
  image: string;
  positionedImage: string;
  walkingImages: string[];
  brokenImage: string;
  changeImage: (img: string) => void;
}
