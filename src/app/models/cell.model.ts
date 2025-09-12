export interface Cell {
  id?: string;
  placeholder?: boolean;
  start?: boolean;
  tile?: { row: number; col: number };
}

export interface Tile {
  row: number;
  col: number;
}

export enum Side {
  None = -1,
  Top = 0,
  Right = 1,
  Bottom = 2,
  Left = 3,
}

export interface EntryPoint {
  side: Side;
  distance: number; // position along that side
}
