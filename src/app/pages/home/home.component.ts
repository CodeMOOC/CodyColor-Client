import { CommonModule } from '@angular/common';
import { Component, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AudioService } from '../../services/audio.service';
import { RabbitService } from '../../services/rabbit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  loginOrProfile = 'LOGIN'; // or 'PROFILE', depending on auth state
  userNickname = 'Guest';
  userLogged = false;

  basePlaying = false;
  language = 'en';

  languageModal = false;
  noOnlineModal = false;
  noOnlineModalText = '';

  serverConnected = false;

  brokerConnected = false;
  totalMatches = 0;
  connectedPlayers = 0;
  private subs: Subscription[] = [];

  constructor(
    private rabbit: RabbitService,
    private router: Router,
    private translate: TranslateService,
    private zone: NgZone
  ) {
    this.subs.push(
      this.rabbit.brokerConnected$.subscribe((connected) => {
        this.zone.run(() => (this.brokerConnected = connected));
      })
    );

    this.subs.push(
      this.rabbit.serverInfo$.subscribe((info) => {
        this.zone.run(() => {
          this.totalMatches = info.totalMatches;
          this.connectedPlayers = info.connectedPlayers;
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.rabbit.clearPageCallbacks();
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
