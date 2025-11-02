import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-spinner',
  imports: [TranslateModule],
  templateUrl: './spinner.component.html',
  standalone: true,
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {}
