import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
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
export class RankingsComponent implements OnInit, OnDestroy {
  userLogged = false;
  userNickname = '';
  rankIndex = 0;
  indexes = {
    top10MatchDaily: 0,
    top10MatchGlobal: 1,
    top10PointsDaily: 2,
    top10PointsGlobal: 3,
  };

  myGlobalMatchRank: any | null = null;
  myGlobalPointsRank: any | null = null;

  rankingTitles: string[] = [];
  rankingSubTitles: string[] = [];
  rankings: RankingsData = {};
  languageModal = false;
  basePlaying = false;

  isLoading = true;

  constructor(
    private translate: TranslateService,
    private rabbit: RabbitService,
    private auth: AuthService,
    private gameData: GameDataService,
    private rankingsHandler: RankingsService,
    private audio: AudioService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.userLogged = !!user.firebaseUser && !!user.serverData;
      if (!this.userLogged) return;
      this.userNickname = user.serverData?.nickname ?? '';
    });

    this.loadTranslations();
    this.initRankings();

    this.rabbit.setPageCallbacks({
      onRankingsResponse: (message: any) => {
        const top10PointsGlobal = message.success
          ? JSON.parse(message.top10PointsGlobal)
          : [];

        const top10PointsDaily = message.success
          ? JSON.parse(message.top10PointsDaily)
          : [];

        const top10MatchGlobal = message.success
          ? JSON.parse(message.top10MatchGlobal)
          : [];

        const top10MatchDaily = message.success
          ? JSON.parse(message.top10MatchDaily)
          : [];

        const myGlobalMatchRank = message.myGlobalMatchRank ?? null;
        const myGlobalPointsRank = message.myGlobalPointsRank ?? null;

        this.rankingsHandler.updateRankings({
          top10MatchDaily,
          top10MatchGlobal,
          top10PointsDaily,
          top10PointsGlobal,
          myGlobalMatchRank,
          myGlobalPointsRank,
        });

        this.rankings = this.rankingsHandler.getRankings();

        this.myGlobalMatchRank = myGlobalMatchRank;
        this.myGlobalPointsRank = myGlobalPointsRank;

        this.isLoading = false;
      },
    });

    this.basePlaying = this.audio.isEnabled();
  }

  ngOnDestroy(): void {
    this.rabbit.clearPageCallbacks();
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
      this.isLoading = true;
      this.rankings = {};
      this.rabbit.sendRankingsRequest(
        this.auth.currentUser?.firebaseUser?.uid ?? ''
      );
    } else {
      this.isLoading = false;
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

  isCurrentUser(nickname: string): boolean {
    return this.userLogged && nickname === this.userNickname;
  }
}
