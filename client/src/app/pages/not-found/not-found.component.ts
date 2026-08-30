
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [TranslateModule],
  standalone: true,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  basePlaying = true;
  languageModal = false;
  userLogged = false;
  userNickname = 'Guest'; // Replace with real data
  currentLang = 'en';

  constructor(private router: Router, private translate: TranslateService) {}
}
