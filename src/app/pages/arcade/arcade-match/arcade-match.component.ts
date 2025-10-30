import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GameDataService } from '../../../services/game-data.service';
import { PathService } from '../../../services/path.service';
import { AudioService } from '../../../services/audio.service';
import { SessionService } from '../../../services/session.service';
import { AuthService } from '../../../services/auth.service';
import { VisibilityService } from '../../../services/visibility.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Player } from '../../../models/player.model';
import { GeneralSettings } from '../../../models/game-data.model';
import { Match } from '../../../models/match.model';
import { Path } from '../../../models/path.model';

@Component({
  selector: 'app-arcade-match',
  imports: [],
  standalone: true,
  templateUrl: './arcade-match.component.html',
  styleUrl: './arcade-match.component.scss',
})
export class ArcadeMatchComponent {
  showDraggableRoby = true;
  showCompleteGrid = false;
  showArrows = false;
  draggableRobyImage = 'roby-idle';
  startCountdownText = '';
  countdownInProgress = false;
  userTimerValue = 0;
  enemyTimerValue = 0;
  userTimerAnimation = '';
  enemyTimerAnimation = '';
  exitGameModal = false;
  forceExitModal = false;
  forceExitText = '';

  //dati di gioco
  user!: Player;
  enemy!: Player;
  general!: GeneralSettings;
  match!: Match;
  playerPath?: Path;
  enemyPath?: Path;

  //punti attuali
  userPoints = 0;
  enemyPoints = 0;

  private destroy$ = new Subject<void>();

  userNickname = '';
  userLogged = false;

  private countdownInterval?: any;
  private gameTimer?: any;
  private nextGameTimerValue = 0;

  subs = new Subscription();

  constructor(
    private router: Router,
    private translate: TranslateService,
    private gameData: GameDataService,
    private path: PathService,
    private audio: AudioService,
    private session: SessionService,
    private auth: AuthService,
    private visibility: VisibilityService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    if (this.session.isSessionInvalid()) {
      // this.quitGame();
      this.router.navigateByUrl('/');
      return;
    }

    this.initUserData();
    // this.initMatch();
    this.startCountdown();

    // handle visibility loss
    this.visibility.setDeadlineCallback(() => {
      this.zone.run(() => {
        // this.quitGame();
        this.translate
          .get('FORCE_EXIT')
          .subscribe((t) => (this.forceExitText = t));
        this.forceExitModal = true;
      });
    });
  }

  ngOnDestroy(): void {
    // this.quitGame();
  }

  private initUserData(): void {
    this.subs.add(
      this.gameData.gameData$
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.user = data.user;
          this.enemy = data.enemy;
          this.general = data.general;
          this.match = data.match;
          this.userPoints = data.userGlobalResult.points;
          this.enemyPoints = data.enemyGlobalResult.points;
        })
    );
  }

  // private initMatch(): void {
  //   this.user = this.gameData.getUser();
  //   this.enemy = this.gameData.getEnemy();
  //   this.match = this.gameData.getMatch();
  //   this.userTimerValue = this.gameData.getGeneral().timerSetting;
  //   this.enemyTimerValue = this.gameData.getGeneral().timerSetting;
  //   this.nextGameTimerValue = this.userTimerValue;

  //   this.path.();
  // }

  private startCountdown(): void {
    this.countdownInProgress = true;
    this.audio.playSound('countdown');
    let value = 3;
    this.startCountdownText = value.toString();

    this.countdownInterval = setInterval(() => {
      this.zone.run(() => {
        value--;
        if (value > 0) {
          this.audio.playSound('countdown');
          this.startCountdownText = value.toString();
        } else if (value === 0) {
          this.audio.playSound('start');
          this.startCountdownText = "Let's Cody!";
        } else {
          clearInterval(this.countdownInterval);
          this.countdownInterval = undefined;
          this.countdownInProgress = false;
          this.startMatchTimers();
        }
      });
    }, 1000);
  }

  private startMatchTimers(): void {
    const interval = 10;
    let expected = Date.now() + interval;

    const step = () => {
      this.zone.run(() => {
        const drift = Date.now() - expected;
        this.nextGameTimerValue -= interval + drift;

        if (this.nextGameTimerValue > 0) {
          if (!this.match.positioned)
            this.userTimerValue = this.nextGameTimerValue;
          if (!this.match.enemyPositioned)
            this.enemyTimerValue = this.nextGameTimerValue;
          if (this.userTimerValue < 10000)
            this.userTimerAnimation = 'clock-ending-animation';
          if (this.enemyTimerValue < 10000)
            this.enemyTimerAnimation = 'clock-ending-animation';

          expected = Date.now() + interval;
          this.gameTimer = setTimeout(step, interval);
        } else {
          this.onTimerEnd();
        }
      });
    };

    this.gameTimer = setTimeout(step, interval);
  }

  private onTimerEnd(): void {
    if (!this.match.positioned) {
      this.match.positioned = true;
      this.match.time = 0;
      this.match.startPosition = { side: -1, distance: -1 };
      this.userTimerValue = 0;
      this.userTimerAnimation = 'clock--end';
      this.showCompleteGrid = true;
      this.showArrows = false;
      this.showDraggableRoby = false;
    }
    if (!this.match.enemyPositioned) {
      this.enemyTimerAnimation = 'clock--end';
      this.enemyTimerValue = 0;
    }
  }

  startDragging(): void {
    this.audio.playSound('roby-drag');
    this.showCompleteGrid = true;
    this.showArrows = true;
    this.draggableRobyImage = 'roby-dragging-trasp';
  }

  endDragging(): void {
    this.audio.playSound('roby-drop');
    // if (!this.match.startAnimation) {
    //   this.showArrows = false;
    //   this.showCompleteGrid = false;
    //   this.draggableRobyImage = 'roby-idle';
    // }
  }
}
