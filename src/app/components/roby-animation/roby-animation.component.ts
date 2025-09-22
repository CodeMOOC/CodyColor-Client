import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Path } from '../../models/path.model';
import { RobotState } from '../../models/robot-state.model';

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
export class RobyAnimationComponent implements OnInit, OnDestroy {
  @Input() path!: Path;
  @Input() image = 'roby-positioned';
  @Input() isBot = false;
  @Output() finished = new EventEmitter<void>();

  currentX = 0;
  currentY = 0;
  currentAngle = 0;
  state: AnimState = 'idle';

  // durations (customize)
  moveDuration = 500;
  turnDuration = 500;

  private steps: Step[] = [];
  private stepTimer?: any;
  private turnToggle = false;
  private moveToggle = false;

  ngOnInit(): void {
    if (this.path) {
      this.prepareSteps();
      this.play();
    }

    console.log('Path for animation:', this.path);

    this.finished.subscribe(() => {
      if (!this.isBot) {
        this.image = 'roby-positioned';
      } else {
        this.image = 'enemy-positioned';
      }
    });
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
    const tileStep = 50 + 5;
    this.steps = [];

    if (!this.path || !this.path.tilesCoords?.length) return;

    const firstDir = this.path.direction[0];
    const firstTile = this.path.tilesCoords[0];

    const entryTileStep = 55;

    let entryX = firstTile.col * entryTileStep;
    let entryY = firstTile.row * entryTileStep;
    switch (firstDir) {
      case 0:
        entryY += entryTileStep;
        break;
      case 1:
        entryX -= entryTileStep;
        break;
      case 2:
        entryY -= entryTileStep;
        break;
      case 3:
        entryX -= entryTileStep;
        break;
    }
    this.steps.push({
      type: 'move',
      x: entryX,
      y: entryY,
      angle: this.getAngle(firstDir),
      duration: this.moveDuration,
    });

    // Build sequence: move into first tile, then for each subsequent tile:
    // if direction changed -> add a turn step (at current pos), then move step
    let prevDir = this.path.direction[0];
    let prevX = this.path.tilesCoords[0].col * tileStep;
    let prevY = this.path.tilesCoords[0].row * tileStep;
    const firstAngle = this.getAngle(prevDir);

    // first move to initial tile (you may want a starting off-grid frame here)
    this.steps.push({ type: 'move', x: prevX, y: prevY, angle: firstAngle });

    for (let i = 1; i < this.path.tilesCoords.length; i++) {
      const dir = this.path.direction[i];
      const x = this.path.tilesCoords[i].col * tileStep;
      const y = this.path.tilesCoords[i].row * tileStep;
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

    const lastTile = this.path.tilesCoords[this.path.tilesCoords.length - 1];
    const exitDir = this.path.direction[this.path.direction.length - 1];
    console.log('path ', this.path);
    // se siamo sulla riga e colonna 4 e 4 e usciamo a
    console.log('Exit dir:', exitDir);
    // one step forward in that direction
    let offX = prevX;
    let offY = prevY;
    switch (exitDir) {
      case 0:
        offY -= tileStep;
        break; // up
      case 1:
        offX += tileStep;
        break; // right
      case 2:
        offY += tileStep;
        break; // down
      case 3:
        offX -= tileStep;
        break; // left
    }

    this.steps.push({
      type: 'move',
      x: offX,
      y: offY,
      angle: this.getAngle(exitDir),
      duration: this.moveDuration,
    });
  }

  private runSteps(): void {
    let idx = 0;
    const next = () => {
      if (idx >= this.steps.length) {
        this.state = 'idle';
        this.finished.emit();
        return;
      }
      const s = this.steps[idx];

      if (s.type === 'turn') {
        // keep position, update angle, toggle turn state so angular re-runs animation
        this.currentAngle = s.angle;
        this.state = this.turnToggle ? 'turning' : 'turning2';
        this.turnToggle = !this.turnToggle;

        // ensure currentX/currentY remain where we are
        // wait for the turn to finish
        this.stepTimer = setTimeout(() => {
          idx++;
          next();
        }, s.duration ?? this.turnDuration);
      } else {
        // move
        // start walking visual here if needed
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
    if (this.isBot) {
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
