/*
 * Controller Splash Screen, la schermata mostrata non appena si accede al sito
 */
angular.module('codyColor').controller('splashCtrl', ['$scope', 'rabbit', 'navigationHandler', 'audioHandler',
    '$location', 'sessionHandler', '$routeParams', 'gameData', 'authHandler',
    function ($scope, rabbit, navigationHandler, audioHandler,
              $location, sessionHandler, $routeParams, gameData, authHandler) {
        console.log("Controller splash ready.");

        // validazione sessione
        navigationHandler.initializeBackBlock($scope);
        sessionHandler.validateSession();

        // inizializza il flusso di autenticazione (automatico, se rilevati cookies)
        authHandler.initializeAuth();
        authHandler.enableCookieSignIn();

        // tenta subito la connessione al broker
        if (!rabbit.getServerConnectionState())
            rabbit.connect();

        let customMatch = $routeParams.custom;
        if (customMatch !== undefined && customMatch.length > 0) {
            gameData.getGeneral().code = customMatch.toString();
            console.log("Custom match!");
            navigationHandler.goToPage($location, '/custom-mmaking');
        }

        let agaMatch = $routeParams.royale;
        if (agaMatch !== undefined && agaMatch.length > 0) {
            gameData.getGeneral().code = agaMatch.toString();
            console.log("Royale match!");
            navigationHandler.goToPage($location, '/royale-mmaking');
        }

        $scope.clientVersion = sessionHandler.getClientVersion();

        // vai alla schermata home al click e avvia la base musicale
        $scope.goToHome = function () {
            navigationHandler.goToPage($location, '/home');
            audioHandler.splashStartBase();
            sessionHandler.enableNoSleep();
        }
    }
]);
