/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('bootmpMatchCtrl', [ '$scope', 'gameData', 'scopeService', 'pathHandler',
    '$location', '$translate', 'navigationHandler', 'audioHandler', 'sessionHandler', 'authHandler',
    'translationHandler', 'visibilityHandler',
    function ($scope, gameData, scopeService, pathHandler, $location, $translate,
              navigationHandler, audioHandler, sessionHandler, authHandler, translationHandler, visibilityHandler) {
        let startCountdownTimer;
        let gameTimer;

        // metodo per terminare la partita in modo sicuro, disattivando i timer,
        // interrompendo animazioni e connessioni con il server
        let quitGame = function () {
            if (startCountdownTimer !== undefined)
                clearInterval(startCountdownTimer);

            if (gameTimer !== undefined)
                clearInterval(gameTimer);

            pathHandler.quitGame();
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

        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        $scope.showDraggableRoby = true;
        pathHandler.initialize($scope);
        $scope.user = gameData.getUser();
        $scope.enemy  = gameData.getEnemy();
        $scope.general = gameData.getGeneral();
        $scope.match = gameData.getMatch();
        $scope.userPoints = JSON.parse(JSON.stringify(gameData.getUserGlobalResult().points));
        $scope.enemyPoints = JSON.parse(JSON.stringify(gameData.getEnemyGlobalResult().points));
        $scope.userTimerValue = gameData.getGeneral().timerSetting;
        $scope.enemyTimerValue = gameData.getGeneral().timerSetting;
        $scope.userTimerAnimation = '';
        $scope.enemyTimerAnimation = '';
        let nextGameTimerValue = gameData.getGeneral().timerSetting;

        $scope.playerRoby = pathHandler.getPlayerRoby();
        $scope.enemiesRoby = pathHandler.getEnemiesRoby();
        $scope.timerFormatter =
            (gameData.getGeneral().botSetting !== 0 ? gameData.formatTimeDecimals : gameData.formatTimeMatchClock);
        $scope.finalTimeFormatter = gameData.formatTimeDecimals;

        // inizializzazione start positions
        let setArrowCss = function (side, distance, over) {
            let finalResult = '';

            let arrowSide = '';
            switch (side) {
                case 0:
                    arrowSide = 'down';
                    break;
                case 1:
                    arrowSide = 'left';
                    break;
                case 2:
                    arrowSide = 'up';
                    break;
                case 3:
                    arrowSide = 'right';
                    break;
            }

            if (over) {
                finalResult += 'fas fa-chevron-circle-' + arrowSide + ' playground--arrow-over';
            } else {
                finalResult += 'fas fa-angle-' + arrowSide + ' playground--arrow';
            }

            if ($scope.showArrows) {
                finalResult += ' floating-' + arrowSide + '-animation';
            }

            $scope.startPositionsCss[side][distance] = finalResult;
        };

        let calculateAllStartPositionCss = function (over) {
            $scope.startPositionsCss = new Array(4);
            for (let side = 0; side < 4; side++) {
                $scope.startPositionsCss[side] = new Array(5);
                for (let distance = 0; distance < 5; distance++) {
                    setArrowCss(side, distance, over);
                }
            }
        };

        calculateAllStartPositionCss(false);

        // inizializzazione tiles
        $scope.tilesCss = new Array(5);
        for (let x = 0; x < 5; x++) {
            $scope.tilesCss[x] = new Array(5);
            for (let y = 0; y < 5; y++) {
                switch (gameData.getMatch().tiles[x][y]) {
                    case 'Y':
                        $scope.tilesCss[x][y] = 'playground--tile-yellow';
                        break;
                    case 'R':
                        $scope.tilesCss[x][y] = 'playground--tile-red';
                        break;
                    case 'G':
                        $scope.tilesCss[x][y] = 'playground--tile-gray';
                        break;
                }
            }
        }

        let startCountdownValue = 3;
        $scope.startCountdownText = startCountdownValue.toString();
        audioHandler.playSound('countdown');
        $scope.countdownInProgress = true;
        startCountdownTimer = setInterval(function () {
            startCountdownValue--;
            if (startCountdownValue > 0) {
                audioHandler.playSound('countdown');
                scopeService.safeApply($scope, function () {
                    $scope.startCountdownText = startCountdownValue.toString();
                });

            } else if (startCountdownValue === 0) {
                audioHandler.playSound('start');
                scopeService.safeApply($scope, function () {
                    $scope.startCountdownText = "Let's Cody!";
                });

            } else {
                // interrompi countdown e mostra schermata di gioco
                clearInterval(startCountdownTimer);
                startCountdownTimer = undefined;

                scopeService.safeApply($scope, function () {
                    $scope.countdownInProgress = false;
                });

                startMatchTimers();
            }
        }, 1000);

        // il tempo di gioco dell'avversario, che viene fissato a seconda della difficoltà
        let positionEnemyTrigger = gameData.getGeneral().timerSetting / 2;
        switch (gameData.getGeneral().botSetting) {
            case 1:
                positionEnemyTrigger = gameData.getGeneral().timerSetting / 2;
                break;

            case 2:
                positionEnemyTrigger = gameData.getGeneral().timerSetting / 3 * 2;
                break;

            case 3:
                positionEnemyTrigger = gameData.getGeneral().timerSetting / 4 * 3;
                break;
        }


        // avvia i timer per visualizzare tempo rimanente di giocatore e avversario; questo timer non utilizza
        // direttamente la funzione setInterval(), ma implementa un procedimento per evitare l'interruzione del tempo
        // a tab inattivo
        let startMatchTimers = function () {
            let interval = 10; // ms
            let expected = Date.now() + interval;
            gameTimer = setTimeout(step, interval);

            function step() {
                let drift = Date.now() - expected;
                if (drift > interval) {
                    console.log("Timer lagged!")
                }
                nextGameTimerValue -= (interval + drift);

                // condizione di decremento ordinario
                if (nextGameTimerValue > 0 && !$scope.startAnimation) {
                    scopeService.safeApply($scope, function () {
                        // fai avanzare il timer
                        if(!gameData.getMatch().positioned)
                            $scope.userTimerValue = nextGameTimerValue;

                        if(!gameData.getMatch().enemyPositioned && gameData.getGeneral().botSetting !== 0)
                            $scope.enemyTimerValue = nextGameTimerValue;

                        // animazione degli ultimi 10 secondi
                        if ($scope.userTimerValue < 10000 && !gameData.getMatch().positioned)
                            $scope.userTimerAnimation = "clock-ending-animation";

                        if ($scope.enemyTimerValue < 10000 && !gameData.getMatch().enemyPositioned
                            && gameData.getGeneral().botSetting !== 0)
                            $scope.enemyTimerAnimation = "clock-ending-animation";

                        // piazza enemy se si raggiunge il trigger
                        if ($scope.enemyTimerValue <= positionEnemyTrigger && !gameData.getMatch().enemyPositioned
                            && gameData.getGeneral().botSetting !== 0) {
                            let botPath = pathHandler.calculateBotPath(gameData.getGeneral().botSetting);
                            gameData.editMatch({
                                enemyPositioned: true,
                                enemyTime: positionEnemyTrigger,
                                enemyStartPosition: botPath.startPosition
                            });
                            $scope.enemyTimerValue = gameData.getMatch().enemyTime;
                            $scope.enemyTimerAnimation = "clock--end";
                        }
                    });

                    // schedula nuovo decremento
                    expected = Date.now() + interval;
                    gameTimer = setTimeout(step, interval); // take into account drift

                } else {
                    // animazione iniziata o fine del tempo

                    // invia un segnale di posizionato, se necessario
                    if (!gameData.getMatch().positioned) {
                        scopeService.safeApply($scope, function () {
                            gameData.editMatch({
                                positioned: true,
                                time: 0,
                                startPosition: { side: -1, distance: -1 }
                            });
                            $scope.userTimerValue = 0;
                            $scope.userTimerAnimation = "clock--end";
                            $scope.showCompleteGrid = true;
                            $scope.showArrows = false;
                            $scope.showDraggableRoby = false;
                            calculateAllStartPositionCss(false);

                            gameData.editUserMatchResult({
                                nickname: gameData.getUser().nickname,
                                playerId: gameData.getUser().playerId,
                                pathLength: 0,
                                time: 0,
                                points: 0,
                                startPosition: { side: -1, distance: -1 }
                            });
                        });
                    }

                    // avvia animation, calcola risultato
                    startAnimation();

                    // non rinnovare il nextTimerValue e il trigger
                }
            }
        };

        // inizializzazione draggable roby
        $scope.showCompleteGrid = false;
        $scope.showArrows = false;
        $scope.startAnimation = false;
        $scope.draggableRobyImage = 'roby-idle';

        // quando roby viene trascinato, viene mostrata la griglia completa (con le posizioni di partenza), e
        // modificata l'immagine di roby
        $scope.startDragging = function () {
            audioHandler.playSound('roby-drag');
            scopeService.safeApply($scope, function () {
                $scope.showCompleteGrid = true;
                $scope.draggableRobyImage = 'roby-dragging-trasp';
                $scope.showArrows = true;
                calculateAllStartPositionCss(false);
            });
        };

        // invocato quando roby viene posizionato, ma non rilasciato, sopra una posizione di partenza valida
        $scope.robyOver = function (event, ui, side, distance) {
            audioHandler.playSound('roby-over');
            scopeService.safeApply($scope, function () {
                setArrowCss(side, distance, true);
            });
        };

        // invocato quando roby viene spostato da una posizione di partenza valida
        $scope.robyOut = function (event, ui, side, distance) {
            scopeService.safeApply($scope, function () {
                setArrowCss(side, distance, false);
            });
        };

        // quando roby viene rilasciato, ritorna nella posizione iniziale...
        $scope.endDragging = function () {
            console.log("End dragging");
            audioHandler.playSound('roby-drop');
            if (!$scope.startAnimation) {
                scopeService.safeApply($scope, function () {
                    $scope.showArrows = false;
                    $scope.showCompleteGrid = false;
                    $scope.draggableRobyImage = 'roby-idle';
                    calculateAllStartPositionCss(false);
                });
            }
        };

        //...a meno che, non venga rilasciato in una posizione valida. In quel caso, viene utilizzata un secondo tag
        // img, per mostrare roby nella sua posizione di partenza. Viene inoltre fermato il timer, e notificato
        // l'avversario dell'avvenuta presa di posizione
        $scope.robyDropped = function (event, ui, sideValue, distanceValue) {
            console.log("Roby dropped");
            audioHandler.playSound('roby-positioned');
            $scope.showCompleteGrid = true;
            if (!$scope.startAnimation) {
                gameData.editMatch({
                    positioned: true,
                    time: nextGameTimerValue,
                    startPosition: { side: sideValue, distance: distanceValue },
                });
                $scope.showDraggableRoby = false;
                $scope.userTimerAnimation = "clock--end";
                $scope.userTimerValue = gameData.getMatch().time;
                let playerResult = pathHandler.positionRoby(true, gameData.getMatch().startPosition);

                gameData.editUserMatchResult({
                    nickname: gameData.getUser().nickname,
                    playerId: gameData.getUser().playerId,
                    pathLength: playerResult.pathLength,
                    time: gameData.getMatch().time,
                    startPosition: gameData.getMatch().startPosition
                });

                // posiziona l'avversario se si supera il limite di tempo stabilito
                if (!gameData.getMatch().enemyPositioned && gameData.getGeneral().botSetting !== 0) {
                    let botPath = pathHandler.calculateBotPath(gameData.getGeneral().botSetting);
                    gameData.editMatch({
                        enemyPositioned: true,
                        enemyTime: positionEnemyTrigger,
                        enemyStartPosition: botPath.startPosition
                    });
                    $scope.enemyTimerValue = gameData.getMatch().enemyTime;
                    $scope.enemyTimerAnimation = "clock--end";
                }

                startAnimation();
            }
        };

        // cosa fare una volta terminata senza intoppi la partita; mostra la schermata aftermatch
        let startAnimation = function () {
            if (!$scope.startAnimation) {

                scopeService.safeApply($scope, function () {
                    $scope.startAnimation = true;
                });

                if (gameData.getGeneral().botSetting !== 0) {
                    let enemyResult = pathHandler.positionRoby(false, gameData.getMatch().enemyStartPosition);
                    gameData.editEnemyMatchResult({
                        nickname: gameData.getEnemy().nickname,
                        playerId: gameData.getEnemy().playerId,
                        pathLength: enemyResult.pathLength,
                        time: gameData.getMatch().enemyTime,
                        startPosition: gameData.getMatch().enemyStartPosition
                    });
                }

                gameData.editAggregated({ matchCount: gameData.getAggregated().matchCount + 1});

                // aggiusta-calcola punti e results
                gameData.editMatch({ winnerId: gameData.getMatchWinner().playerId });

                if (gameData.getMatch().winnerId === 0) {
                    gameData.editUserMatchResult({
                        points: gameData.calculateMatchPoints(gameData.getUserMatchResult().pathLength, gameData.getUserMatchResult().time)
                    });
                    gameData.editUserGlobalResult({
                        points: gameData.getUserGlobalResult().points + gameData.getUserMatchResult().points,
                        wonMatches: gameData.getUserGlobalResult().wonMatches + 1
                    });

                } else if (gameData.getMatch().winnerId === 1) {
                    gameData.editEnemyMatchResult({
                        points: gameData.calculateMatchPoints(gameData.getEnemyMatchResult().pathLength, gameData.getEnemyMatchResult().time)
                    });
                    gameData.editEnemyGlobalResult({
                        points: gameData.getEnemyGlobalResult().points + gameData.getEnemyMatchResult().points,
                        wonMatches: gameData.getEnemyGlobalResult().wonMatches + 1
                    });
                }

                pathHandler.animateActiveRobys(function () {
                    pathHandler.quitGame();
                    scopeService.safeApply($scope, function () {
                        navigationHandler.goToPage($location, '/bootmp-aftermatch');
                    });
                });
            }
        };


        // termina la partita alla pressione sul tasto corrispondente
        $scope.exitGameModal = false;
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };
        $scope.continueExitGame = function () {
            audioHandler.playSound('menu-click');
            quitGame();
            navigationHandler.goToPage($location, '/home');
        };
        $scope.stopExitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.skip = function () {
            pathHandler.quitGame();
            if ($scope.forceExitModal !== true)
                navigationHandler.goToPage($location, '/bootmp-aftermatch');
            audioHandler.playSound('menu-click');
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