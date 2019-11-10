/*
 * Controller Home, il menù principale, dal quale è possibile accedere alle varie sezioni del gioco
 */
angular.module('codyColor').controller('homeCtrl', ['$scope', 'rabbit', 'navigationHandler', 'audioHandler',
    '$location', 'sessionHandler', 'scopeService', '$translate', 'authHandler', 'translationHandler',
    function ($scope, rabbit, navigationHandler, audioHandler, $location, sessionHandler,
              scopeService, $translate, authHandler, translationHandler) {

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
            return;
        }

        $scope.totalMatches = 0;
        $scope.connectedPlayers = 0;

        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
            translationHandler.setTranslation($scope, 'loginOrProfile', 'PROFILE');
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
            translationHandler.setTranslation($scope, 'loginOrProfile', 'LOGIN');
        }
        authHandler.setCookieNickCallback(function () {
            scopeService.safeApply($scope, function () {
                $scope.userLogged = authHandler.loginCompleted();
                if (authHandler.loginCompleted()) {
                    $scope.userNickname = authHandler.getServerUserData().nickname;
                    translationHandler.setTranslation($scope, 'loginOrProfile', 'PROFILE');
                } else {
                    translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
                    translationHandler.setTranslation($scope, 'loginOrProfile', 'LOGIN');
                }
            });
        });


        $scope.connected = rabbit.getServerConnectionState();
        if ($scope.connected) {
            scopeService.safeApply($scope, function () {
                $scope.totalMatches = sessionHandler.getTotalMatches().toString();
                $scope.connectedPlayers = sessionHandler.getConnectedPlayers().toString();
            });
        }

        rabbit.setPageCallbacks({
            onConnectionLost: function() {
                scopeService.safeApply($scope, function () {
                    $scope.connected = false;
                });

            }, onGeneralInfoMessage: function() {
                scopeService.safeApply($scope, function () {
                    $scope.connected = true;
                    $scope.totalMatches = (sessionHandler.getTotalMatches()).toString();
                    $scope.connectedPlayers = sessionHandler.getConnectedPlayers().toString();
                });
            }
        });


        // inizializzazione menù di navigazione
        $scope.goToRules = function () {
            audioHandler.playSound('menu-click');
            rabbit.setPageCallbacks({});
            navigationHandler.goToPage($location, "/rules");
        };

        $scope.goToRMMaking = function () {
            audioHandler.playSound('menu-click');
            if (!$scope.connected) {
                $scope.noOnlineModal = true;
                $translate('NO_CONNECT_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else if (!sessionHandler.isClientVersionValid()) {
                $scope.noOnlineModal = true;
                $translate('OUTDATED_VERSION_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else {
                navigationHandler.goToPage($location, "/random-mmaking");
            }

        };
        $scope.goToCMMaking = function () {
            audioHandler.playSound('menu-click');
            if (!$scope.connected) {
                $scope.noOnlineModal = true;
                $translate('NO_CONNECT_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else if (!sessionHandler.isClientVersionValid()) {
                $scope.noOnlineModal = true;
                $translate('OUTDATED_VERSION_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else {
                navigationHandler.goToPage($location, "/custom-mmaking");
            }
        };
        $scope.goToAMMaking = function () {
            audioHandler.playSound('menu-click');
            if (!$scope.connected) {
                $scope.noOnlineModal = true;
                $translate('NO_CONNECT_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else if (!sessionHandler.isClientVersionValid()) {
                $scope.noOnlineModal = true;
                $translate('OUTDATED_VERSION_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else {
                navigationHandler.goToPage($location, "/royale-mmaking");
            }
        };
        $scope.goToRankings = function () {
            audioHandler.playSound('menu-click');
            if (!$scope.connected) {
                $scope.noOnlineModal = true;
                $translate('NO_CONNECT_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else if (!sessionHandler.isClientVersionValid()) {
                $scope.noOnlineModal = true;
                $translate('OUTDATED_VERSION_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else {
                navigationHandler.goToPage($location, "/rankings");
            }
        };
        $scope.goToLoginProfile = function () {
            audioHandler.playSound('menu-click');
            if (!$scope.connected) {
                $scope.noOnlineModal = true;
                $translate('NO_CONNECT_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else if (!sessionHandler.isClientVersionValid()) {
                $scope.noOnlineModal = true;
                $translate('OUTDATED_VERSION_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else {
                navigationHandler.goToPage($location, "/login");
            }

        };
        $scope.goToBootcamp = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, "/bootmp-mmaking");
        };
        $scope.goToRanking = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, "/ranking");
        };
        $scope.goToProfile = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, "/profile");
        };

        $scope.closeNoConnectionModal = function() {
            audioHandler.playSound('menu-click');
            $scope.noOnlineModal = false;
        };

        // impostazioni multi language
        $scope.openLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = true;
        };

        $scope.closeLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = false;
        };

        $scope.changeLanguage = function(langKey) {
            audioHandler.playSound('menu-click');
            $translate.use(langKey);
            $scope.languageModal = false;

            if (authHandler.loginCompleted()) {
                translationHandler.setTranslation($scope, 'loginOrProfile', 'PROFILE');
            } else {
                translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
                translationHandler.setTranslation($scope, 'loginOrProfile', 'LOGIN');
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