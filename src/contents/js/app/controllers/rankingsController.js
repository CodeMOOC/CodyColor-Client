/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('rankingsCtrl', ['$scope', 'rabbit', 'navigationHandler', '$translate',
    'authHandler', 'gameData', 'rankingsHandler', 'audioHandler', '$location', 'sessionHandler', 'translationHandler',
    'scopeService',
    function ($scope, rabbit, navigationHandler, $translate, authHandler, gameData, rankingsHandler,
              audioHandler, $location, sessionHandler, translationHandler, scopeService) {

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
            return;
        }

        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        // inizializza i vari componenti dello slider classifiche
        $scope.indexes = {
            top10MatchDaily:   0,
            top10MatchGlobal:  1,
            top10PointsDaily:  2,
            top10PointsGlobal: 3,
        };

        $scope.rankIndex = 0;

        $translate(['TOP_10_MATCH_DAILY', 'TOP_10_MATCH_GLOBAL', 'TOP_10_POINTS_DAILY', 'TOP_10_POINTS_GLOBAL'])
            .then(function (translations) {
                $scope.rankingTitles = [
                    translations['TOP_10_MATCH_DAILY'],
                    translations['TOP_10_MATCH_GLOBAL'],
                    translations['TOP_10_POINTS_DAILY'],
                    translations['TOP_10_POINTS_GLOBAL']
                ];
            });

        $translate(['TOP_10_MATCH_DAILY_SUBT', 'TOP_10_MATCH_GLOBAL_SUBT', 'TOP_10_POINTS_DAILY_SUBT',
            'TOP_10_POINTS_GLOBAL_SUBT'])
            .then(function (translations) {
                $scope.rankingSubTitles = [
                    translations['TOP_10_MATCH_DAILY_SUBT'],
                    translations['TOP_10_MATCH_GLOBAL_SUBT'],
                    translations['TOP_10_POINTS_DAILY_SUBT'],
                    translations['TOP_10_POINTS_GLOBAL_SUBT']
                ];
            });

        $scope.scrollRanking = function(increment) {
            if (increment)
                $scope.rankIndex = ($scope.rankIndex < 3 ? $scope.rankIndex + 1 : 0);
            else
                $scope.rankIndex = ($scope.rankIndex > 0 ? $scope.rankIndex - 1 : 3);
        };

        $scope.timeFormatter = gameData.formatTimeDecimals;

        // avvia il download delle classifiche, se necessario;
        // altrimenti popola scope con i dati già in memoria
        if (rankingsHandler.updateNeeded()) {
            $scope.rankings = [];
            rabbit.sendRankingsRequest();
        } else {
            $scope.rankings = rankingsHandler.getRankings();
        }

        rabbit.setPageCallbacks({
            onRankingsResponse: function (message) {
                if (message.success) {
                    // all'arrivo dei nuovi dati sulle classifiche, aggiorna i dati memorizzati nel factory
                    rankingsHandler.updateRankings({
                        top10MatchDaily:   JSON.parse(message.top10MatchDaily),
                        top10MatchGlobal:  JSON.parse(message.top10MatchGlobal),
                        top10PointsDaily:  JSON.parse(message.top10PointsDaily),
                        top10PointsGlobal: JSON.parse(message.top10PointsGlobal)
                    });
                } else {
                    rankingsHandler.updateRankings({
                        top10MatchDaily:   [],
                        top10MatchGlobal:  [],
                        top10PointsDaily:  [],
                        top10PointsGlobal: []
                    });
                }

                scopeService.safeApply($scope, function () {
                    $scope.rankings = rankingsHandler.getRankings();
                });
            }
        });

        // inizializzazione tasto home
        $scope.goToHome = function () {
            navigationHandler.goToPage($location, '/home');
            audioHandler.playSound('menu-click');
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
            audioHandler.playSound('menu-click');
            $translate.use(langKey);
            $scope.languageModal = false;

            $translate(['TOP_10_MATCH_DAILY', 'TOP_10_MATCH_GLOBAL', 'TOP_10_POINTS_DAILY', 'TOP_10_POINTS_GLOBAL'])
                .then(function (translations) {
                    $scope.rankingTitles = [
                        translations['TOP_10_MATCH_DAILY'],
                        translations['TOP_10_MATCH_GLOBAL'],
                        translations['TOP_10_POINTS_DAILY'],
                        translations['TOP_10_POINTS_GLOBAL']
                    ];
                });

            $translate(['TOP_10_MATCH_DAILY_SUBT', 'TOP_10_MATCH_GLOBAL_SUBT', 'TOP_10_POINTS_DAILY_SUBT',
                'TOP_10_POINTS_GLOBAL_SUBT'])
                .then(function (translations) {
                    $scope.rankingSubTitles = [
                        translations['TOP_10_MATCH_DAILY_SUBT'],
                        translations['TOP_10_MATCH_GLOBAL_SUBT'],
                        translations['TOP_10_POINTS_DAILY_SUBT'],
                        translations['TOP_10_POINTS_GLOBAL_SUBT']
                    ];
                });

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