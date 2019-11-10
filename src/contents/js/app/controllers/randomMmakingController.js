/*
 * Controller responsabile della funzione di matchmaking nelle partite a accoppiamento
 * casuale dei giocatori
 */
angular.module('codyColor').controller('randomMmakingCtrl',['$scope', 'rabbit', 'gameData', '$location',
    'scopeService', '$translate', 'authHandler', 'navigationHandler', 'audioHandler', 'sessionHandler', 'chatHandler',
    'translationHandler',
    function ($scope, rabbit, gameData, $location, scopeService, $translate, authHandler,
              navigationHandler, audioHandler, sessionHandler, chatHandler, translationHandler) {
        gameData.getGeneral().gameType = gameData.getGameTypes().random;

        // matchmakingTimer: interrompe la ricerca della partita nel caso in cui vada troppo per le lunghe
        $scope.mmakingTimerValue = 120000;
        $scope.mmakingTimerFormatter = gameData.formatTimeSeconds;
        $scope.enemy = gameData.getEnemy();
        $scope.enemyReady = false;

        let mmakingTimer = undefined;

        // routine da eseguire per chiudere la schermata e uscire dal gioco in modo sicuro
        let quitGame = function () {
            rabbit.quitGame();
            gameData.initializeGameData();
            chatHandler.clearChat();
            if (mmakingTimer !== undefined) {
                clearInterval(mmakingTimer);
            }
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, '/');
            return;
        }

        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
            $scope.nickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        // cambia schermata (senza lasciare la pagina) evitando flickering durante le animazioni
        let changeScreen = function (newScreen) {
            scopeService.safeApply($scope, function () {
                $scope.mmakingState = screens.loadingScreen;
            });
            setTimeout(function () {
                scopeService.safeApply($scope, function () {
                    $scope.mmakingState = newScreen;
                });
            }, 200);
        };

        const screens = {
            loadingScreen:     'loadingScreen',     // schermata di transizione
            nicknameSelection: 'nicknameSelection', // inserimento nickname, schermata iniziale
            waitingEnemy:      'waitingEnemy',      // entrato nella gameRoom, mostra codici e attende un avvers.
            enemyFound:        'enemyFound',        // players accoppiati, in attesa di ready
            waitingReady:      'waitingReady'       // ready clicked, spettando il segnale di ready dell'avversario
        };
        $scope.screens = screens;

        // tiene traccia dello stato del matchmaking, e di quale schermata deve essere visualizzata
        changeScreen(screens.nicknameSelection);
        $scope.randomWaitingPlayers = sessionHandler.getRandomWaitingPlayers();

        rabbit.setPageCallbacks({
            onGeneralInfoMessage: function () {
                scopeService.safeApply($scope, function () {
                    $scope.randomWaitingPlayers = sessionHandler.getRandomWaitingPlayers().toString();
                });

            }, onGameRequestResponse: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.editGeneral(message.general);
                    gameData.editUser(message.user);
                    gameData.editEnemy(message.enemy);
                });
                rabbit.subscribeGameRoom();

                // nemico validato <==> nemico presente
                if (gameData.getEnemy().validated) {
                    clearInterval(mmakingTimer);
                    mmakingTimer = undefined;
                    changeScreen(screens.enemyFound);

                } else {
                    mmakingTimer = setInterval(function () {
                        scopeService.safeApply($scope, function () {
                            $scope.mmakingTimerValue -= 1000;
                            if ($scope.mmakingTimerValue <= 0) {
                                quitGame();
                                $translate('NO_NEW_ENEMY').then(function (forceExit) {
                                    $scope.forceExitText = forceExit;
                                }, function (translationId) {
                                    $scope.forceExitText = translationId;
                                });
                                $scope.forceExitModal = true;
                            }
                        });
                    }, 1000);
                    changeScreen(screens.waitingEnemy);
                }

            }, onPlayerAdded: function (message) {
                if (message.addedPlayerId !== gameData.getUser().playerId) {
                    audioHandler.playSound('enemy-found');
                    scopeService.safeApply($scope, function () {
                        gameData.editEnemy(message.addedPlayer);
                    });
                    clearInterval(mmakingTimer);
                    mmakingTimer = undefined;

                    changeScreen(screens.enemyFound);
                }

            }, onReadyMessage: function () {
                scopeService.safeApply($scope, function () {
                    $scope.enemyReady = true;
                })

            }, onStartMatch: function (message) {
                gameData.editMatch({ tiles: gameData.formatMatchTiles(message.tiles) });
                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/arcade-match');
                });

            }, onGameQuit: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope,'forceExitText', 'ENEMY_LEFT');
                    $scope.forceExitModal = true;
                });

            }, onConnectionLost: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope,'forceExitText', 'FORCE_EXIT');
                    $scope.forceExitModal = true;
                });

            }, onChatMessage: function (message) {
                audioHandler.playSound('roby-over');
                chatHandler.enqueueChatMessage(message);
                scopeService.safeApply($scope, function () {
                    $scope.chatBubbles = chatHandler.getChatMessages();
                });
            }
        });

        // chat
        $scope.chatBubbles = chatHandler.getChatMessages();
        $scope.getBubbleStyle = function (chatMessage) {
            if (chatMessage.playerId === gameData.getUser().playerId)
                return 'chat--bubble-player';
            else
                return 'chat--bubble-enemy';
        };
        $scope.chatHints = chatHandler.getChatHintsPreMatch();
        $scope.sendChatMessage = function (messageBody) {
            audioHandler.playSound('menu-click');
            let chatMessage = rabbit.sendChatMessage(messageBody);
            chatHandler.enqueueChatMessage(chatMessage);
            $scope.chatBubbles = chatHandler.getChatMessages();
        };

        // una volta che l'utente ha scelto un nickname, invia una richiesta di gioco al server
        $scope.requestMMaking = function () {
            $scope.mmakingRequested = true;
            audioHandler.playSound('menu-click');
            gameData.editUser({ nickname: $scope.nickname });
            rabbit.sendGameRequest();
        };

        // invocata una volta premuto il tasto 'iniziamo'
        $scope.playerReady = function () {
            $scope.readyClicked = true;
            rabbit.sendReadyMessage();

            if (!$scope.enemyReady)
                changeScreen(screens.waitingReady);
        };

        // termina la partita alla pressione sul tasto corrispondente
        $scope.exitGameModal = false;
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };

        $scope.continueExitGame = function () {
            audioHandler.playSound('menu-click');
            rabbit.sendPlayerQuitRequest();
            quitGame();
            navigationHandler.goToPage($location, '/home');
        };
        $scope.stopExitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.forceExitModal = false;
        $scope.forceExitText = '';
        $scope.continueForceExit = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, '/home');
        };

        // impostazioni multi language
        $scope.openLanguageModal = function () {
            $scope.languageModal = true;
            audioHandler.playSound('menu-click');
        };
        $scope.closeLanguageModal = function () {
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');
        };
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');

            if (!authHandler.loginCompleted()) {
                translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
            }
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
]);