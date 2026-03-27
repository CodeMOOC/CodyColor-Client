import { inject, Injectable } from '@angular/core';
import { GameDataService } from './game-data.service';
import { ChatHandlerService } from './chat.service';
import { MatchManagerService } from './match-manager.service';
import { PathService } from './path.service';
import { RabbitService } from './rabbit.service';

@Injectable({ providedIn: 'root' })
export class GameLifecycleService {
  private gameData = inject(GameDataService);
  private path = inject(PathService);
  private rabbit = inject(RabbitService);
  private chat = inject(ChatHandlerService);
  private match = inject(MatchManagerService);

  /* ---------------- MATCH ---------------- */

  startNewMatch(): void {
    // this.rabbit.quitGame();
    this.match.resetMatchState();
    this.path.reset();
    this.chat.clearChat();
    this.gameData.reset();
  }

  endMatch(): void {
    this.match.resetMatchState(); // stop timers
  }

  restartMatch(): void {
    this.match.resetMatchState();
    this.path.reset();
    // this.chat.clearChat();
    // this.gameData.initializeMatchData();
  }

  leaveGame(): void {
    this.match.resetMatchState();
    this.path.reset();
    this.chat.clearChat();
    this.gameData.reset();
    this.rabbit.quitGame;
  }
}
