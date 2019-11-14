/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('arcadeAftermatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    '$location', '$translate', 'authHandler', 'navigationHandler', 'audioHandler', 'sessionHandler', 'chatHandler',
    'translationHandler', 'visibilityHandler', 'shareHandler',
    function ($scope, rabbit, gameData, scopeService, $location, $translate, authHandler,
              navigationHandler, audioHandler, sessionHandler, chatHandler, translationHandler, visibilityHandler, shareHandler) {
        let newMatchTimer;

        // esci dalla partita in modo sicuro, chiudendo la connessione e effettuando il
        // clean dei dati di gioco
        let quitGame = function () {
            rabbit.quitGame();
            gameData.initializeGameData();
            chatHandler.clearChat();
            if (newMatchTimer !== undefined) {
                clearInterval(newMatchTimer);
                newMatchTimer = undefined;
            }
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, '/');
            return;
        }

        visibilityHandler.setDeadlineCallback(function() {
            rabbit.sendPlayerQuitRequest();
            quitGame();
            scopeService.safeApply($scope, function () {
                translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
                $scope.forceExitModal = true;
            });
        });

        // imposta nickname utente registrato
        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        $scope.newMatchTimerValue = 60000;
        newMatchTimer = setInterval(function () {
            scopeService.safeApply($scope, function () {
                if ($scope.newMatchTimerValue <= 0) {
                    $scope.newMatchTimerValue = 0;
                    if (newMatchTimer !== undefined) {
                        clearInterval(newMatchTimer);
                        newMatchTimer = undefined;
                    }
                    if (!$scope.newMatchClicked) {
                        $scope.newMatchClicked = true;
                        rabbit.sendReadyMessage();
                    }

                } else {
                    $scope.newMatchTimerValue -= 1000;
                }
            });
        }, 1000);

        // imposta dati e stats dell'ultima partita, da mostrare all'utente
        $scope.timeFormatter = gameData.formatTimeDecimals;
        $scope.timeFormatterCountdown = gameData.formatTimeSeconds;
        $scope.user = gameData.getUser();
        $scope.enemy = gameData.getEnemy();
        $scope.draw = gameData.getMatch().winnerId === -1;
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchCount = gameData.getAggregated().matchCount;
        $scope.userMatch = gameData.getUserMatchResult();
        $scope.userGlobal = gameData.getUserGlobalResult();
        $scope.enemyMatch = gameData.getEnemyMatchResult();
        $scope.enemyGlobal = gameData.getEnemyGlobalResult();
        $scope.newMatchClicked = false;
        $scope.enemyRequestNewMatch = false;

        if ($scope.winner === gameData.getUser().nickname) {
            audioHandler.playSound('win');
        } else if ($scope.winner === gameData.getEnemy().nickname) {
            audioHandler.playSound('lost');
        }

        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            audioHandler.playSound('menu-click');
            $scope.newMatchClicked = true;
            rabbit.sendReadyMessage();
        };

        $scope.share = function() {
            audioHandler.playSound('menu-click');
            let shareText = 'I took ' + gameData.getUserMatchResult().pathLength +
                ' steps with my Roby in a ' + gameData.getGeneral().gameType + ' match!';

            $scope.sharedLegacy =
                shareHandler.shareText('CodyColor Multiplayer', shareText, 'https://codycolor.codemooc.net');
        };

        rabbit.setPageCallbacks({
            onReadyMessage: function () {
                scopeService.safeApply($scope, function () {
                    $scope.enemyRequestNewMatch = true;
                });

            }, onStartMatch: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.initializeMatchData();
                    gameData.editMatch({tiles: gameData.formatMatchTiles(message.tiles)});

                    if (newMatchTimer !== undefined) {
                        clearInterval(newMatchTimer);
                        newMatchTimer = undefined;
                    }
                    navigationHandler.goToPage($location, '/arcade-match');
                });

            }, onGameQuit: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                    translationHandler.setTranslation($scope,'forceExitText', 'ENEMY_LEFT');
                    $scope.forceExitModal = true;
                });

            }, onConnectionLost: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                    translationHandler.setTranslation($scope,'forceExitText', 'FORCE_EXIT');
                    $scope.forceExitModal = true;
                });

            }, onChatMessage: function (message) {
                scopeService.safeApply($scope, function () {
                    audioHandler.playSound('roby-over');
                    chatHandler.enqueueChatMessage(message);
                    $scope.chatBubbles = chatHandler.getChatMessages();
                });
            }
        });

        // impostazioni chat
        $scope.chatBubbles = chatHandler.getChatMessages();
        $scope.getBubbleStyle = function(chatMessage) {
            if (chatMessage.playerId === gameData.getUser().playerId)
                return 'chat--bubble-player';
            else
                return 'chat--bubble-enemy';
        };
        $scope.chatHints = chatHandler.getChatHintsAfterMatch();
        $scope.sendChatMessage = function(messageBody) {
            audioHandler.playSound('menu-click');
            let chatMessage = rabbit.sendChatMessage(messageBody);
            chatHandler.enqueueChatMessage(chatMessage);
            $scope.chatBubbles = chatHandler.getChatMessages();
        };

        // impostazioni exit game
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };

        $scope.continueExitGame = function() {
            audioHandler.playSound('menu-click');
            rabbit.sendPlayerQuitRequest();
            quitGame();
            navigationHandler.goToPage($location, '/home');
        };

        $scope.stopExitGame = function() {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.continueForceExit = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, '/home');
        };

        // impostazioni multi-language
        $scope.openLanguageModal = function() {
            $scope.languageModal = true;
            audioHandler.playSound('menu-click');
        };

        $scope.closeLanguageModal = function() {
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');
        };

        $scope.changeLanguage = function(langKey) {
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