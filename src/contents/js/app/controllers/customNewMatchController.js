/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('customNewMatchCtrl', ['$scope', 'rabbit', 'navigationHandler',
    'scopeService', '$translate', 'translationHandler', 'audioHandler', '$location', 'sessionHandler', 'gameData',
    'authHandler',
    function ($scope, rabbit, navigationHandler, scopeService, $translate, translationHandler,
              audioHandler, $location, sessionHandler, gameData, authHandler) {

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

        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
            $scope.nickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        // timer set
        $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
            $scope.timerSettings = [
                { text: translations['15_SECONDS'], value: 15000 },
                { text: translations['30_SECONDS'], value: 30000 },
                { text: translations['1_MINUTE'], value: 60000 },
                { text: translations['2_MINUTES'], value: 120000 }];
        });
        $scope.currentTimerIndex = 1;

        $scope.editTimer = function (increment) {
            audioHandler.playSound('menu-click');
            if (increment)
                $scope.currentTimerIndex = ($scope.currentTimerIndex < 3 ? $scope.currentTimerIndex + 1 : 3);
            else
                $scope.currentTimerIndex = ($scope.currentTimerIndex > 0 ? $scope.currentTimerIndex - 1 : 0);

            gameData.editGeneral({ timerSetting: $scope.timerSettings[$scope.currentTimerIndex].value });
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

        $scope.creatingMatch = false;
        $scope.requestMMaking = function () {
            audioHandler.playSound('menu-click');
            $scope.creatingMatch = true;
            gameData.editGeneral({ code: '0000' });
            gameData.editUser({
                nickname: $scope.nickname,
                organizer: true,
            });
            navigationHandler.goToPage($location, '/custom-mmaking');
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

            $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
                $scope.timerSettings = [
                    {text: translations['15_SECONDS'], value: 15000},
                    {text: translations['30_SECONDS'], value: 30000},
                    {text: translations['1_MINUTE'], value: 60000},
                    {text: translations['2_MINUTES'], value: 120000}
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