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
  private botPlaced = false;

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
    if (onEnemyTick) {
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
    if (this.botPlaced) return;
    this.botPlaced = true;

    const botPath = this.path.calculateBotPath(botSetting);
    this.gameData.update('match', {
      enemyPositioned: true,
      enemyTime: triggerTime,
      enemyStartPosition: botPath.startPosition,
    });
  }

  resetMatchState() {
    this.resetForNewTimers();
  }

  private resetForNewTimers() {
    this.subs.unsubscribe();
    this.subs = new Subscription();
    this.botPlaced = false;
    this.positionEnemyTrigger = 0;
    this.playerAnimationDone = false;
    this.enemyAnimationDone = false;
    this.isAnimationReady = false;
    this.gameData.stopTimer();
  }

  executeEndSequence(
    playerType?: 'player' | 'enemy',
    options?: { onComplete?: () => void }
  ): void {
    console.log('Executing end sequence for', playerType);
    const current = this.gameData.value;

    // Handle animation state
    if (playerType === 'player') this.playerAnimationDone = true;
    if (playerType === 'enemy') {
      this.enemyAnimationDone = true;
    }

    // if playerType is not defined, skip animations
    const skipAnimations = !playerType;
    if (
      !skipAnimations &&
      !(this.playerAnimationDone && this.enemyAnimationDone)
    )
      return;

    // Prevent multiple executions
    if (this.isAnimationReady) return;
    this.isAnimationReady = true;

    // Update the user match result with path information
    const userPath = this.path.value;
    this.gameData.update('userMatchResult', {
      pathLength: userPath.pathLength,
      startPosition: userPath.startPosition,
      nickname: current.user.nickname,
      playerId: current.user.playerId,
      time: current.match.time,
    });

    // Ensure enemy match data exists
    let enemyPathLength = current.enemyMatchResult?.pathLength ?? 0;
    let enemyTime = current.match.enemyTime;

    if (current.general.botSetting !== 0) {
      const botPath = this.path.calculateBotPath(current.general.botSetting);
      enemyPathLength = botPath.pathLength;

      this.gameData.update('enemyMatchResult', {
        nickname: current.enemy.nickname,
        playerId: current.enemy.playerId,
        pathLength: enemyPathLength,
        time: enemyTime,
        startPosition: current.match.enemyStartPosition,
      });
    } else {
      const existingEnemy = current.enemyMatchResult;
      this.gameData.update('enemyMatchResult', {
        nickname: existingEnemy.nickname || current.enemy.nickname,
        playerId: existingEnemy.playerId || current.enemy.playerId,
        pathLength: existingEnemy.pathLength ?? 0,
        time:
          existingEnemy.time >= 0
            ? existingEnemy.time
            : current.match.enemyTime ?? 0,
        startPosition: existingEnemy.startPosition ||
          current.match.enemyStartPosition || { side: -1, distance: -1 },
      });
    }

    // Increment aggregated match count
    this.gameData.update('aggregated', {
      matchCount: current.aggregated.matchCount + 1,
    });

    // Determine winner
    const winner = this.gameData.getMatchWinner();

    this.gameData.update('match', { winnerId: winner.playerId });

    // --- Calculate and assign points for BOTH players ---
    const user = this.gameData.value.userMatchResult;
    const enemy = this.gameData.value.enemyMatchResult;

    const userPoints =
      this.gameData.calculateMatchPoints(user.pathLength) +
      this.gameData.calculateWinnerBonusPoints(user.time);
    const enemyPoints =
      this.gameData.calculateMatchPoints(enemy.pathLength) +
      this.gameData.calculateWinnerBonusPoints(enemy.time);

    // Update both (winner and loser get their base points)
    this.gameData.update('userMatchResult', { points: userPoints });
    this.gameData.update('enemyMatchResult', { points: enemyPoints });

    // Winner gets an extra match count increment
    if (winner.playerId === current.user.playerId) {
      this.gameData.update('userGlobalResult', {
        points: current.userGlobalResult.points + userPoints,
        wonMatches: current.userGlobalResult.wonMatches + 1,
      });
    } else if (winner.playerId === current.enemy.playerId) {
      this.gameData.update('enemyGlobalResult', {
        points: current.enemyGlobalResult.points + enemyPoints,
        wonMatches: current.enemyGlobalResult.wonMatches + 1,
      });
    }

    // --- Callback or navigation ---
    if (options?.onComplete) options.onComplete();
  }

  stopAll() {
    this.resetForNewTimers();
  }
}
