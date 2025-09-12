import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-roby-animation',
  imports: [],
  templateUrl: './roby-animation.component.html',
  styleUrl: './roby-animation.component.scss',
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
      transition('idle => moving', [
        animate(
          '600ms ease-in-out',
          style({
            transform: 'translate({{x}}px, {{y}}px) rotate({{angle}}deg)',
          })
        ),
      ]),
      transition('moving => idle', [animate('200ms ease-out')]),
    ]),
  ],
})
export class RobyAnimationComponent {
  @Input() image = 'roby-positioned'; // default
  @Input() x = 0;
  @Input() y = 0;
  @Input() angle = 0;

  // controlla lo stato di animazione
  state: 'idle' | 'moving' = 'idle';

  moveTo(x: number, y: number, angle: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.state = 'moving';

    setTimeout(() => {
      this.state = 'idle';
    }, 600);
  }
}
