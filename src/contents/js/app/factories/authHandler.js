/*
 * AuthHandler: factory per la gestione del flusso di autenticazione legato alle librerie firebase Auth, firebase UI
 * e ai vari provider oAuth
 */
angular.module('codyColor').factory("authHandler", ['$cookies', 'settings', function($cookies, settings) {
    let authHandler = {};

    // oggetto di configurazione dell'istanza firebaseUI
    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult) {
                // return false in case of custom success sign in flow
                if (callbacks.onFirebaseSignIn !== undefined)
                    callbacks.onFirebaseSignIn(authResult);
                return false;
            },
            signInFailure: function (error) {
                // Return a promise when error handling is completed and FirebaseUI will reset, clearing any UI
                if (callbacks.onFirebaseSignInError !== undefined)
                    return callbacks.onFirebaseSignInError(error);
            },
            uiShown: function () {
                // The widget is rendered, hide the loader
                if (callbacks.uiShown !== undefined)
                    callbacks.onUiShown();
            }
        },
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        tosUrl: function() {
            if (callbacks.onTosClick !== undefined)
                callbacks.onTosClick();
        },
        privacyPolicyUrl: function() {
            if (callbacks.onPrivacyClick !== undefined)
                callbacks.onPrivacyClick();
        }
    };

    let initialized = false;
    let ui;
    let callbacks = {};

    let firebaseUserData = {};
    let serverUserData = {};
    let startCookieSignIn;
    let cookieNickCallback;


    // inizializza i callbacks
    authHandler.setAuthCallbacks = function(args) {
        callbacks.onFirebaseSignIn = args.onFirebaseSignIn;
        callbacks.onFirebaseSignInError = args.onFirebaseSignInError;
        callbacks.onFirebaseSignOut = args.onFirebaseSignOut;
        callbacks.onFirebaseUserDeleted = args.onFirebaseUserDeleted;
        callbacks.onFirebaseUserDeletedError = args.onFirebaseUserDeletedError;
        callbacks.onUiShown = args.onUiShown;
        callbacks.onPrivacyClick = args.onPrivacyClick;
        callbacks.onTosClick = args.onTosClick;
    };


    // imposta un callback, utilizzato nella schermata home, che aggiorna il nickname dell'utente
    // visualizzato in fondo a destra, nel caso si passi alla schermata nickname senza aver concluso
    // la cookieAuthentication
    authHandler.setCookieNickCallback = function(callback) {
        if (serverUserData.nickname === undefined) {
            cookieNickCallback = callback;
        }
    };

    // invocando questa funzione, il programma prova ad autenticare l'utente tramite cookie non appena firebaseAuth
    // viene inizializzato per la prima volta
    authHandler.enableCookieSignIn = function() {
        startCookieSignIn = function(user) {
            console.log('1/2 [CookieSignIn] - User ' + user.email + ' signed in with FirebaseAuth.');
            firebaseUserData = user;

            // controlla che sia memorizzato tra i cookie anche il nickname. Se non memorizzato, l'ultimo login
            // non si è concluso con successo: effettua il logout anche da firebaseAuth
            let cookieServerUserData = $cookies.get('serverUserData');
            if (cookieServerUserData !== undefined) {
                console.log('2/2 [CookieSignIn] - Cookie nickname validated. Welcome, user.');
                serverUserData = JSON.parse(cookieServerUserData);

            } else {
                console.log('2/2 [CookieSignIn] - Cookie nickname not found. Logging out from FirebaseAuth.');
                authHandler.logout();
            }

            if (cookieNickCallback !== undefined) {
                cookieNickCallback(serverUserData.nickname);
                cookieNickCallback = undefined;
            }
        }
    };


    // invocando questa funzione, il programma disattiva l'autenticazione utente tramite cookie, invocata altrimenti
    // in automatico non appena firebaseAuth viene inizializzato per la prima volta
    authHandler.disableCookieSignIn = function() {
        startCookieSignIn = undefined;
    };


    // inizializza la libreria firebase per l'autenticazione; in caso l'inizializzazione sia già avvenuta, non esegue
    // nulla; tenta l'autenticazione tramite cookies nel caso in cui sia stata abilitata con le funzioni di cui sopra
    authHandler.initializeAuth = function () {
        if (!initialized) {
            firebase.initializeApp(settings.firebaseConfig);
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    if (startCookieSignIn !== undefined)
                        startCookieSignIn(user);

                    startCookieSignIn = undefined;
                }
            });
            initialized = true;
        }
    };


    // crea una nuova istanza di firebaseUI. Da chiamare all'entrata nella pagina di login
    authHandler.initializeUi = function () {
        ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    };


    // avvia l'istanza firebaseUI
    authHandler.startUi = function () {
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
    };


    // effettua il logout in maniera 'safe', cancellando sia i dati salvati automaticamente da FirebaseAuth che
    // quelli personalizzati provenienti dal db server (sia quelli di sessione che nei cookies)
    authHandler.logout = function () {
        $cookies.remove('serverUserData');
        serverUserData = {};
        firebaseUserData = {};
        firebase.auth().signOut().then(function () {
            if (callbacks.onFirebaseSignOut !== undefined)
                callbacks.onFirebaseSignOut();
        });
    };


    // effettua l'eliminazione utente in maniera 'safe', cancellando i dati salvati automaticamente da FirebaseAuth,
    // quelli personalizzati provenienti dal db server (sia quelli di sessione che nei cookies), e inviando una
    // richiesta di rimozione dei dati utente al server (nel callback onFirebaseUserDeleted)
    authHandler.deleteAccount = function () {
        firebase.auth().currentUser.delete().then(function() {
            $cookies.remove('serverUserData');
            serverUserData = {};
            firebaseUserData = {};
            callbacks.onFirebaseUserDeleted();
        }).catch(function(error) {
            if (callbacks.onFirebaseUserDeletedError !== undefined)
                callbacks.onFirebaseUserDeletedError();
        });
    };


    // controlla che ci sia un flusso di autenticazione in corso. Utile per verificare se ci si trova
    // nella pagina di login dopo un redirect di un provider oAuth
    authHandler.isPendingRedirect = function () {
        return ui.isPendingRedirect();
    };


    authHandler.loginCompleted = function () {
        return !(Object.entries(serverUserData).length === 0 && serverUserData.constructor === Object)
            && !(Object.entries(firebaseUserData).length === 0 && firebaseUserData.constructor === Object);
    };


    authHandler.setFirebaseUserData = function(newUser) {
        firebaseUserData = newUser;
    };


    authHandler.getFirebaseUserData = function () {
        return firebaseUserData;
    };


    authHandler.setServerUserData = function (newUserData) {
        $cookies.put('serverUserData', JSON.stringify(newUserData));
        serverUserData = newUserData;
    };


    authHandler.getServerUserData = function () {
        return serverUserData;
    };


    return authHandler;
}]);