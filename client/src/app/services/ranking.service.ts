import { Injectable } from '@angular/core';
import { RankingsData } from '../models/ranking.model';

@Injectable({
  providedIn: 'root',
})
export class RankingsService {
  private rankingsData: RankingsData = {};
  private lastUpdate?: Date;

  /**
   * Returns true if no data yet or more than one minute passed since last update.
   */
  updateNeeded(): boolean {
    return !this.lastUpdate || this.timeToUpdate();
  }

  /**
   * Stores new rankings only if an update is needed.
   */
  updateRankings(newRankings: RankingsData): void {
    if (!this.lastUpdate || this.timeToUpdate()) {
      this.rankingsData = newRankings;
      this.lastUpdate = new Date();
    }
  }

  /**
   * Retrieves the cached rankings.
   */
  getRankings(): RankingsData {
    return this.rankingsData;
  }

  /**
   * Checks if more than 1 minute has passed since the last update.
   */
  private timeToUpdate(): boolean {
    return (
      !!this.lastUpdate && this.lastUpdate.getTime() + 60_000 <= Date.now()
    );
  }
}
