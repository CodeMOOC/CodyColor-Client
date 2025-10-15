/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('bootmpMmakingCtrl', ['$scope', 'rabbit', 'navigationHandler', '$translate',
    'authHandler', 'translationHandler', 'audioHandler', '$location', 'sessionHandler', 'gameData', 'scopeService',
    'visibilityHandler',
    function ($scope, rabbit, navigationHandler, $translate, authHandler, translationHandler,
              audioHandler, $location, sessionHandler, gameData, scopeService, visibilityHandler) {

        gameData.getGeneral().gameType = gameData.getGameTypes().bootmp;

        // chiude la partita in modo sicuro
        let quitGame = function() {
            gameData.initializeGameData();
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, '/');
            return;
        }

        visibilityHandler.setDeadlineCallback();
        rabbit.setPageCallbacks({
            onEditNicknameResponse: function(message) {
                scopeService.safeApply($scope, function() {
                    if (message.success) {
                        $scope.serverUserData.nickname = message.newNickname;
                        authHandler.setServerUserData($scope.serverUserData);
                        $scope.nickname = message.newNickname;
                    } else {
                        console.log("Error updating nickname");
                    }
                });
            }
        });

        
        // visualizza user nickname in fondo a dx se disponibile
        $scope.userLogged = authHandler.loginCompleted();

        if (authHandler.loginCompleted()) {
            $scope.serverUserData = authHandler.getServerUserData();
            $scope.userNickname = authHandler.getServerUserData().nickname;
            $scope.nickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
            $scope.serverUserData = {};
        }

        // carica la pagina con un leggero delay per evitare problemi di flickering
        setTimeout(function () {
            scopeService.safeApply($scope, function () {
                $scope.pageReady = true;
            });
        }, 200);

        // timer selector
        $translate([ '15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES'])
            .then(function (translations) {
                $scope.timerSettings = [
                    { text: translations['15_SECONDS'], value: 15000  },
                    { text: translations['30_SECONDS'], value: 30000  },
                    { text: translations['1_MINUTE'],   value: 60000  },
                    { text: translations['2_MINUTES'],  value: 120000 }
                ];
            });
        $scope.currentTimerIndex = 1;
        $scope.editTimer = function(increment) {
            audioHandler.playSound('menu-click');
            if (increment)
                $scope.currentTimerIndex = ($scope.currentTimerIndex < 3 ? $scope.currentTimerIndex + 1 : 3);
            else
                $scope.currentTimerIndex = ($scope.currentTimerIndex > 0 ? $scope.currentTimerIndex - 1 : 0);

            gameData.editGeneral({ timerSetting: $scope.timerSettings[$scope.currentTimerIndex].value });
        };

        // mode selector
        $translate(['NO_ENEMY', 'AI_EASY', 'AI_MEDIUM', 'AI_HARD'])
            .then(function (translations) {
                $scope.botSettings = [
                    { text: translations['NO_ENEMY'],  value: 0 },
                    { text: translations['AI_EASY'],   value: 1 },
                    { text: translations['AI_MEDIUM'], value: 2 },
                    { text: translations['AI_HARD'],   value: 3 }
                ];
        });
        $scope.currentBotSettingIndex = 0;
        gameData.editGeneral({ botSetting: 0 });
        $scope.editBotSetting = function(increment) {
            if (increment) {
                $scope.currentBotSettingIndex
                    = ($scope.currentBotSettingIndex < 3 ? $scope.currentBotSettingIndex + 1 : 3);
            } else {
                $scope.currentBotSettingIndex
                    = ($scope.currentBotSettingIndex > 0 ? $scope.currentBotSettingIndex - 1 : 0);
            }
            gameData.editGeneral({ botSetting: $scope.botSettings[$scope.currentBotSettingIndex].value });
        };
      
        // tasto 'inizia partita'
        $scope.createBootcamp = function() {
            gameData.editUser({
                nickname: $scope.nickname,
                playerId: 0
            });
            gameData.editEnemy({
                nickname: 'CodyColor',
                playerId: 1
            });
            gameData.editMatch({ tiles: gameData.generateNewMatchTiles() });

            navigationHandler.goToPage($location, '/bootmp-match');
        };

        // termina la partita alla pressione sul tasto corrispondente
        $scope.exitGameModal = false;
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };
        $scope.continueExitGame = function() {
            audioHandler.playSound('menu-click');
            quitGame();
            navigationHandler.goToPage($location, '/home');
        };
        $scope.stopExitGame = function() {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        // impostazioni multi language
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

            // timer set
            $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
                $scope.timerSettings = [
                    { text: translations['15_SECONDS'], value: 15000 },
                    { text: translations['30_SECONDS'], value: 30000 },
                    { text: translations['1_MINUTE'], value: 60000 },
                    { text: translations['2_MINUTES'], value: 120000 } ];
            });

            $translate(['NO_ENEMY', 'AI_EASY', 'AI_MEDIUM', 'AI_HARD']).then(function (translations) {
                $scope.bootEnemySettings = [
                    { text: translations['NO_ENEMY'], value: 0 },
                    { text: translations['AI_EASY'], value: 1 },
                    { text: translations['AI_MEDIUM'], value: 2 },
                    { text: translations['AI_HARD'], value: 3 } ];
            });

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