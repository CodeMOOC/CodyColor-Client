import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-multi-options-modal',
  imports: [TranslateModule],
  standalone: true,
  templateUrl: './multi-options-modal.component.html',
  styleUrl: './multi-options-modal.component.scss',
})
export class MultiOptionsModalComponent {
  @Input() text = '';
  @Output() ok = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
