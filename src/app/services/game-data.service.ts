import { Injectable } from '@angular/core';
import {
  GameData,
  GameType,
  GeneralSettings,
  GlobalResult,
} from '../models/game-data.model';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { Match, MatchResult } from '../models/match.model';

@Injectable({
  providedIn: 'root',
})
export class GameDataService {
  private gameDataSubject = new BehaviorSubject<GameData>(this.emptyGameData());
  readonly gameData$ = this.gameDataSubject.asObservable();

  private userTimer$ = new BehaviorSubject<number>(0);
  private enemyTimer$ = new BehaviorSubject<number>(0);
  private intervalId?: any;

  readonly gameTypes = {
    bootmp: 'bootmp' as GameType,
    random: 'random' as GameType,
    custom: 'custom' as GameType,
    royale: 'royale' as GameType,
  };

  constructor() {
    this.emptyGameData();
  }

  /* -------------------------------------------------------------------- *
   * Initializators: metodi per 'pulire' la struttura dati, nel momento
   * in cui vada resettata
   * -------------------------------------------------------------------- */

  // pulizia dei dati relativi alla partita
  initializeMatchData(): void {
    this.gameDataSubject.next({
      ...this.value,
      match: this.emptyMatch(),
      matchRanking: [],
      globalRanking: [],
    });
  }

  /* ---------------- Public API ---------------- */

  /** current snapshot */
  get value(): GameData {
    return this.gameDataSubject.value;
  }

  // pulizia di tutti i dati al valore iniziale
  reset(): void {
    this.gameDataSubject.next(this.emptyGameData());
  }

  /** update a top-level key with a partial object */
  update<K extends keyof GameData>(key: K, patch: Partial<GameData[K]>): void {
    this.gameDataSubject.next({
      ...this.value,
      [key]: { ...this.value[key], ...patch },
    });
  }

  /** replace a full array (e.g. rankings) */
  setArray<K extends keyof GameData>(key: K, arr: GameData[K]): void {
    this.gameDataSubject.next({
      ...this.value,
      [key]: arr,
    });
  }

  /** derived selectors for convenience */
  select<K extends keyof GameData>(key: K): Observable<GameData[K]> {
    return this.gameData$.pipe(
      map((g) => g[key]),
      distinctUntilChanged()
    );
  }

  updateGlobalRanking(newRanking: GlobalResult[]): void {
    const current = this.value;
    const type = current.general.gameType;

    // nuovo oggetto GameData con ranking aggiornato
    const next: GameData = {
      ...current,
      globalRanking: [...newRanking],
    };

    if (type === this.gameTypes.random || type === this.gameTypes.custom) {
      const [p1, p2] = newRanking;
      const user = p1.playerId === current.user.playerId ? p1 : p2;
      const enemy = user === p1 ? p2 : p1;

      next.userGlobalResult = { ...user };
      next.enemyGlobalResult = { ...enemy };
    }

    this.gameDataSubject.next(next);
  }

  updateMatchRanking(newRanking: MatchResult[]): void {
    const current = this.value;
    const type = current.general.gameType;

    const next: GameData = {
      ...current,
      matchRanking: [...newRanking],
    };

    if (type === this.gameTypes.random || type === this.gameTypes.custom) {
      const [p1, p2] = newRanking;
      const user = p1.playerId === current.user.playerId ? p1 : p2;
      const enemy = user === p1 ? p2 : p1;

      next.userMatchResult = { ...user };
      next.enemyMatchResult = { ...enemy };
    }

    this.gameDataSubject.next(next);
  }

  getUserTimer(): Observable<number> {
    return this.userTimer$.asObservable();
  }

  getEnemyTimer(): Observable<number> {
    return this.enemyTimer$.asObservable();
  }

  /** For saving match state */
  getUserFinalTime(): number {
    return this.userTimer$.value;
  }

  getEnemyFinalTime(): number {
    return this.enemyTimer$.value;
  }
  /* ------------------ Helper Methods ------------------ */

