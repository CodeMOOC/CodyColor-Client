/*
 * Controller login
 */
angular.module('codyColor').controller('loginCtrl', ['navigationHandler', '$scope', 'audioHandler', '$location',
    'sessionHandler', '$translate', 'scopeService', 'authHandler', 'rabbit', 'translationHandler', 'gameData',
    function (navigationHandler, $scope, audioHandler, $location, sessionHandler,
              $translate, scopeService, authHandler, rabbit, translationHandler, gameData) {

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);

        // cambia schermata (senza lasciare la pagina) evitando flickering durante le animazioni
        let changeScreen = function (newScreen) {
            scopeService.safeApply($scope, function () {
                $scope.loginState = screens.loadingScreen;
            });
            setTimeout(function () {
                scopeService.safeApply($scope, function () {
                    $scope.loginState = newScreen;
                });
            }, 200);
        };

        const screens = {
            loadingScreen:     'loadingScreen',    // schermata di transizione
            login:             'login',            // schermata di login (gestita con FirebaseUi)
            profile:           'profile',          // schermata profilo utente
            nicknameSelection: 'nicknameSelection' // schermata di selezione nickname nuovo utente
        };
        $scope.screens = screens;
        $scope.timeFormatter = gameData.formatTimeDecimals;

        // inizializza il flusso di autenticazione disabilitando la cookie authentication,
        // in quanto si potrebbe provenire da pendingRedirect
        authHandler.initializeAuth();
        authHandler.initializeUi();
        authHandler.disableCookieSignIn();

        if (sessionHandler.isSessionInvalid() && authHandler.isPendingRedirect()) {
            // flusso di autenticazione in corso: avvia l'interfaccia utente
            $scope.pendingRedirect = true;
            sessionHandler.validateSession();
            changeScreen(screens.login);
            authHandler.startUi();

        } else if (sessionHandler.isSessionInvalid()) {
            // sessione non valida: redirect alla schermata iniziale
            navigationHandler.goToPage($location, '/');
            return;

        } else if (authHandler.loginCompleted()) {
            // utente già autenticato: mostra profile screen, richiedi dati utente
            $scope.firebaseUserData = authHandler.getFirebaseUserData();
            $scope.serverUserData = authHandler.getServerUserData();
            $scope.pendingRedirect = false;
            rabbit.sendLogInRequest();
            changeScreen(screens.profile);

        } else {
            // utente non autenticato: mostra login screen
            $scope.pendingRedirect = false;
            changeScreen(screens.login);
            authHandler.startUi();
        }

        // avvia la connessione al broker se necessario
        if (!rabbit.getServerConnectionState())
            rabbit.connect();

        authHandler.setAuthCallbacks({
            onFirebaseSignIn: function(authResult) {
                // cosa fare a autenticazione tramite FirebaseAuth completata.
                console.log("Sign in with FirebaseUI completed.");
                authHandler.setFirebaseUserData(authResult.user);
                if (authResult.additionalUserInfo.isNewUser) {
                    // se l'utente è nuovo, va completato il flusso di registrazione e autenticazione
                    // impostando un nickname e aggiungendo l'utente al db server
                    changeScreen(screens.nicknameSelection);
                } else {
                    // se l'account è già presente, va completato il flusso di autenticazione richiedendo
                    // al server i dati del profilo utente, tra cui anche il nickname
                    rabbit.sendLogInRequest();
                }

            }, onFirebaseSignInError: function(error) {
                // in caso di un qualunque errore, mostra il dialog modale e la schermata di login
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_LOGIN');
                    $scope.singleOptionModal = true;
                    $scope.firebaseUserData = undefined;
                    $scope.serverUserData = undefined;
                    $scope.pendingRedirect = false;
                });

                console.log(error.toString());
                authHandler.logout();
                authHandler.initializeUi();
                authHandler.startUi();
                changeScreen(screens.login);

            }, onFirebaseSignOut: function() {
                // completa il flusso di logout, eliminando i dati utente nello scope e mostrando la schermata di login
                scopeService.safeApply($scope, function () {
                    $scope.firebaseUserData = undefined;
                    $scope.serverUserData = undefined;
                    $scope.userLogged = false;
                    $scope.pendingRedirect = false;
                    translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
                });
                authHandler.initializeUi();
                authHandler.startUi();
                changeScreen(screens.login);

            }, onFirebaseUserDeleted: function() {
                // flusso di eliminazione utente terminato. Mostra la schermata di login
                scopeService.safeApply($scope, function () {
                    $scope.firebaseUserData = undefined;
                    $scope.serverUserData = undefined;
                    $scope.userLogged = false;
                    $scope.pendingRedirect = false;
                    translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
                });
                authHandler.initializeUi();
                authHandler.startUi();
                changeScreen(screens.login);

            }, onFirebaseUserDeletedError: function(error) {
                // in caso di errore, mostra il dialog modale corrispondente
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_DELETE');
                    $scope.singleOptionModal = true;
                });

            }, onPrivacyClick: function () {
                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/privacy',);
                });

            }, onTosClick: function () {
                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/terms');
                });

            }, onUiShown: function () {
                $scope.safeApply($scope, function () {
                    $scope.pendingRedirect = false;
                });
            }
        });

        // completa la registrazione dell'utente impostando un nickname e inviandolo al server
        $scope.hideSignUpButton = false;
        $scope.ultimateSignUp = function(nickname) {
            $scope.hideSignUpButton = true;
            rabbit.sendSignUpRequest(nickname);
        };

        rabbit.setPageCallbacks({
            onLogInResponse: function(message) {
                // risposta del server alla registrazione/autenticazione di un utente
                if (message.success) {
                    // message.success === true indica che la registrazione è avvenuta con successo. Mostra
                    // quindi la schermata profilo popolata adeguatamente
                    authHandler.setServerUserData({
                        nickname: message.nickname,
                        totalPoints: message.totalPoints,
                        wonMatches: message.wonMatches,
                        avgPoints: message.avgPoints,
                        bestMatch: message.bestMatch
                    });
                    scopeService.safeApply($scope, function () {
                        $scope.firebaseUserData = authHandler.getFirebaseUserData();
                        $scope.serverUserData = authHandler.getServerUserData();
                        $scope.userLogged = true;
                        $scope.userNickname = authHandler.getServerUserData().nickname;
                    });

                    if ($scope.loginState !== screens.profile)
                        changeScreen(screens.profile);

                } else {
                    // message.success === false indica che non è presente un record utente nel db server
                    // Mostra quindi un messaggio di errore, rimuovi l'account, e rimanda alla schermata di login
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_LOGIN');
                        $scope.singleOptionModal = true;
                        $scope.firebaseUserData = undefined;
                        $scope.serverUserData = undefined;
                        $scope.pendingRedirect = false;
                    });

                    console.log('Error auth response false.');
                    authHandler.deleteAccount();
                    authHandler.initializeUi();
                    authHandler.startUi();
                    changeScreen(screens.login);
                }
            },
            onUserDeletedResponse: function(message) {
                // continua il flusso di eliminazione account; nel caso i dati siano stati rimossi con successo dal
                // db server rimuovi anche i dati da firebaseAuth, e vai alla schermata di login
                if (message.success) {
                    authHandler.deleteAccount();

                } else {
                    // in caso di errore, mostra il dialog modale
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_DELETE');
                        $scope.singleOptionModal = true;
                    });
                }
            },

        });

        // click sul tasto logout della schermata profile. Mostra il dialog modale di conferma. In caso
        // di conferma, avvia il flusso di logout
        $scope.logout = function() {
            audioHandler.playSound('menu-click');
            translationHandler.setTranslation($scope, 'multiOptionsText', 'SURE_TO_LOGOUT');
            $scope.multiOptionsModal = true;
            $scope.multiOptionsOk = function() {
                audioHandler.playSound('menu-click');
                authHandler.logout();
                $scope.multiOptionsModal = false;
            };
        };

        // click sul tasto eliminazione account della schermata profile. Mostra il dialog modale di conferma. In caso
        // di conferma, avvia il flusso di eliminazione account
        $scope.deleteAccount = function() {
            audioHandler.playSound('menu-click');
            translationHandler.setTranslation($scope, 'multiOptionsText', 'SURE_TO_DELETE');
            $scope.multiOptionsModal = true;
            $scope.multiOptionsOk = function() {
                audioHandler.playSound('menu-click');
                rabbit.sendUserDeleteRequest();
                $scope.multiOptionsModal = false;
            };
        };

        // testo iniziale visualizzato in fondo a dx
        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        // click sul tasto home. In caso di flusso di autenticazione non completato, annullalo completamente
        $scope.goToHome = function () {
            audioHandler.playSound('menu-click');
            audioHandler.splashStartBase();
            authHandler.setAuthCallbacks({});
            if (!authHandler.loginCompleted())
                authHandler.logout();

            navigationHandler.goToPage($location, '/home');
        };

        // gestione dialog modale con due opzioni (ok e cancel)
        $scope.multiOptionsText = '';
        $scope.multiOptionsModal = false;
        $scope.multiOptionsCancel = function () {
            audioHandler.playSound('menu-click');
            $scope.multiOptionsModal = false;
        };

        // gestione dialog modale a opzione singola (ok)
        $scope.singleOptionText = '';
        $scope.singleOptionModal = false;
        $scope.singleOptionOk = function() {
            audioHandler.playSound('menu-click');
            $scope.singleOptionModal = false;
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