import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Import the Angular services you already have, converted from AngularJS
import { RabbitService } from '../../../services/rabbit.service';
import { GameDataService } from '../../../services/game-data.service';
import { AudioService } from '../../../services/audio.service';
import { SessionService } from '../../../services/session.service';
import { LanguageService } from '../../../services/language.service';
import { VisibilityService } from '../../../services/visibility.service';
import { ShareService } from '../../../services/share.service';
import { CommonModule } from '@angular/common';
import { PathService } from '../../../services/path.service';
import { Subject, takeUntil } from 'rxjs';
import { MatchManagerService } from '../../../services/match-manager.service';

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
  enemyMatch: any;
  enemyGlobal: any;
  userMatch: any;
  userGlobal: any;

  newMatchClicked = false;

  exitGameModal = false;
  forceExitModal = false;
  languageModal = false;
  basePlaying = false;
  sharedLegacy = false;

  private destroy$ = new Subject<void>();

  constructor(
    private rabbit: RabbitService,
    private audio: AudioService,
    private matchManager: MatchManagerService,
    private path: PathService,
    private session: SessionService,
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

    // Match data
    this.gameData.gameData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.user = data.user;
      this.enemy = data.enemy;
      this.general = data.general;
      this.draw = data.match.winnerId === -1;
      this.winner = this.gameData.getMatchWinner().nickname;
      this.matchCount = data.aggregated.matchCount;
      this.userGlobal = data.userGlobalResult;
      this.userMatch = data.userMatchResult;
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
    this.matchManager.resetMatchState();

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

  // Helpers used in template
  timeFormatter = this.gameData.formatTimeDecimals;

  continueForceExit(): void {
    this.audio.playSound('menu-click');
    this.quitGame();
    this.router.navigate(['/home']);
  }
}
