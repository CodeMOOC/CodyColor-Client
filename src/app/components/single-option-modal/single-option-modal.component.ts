import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-single-option-modal',
  imports: [TranslateModule],
  standalone: true,
  templateUrl: './single-option-modal.component.html',
  styleUrl: './single-option-modal.component.scss',
})
export class SingleOptionModalComponent {
  /** Text to show inside the modal */
  @Input() text = '';

  /** Fired when the OK button is pressed */
  @Output() ok = new EventEmitter<void>();
}
