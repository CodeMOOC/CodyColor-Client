import { Side } from '../models/cell.model';

export function sideToString(side: Side): string {
  switch (side) {
    case Side.Top:
      return 'top';
    case Side.Right:
      return 'right';
    case Side.Bottom:
      return 'bottom';
    case Side.Left:
      return 'left';
    case Side.None:
      return 'none';
  }
}
