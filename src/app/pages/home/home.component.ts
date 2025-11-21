import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AudioService } from '../../services/audio.service';
import { RabbitService } from '../../services/rabbit.service';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  loginOrProfile = 'LOGIN'; // or 'PROFILE', depending on auth state
  userNickname = 'Guest';
  userLogged = false;

  totalMatches = 0;
  connectedPlayers = 0;

  basePlaying = false;
  language = 'en';

  languageModal = false;
  noOnlineModal = false;
  noOnlineModalText = '';

  brokerConnected = false;
  serverConnected = false;

  constructor(
    private rabbit: RabbitService,
    private router: Router,
    private translate: TranslateService
  ) {
    // Register callbacks for events you care about
    this.rabbit.setPageCallbacks({
      onConnected: () => {
        this.brokerConnected = true;
      },
      onConnectionLost: () => {
        this.brokerConnected = false;
        this.serverConnected = false;
      },
      onGeneralInfoMessage: (msg: any) => {
        this.serverConnected = true;
        this.totalMatches = msg.totalMatches;
        this.connectedPlayers = msg.connectedPlayers;
      },
    });

    // Start the connection
    this.rabbit.connect();
  }

  sendPing(): void {
    // This will send a message to the server queue
    this.rabbit.sendRankingsRequest();
  }

  goToRules() {
    this.router.navigate(['/rules']);
  }
  goToRMMaking() {
    this.router.navigate(['/random-mmaking']);
  }
  goToCMMaking() {
    this.router.navigate(['/custom-mmaking']);
  }
  goToAMMaking() {
    this.router.navigate(['/royale-mmaking']);
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
