import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';
import { GameDataService } from './game-data.service';
import { PathService } from './path.service';

@Injectable({
  providedIn: 'root',
})
export class MatchManagerService {
  private subs = new Subscription();
  private positionEnemyTrigger = 0;
  private isAnimationReady = false;
  private playerAnimationDone = false;
  private enemyAnimationDone = false;

  constructor(
    private gameData: GameDataService,
    private path: PathService,
    private router: Router
  ) {}

  /**
   * Starts both timers and handles bot + user logic automatically.
   */
  startMatchTimers(
    botSetting: number,
    generalTimer: number,
    onUserTick: (ms: number) => void,
    onEnemyTick?: (ms: number) => void,
    onUserTimeout?: () => void
  ) {
    this.gameData.startTimer(generalTimer);

    // Calculate when the bot should move (based on difficulty)
    if (botSetting !== 0) {
      this.positionEnemyTrigger =
        generalTimer * (botSetting / (botSetting + 1));
    }

    // USER TIMER
    this.subs.add(
      this.gameData.getUserTimer().subscribe((ms) => {
        onUserTick(ms);
        if (ms <= 0 && onUserTimeout) {
          onUserTimeout();
        }
      })
    );

    // ENEMY TIMER
    if (botSetting !== 0 && onEnemyTick) {
      this.subs.add(
        this.gameData.getEnemyTimer().subscribe((ms) => {
          onEnemyTick(ms);
          if (ms <= this.positionEnemyTrigger) {
            this.placeBot(botSetting, this.positionEnemyTrigger);
          }
        })
      );
    }
  }

  /**
   * Called when user runs out of time before placing the robot
   */
  handleUserTimeout(user: Player) {
    if (this.gameData.value.match.positioned) return;

    this.gameData.update('match', {
      positioned: true,
      time: 0,
      startPosition: { side: -1, distance: -1 },
    });

    this.gameData.update('userMatchResult', {
      nickname: user.nickname,
      playerId: user.playerId,
      pathLength: 0,
      time: 0,
      points: 0,
      startPosition: { side: -1, distance: -1 },
    });

    this.executeEndSequence();
  }

  /**
   * Auto-position the bot when its timer hits the trigger threshold
   */
  private placeBot(botSetting: number, triggerTime: number) {
    const botPath = this.path.calculateBotPath(botSetting);
    this.gameData.update('match', {
      enemyPositioned: true,
      enemyTime: triggerTime,
      enemyStartPosition: botPath.startPosition,
    });
  }

  resetMatchState() {
    this.isAnimationReady = false;
    this.playerAnimationDone = false;
    this.enemyAnimationDone = false;
    this.positionEnemyTrigger = 0;
    this.subs.unsubscribe();
    this.subs = new Subscription();
  }

  /**
   * Wrap up the match, calculate scores, navigate to after-match.
   */
  executeEndSequence(
    playerType?: string,
    options?: { onComplete?: () => void }
  ) {
    const current = this.gameData.value;

    if (playerType === 'player') this.playerAnimationDone = true;
    if (playerType === 'enemy' || current.general.botSetting === 0) {
      this.enemyAnimationDone = true;
    }

    // If playerType is undefined, it means timeout
    const skipAnimations = !playerType;

    // Only proceed if both animations are done or skipping
    if (
      skipAnimations ||
      (this.playerAnimationDone && this.enemyAnimationDone)
    ) {
      if (this.isAnimationReady) return;
      this.isAnimationReady = true;

      if (current.general.botSetting !== 0) {
        const botPath = this.path.calculateBotPath(current.general.botSetting);
        this.gameData.update('enemyMatchResult', {
          nickname: current.enemy.nickname,
          playerId: current.enemy.playerId,
          pathLength: botPath.pathLength,
          time: current.match.enemyTime,
          startPosition: current.match.enemyStartPosition,
        });
      }

      // Aggregate results and calculate scores
      this.gameData.update('aggregated', {
        matchCount: current.aggregated.matchCount + 1,
      });

      const winner = this.gameData.getMatchWinner();
      this.gameData.update('match', { winnerId: winner.playerId });

      if (winner.playerId === current.user.playerId) {
        const userPoints =
          this.gameData.calculateMatchPoints(
            current.userMatchResult.pathLength
          ) +
          this.gameData.calculateWinnerBonusPoints(
            current.userMatchResult.time
          );

        this.gameData.update('userMatchResult', { points: userPoints });
        this.gameData.update('userGlobalResult', {
          points: current.userGlobalResult.points + userPoints,
          wonMatches: current.userGlobalResult.wonMatches + 1,
        });
      } else if (winner.playerId === current.enemy.playerId) {
        const enemyPoints =
          this.gameData.calculateMatchPoints(
            current.enemyMatchResult.pathLength
          ) +
          this.gameData.calculateWinnerBonusPoints(
            current.enemyMatchResult.time
          );

        this.gameData.update('enemyMatchResult', { points: enemyPoints });
        this.gameData.update('enemyGlobalResult', {
          points: current.enemyGlobalResult.points + enemyPoints,
          wonMatches: current.enemyGlobalResult.wonMatches + 1,
        });
      }

      // Call the callback if provided
      if (options?.onComplete) options.onComplete();
    }
  }

  stopAll() {
    this.subs.unsubscribe();
    this.gameData.stopTimer();
  }
}