  startTimer(initial: number) {
    console.log('Starting timer with', initial);
    this.userTimer$.next(initial);
    // this.userTimer$.next(3000);
    this.enemyTimer$.next(initial);
    this.intervalId = setInterval(() => {
      const nextUser = this.userTimer$.value - 10;
      const nextEnemy = this.enemyTimer$.value - 10;

      this.userTimer$.next(nextUser);
      this.enemyTimer$.next(nextEnemy);
    }, 10);
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  calculateMatchPoints(pathLength: number): number {
    // ogni passo vale 2 punti
    return pathLength * 2;
  }

  calculateWinnerBonusPoints(time: number): number {
    // il tempo viene scalato su un massimo di 15 punti
    return Math.floor((15 * time) / this.value.general.timerSetting);
  }

  setNewMatchTiles(): void {
    this.update('match', { tiles: this.generateNewMatchTiles() });
  }

  // funzione per la generazione locale di nuove tiles; utilizzata nel boot camp
  private generateNewMatchTiles(): string[][] {
    const colors = ['R', 'Y', 'G'];
    let tiles = '';
    for (let i = 0; i < 25; i++) {
      tiles += colors[Math.floor(Math.random() * 3)];
    }
    return this.formatMatchTiles(tiles);
  }

  // converte la stringa 'GRY' in una matrice 5x5
  formatMatchTiles(tileStr: string): string[][] {
    const grid: string[][] = [];
    for (let i = 0; i < 5; i++) {
      const row: string[] = [];
      for (let j = 0; j < 5; j++) {
        row.push(tileStr[i * 5 + j]);
      }
      grid.push(row);
    }
    return grid;
  }

  // ottiene la notazione 'secondi' : 'centesimi'
  formatTimeDecimals(ms: number): string {
    const dec = Math.floor((ms / 10) % 100)
      .toString()
      .padStart(2, '0');
    const sec = Math.floor((ms / 1000) % 60);
    const min = Math.floor(ms / 60000);
    return min ? `${min}:${sec}:${dec}` : `${sec}:${dec}`;
  }

  // formattazione utilizzata durante il match
  formatTimeMatchClock(ms: number): string {
    const dec = Math.floor((ms / 100) % 10).toString();
    const sec = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, '0');
    const min = Math.floor(ms / 60000);
    return min ? `${min}' ${sec}` : `${sec}:${dec}`;
  }

  // ottiene la notazione 'minuti' : 'secondi'; utilizzata in mmaking
  formatTimeSeconds(ms: number): string {
    const sec = Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, '0');
    const min = Math.floor((ms % 3600000) / 60000);
    const hr = Math.floor(ms / 3600000);
    return (hr ? hr + ':' : '') + min + ':' + sec;
  }

  // funzione che restituisce una stringa leggibile dato il valore di un timer
  formatTimeStatic(ms: number): string {
    switch (ms) {
      case 15000:
        return '15_SECONDS';
      case 30000:
        return '30_SECONDS';
      case 60000:
        return '1_MINUTE';
      case 120000:
        return '2_MINUTES';
      default:
        return '';
    }
  }

  formatChatDate(ms: number): string {
    const date = new Date(ms);
    const h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  // restituisce il vincitore della partita corrente in base
  // nell'ordine a: passi effettuati e tempo impiegato
  getMatchWinner(): any {
    const { gameType, botSetting } = this.value.general;
    const user = this.value.userMatchResult;
    const enemy = this.value.enemyMatchResult;

    if (gameType === this.gameTypes.royale) {
      return this.value.matchRanking[0];
    } else if (botSetting === 0) {
      return user;
    } else if (user.pathLength > enemy.pathLength) {
      return user;
    } else if (user.pathLength < enemy.pathLength) {
      return enemy;
    } else if (user.time > enemy.time) {
      return user;
    } else if (user.time < enemy.time) {
      return enemy;
    } else {
      return { playerId: -1, nickname: 'Draw!' };
    }
  }

  getGameTypes() {
    return this.gameTypes;
  }

  /* ------------------ Private Structures ------------------ */

  /* ---------------- Private helpers ---------------- */

  private emptyGameData(): GameData {
    return {
      general: {
        gameName: undefined,
        startDate: undefined,
        scheduledStart: false,
        gameRoomId: -1,
        timerSetting: 30000,
        maxPlayersSetting: 20,
        code: '0000',
        gameType: undefined,
        botSetting: -1,
      },
      user: this.emptyPlayer(),
      enemy: this.emptyPlayer(),
      aggregated: {
        connectedPlayers: 0,
        positionedPlayers: 0,
        readyPlayers: 0,
        matchCount: 0,
      },
      match: this.emptyMatch(),
      matchRanking: [],
      globalRanking: [],
      userMatchResult: this.emptyMatchResult(),
      enemyMatchResult: this.emptyMatchResult(),
      userGlobalResult: this.emptyGlobalResult(),
      enemyGlobalResult: this.emptyGlobalResult(),
    };
  }

  private generateEmptyGeneral() {
    return {
      gameName: undefined,
      startDate: undefined,
      scheduledStart: false,
      gameRoomId: -1,
      timerSetting: 30000,
      maxPlayersSetting: 20,
      code: '0000',
      gameType: undefined,
      botSetting: -1,
    };
  }

  private generateEmptyAggregated() {
    return {
      connectedPlayers: 0,
      positionedPlayers: 0,
      readyPlayers: 0,
      matchCount: 0,
    };
  }

  private emptyPlayer(): Player {
    return {
      nickname: 'Anonymous',
      validated: false,
      organizer: false,
      playerId: -1,
    };
  }

  private emptyMatch(): Match {
    return {
      tiles: [],
      enemyTime: -1,
      enemyPositioned: false,
      time: -1,
      positioned: false,
      winnerId: -1,
      startPosition: { side: -1, distance: -1 },
      enemyStartPosition: { side: -1, distance: -1 },
    };
  }

  private emptyMatchResult() {
    return {
      nickname: 'Anonymous',
      playerId: -1,
      time: -1,
      points: 0,
      pathLength: 0,
      startPosition: { side: -1, distance: -1 },
    };
  }

  private emptyGlobalResult() {
    return {
      nickname: 'Anonymous',
      playerId: -1,
      wonMatches: 0,
      points: 0,
    };
  }
}
