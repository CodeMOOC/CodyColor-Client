import { Component, inject, NgZone, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/shared/footer/footer.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { RabbitService } from './services/rabbit.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, FooterComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'CodyColor-Client';
  showFooter = true;

  firestore: Firestore = inject(Firestore);

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private rabbit: RabbitService,
    private zone: NgZone
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showFooter = event.urlAfterRedirects !== '/';
      });
  }

  ngOnInit(): void {
    this.rabbit.setPageCallbacks({
      onConnected: () => {
        this.zone.run(() => {
          this.rabbit.setBrokerConnected(true);
        });
      },
      onConnectionLost: () => {
        this.zone.run(() => {
          console.warn('Connection to broker lost');
          this.rabbit.setBrokerConnected(false);
          this.rabbit.setServerInfo({ totalMatches: 0, connectedPlayers: 0 });
        });
      },
      onGeneralInfoMessage: (msg: any) => {
        this.zone.run(() => {
          this.rabbit.setServerInfo({
            totalMatches: msg.totalMatches,
            connectedPlayers: msg.connectedPlayers,
          });
        });
      },
    });

    this.authService.initializeAuth();

    // lang init
    this.translate.addLangs(['it', 'en']);
    this.translate.setDefaultLang('it');

    const browserLang = this.translate.getBrowserLang();
    const langToUse =
      browserLang && ['it', 'en'].includes(browserLang) ? browserLang : 'it';

    this.translate.use(langToUse);
    this.rabbit.connect();

    // If the page was reloaded, navigate to slashash to avoid issues with the app state
    const navigationEntry = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    if (navigationEntry?.type === 'reload') {
      this.router.navigateByUrl('/');
    }
  }
}
