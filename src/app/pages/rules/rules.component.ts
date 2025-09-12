import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rules',
  imports: [CommonModule, TranslateModule],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
})
export class RulesComponent {
  basePlaying = false;
  languageModal = false;
  language = 'en';
  userLogged = false;
  userNickname = 'Guest';

  constructor(private router: Router, private translate: TranslateService) {
    this.translate.addLangs(['it', 'en']);
    this.translate.setDefaultLang('it');
    this.translate.use('it');
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  toggleBase() {
    this.basePlaying = !this.basePlaying;
    // toggle audio volume logic
  }

  openLanguageModal() {
    this.languageModal = true;
  }

  closeLanguageModal() {
    this.languageModal = false;
  }

  changeLanguage(lang: string) {
    this.language = lang;
    // set language via translateService if used
  }
}
