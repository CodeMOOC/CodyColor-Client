import { Injectable } from '@angular/core';
import {
  Client,
  IMessage,
  StompConfig,
  StompSubscription,
} from '@stomp/stompjs';

import { SettingsService } from './settings.service';

import { SessionService } from './session.service';
import { GameDataService } from './game-data.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

// TMP: To change when updating BE
import * as LZUTF8 from 'lzutf8';

@Injectable({ providedIn: 'root' })
export class RabbitService {
  private client!: Client;
  private connectedToBroker = false;
  private connectedToServer = false;
  private pageCallbacks: any = {};
  private heartbeatTimer: any;
  private subscriptions: Record<string, StompSubscription> = {};
  private lastMsgId?: string;
  private debug: boolean;

  private readonly endpoints = {
    serverControlQueue: '/queue/serverControl',
    clientControlTopic: '/topic/clientsControl',
    generalTopic: '/topic/general',
    randomGameRoomsTopic: '/topic/gameRooms',
    customGameRoomsTopic: '/topic/custGameRooms',
    agaGameRoomsTopics: '/topic/agaGameRooms',
  };

  readonly messageTypes = {
    c_connectedSignal: 'c_connectedSignal',
    s_generalInfo: 's_generalInfo', //

    c_gameRequest: 'c_gameRequest', // client richiede di giocare
    s_gameResponse: 's_gameResponse', // server fornisce credenziali di gioco

    c_playerQuit: 'c_playerQuit', // richiesta di fine gioco di un client
    s_gameQuit: 's_gameQuit', // forza il fine gioco per tutti

    s_playerAdded: 's_playerAdded', // notifica un giocatore si collega
    s_playerRemoved: 's_playerRemoved', // notifica un giocatore si scollega

    c_validation: 'c_validation', // rende l'iscrizione del giocatore 'valida' fornendo credenz. come il nick
    c_ready: 'c_ready', // segnale pronto a giocare; viene intercettato anche dai client
    s_startMatch: 's_startMatch', // segnale avvia partita

    c_positioned: 'c_positioned', // segnale giocatore posizionato
    s_timerSync: 's_timerSync', // re-rincronizza i timer ogni 5 secondi
    s_startAnimation: 's_startAnimation', // inviato quando tutti sono posizionati
    c_endAnimation: 'c_endAnimation', // notifica la fine dell'animazione, o lo skip
    s_endMatch: 's_endMatch', // segnale aftermatch

    c_heartbeat: 'c_heartbeat', // segnale heartbeat
    c_chat: 'c_chat', // chat, intercettati SOLO dai client

    c_signUpRequest: 'c_signUpRequest', // aggiunge l'utente al db con nickname
    c_logInRequest: 'c_logInRequest', // richiedi nickname utente con uid
    s_authResponse: 's_authResponse', // fornisci il nickname utente - o messaggio error

    c_userDeleteRequest: 'c_userDeleteRequest', // richiedi l'eliminazione di un utente
    s_userDeleteResponse: 's_userDeleteResponse', // conferma l'eliminazione di un utente

    c_rankingsRequest: 'c_rankingsRequest', // richiedi le classifiche
    s_rankingsResponse: 's_rankingsResponse', // restituisci le classifiche
  };

  constructor(
    private authHandler: AuthService,
    private gameDataService: GameDataService,
    private sessionHandler: SessionService,
    private settings: SettingsService
  ) {
    this.debug =
      environment.rabbit.socketUrl !== 'wss://codycolor.codemooc.net/api/ws';
  }

