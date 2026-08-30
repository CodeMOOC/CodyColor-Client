import { CommonModule } from '@angular/common';
import { Component, NgZone, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RabbitService } from '../../services/rabbit.service';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, CommonModule, RouterLink],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
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

  private destroyRef = inject(DestroyRef);

  constructor(private rabbit: RabbitService, private zone: NgZone) {
    this.rabbit.brokerConnected$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((connected: any) => {
        this.zone.run(() => {
          this.brokerConnected = connected;
        });
      });

    this.rabbit.serverInfo$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((info: any) => {
        this.zone.run(() => {
          console.log('Received server info:', info);

          this.totalMatches = info.totalMatches;
          this.connectedPlayers = info.connectedPlayers;
        });
      });

    this.destroyRef.onDestroy(() => {
      this.rabbit.clearPageCallbacks();
    });
  }

  sendPing(): void {
    // This will send a message to the server queue
    this.rabbit.sendRankingsRequest();
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
