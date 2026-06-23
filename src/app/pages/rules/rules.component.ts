
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rules',
  imports: [TranslateModule],
  standalone: true,
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
})
export class RulesComponent {
  basePlaying = false;
  languageModal = false;
  language = 'en';
  userLogged = false;
  userNickname = 'Guest';

  constructor(private router: Router, private translate: TranslateService) {}
}
