import { Injectable, inject } from '@angular/core';
import { GameDataService } from './game-data.service';
import { RabbitService } from './rabbit.service';
import { ChatHandlerService } from './chat.service';
import { PathService } from './path.service';

@Injectable({ providedIn: 'root' })
export class GameResetService {
  private gameData = inject(GameDataService);
  private path = inject(PathService);
  private rabbit = inject(RabbitService);
  private chat = inject(ChatHandlerService);

  // track timers for different modes
  private timers: { [key: string]: any } = {};

  quitGame(mode: string) {
    switch (mode) {
      case 'bootmp-mmaking':
        this.gameData.reset();
        break;

      case 'bootmp-match':
        // this.clearTimer('bootmp-match-startCountdown');
        // this.clearTimer('bootmp-match-gameTimer');
        //this.path.quitGame();
        this.gameData.reset();
        break;

      case 'bootmp-aftermatch':
        this.gameData.reset();
        break;

      case 'arcade-aftermatch':
        this.rabbit.quitGame();
        this.gameData.initializeMatchData();
        this.chat.clearChat();
        this.clearTimer('arcade-aftermatch');
        break;

      case 'arcade-match':
        this.clearTimer('arcade-match-startCountdown');
        this.clearTimer('arcade-match-gameTimer');
        this.rabbit.quitGame();
        //this.path.quitGame();
        this.chat.clearChat();
        this.gameData.initializeMatchData();
        break;

      case 'custom-mmaking':
        this.rabbit.quitGame();
        this.gameData.initializeMatchData();
        this.chat.clearChat();
        break;

      case 'custom-newmatch':
        this.rabbit.quitGame();
        this.gameData.initializeMatchData();
        break;

      case 'random-mmaking':
        this.rabbit.quitGame();
        this.gameData.initializeMatchData();
        this.chat.clearChat();
        this.clearTimer('random-mmaking');
        break;

      case 'royale-newmatch':
        this.rabbit.quitGame();
        this.gameData.initializeMatchData();
        break;

      case 'royale-mmaking':
        this.rabbit.quitGame();
        this.gameData.initializeMatchData();
        this.chat.clearChat();
        this.clearTimer('royale-mmaking');
        break;

      case 'royale-match':
        this.clearTimer('royale-match-startCountdown');
        this.clearTimer('royale-match-gameTimer');
        this.rabbit.quitGame();
        //this.path.quitGame();
        this.chat.clearChat();
        this.gameData.initializeMatchData();
        break;

      case 'royale-aftermatch':
        this.rabbit.quitGame();
        this.gameData.initializeMatchData();
        this.chat.clearChat();
        this.clearTimer('royale-aftermatch');
        break;

      default:
        // fallback for unknown modes
        this.gameData.initializeMatchData();
        break;
    }
  }
  /**
   * Quit/reset game depending on the mode
   */
  squitGame(mode: string) {
    switch (mode) {
      case 'boottmp':
        this.gameData.reset();
        break;

      case '/custom-mmaking':
        this.rabbit.quitGame();
        this.gameData.reset();
        break;

      case 'random':
        this.rabbit.quitGame();
        this.gameData.reset();
        this.chat.clearChat();
        this.clearTimer('random');
        break;

      case 'royale':
        this.rabbit.quitGame();
        this.gameData.initializeMatchData();
        this.chat.clearChat();
        this.clearTimer('royale');
        break;

      case 'arcade':
        this.rabbit.quitGame();
        this.gameData.reset();
        this.chat.clearChat();
        this.clearTimer('arcade');
        break;

      case 'arcade-match':
        this.rabbit.quitGame();
        this.gameData.reset();
        this.chat.clearChat();
        this.gameData.initializeMatchData();
        this.clearTimer('arcade-match');
        break;

      default:
        this.gameData.reset();
        break;
    }
  }

  /**
   * Register timers so they can be cleared when quitting
   */
  registerTimer(mode: string, timerId: any) {
    this.timers[mode] = timerId;
  }

  private clearTimer(mode: string) {
    const timerId = this.timers[mode];
    if (timerId) {
      clearInterval(timerId);
      this.timers[mode] = undefined;
    }
  }
}
