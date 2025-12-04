/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('royaleNewMatchCtrl', ['$scope', 'rabbit', 'navigationHandler',
    'scopeService', '$translate', 'translationHandler', 'audioHandler', '$location', 'sessionHandler', 'gameData',
    'authHandler', 'visibilityHandler',
    function ($scope, rabbit, navigationHandler, scopeService, $translate, translationHandler,
              audioHandler, $location, sessionHandler, gameData, authHandler, visibilityHandler) {

        gameData.getGeneral().gameType = gameData.getGameTypes().royale;


        let quitGame = function () {
            rabbit.quitGame();
            gameData.initializeGameData();
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, '/');
            return;
        }

        visibilityHandler.setDeadlineCallback(function() {
            quitGame();
            scopeService.safeApply($scope, function () {
                translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
                $scope.forceExitModal = true;
            });
        });

        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
            $scope.nickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        // inizializza data e ora
        let now = new Date();
        $scope.hours = now.getHours();
        $scope.minutes = now.getMinutes();

        // timer setting selector
        $scope.currentTimerIndex = 1;
        $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
            $scope.timerSettings = [
                {text: translations['15_SECONDS'], value: 15000},
                {text: translations['30_SECONDS'], value: 30000},
                {text: translations['1_MINUTE'], value: 60000},
                {text: translations['2_MINUTES'], value: 120000}
            ];
        });

        $scope.editTimer = function (increment) {
            audioHandler.playSound('menu-click');
            if (increment)
                $scope.currentTimerIndex = ($scope.currentTimerIndex < 3 ? $scope.currentTimerIndex + 1 : 3);
            else
                $scope.currentTimerIndex = ($scope.currentTimerIndex > 0 ? $scope.currentTimerIndex - 1 : 0);

            gameData.editGeneral({ timerSetting: $scope.timerSettings[$scope.currentTimerIndex].value });
        };

        // maxPlayers setting selector
        $scope.currentMaxPlayersIndex = 1;
        $translate(['PLAYERS_10', 'PLAYERS_20', 'PLAYERS_40', 'PLAYERS_60']).then(function (translations) {
            $scope.maxPlayersSettings = [
                {text: translations['PLAYERS_10'], value: 10},
                {text: translations['PLAYERS_20'], value: 20},
                {text: translations['PLAYERS_40'], value: 40},
                {text: translations['PLAYERS_60'], value: 60}
            ];
        });

        $scope.editMaxPlayers = function (increment) {
            audioHandler.playSound('menu-click');
            if (increment)
                $scope.currentMaxPlayersIndex = ($scope.currentMaxPlayersIndex < 3 ? $scope.currentMaxPlayersIndex + 1 : 3);
            else
                $scope.currentMaxPlayersIndex = ($scope.currentMaxPlayersIndex > 0 ? $scope.currentMaxPlayersIndex - 1 : 0);

            gameData.editGeneral({ maxPlayersSetting: $scope.maxPlayersSettings[$scope.currentMaxPlayersIndex].value });
        };

        // start mode selector
        $scope.currentStartIndex = 0;
        $translate(['IN_DATE', 'MANUAL']).then(function (translations) {
            $scope.startSettings = [
                { text: translations['IN_DATE'], value: 0 },
                { text: translations['MANUAL'],  value: 1 }
            ];
        });

        $scope.editStartMode = function () {
            audioHandler.playSound('menu-click');
            if ($scope.currentStartIndex === 0) {
                $scope.currentStartIndex = 1;
            } else {
                $scope.currentStartIndex = 0;
            }
        };

        rabbit.setPageCallbacks({
            onConnectionLost: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
                    $scope.forceExitModal = true;
                });
            }
        });

        $scope.isNicknameShort = false; 
        $scope.requestMMaking = function () {
            if (!$scope.nickname || $scope.nickname.length < 3) {
                $scope.isNicknameShort = true;
                return;
            }
            $scope.isNicknameShort = false; 

            audioHandler.playSound('menu-click');
            if ($scope.currentStartIndex === 0) {
                if (matchDateValid($scope.hours, $scope.minutes)) {
                    let startDateGenerator = new Date();
                    startDateGenerator.setHours($scope.hours, $scope.minutes);
                    gameData.getGeneral().startDate = startDateGenerator.getTime();
                } else {
                    return;
                }
            }
            gameData.editGeneral({
                gameName: $scope.gameName,
                code: '0000'
            });
            gameData.editUser({
                nickname: $scope.nickname,
                organizer: true
            });
            navigationHandler.goToPage($location, '/royale-mmaking');
        };

        // controlla che l'ora settata come inizio match sia valida
        let matchDateValid = function(hours, minutes) {
            let dateValid = false;
            let now = new Date();

            let nowHours = now.getHours();
            let nowMinutes = now.getMinutes();
            let userHours = parseInt(hours, 10);
            let userMinutes = parseInt(minutes, 10);

            if (nowHours < userHours)
                dateValid = true;

            if (nowHours === userHours && nowMinutes < userMinutes)
                dateValid = true;

            return dateValid;
        };

        // termina la partita alla pressione sul tasto corrispondente
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

            $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
                $scope.timerSettings = [
                    { text: translations['15_SECONDS'], value: 15000  },
                    { text: translations['30_SECONDS'], value: 30000  },
                    { text: translations['1_MINUTE'],   value: 60000  },
                    { text: translations['2_MINUTES'],  value: 120000 }
                ];
            });

            $translate(['PLAYERS_10', 'PLAYERS_20', 'PLAYERS_40', 'PLAYERS_60']).then(function (translations) {
                $scope.maxPlayersSettings = [
                    {text: translations['PLAYERS_10'], value: 10},
                    {text: translations['PLAYERS_20'], value: 20},
                    {text: translations['PLAYERS_40'], value: 40},
                    {text: translations['PLAYERS_60'], value: 60}
                ];
            });

            $translate(['IN_DATE', 'MANUAL']).then(function (translations) {
                $scope.startSettings = [
                    { text: translations['IN_DATE'], value: 0 },
                    { text: translations['MANUAL'],  value: 1 }
                ];
            });

            if (!authHandler.loginCompleted()) {
                translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
            }

            audioHandler.playSound('menu-click');
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
]);