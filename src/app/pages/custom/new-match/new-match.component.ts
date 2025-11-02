import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GameDataService } from '../../../services/game-data.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-new-match',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './new-match.component.html',
  styleUrl: './new-match.component.scss',
})
export class NewMatchComponent implements OnInit {
  nickname = '';
  userNickname = '';
  userLogged = false;

  basePlaying = true;

  languageModal = false;
  exitGameModal = false;
  forceExitModal = false;
  forceExitText = '';

  creatingMatch = false;

  timerSettings: { text: string; value: number }[] = [];
  currentTimerIndex = 1;

  constructor(
    private auth: AuthService,
    private gameData: GameDataService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.translate
      .get(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES'])
      .subscribe((translations) => {
        this.timerSettings = [
          { text: translations['15_SECONDS'], value: 15000 },
          { text: translations['30_SECONDS'], value: 30000 },
          { text: translations['1_MINUTE'], value: 60000 },
          { text: translations['2_MINUTES'], value: 120000 },
        ];
      });

    // Example mock state
    this.auth.authReady$.subscribe((ready) => {
      if (ready) {
        this.auth.user$.subscribe((appUser) => {
          this.userLogged = !!appUser.firebaseUser && !!appUser.serverData;
          this.userNickname = appUser.serverData?.nickname || '';
          this.nickname = this.userNickname;
        });
      }
    });
  }

  editTimer(increment: boolean) {
    if (increment)
      this.currentTimerIndex =
        this.currentTimerIndex < 3 ? this.currentTimerIndex + 1 : 3;
    else
      this.currentTimerIndex =
        this.currentTimerIndex > 0 ? this.currentTimerIndex - 1 : 0;
  }

  requestMMaking() {
    this.creatingMatch = true;
    this.gameData.update('general', { code: '0000' });
    this.gameData.update('user', {
      nickname: this.nickname,
      organizer: true,
    });

    this.router.navigate(['/custom-mmaking']);
    // Here you’d call your service or navigation
    console.log('Creating match with', {
      nickname: this.nickname,
      timer: this.timerSettings[this.currentTimerIndex],
    });
  }
}
