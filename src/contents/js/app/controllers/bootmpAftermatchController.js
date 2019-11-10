/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('bootmpAftermatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    '$location', 'navigationHandler', 'audioHandler', 'sessionHandler', '$translate', 'authHandler', 'translationHandler',
    function ($scope, rabbit, gameData, scopeService, $location, navigationHandler,
              audioHandler, sessionHandler, $translate, authHandler, translationHandler) {

        // chiusura 'sicura' della partita
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

        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        // informazioni sul risultato della partita
        $scope.user = gameData.getUser();
        $scope.enemy = gameData.getEnemy();
        $scope.general = gameData.getGeneral();
        $scope.draw = gameData.getMatch().winnerId === -1;
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchCount = gameData.getAggregated().matchCount;
        $scope.userMatch = gameData.getUserMatchResult();
        $scope.userGlobal = gameData.getUserGlobalResult();
        $scope.enemyMatch = gameData.getEnemyMatchResult();
        $scope.enemyGlobal = gameData.getEnemyGlobalResult();
        $scope.timeFormatter = gameData.formatTimeDecimals;
        $scope.newMatchClicked = false;

        if ($scope.winner === gameData.getUser().nickname) {
            audioHandler.playSound('win');
        } else if (gameData.getGeneral().botSetting !== 0 && $scope.winner === gameData.getEnemy().nickname) {
            audioHandler.playSound('lost');
        }

        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            gameData.initializeMatchData();
            gameData.editMatch({ tiles: gameData.generateNewMatchTiles() });
            navigationHandler.goToPage($location, '/bootmp-match');
        };

        $scope.share = function() {
            let shareText = 'I took ' + gameData.getUserMatchResult().pathLength +
                ' steps with my Roby in a ' + gameData.getGeneral().gameType + ' match!';

            if (navigator.share) {
                navigator.share({
                    title: 'CodyColor Multiplayer',
                    text: shareText,
                    url: 'https://codycolor.codemooc.net'
                }).then(() => {
                    console.log('Thanks for sharing!');
                }).catch(console.error);
            } else {
                // fallback
                $scope.sharedLegacy = true;
                copyStringToClipboard(shareText + ' Play with me in https://codycolor.codemooc.net');
            }
        };

        let copyStringToClipboard = function (text) {
            // Create new element
            let el = document.createElement('textarea');
            // Set value (string to be copied)
            el.value = text;
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style = {position: 'absolute', left: '-9999px'};
            document.body.appendChild(el);
            // Select text inside element
            el.select();
            // Copy text to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);
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