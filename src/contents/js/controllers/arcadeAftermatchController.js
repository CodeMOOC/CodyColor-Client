/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('arcadeAftermatchCtrl',
    function ($scope, rabbit, gameData, scopeService, $location, $translate,
              navigationHandler, audioHandler, sessionHandler, chatHandler, translationHandler) {
        console.log("Controller aftermatch ready.");

        let quitGame = function () {
            rabbit.quitGame();
            gameData.initializeGameData();
            chatHandler.clearChat();
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        $scope.timeFormatter = gameData.formatTimeDecimals;
        $scope.player = gameData.getUserPlayer();
        $scope.enemy = gameData.getEnemy1vs1();
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchCount = gameData.getGeneral().matchCount;

        if ($scope.winner === gameData.getUserPlayer().nickname) {
            audioHandler.playSound('win');
        } else if ($scope.winner === gameData.getEnemy1vs1().nickname) {
            audioHandler.playSound('lost');
        }

        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            gameData.getUserPlayer().ready = true;
            rabbit.sendReadyMessage();
            scopeService.safeApply($scope, function () {
                $scope.newMatchClicked = true;
            });
        };

        rabbit.setPageCallbacks({
            onReadyMessage: function () {
                gameData.getEnemy1vs1().ready = true;
                scopeService.safeApply($scope, function () {
                    $scope.enemyRequestNewMatch = true;
                });

            }, onStartMatch: function (message) {
                gameData.initializeMatchData();
                gameData.syncGameData(message.gameData);
                navigationHandler.goToPage($location, $scope, '/arcade-match', true);

            }, onGameQuit: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope,'forceExitText', 'ENEMY_LEFT');
                    $scope.forceExitModal = true;
                });

            }, onConnectionLost: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
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

        // impostazioni chat
        $scope.chatBubbles = chatHandler.getChatMessages();
        $scope.getBubbleStyle = function(chatMessage) {
            if (chatMessage.playerId === gameData.getUserPlayer().playerId)
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
            navigationHandler.goToPage($location, $scope, '/home', false);
        };
        $scope.stopExitGame = function() {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };
        $scope.continueForceExit = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, '/home', false);
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
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);