  connect(): void {
    this.client = new Client({
      brokerURL: environment.rabbit.socketUrl,
      connectHeaders: {
        login: environment.rabbit.username,
        passcode: environment.rabbit.password,
      },
      debug: (str) => {
        if (this.debug) console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
    });

    this.client.onConnect = () => this.onConnected();
    this.client.onWebSocketClose = () => this.onConnectionLost();
    this.client.activate();
  }

  setPageCallbacks(callbacks: any): void {
    this.pageCallbacks = callbacks;
  }

  getBrokerConnectionState(): boolean {
    return this.connectedToBroker;
  }

  getServerConnectionState(): boolean {
    return this.connectedToServer;
  }

  subscribeGameRoom(): void {
    const endpoint = this.getGameRoomEndpoint();
    this.subscriptions['gameRoom'] = this.client.subscribe(endpoint, (msg) =>
      this.handleIncomingMessage(msg)
    );

    this.heartbeatTimer = setInterval(() => {
      this.sendInServerControlQueue({
        msgType: this.messageTypes.c_heartbeat,
        gameRoomId: this.gameDataService.value.general.gameRoomId,
        playerId: this.gameDataService.value.user.playerId,
        gameType: this.gameDataService.value.general.gameType,
      });
    }, 5000);
  }

  quitGame(): void {
    this.subscriptions['gameRoom']?.unsubscribe();
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.pageCallbacks = {};
  }

  private onConnected(): void {
    this.connectedToBroker = true;
    const serverDirectEndpoint = `${
      this.endpoints.clientControlTopic
    }.${this.sessionHandler.getSessionId()}`;

    this.subscriptions['serverDirect'] = this.client.subscribe(
      serverDirectEndpoint,
      (m) => this.handleIncomingMessage(m)
    );
    this.subscriptions['general'] = this.client.subscribe(
      this.endpoints.generalTopic,
      (m) => this.handleIncomingMessage(m)
    );

    this.sendInServerControlQueue({
      msgType: this.messageTypes.c_connectedSignal,
      correlationId: this.sessionHandler.getSessionId(),
    });

    this.pageCallbacks?.onConnected?.();
  }

  private onConnectionLost(): void {
    this.connectedToBroker = false;
    this.connectedToServer = false;
    this.pageCallbacks?.onConnectionLost?.();
  }

  private sendInServerControlQueue(message: any): void {
    if (this.debug)
      console.log('DEBUG: Sent message in server queue:', message);
    message.msgId = Math.floor(Math.random() * 100000).toString();
    this.client.publish({
      destination: this.endpoints.serverControlQueue,
      body: JSON.stringify(message),
    });
  }

  private sendInGameRoomTopic(message: any): void {
    if (this.debug) console.log('DEBUG: Sent message in topic:', message);
    if (
      this.gameDataService.value.general.gameRoomId === -1 ||
      this.gameDataService.value.user.playerId === -1
    )
      return;
    message.msgId = Math.floor(Math.random() * 100000).toString();
    this.client.publish({
      destination: this.getGameRoomEndpoint(),
      body: JSON.stringify(message),
    });
  }

  private getGameRoomEndpoint(): string {
    const type = this.gameDataService.value.general.gameType;
    const id = this.gameDataService.value.general.gameRoomId;
    if (type === this.gameDataService.getGameTypes().random)
      return `${this.endpoints.randomGameRoomsTopic}.${id}`;
    if (type === this.gameDataService.getGameTypes().custom)
      return `${this.endpoints.customGameRoomsTopic}.${id}`;
    if (type === this.gameDataService.getGameTypes().royale)
      return `${this.endpoints.agaGameRoomsTopics}.${id}`;
    return '';
  }

  private handleIncomingMessage(rawMessage: IMessage): void {
    if (this.debug) console.log('DEBUG: Received message:', rawMessage.body);
    const message = JSON.parse(rawMessage.body);

    if (message.gameData) {
      message.gameData = JSON.parse(
        LZUTF8.decompress(message.gameData, {
          inputEncoding: 'StorageBinaryString',
        })
      );
    }

    if (this.lastMsgId === message.msgId) {
      console.log('Received duplicate message. Ignored.');
      return;
    }
    this.lastMsgId = message.msgId;

    const cb = this.pageCallbacks;

    switch (message.msgType) {
      case this.messageTypes.s_gameResponse:
        cb?.onGameRequestResponse?.(message);
        break;
      case this.messageTypes.s_authResponse:
        cb?.onLogInResponse?.(message);
        break;
      case this.messageTypes.s_userDeleteResponse:
        cb?.onUserDeletedResponse?.(message);
        break;
      case this.messageTypes.s_rankingsResponse:
        cb?.onRankingsResponse?.(message);
        break;
      case this.messageTypes.s_generalInfo:
        this.connectedToServer = true;
        this.sessionHandler.setGeneralInfo({
          totalMatches: message.totalMatches,
          connectedPlayers: message.connectedPlayers,
          randomWaitingPlayers: message.randomWaitingPlayers,
          requiredClientVersion: message.requiredClientVersion,
        });
        cb?.onGeneralInfoMessage?.(message);
        break;
      case this.messageTypes.c_ready:
        if (message.playerId !== this.gameDataService.value.user.playerId)
          cb?.onReadyMessage?.(message);
        break;
      case this.messageTypes.c_positioned:
        if (message.playerId !== this.gameDataService.value.user.playerId)
          cb?.onEnemyPositioned?.(message);
        break;
      case this.messageTypes.c_chat:
        if (message.playerId !== this.gameDataService.value.user.playerId)
          cb?.onChatMessage?.(message);
        break;
      case this.messageTypes.s_startAnimation:
        cb?.onStartAnimation?.(message);
        break;
      case this.messageTypes.s_startMatch:
        cb?.onStartMatch?.(message);
        break;
      case this.messageTypes.s_endMatch:
        cb?.onEndMatch?.(message);
        break;
      case this.messageTypes.s_gameQuit:
        cb?.onGameQuit?.(message);
        break;
      case this.messageTypes.s_playerAdded:
        cb?.onPlayerAdded?.(message);
        break;
      case this.messageTypes.s_playerRemoved:
        cb?.onPlayerRemoved?.(message);
        break;
    }
  }

  // richiesta per iniziare una nuova partita
  sendGameRequest(): void {
    this.sendInServerControlQueue({
      msgType: this.messageTypes.c_gameRequest,
      user: this.gameDataService.value.user,
      general: this.gameDataService.value.general,
      gameType: this.gameDataService.value.general.gameType,
      userId: this.authHandler.getFirebaseUserData().uid,
      correlationId: this.sessionHandler.getSessionId(),
      clientVersion: this.sessionHandler.getClientVersion(),
    });
  }

  sendSignUpRequest(nickname: string): void {
    this.sendInServerControlQueue({
      msgType: this.messageTypes.c_signUpRequest,
      nickname: nickname,
      email: this.authHandler.getFirebaseUserData().email,
      correlationId: this.sessionHandler.getSessionId(),
      userId: this.authHandler.getFirebaseUserData().uid,
    });
  }

  sendLogInRequest(): void {
    this.sendInServerControlQueue({
      msgType: this.messageTypes.c_logInRequest,
      correlationId: this.sessionHandler.getSessionId(),
      userId: this.authHandler.getFirebaseUserData().uid,
    });
  }

  sendRankingsRequest(): void {
    this.sendInServerControlQueue({
      msgType: this.messageTypes.c_rankingsRequest,
      correlationId: this.sessionHandler.getSessionId(),
    });
  }

  sendUserDeleteRequest(): void {
    this.sendInServerControlQueue({
      msgType: this.messageTypes.c_userDeleteRequest,
      correlationId: this.sessionHandler.getSessionId(),
      userId: this.authHandler.getFirebaseUserData().uid,
    });
  }

  // notifica all'avversario che si è pronti a iniziare la partita
  sendReadyMessage(): void {
    this.sendInGameRoomTopic({
      msgType: this.messageTypes.c_ready,
      gameRoomId: this.gameDataService.value.general.gameRoomId,
      playerId: this.gameDataService.value.user.playerId,
      gameType: this.gameDataService.value.general.gameType,
      clientDirect: true,
    });
  }

  // notifica i propri dati
  sendValidationMessage(): void {
    this.sendInGameRoomTopic({
      msgType: this.messageTypes.c_validation,
      organizer: this.gameDataService.value.user.organizer,
      gameRoomId: this.gameDataService.value.general.gameRoomId,
      playerId: this.gameDataService.value.user.playerId,
      nickname: this.gameDataService.value.user.nickname,
      gameType: this.gameDataService.value.general.gameType,
    });
  }

  // notifica all'avversario l'avvenuto posizionamento di roby
  sendPlayerPositionedMessage(): void {
    this.sendInGameRoomTopic({
      msgType: this.messageTypes.c_positioned,
      gameRoomId: this.gameDataService.value.general.gameRoomId,
      playerId: this.gameDataService.value.user.playerId,
      gameType: this.gameDataService.value.general.gameType,
      matchTime: this.gameDataService.value.match.time,
      side: this.gameDataService.value.match.startPosition.side,
      distance: this.gameDataService.value.match.startPosition.distance,
    });
  }

  // notifica all'avversario l'avvenuto posizionamento di roby
  sendPlayerQuitRequest(): void {
    this.sendInGameRoomTopic({
      msgType: this.messageTypes.c_playerQuit,
      gameRoomId: this.gameDataService.value.general.gameRoomId,
      playerId: this.gameDataService.value.user.playerId,
      gameType: this.gameDataService.value.general.gameType,
    });
  }

  // notifica all'avversario la volontà di skippare l'animazione
  sendEndAnimationMessage(): void {
    this.sendInGameRoomTopic({
      msgType: this.messageTypes.c_endAnimation,
      gameRoomId: this.gameDataService.value.general.gameRoomId,
      playerId: this.gameDataService.value.user.playerId,
      gameType: this.gameDataService.value.general.gameType,
    });
  }

  // formatta, invia e restituisci messaggio di chat
  sendChatMessage(messageBody: string): any {
    const message = {
      msgType: this.messageTypes.c_chat,
      gameRoomId: this.gameDataService.value.general.gameRoomId,
      playerId: this.gameDataService.value.user.playerId,
      sender: this.gameDataService.value.user.nickname,
      body: messageBody,
      date: new Date().getTime(),
      clientDirect: true,
      gameType: this.gameDataService.value.general.gameType,
    };
    this.sendInGameRoomTopic(message);
    return message;
  }
}
