import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  loginOrProfile = 'LOGIN'; // or 'PROFILE', depending on auth state
  userNickname = 'Guest';
  userLogged = false;
  connected = false;

  totalMatches = 0;
  connectedPlayers = 0;

  basePlaying = false;
  language = 'en';

  languageModal = false;
  noOnlineModal = false;
  noOnlineModalText = '';

  constructor(private router: Router, private translate: TranslateService) {
    this.translate.addLangs(['it', 'en']);
    this.translate.setDefaultLang('it');
    this.translate.use('it');
  }
  goToRules() {
    this.router.navigate(['/rules']);
  }
  goToRMMaking() {
    console.log('Navigating to Random Matchmaking');
    this.router.navigate(['/random-mmaking']);
  }
  goToCMMaking() {
    this.router.navigate(['/custom-mmaking']);
  }
  goToAMMaking() {
    this.router.navigate(['/arcade-mmaking']);
  }
  goToBootcamp() {
    this.router.navigate(['/bootmp-mmaking']);
  }
  goToRankings() {
    this.router.navigate(['/rankings']);
  }
  goToLoginProfile() {
    this.router.navigate(['/login']);
  }

  toggleBase() {
    this.basePlaying = !this.basePlaying;
    // maybe toggle actual audio here
  }

  openLanguageModal() {
    this.languageModal = true;
  }

  closeLanguageModal() {
    this.languageModal = false;
  }

  changeLanguage(lang: string) {
    this.language = lang;
    // trigger translation change if needed
  }

  closeNoConnectionModal() {
    this.noOnlineModal = false;
  }
}
