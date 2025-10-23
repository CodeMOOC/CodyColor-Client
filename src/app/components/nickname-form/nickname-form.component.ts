import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-nickname-form',
  imports: [CommonModule, FormsModule, TranslateModule],
  standalone: true,
  templateUrl: './nickname-form.component.html',
  styleUrl: './nickname-form.component.scss',
})
export class NicknameFormComponent {
  username = '';

  @Output() submitNickname = new EventEmitter<string>();

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.submitNickname.emit(this.username.trim());
    }
  }
}
