import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SessionService } from '../../services/session.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-splash',
  imports: [TranslateModule],
  standalone: true,
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
})
export class SplashComponent implements OnInit {
  clientVersion = '3.3.4';
  basePlaying = false;
  currentYear = new Date().getFullYear();

  constructor(private router: Router, private sessionHandler: SessionService) {}

  ngOnInit(): void {
    this.sessionHandler.validateSession();
  }

  goToHome(): void {
    this.sessionHandler.enableNoSleep();
    this.router.navigate(['/home']);
  }
}
