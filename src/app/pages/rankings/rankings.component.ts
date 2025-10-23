import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { RabbitService } from '../../services/rabbit.service';
import { AuthService } from '../../services/auth.service';
import { GameData } from '../../models/game-data.model';
import { GameDataService } from '../../services/game-data.service';
import { RankingsService } from '../../services/ranking.service';
import { AudioService } from '../../services/audio.service';
import { SessionService } from '../../services/session.service';
import { VisibilityService } from '../../services/visibility.service';
import { RankingsData } from '../../models/ranking.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  imports: [CommonModule, TranslateModule],
  standalone: true,
  styleUrls: ['./rankings.component.scss'],
})
export class RankingsComponent implements OnInit {
  userLogged = false;
  userNickname = '';
  rankIndex = 0;
  indexes = {
    top10MatchDaily: 0,
    top10MatchGlobal: 1,
    top10PointsDaily: 2,
    top10PointsGlobal: 3,
  };
  rankingTitles: string[] = [];
  rankingSubTitles: string[] = [];
  rankings: RankingsData = {};
  languageModal = false;
  basePlaying = false;

  constructor(
    private translate: TranslateService,
    private rabbit: RabbitService,
    private auth: AuthService,
    private gameData: GameDataService,
    private rankingsHandler: RankingsService,
    private audio: AudioService,
    private session: SessionService,
    private translationHandler: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Session check
    if (this.session.isSessionInvalid()) {
      this.router.navigate(['/']);
      return;
    }

    this.userLogged = this.auth.loginCompleted();
    if (this.userLogged && this.auth.currentUser?.serverData) {
      this.userNickname = this.auth.currentUser.serverData.nickname;
    } else {
      this.translate.get('NOT_LOGGED').subscribe((res: string) => {
        this.userNickname = res;
      });
    }

    this.loadTranslations();
    this.initRankings();

    this.rabbit.setPageCallbacks({
      onRankingsResponse: (message: any) => {
        this.rankingsHandler.updateRankings({
          top10MatchDaily: message.success
            ? JSON.parse(message.top10MatchDaily)
            : [],
          top10MatchGlobal: message.success
            ? JSON.parse(message.top10MatchGlobal)
            : [],
          top10PointsDaily: message.success
            ? JSON.parse(message.top10PointsDaily)
            : [],
          top10PointsGlobal: message.success
            ? JSON.parse(message.top10PointsGlobal)
            : [],
        });
        this.rankings = this.rankingsHandler.getRankings();
      },
    });

    this.basePlaying = this.audio.isEnabled();
  }

  private loadTranslations(): void {
    this.translate
      .get([
        'TOP_10_MATCH_DAILY',
        'TOP_10_MATCH_GLOBAL',
        'TOP_10_POINTS_DAILY',
        'TOP_10_POINTS_GLOBAL',
      ])
      .subscribe((t) => {
        this.rankingTitles = [
          t['TOP_10_MATCH_DAILY'],
          t['TOP_10_MATCH_GLOBAL'],
          t['TOP_10_POINTS_DAILY'],
          t['TOP_10_POINTS_GLOBAL'],
        ];
      });

    this.translate
      .get([
        'TOP_10_MATCH_DAILY_SUBT',
        'TOP_10_MATCH_GLOBAL_SUBT',
        'TOP_10_POINTS_DAILY_SUBT',
        'TOP_10_POINTS_GLOBAL_SUBT',
      ])
      .subscribe((t) => {
        this.rankingSubTitles = [
          t['TOP_10_MATCH_DAILY_SUBT'],
          t['TOP_10_MATCH_GLOBAL_SUBT'],
          t['TOP_10_POINTS_DAILY_SUBT'],
          t['TOP_10_POINTS_GLOBAL_SUBT'],
        ];
      });
  }

  private initRankings(): void {
    if (this.rankingsHandler.updateNeeded()) {
      this.rankings = {};
      this.rabbit.sendRankingsRequest();
    } else {
      this.rankings = this.rankingsHandler.getRankings();
    }
  }

  scrollRanking(increment: boolean): void {
    if (increment) {
      this.rankIndex = this.rankIndex < 3 ? this.rankIndex + 1 : 0;
    } else {
      this.rankIndex = this.rankIndex > 0 ? this.rankIndex - 1 : 3;
    }
  }

  formatTime = (value: number) => this.gameData.formatTimeDecimals(value);
}
