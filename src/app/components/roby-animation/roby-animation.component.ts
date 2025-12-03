import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Path } from '../../models/path.model';
import { StartPixel } from '../../models/cell.model';

import { ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

type AnimState = 'idle' | 'moving' | 'moving2' | 'turning' | 'turning2';
type Step = {
  type: 'turn' | 'move';
  x: number;
  y: number;
  angle: number;
  duration?: number;
};

@Component({
  selector: 'app-roby-animation',
  templateUrl: './roby-animation.component.html',
  styleUrls: ['./roby-animation.component.scss'],
  imports: [CommonModule],
  standalone: true,
  animations: [
    trigger('move', [
      state(
        'idle',
        style({
          transform: 'translate({{x}}px, {{y}}px) rotate({{angle}}deg)',
        }),
        { params: { x: 0, y: 0, angle: 0 } }
      ),

      state(
        'moving',
        style({
          transform: 'translate({{x}}px, {{y}}px) rotate({{angle}}deg)',
        }),
        { params: { x: 0, y: 0, angle: 0 } }
      ),

      state(
        'moving2',
        style({
          transform: 'translate({{x}}px, {{y}}px) rotate({{angle}}deg)',
        }),
        { params: { x: 0, y: 0, angle: 0 } }
      ),

      state(
        'turning',
        style({
          transform: 'translate({{x}}px, {{y}}px) rotate({{angle}}deg)',
        }),
        { params: { x: 0, y: 0, angle: 0 } }
      ),

      state(
        'turning2',
        style({
          transform: 'translate({{x}}px, {{y}}px) rotate({{angle}}deg)',
        }),
        { params: { x: 0, y: 0, angle: 0 } }
      ),

      // moving <=> moving2 toggle (keeps alternating for consecutive moves)
      transition('moving <=> moving2', [animate('{{duration}}ms linear')], {
        params: { duration: 500 },
      }),

      // turning transitions (toggle between turning and turning2)
      transition(
        'turning <=> turning2',
        [animate('{{turnDuration}}ms ease-in-out')],
        { params: { turnDuration: 500 } }
      ),
      transition('* => turning', [animate('{{turnDuration}}ms ease-in-out')]),
      transition('* => turning2', [animate('{{turnDuration}}ms ease-in-out')]),
      transition('turning => *', [animate('{{duration}}ms linear')]),
      transition('turning2 => *', [animate('{{duration}}ms linear')]),
    ]),
  ],
})
export class RobyAnimationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() path!: Path;
  @Input() executeAnimation = false;
  @Input() image = 'roby-positioned';
  @Input() isBotOrEnemy = false;
  @Input() startPixel: StartPixel = { x: 0, y: 0 };
  @Output() finished = new EventEmitter<void>();

  currentX = 0;
  currentY = 0;
  currentAngle = 0;
  state: AnimState = 'idle';

  // durations (customize)
  moveDuration = 700;
  turnDuration = 700;

  entryX = 0;
  entryY = 0;
  entryAngle = 0;

  private steps: Step[] = [];
  private stepTimer?: any;
  private turnToggle = false;
  private moveToggle = false;

  constructor(private elRef: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.prepareSteps();

    this.finished.subscribe(() => {
      this.image = this.isBotOrEnemy ? 'enemy-positioned' : 'roby-positioned';
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['path'] && this.path && this.path.pathLength > 0) {
      this.prepareSteps();
    }

    if (changes['executeAnimation']?.currentValue === true) {
      this.startRealAnimation();
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }

  public play(): void {
    this.stop();
    this.prepareSteps();
    this.runSteps();
  }

  private stop(): void {
    if (this.stepTimer) {
      clearTimeout(this.stepTimer);
      this.stepTimer = undefined;
    }
  }

  private prepareSteps(): void {
    if (!this.path?.tilesCoords?.length) {
      this.steps = [];
      return;
    }
    const tileStep = 50 + 5;

    const offsetX = 10;
    const offsetY = 55;

    this.steps = [];

    if (!this.path || !this.path.tilesCoords?.length) return;

    const tiles = this.path.tilesCoords;
    const dirs = this.path.direction;

    const dirVecs = [
      { dx: 0, dy: -1 }, // 0 up
      { dx: 1, dy: 0 }, // 1 right
      { dx: 0, dy: 1 }, // 2 down
      { dx: -1, dy: 0 }, // 3 left
    ];

    const firstDir = dirs[0];
    const firstTile = tiles[0];

    const firstTileX = firstTile.col * tileStep + offsetX;
    const firstTileY = firstTile.row * tileStep + offsetY;

    // entry is firstTile - dirVector * tileStep
    const dv = dirVecs[firstDir] ?? { dx: 0, dy: 0 };
    const entryX = firstTileX - dv.dx * tileStep;
    const entryY = firstTileY - dv.dy * tileStep;

    this.entryX = entryX;
    this.entryY = entryY;
    this.entryAngle = this.getAngle(firstDir);

    this.steps.push({
      type: 'move',
      x: entryX,
      y: entryY,
      angle: this.getAngle(firstDir),
      duration: this.moveDuration,
    });

    // move into the first tile
    this.steps.push({
      type: 'move',
      x: firstTileX,
      y: firstTileY,
      angle: this.getAngle(firstDir),
      duration: this.moveDuration,
    });

    // subsequent tiles
    let prevDir = dirs[0];
    let prevX = firstTileX;
    let prevY = firstTileY;

    for (let i = 1; i < this.path.tilesCoords.length; i++) {
      const dir = dirs[i];
      const tile = tiles[i];
      const x = tile.col * tileStep + offsetX;
      const y = tile.row * tileStep + offsetY;

      const angle = this.getAngle(dir);

      if (dir !== prevDir) {
        // turn in place (stay at prevX, prevY)
        this.steps.push({
          type: 'turn',
          x: prevX,
          y: prevY,
          angle,
          duration: this.turnDuration,
        });
      }
      // then move to the next tile
      this.steps.push({
        type: 'move',
        x,
        y,
        angle,
        duration: this.moveDuration,
      });

      prevDir = dir;
      prevX = x;
      prevY = y;
    }

    // EXIT: compute exit direction
    const lastTile = tiles[tiles.length - 1];
    const lastX = lastTile.col * tileStep + offsetX;
    const lastY = lastTile.row * tileStep + offsetY;

    const exitDir =
      typeof this.path.exitDirection === 'number'
        ? this.path.exitDirection
        : dirs && dirs.length
        ? dirs[dirs.length - 1]
        : 0;

    // if we need to turn before leaving
    const lastDir = dirs[dirs.length - 1];
    if (lastDir !== exitDir) {
      this.steps.push({
        type: 'turn',
        x: lastX,
        y: lastY,
        angle: this.getAngle(exitDir),
        duration: this.turnDuration,
      });
    }

    const edv = dirVecs[exitDir] ?? { dx: 0, dy: 0 };
    const offX = lastX + edv.dx * tileStep;
    const offY = lastY + edv.dy * tileStep;

    this.steps.push({
      type: 'move',
      x: offX,
      y: offY,
      angle: this.getAngle(exitDir),
      duration: this.moveDuration,
    });
  }

  private startRealAnimation(): void {
    if (!this.steps?.length) {
      return;
    }

    this.stop();
    let idx = 0;

    // place robot at the step[0] starting location
    this.currentX = this.steps[0].x;
    this.currentY = this.steps[0].y;
    this.currentAngle = this.steps[0].angle;
    this.state = 'idle';

    // start animation
    this.runSteps();
  }

  getPlacedRobyStyles() {
    if (!this.path || !this.path.tilesCoords?.length) return {};

    return {
      transform: `translate(${this.entryX}px, ${this.entryY}px) rotate(${this.entryAngle}deg)`,
    };
  }

  /**
   * runSteps - starts from steps[0] as "current visual" position and animates steps[1..]
   */
  private runSteps(): void {
    if (!this.steps || !this.steps.length) {
      this.state = 'idle';
      this.finished.emit();
      return;
    }

    // Set initial visual position to the entry (steps[0]) so the robot is already there.
    // Then animate starting from steps[1].
    this.currentX = this.steps[0].x;
    this.currentY = this.steps[0].y;
    this.currentAngle = this.steps[0].angle;
    this.state = 'idle';

    let idx = 0;
    const next = () => {
      if (idx >= this.steps.length) {
        this.state = 'idle';
        this.finished.emit();
        return;
      }
      const s = this.steps[idx];

      if (s.type === 'turn') {
        // rotate in place
        this.currentAngle = s.angle;
        this.state = this.turnToggle ? 'turning' : 'turning2';
        this.turnToggle = !this.turnToggle;

        this.stepTimer = setTimeout(() => {
          idx++;
          next();
        }, s.duration ?? this.turnDuration);
      } else {
        // move to target position
        this.currentX = s.x;
        this.currentY = s.y;
        this.currentAngle = s.angle;
        this.state = this.moveToggle ? 'moving' : 'moving2';
        this.moveToggle = !this.moveToggle;

        this.stepTimer = setTimeout(() => {
          idx++;
          next();
        }, s.duration ?? this.moveDuration);
      }
    };

    next();
  }

  get currentImage() {
    if (this.isBotOrEnemy) {
      return this.state === 'moving'
        ? 'enemy-walking-1'
        : this.state === 'moving2'
        ? 'enemy-walking-2'
        : this.image;
    }
    return this.state === 'moving'
      ? 'roby-walking-1'
      : this.state === 'moving2'
      ? 'roby-walking-2'
      : this.image;
  }

  private getAngle(direction: number): number {
    return [0, 90, 180, -90][direction] ?? 0;
  }
}
