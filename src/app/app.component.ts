import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/shared/footer/footer.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showFooter = event.urlAfterRedirects !== '/';
      });
  }

  ngOnInit(): void {
    this.authService.initializeAuth();

    // lang init
    this.translate.addLangs(['it', 'en']);
    this.translate.setDefaultLang('it');

    const browserLang = this.translate.getBrowserLang();
    const langToUse =
      browserLang && ['it', 'en'].includes(browserLang) ? browserLang : 'it';

    this.translate.use(langToUse);

    // If the page was reloaded, navigate to slashash to avoid issues with the app state
    const navigationEntry = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    if (navigationEntry?.type === 'reload') {
      this.router.navigateByUrl('/');
    }
  }
}
