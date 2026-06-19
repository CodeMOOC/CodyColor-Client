import { Injectable } from '@angular/core';

/*
 * ChatHandler: factory incaricato di gestire il modulo chat. Memorizza i messaggi di una determinata sezione di gioco,
 * e espone metodi per la sua gestione
 */
@Injectable({
  providedIn: 'root',
})
export class ChatHandlerService {
  private chatMessages: any[] = [];
  private chatHintsPreMatch: string[] = [];
  private chatHintsAfterMatch: string[] = [];

  constructor() {
    // inizializza manualmente gli id dei messaggi della chat
    const hints = [
      'HI',
      'WELCOME',
      'I_FEEL_STRONG_TODAY',
      'I_M_READY',
      'HAPPY_TO_PLAY_WITH_YOU',
      'ARE_YOU_READY',
      'PLAYING_WITH_FRIENDS',
      'FROM_NORTH',
      'FROM_SOUTH',
      'FROM_WEST',
      'FROM_EAST',
      'WELLDONE',
      'YOU_MADE_A_GREAT_SCORE',
      'IT_WAS_FUN',
      'DO_BETTER_NEXT_TIME',
      'THANKS',
      'LET_S_PLAY_AGAIN',
      'BYE',
      'SEE_YOU_NEXT_TIME',
      'EMOJI_1',
      'EMOJI_2',
      'EMOJI_3',
      'EMOJI_4',
      'EMOJI_5',
      'EMOJI_6',
      'EMOJI_7',
      'EMOJI_8',
    ];

    this.chatHintsPreMatch = [...hints];
    this.chatHintsAfterMatch = [...hints];
  }

  getChatMessages(): any[] {
    return this.chatMessages;
  }

  getChatHintsPreMatch(): string[] {
    return this.chatHintsPreMatch;
  }

  getChatHintsAfterMatch(): string[] {
    return this.chatHintsAfterMatch;
  }

  enqueueChatMessage(message: any): void {
    this.chatMessages.push(message);
    this.chatMessages.sort((a, b) => {
      if (a.date < b.date) return 1;
      else if (a.date > b.date) return -1;
      else return 0;
    });

    // lunghezza massima chat: 10 messaggi
    if (this.chatMessages.length > 10) {
      this.chatMessages.splice(10, 1);
    }
  }

  clearChat(): void {
    this.chatMessages = [];
  }
}
