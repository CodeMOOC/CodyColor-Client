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
        params: { duration: 300 },
      }),

      // turning transitions (toggle between turning and turning2)
      transition(
        'turning <=> turning2',
        [animate('{{turnDuration}}ms ease-in-out')],
        { params: { turnDuration: 300 } }
      ),
      transition('* => turning', [animate('{{turnDuration}}ms ease-in-out')]),
      transition('* => turning2', [animate('{{turnDuration}}ms ease-in-out')]),
    ]),
  ],
})
export class RobyAnimationComponent implements OnInit, OnDestroy {
  @Input() path!: Path;
  @Input() image = 'roby-positioned';
  @Output() finished = new EventEmitter<void>();

  currentX = 0;
  currentY = 0;
  currentAngle = 0;
  state: AnimState = 'idle';

  // durations (customize)
  moveDuration = 300;
  turnDuration = 300;

  private steps: Step[] = [];
  private stepTimer?: any;
  private turnToggle = false;
  private moveToggle = false;

  ngOnInit(): void {
    if (this.path) {
      this.prepareSteps();
      this.play();
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
    const tileSize = 50;
    this.steps = [];

    if (!this.path || !this.path.tilesCoords?.length) return;

    // Build sequence: move into first tile, then for each subsequent tile:
    // if direction changed -> add a turn step (at current pos), then move step
    let prevDir = this.path.direction[0];
    let prevX = this.path.tilesCoords[0].col * tileSize;
    let prevY = this.path.tilesCoords[0].row * tileSize;
    const firstAngle = this.getAngle(prevDir);

    // first move to initial tile (you may want a starting off-grid frame here)
    this.steps.push({ type: 'move', x: prevX, y: prevY, angle: firstAngle });

    for (let i = 1; i < this.path.tilesCoords.length; i++) {
      const dir = this.path.direction[i];
      const x = this.path.tilesCoords[i].col * tileSize;
      const y = this.path.tilesCoords[i].row * tileSize;
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

  private getAngle(direction: number): number {
    return [0, 90, 180, -90][direction] ?? 0;
  }
}
