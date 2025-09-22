import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Import the Angular services you already have, converted from AngularJS
import { RabbitService } from '../../../services/rabbit.service';
import { GameDataService } from '../../../services/game-data.service';
import { NavigationService } from '../../../services/navigation.service';
import { AudioService } from '../../../services/audio.service';
import { SessionService } from '../../../services/session.service';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
import { VisibilityService } from '../../../services/visibility.service';
import { ShareService } from '../../../services/share.service';
import { CommonModule } from '@angular/common';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-bootmp-aftermatch',
  imports: [CommonModule, TranslateModule],
  templateUrl: './bootmp-aftermatch.component.html',
  styleUrl: './bootmp-aftermatch.component.scss',
  standalone: true,
})
export class BootmpAftermatchComponent implements OnInit {
  private gameData = inject(GameDataService);

  userLogged = false;
  userNickname = '';

  user: any;
  enemy: any;
  general: any;
  draw = false;
  winner = '';
  matchCount = 0;
  userMatch: any;
  userGlobal: any;
  enemyMatch: any;
  enemyGlobal: any;
  newMatchClicked = false;

  exitGameModal = false;
  forceExitModal = false;
  languageModal = false;
  basePlaying = false;
  sharedLegacy = false;

  constructor(
    private rabbit: RabbitService,
    private navigation: NavigationService,
    private audio: AudioService,
    private session: SessionService,
    private translate: TranslateService,
    private auth: AuthService,
    private path: PathService,
    private language: LanguageService,
    private shareService: ShareService,
    private visibility: VisibilityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Safe quit if session invalid
    if (this.session.isSessionInvalid()) {
      this.quitGame();
      this.router.navigate(['/']);
      return;
    }

    this.visibility.setDeadlineCallback(() => {
      this.rabbit.sendPlayerQuitRequest();
      this.quitGame();
      this.language.setTranslation('forceExitText', 'FORCE_EXIT');
      this.forceExitModal = true;
    });

    this.userLogged = this.auth.loginCompleted();
    if (this.userLogged) {
      this.userNickname = this.auth.getServerUserData().nickname;
    } else {
      this.language.setTranslation('userNickname', 'NOT_LOGGED');
    }

    // Match data
    this.gameData.select('user').subscribe((user) => {
      console.log('User updated:', user);
    });

    this.gameData.gameData$.subscribe((data) => {
      console.log('Game data updated:', data);
      this.enemy = data.enemy;
      this.general = data.general;
      this.draw = data.match.winnerId === -1;
      this.winner = this.gameData.getMatchWinner().nickname;
      this.matchCount = data.aggregated.matchCount;
      this.userMatch = data.userMatchResult;
      this.userGlobal = data.userGlobalResult;
      this.enemyMatch = data.enemyMatchResult;
      this.enemyGlobal = data.enemyGlobalResult;
    });

    // Play sounds
    if (this.winner === this.user.nickname) {
      this.audio.playSound('win');
    } else if (
      this.general.botSetting !== 0 &&
      this.winner === this.enemy.nickname
    ) {
      this.audio.playSound('lost');
    }

    this.basePlaying = this.audio.isEnabled();
  }

  private quitGame(): void {
    this.gameData.reset();
  }

  newMatch(): void {
    this.audio.playSound('menu-click');
    // reset match
    this.gameData.initializeMatchData();
    this.path.reset();

    this.gameData.setNewMatchTiles();
    this.router.navigate(['/bootmp-match']);
  }

  shareText(): void {
    this.audio.playSound('menu-click');
    const shareText = `I took ${this.gameData.value.userMatchResult.pathLength} steps with my Roby in a ${this.gameData.value.general.gameType} match!`;
    this.sharedLegacy = this.shareService.shareText(
      'CodyColor Multiplayer',
      shareText,
      'https://codycolor.codemooc.net'
    );
  }

  // Exit modal controls
  exitGame(): void {
    this.audio.playSound('menu-click');
    this.exitGameModal = true;
  }

  continueExitGame(): void {
    this.audio.playSound('menu-click');
    this.quitGame();
    this.router.navigate(['/home']);
  }

  stopExitGame(): void {
    this.audio.playSound('menu-click');
    this.exitGameModal = false;
  }

  // Audio controls
  toggleBase(): void {
    this.audio.toggleBase();
    this.basePlaying = this.audio.isEnabled();
  }

  // Helpers used in template
  timeFormatter = this.gameData.formatTimeDecimals;

  continueForceExit(): void {
    this.audio.playSound('menu-click');
    this.quitGame();
    this.router.navigate(['/home']);
  }
}
