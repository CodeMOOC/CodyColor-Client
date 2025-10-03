/*
 * RabbitCommunicator module: service che si occupa dell'interazione 
 * con il broker (RabbitMQ, per l'appunto), esponendo funzioni per la connessione
 * e l'invio di messaggi al broker
 */

angular.module('codyColor').factory("rabbit", [ 'gameData', 'sessionHandler', 'settings', 'authHandler',
    function (gameData, sessionHandler, settings, authHandler) {
    let rabbit = {};

    const endpoints = {
        serverControlQueue:   "/queue/serverControl",
        clientControlTopic:   "/topic/clientsControl",
        generalTopic:         "/topic/general",
        randomGameRoomsTopic: "/topic/gameRooms",
        customGameRoomsTopic: "/topic/custGameRooms",
        agaGameRoomsTopics:   "/topic/agaGameRooms"
    };

    const messageTypes = {
        c_connectedSignal:  "c_connectedSignal",
        s_generalInfo:      "s_generalInfo",   //

        c_gameRequest:    "c_gameRequest",    // client richiede di giocare
        s_gameResponse:   "s_gameResponse",   // server fornisce credenziali di gioco

        c_playerQuit:     "c_playerQuit",     // richiesta di fine gioco di un client
        s_gameQuit:       "s_gameQuit",       // forza il fine gioco per tutti

        s_playerAdded:    "s_playerAdded",    // notifica un giocatore si collega
        s_playerRemoved:  "s_playerRemoved",  // notifica un giocatore si scollega

        c_validation:     "c_validation",     // rende l'iscrizione del giocatore 'valida' fornendo credenz. come il nick
        c_ready:          "c_ready",          // segnale pronto a giocare; viene intercettato anche dai client
        s_startMatch:     "s_startMatch",     // segnale avvia partita

        c_positioned:     "c_positioned",     // segnale giocatore posizionato
        s_timerSync:      "s_timerSync",      // re-rincronizza i timer ogni 5 secondi
        s_startAnimation: "s_startAnimation", // inviato quando tutti sono posizionati
        c_endAnimation:   "c_endAnimation",   // notifica la fine dell'animazione, o lo skip
        s_endMatch:       "s_endMatch",       // segnale aftermatch

        c_heartbeat:      "c_heartbeat",      // segnale heartbeat
        c_chat:           "c_chat",           // chat, intercettati SOLO dai client

        c_signUpRequest:  "c_signUpRequest",  // aggiunge l'utente al db con nickname
        c_logInRequest:   "c_logInRequest",  // richiedi nickname utente con uid
        s_authResponse:  "s_authResponse",   // fornisci il nickname utente - o messaggio error

        c_editNicknameRequest: "c_editNicknameRequest", // richiedi la modifica del nickname
        s_editNicknameResponse: "s_editNicknameResponse", // conferma la modifica del nickname - o messaggio error
        
        c_userDeleteRequest:   "c_userDeleteRequest",  // richiedi l'eliminazione di un utente
        s_userDeleteResponse:  "s_userDeleteResponse",  // conferma l'eliminazione di un utente

        c_rankingsRequest: "c_rankingsRequest",   // richiedi le classifiche
        s_rankingsResponse: "s_rankingsResponse", // restituisci le classifiche
    };

    const debug = settings.rabbitSocketUrl !== "wss://codycolor.codemooc.net/api/ws";

    let connectedToBroker;
    let connectedToServer;
    let client;
    let pageCallbacks = {};
    let heartbeatTimer;
    let subscriptions = {};
    let lastMsgId;


    rabbit.getBrokerConnectionState = function () {
        if (connectedToBroker === undefined)
            connectedToBroker = false;
        return connectedToBroker;
    };

    rabbit.getServerConnectionState = function () {
        if (connectedToServer === undefined)
            connectedToServer = false;
        return connectedToServer;
    };


    rabbit.setPageCallbacks = function (callbacks) {
        pageCallbacks = callbacks;
    };

    rabbit.connect = function () {
        client = new StompJs.Client({
            brokerURL: settings.rabbitSocketUrl, // "wss://codycolor.codemooc.net/api/ws"
            connectHeaders: {
                login: settings.rabbitUsername,
                passcode: settings.rabbitPassword
            },
            debug: function (stringLog) {
                if (debug)
                    console.log(stringLog);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 5000,
            heartbeatOutgoing: 5000
        });

        client.onConnect = onConnected;
        client.onWebSocketClose = onConnectionLost;
        client.activate();
    };

    rabbit.subscribeGameRoom = function () {
        subscriptions.gameRoom = client.subscribe(
            getGameRoomEndpoint(),
            handleIncomingMessage
        );

        // invia un heartbeat al server ogni 5 secondi
        heartbeatTimer = setInterval(function () {
            sendInServerControlQueue({
                msgType:    messageTypes.c_heartbeat,
                gameRoomId: gameData.getGeneral().gameRoomId,
                playerId:   gameData.getUser().playerId,
                gameType:   gameData.getGeneral().gameType
            });
        }, 5000);
    };


    // richiesta per iniziare una nuova partita
    rabbit.sendGameRequest = function () {
        sendInServerControlQueue({
            msgType:           messageTypes.c_gameRequest,
            user:              gameData.getUser(),
            general:           gameData.getGeneral(),
            gameType:          gameData.getGeneral().gameType,
            userId:            authHandler.getFirebaseUserData().uid,
            correlationId:     sessionHandler.getSessionId(),
            clientVersion:     sessionHandler.getClientVersion()
        });
    };

    rabbit.sendSignUpRequest = function (nickname) {
        sendInServerControlQueue({
            msgType:           messageTypes.c_signUpRequest,
            nickname:          nickname,
            email:             authHandler.getFirebaseUserData().email,
            correlationId:     sessionHandler.getSessionId(),
            userId:            authHandler.getFirebaseUserData().uid
        });
    };

    rabbit.sendLogInRequest = function () {
        sendInServerControlQueue({
            msgType:           messageTypes.c_logInRequest,
            correlationId:     sessionHandler.getSessionId(),
            userId:            authHandler.getFirebaseUserData().uid
        });
    };

    rabbit.sendRankingsRequest = function () {
        sendInServerControlQueue({
            msgType:           messageTypes.c_rankingsRequest,
            correlationId:     sessionHandler.getSessionId(),
        });
    };

    rabbit.sendEditNicknameRequest = function(newNickname) {
        let message = {
            msgType: messageTypes.c_editNicknameRequest,
            userId: authHandler.getFirebaseUserData().uid, 
            newNickname: newNickname,
        };
        sendInServerControlQueue(message);
    };    

    rabbit.sendUserDeleteRequest = function () {
        sendInServerControlQueue({
            msgType:           messageTypes.c_userDeleteRequest,
            correlationId:     sessionHandler.getSessionId(),
            userId:            authHandler.getFirebaseUserData().uid
        });
    };


    // notifica all'avversario che si è pronti a iniziare la partita
    rabbit.sendReadyMessage = function () {
        sendInGameRoomTopic({
            msgType:     messageTypes.c_ready,
            gameRoomId: gameData.getGeneral().gameRoomId,
            playerId:   gameData.getUser().playerId,
            gameType:   gameData.getGeneral().gameType,
            clientDirect: true
        });
    };

    // notifica i propri dati
    rabbit.sendValidationMessage = function () {
        sendInGameRoomTopic({
            msgType:    messageTypes.c_validation,
            organizer:  gameData.getUser().organizer,
            gameRoomId: gameData.getGeneral().gameRoomId,
            playerId:   gameData.getUser().playerId,
            nickname:   gameData.getUser().nickname,
            gameType:   gameData.getGeneral().gameType,
        });
    };


    // notifica all'avversario l'avvenuto posizionamento di roby
    rabbit.sendPlayerPositionedMessage = function () {
        sendInGameRoomTopic({
            msgType:    messageTypes.c_positioned,
            gameRoomId: gameData.getGeneral().gameRoomId,
            playerId:   gameData.getUser().playerId,
            gameType:   gameData.getGeneral().gameType,
            matchTime:  gameData.getMatch().time,
            side:       gameData.getMatch().startPosition.side,
            distance:   gameData.getMatch().startPosition.distance,
        });
    };


    // notifica all'avversario l'avvenuto posizionamento di roby
    rabbit.sendPlayerQuitRequest = function () {
        sendInGameRoomTopic({
            msgType:    messageTypes.c_playerQuit,
            gameRoomId: gameData.getGeneral().gameRoomId,
            playerId:   gameData.getUser().playerId,
            gameType:   gameData.getGeneral().gameType
        });
    };


    // notifica all'avversario la volontà di skippare l'animazione
    rabbit.sendEndAnimationMessage = function () {
        sendInGameRoomTopic({
            msgType:    messageTypes.c_endAnimation,
            gameRoomId: gameData.getGeneral().gameRoomId,
            playerId:   gameData.getUser().playerId,
            gameType:   gameData.getGeneral().gameType
        });
    };


    // formatta, invia e restituisci messaggio di chat
    rabbit.sendChatMessage = function (messageBody) {
        let message = {
            msgType:      messageTypes.c_chat,
            gameRoomId:   gameData.getGeneral().gameRoomId,
            playerId:     gameData.getUser().playerId,
            sender:       gameData.getUser().nickname,
            body:         messageBody,
            date:         (new Date()).getTime(),
            clientDirect: true,
            gameType:     gameData.getGeneral().gameType
        };
        sendInGameRoomTopic(message);
        return message;
    };


    // chiude la connessione alla game room in modo sicuro
    rabbit.quitGame = function () {
        if (subscriptions.gameRoom !== undefined) {
            subscriptions.gameRoom.unsubscribe();
            // subscriptions.gameRoom = undefined; !! porre la sub a undefined genera un errore!
        }

        if (heartbeatTimer !== undefined) {
            clearInterval(heartbeatTimer);
            heartbeatTimer = undefined;
        }

        pageCallbacks = {};
    };


    // invocato non appena connesso al broker
    let onConnected = function () {
        connectedToBroker = true;

        let serverDirectEndpoint   = endpoints.clientControlTopic + '.' + sessionHandler.getSessionId();
        subscriptions.serverDirect = client.subscribe(serverDirectEndpoint,   handleIncomingMessage);
        subscriptions.general      = client.subscribe(endpoints.generalTopic, handleIncomingMessage);

        sendInServerControlQueue({
            msgType: messageTypes.c_connectedSignal,
            correlationId: sessionHandler.getSessionId()
        });

        // eventuali azioni addizionali da compiere a connessione completata
        if (pageCallbacks.onConnected !== undefined)
            pageCallbacks.onConnected();
    };


    // invocato in caso di errore di connessione con il broker
    let onConnectionLost = function () {
        connectedToBroker = false;
        connectedToServer = false;

        // ritenta connessione dopo tot secondi in automatico

        // eventuali azioni addizionali
        if (pageCallbacks.onConnectionLost !== undefined)
            pageCallbacks.onConnectionLost();
    };


    let sendInServerControlQueue = function(message) {
        if (debug)
            console.log('DEBUG: Sent message in server queue: ' + JSON.stringify(message));

        $.extend(true, message, { msgId: (Math.floor(Math.random() * 100000)).toString() });
        client.publish({
            destination: endpoints.serverControlQueue,
            headers: { durable: false, exclusive: false },
            body: JSON.stringify(message)
        });
    };


    let sendInGameRoomTopic = function(message) {
        if (debug)
            console.log('DEBUG: Sent message in topic: ' + JSON.stringify(message));

        if (gameData.getGeneral().gameRoomId === -1 || gameData.getUser().playerId === -1)
            return;

        // aggiunge un id univoco al messaggio
        $.extend(true, message, { msgId: (Math.floor(Math.random() * 100000)).toString() });

        // invia un messaggio alla game room sottoscritta dal giocatore
        client.publish({
            destination: getGameRoomEndpoint(),
            headers: { durable: false, exclusive: false },
            body: JSON.stringify(message)
        });
    };


    let getGameRoomEndpoint = function() {
        switch (gameData.getGeneral().gameType) {
            case gameData.getGameTypes().random: {
                return endpoints.randomGameRoomsTopic + '.' + gameData.getGeneral().gameRoomId;
            }
            case gameData.getGameTypes().custom: {
                return endpoints.customGameRoomsTopic + '.' + gameData.getGeneral().gameRoomId;
            }
            case gameData.getGameTypes().royale: {
                return endpoints.agaGameRoomsTopics + '.' + gameData.getGeneral().gameRoomId;
            }
        }
    };


    let handleIncomingMessage = function (rawMessage) {
        if (debug)
            console.log('DEBUG: Received message: ' + rawMessage.body);

        let message = JSON.parse(rawMessage.body);

        // decompressione gameData
        if(message.gameData !== undefined) {
            message.gameData = JSON.parse(
                LZUTF8.decompress(message.gameData, {inputEncoding: 'StorageBinaryString'})
            );
        }

        if (lastMsgId === undefined || lastMsgId !== message.msgId) {
            lastMsgId = message.msgId;

        } else if (lastMsgId === message.msgId) {
            console.log("Received duplicate message. Ignored.");
            return;
        }

        // 1. messaggi provenienti dal server direct
        switch(message.msgType) {
            case messageTypes.s_gameResponse:
                if (pageCallbacks.onGameRequestResponse !== undefined) {
                    pageCallbacks.onGameRequestResponse(message);
                }
                return;

            case messageTypes.s_authResponse:
                if (pageCallbacks.onLogInResponse !== undefined) {
                    pageCallbacks.onLogInResponse(message);
                }
                return;

            case messageTypes.s_userDeleteResponse:
                if (pageCallbacks.onUserDeletedResponse !== undefined) {
                    pageCallbacks.onUserDeletedResponse(message);
                }
                return;

            case messageTypes.s_rankingsResponse:
                if (pageCallbacks.onRankingsResponse !== undefined) {
                    pageCallbacks.onRankingsResponse(message);
                }
                return;

            case messageTypes.s_generalInfo:
                connectedToServer = true;
                sessionHandler.setGeneralInfo( {
                    totalMatches: message.totalMatches,
                    connectedPlayers: message.connectedPlayers,
                    randomWaitingPlayers: message.randomWaitingPlayers,
                    requiredClientVersion: message.requiredClientVersion
                });

                if (pageCallbacks.onGeneralInfoMessage !== undefined) {
                    pageCallbacks.onGeneralInfoMessage(message);
                }
                return;
        }


        switch (message.msgType) {
            case messageTypes.c_ready:
                if (pageCallbacks.onReadyMessage !== undefined
                    && message.playerId !== gameData.getUser().playerId)
                    pageCallbacks.onReadyMessage(message);
                break;

            case messageTypes.c_positioned:
                if (pageCallbacks.onEnemyPositioned !== undefined
                    && message.playerId !== gameData.getUser().playerId)
                    pageCallbacks.onEnemyPositioned(message);
                break;

            case messageTypes.c_chat:
                if (pageCallbacks.onChatMessage !== undefined
                    && message.playerId !== gameData.getUser().playerId)
                    pageCallbacks.onChatMessage(message);
                break;

            case messageTypes.s_startAnimation:
                if (pageCallbacks.onStartAnimation !== undefined)
                    pageCallbacks.onStartAnimation(message);
                break;

            case messageTypes.s_startMatch:
                if (pageCallbacks.onStartMatch !== undefined)
                    pageCallbacks.onStartMatch(message);
                break;

            case messageTypes.s_endMatch:
                if (pageCallbacks.onEndMatch !== undefined)
                    pageCallbacks.onEndMatch(message);
                break;

            case messageTypes.s_gameQuit:
                if (pageCallbacks.onGameQuit !== undefined)
                    pageCallbacks.onGameQuit(message);
                break;

            case messageTypes.s_playerAdded:
                if (pageCallbacks.onPlayerAdded !== undefined)
                    pageCallbacks.onPlayerAdded(message);
                break;

            case messageTypes.s_playerRemoved:
                if (pageCallbacks.onPlayerRemoved !== undefined)
                    pageCallbacks.onPlayerRemoved(message);
                break;
        }
    };

    return rabbit;
}]);

