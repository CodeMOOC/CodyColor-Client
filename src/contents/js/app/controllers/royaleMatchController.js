/*
 * Controller responsabile della schermata partita
 */
angular.module('codyColor').controller('royaleMatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    'pathHandler', '$location', '$translate', 'chatHandler', 'navigationHandler', 'audioHandler', 'sessionHandler',
    'translationHandler', 'authHandler',
    function ($scope, rabbit, gameData, scopeService, pathHandler, $location, $translate, chatHandler,
              navigationHandler, audioHandler, sessionHandler, translationHandler, authHandler) {

        let startCountdownTimer;
        let gameTimer;

        // metodo per terminare la partita in modo sicuro, disattivando i timer,
        // interrompendo animazioni e connessioni con il server
        let quitGame = function () {
            if (startCountdownTimer !== undefined) {
                clearInterval(startCountdownTimer);
                startCountdownTimer = undefined;
            }

            if (gameTimer !== undefined) {
                clearInterval(gameTimer);
                gameTimer = undefined;
            }

            rabbit.quitGame();
            pathHandler.quitGame();
            chatHandler.clearChat();
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


        // inizializzazione componenti generali interfaccia
        $scope.gameTimerValue = gameData.getGeneral().timerSetting;
        let nextGameTimerValue = gameData.getGeneral().timerSetting;

        $scope.showDraggableRoby = true;
        pathHandler.initialize($scope);
        $scope.general = gameData.getGeneral();
        $scope.aggregated = gameData.getAggregated();
        $scope.user = gameData.getUser();
        $scope.match = gameData.getMatch();
        $scope.timerFormatter = gameData.formatTimeMatchClock;
        $scope.finalTimeFormatter = gameData.formatTimeDecimals;
        $scope.playerRoby = pathHandler.getPlayerRoby();
        $scope.enemiesRoby = pathHandler.getEnemiesRoby();
        $scope.clockAnimation = "";

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
        audioHandler.playSound('countdown');
        $scope.startCountdownText = startCountdownValue.toString();
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

                startMatchTimer();
            }
        }, 1000);

        // avvia i timer per visualizzare tempo rimanente di giocatore e avversario; questo timer non utilizza
        // direttamente la funzione setInterval(), ma implementa un procedimento per evitare l'interruzione del tempo
        // a tab inattivo
        let startMatchTimer = function () {
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
                        // animazione degli ultimi 10 secondi
                        if(nextGameTimerValue < 10000)
                            $scope.clockAnimation = "clock-ending-animation";

                        // fai avanzare il timer
                        $scope.gameTimerValue = nextGameTimerValue;
                    });

                    // schedula nuovo decremento
                    expected = Date.now() + interval;
                    gameTimer = setTimeout(step, interval); // take into account drift

                } else {
                    scopeService.safeApply($scope, function () {
                        $scope.gameTimerValue = 0;
                        $scope.clockAnimation = "clock--end";
                    });

                    // invia un segnale di posizionato, se necessario
                    if (!gameData.getMatch().positioned) {
                        scopeService.safeApply($scope, function () {
                            gameData.editMatch({
                                positioned: true,
                                time: 0,
                                startPosition: {side: -1, distance: -1}
                            });

                            gameData.editUserMatchResult({
                                nickname: gameData.getUser().nickname,
                                playerId: gameData.getUser().playerId,
                                time: 0,
                                pathLength: 0,
                                startPosition: {side: -1, distance: -1},
                                points: 0
                            });

                            gameData.editAggregated({
                                positionedPlayers: gameData.getAggregated().positionedPlayers + 1
                            });

                            $scope.showCompleteGrid = true;
                            $scope.showArrows = false;
                            $scope.showDraggableRoby = false;
                            calculateAllStartPositionCss(false);
                            rabbit.sendPlayerPositionedMessage();
                        });
                    }
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
            console.log("Start dragging");
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
                scopeService.safeApply($scope, function () {
                    gameData.editMatch({
                        positioned: true,
                        time: $scope.gameTimerValue,
                        startPosition: { side: sideValue, distance: distanceValue },
                    });
                    $scope.showDraggableRoby = false;
                });
                let userPath = pathHandler.positionRoby(true, gameData.getMatch().startPosition);

                // aggiorna i risultati match dell'utente
                scopeService.safeApply($scope, function () {
                    gameData.editUserMatchResult({
                        nickname: gameData.getUser().nickname,
                        playerId: gameData.getUser().playerId,
                        time: gameData.getMatch().time,
                        pathLength: userPath.pathLength,
                        startPosition: gameData.getMatch().startPosition,
                        points: gameData.calculateMatchPoints(userPath.pathLength, gameData.getMatch().time)
                    });

                    gameData.editAggregated({
                        positionedPlayers: gameData.getAggregated().positionedPlayers + 1
                    });
                });

                rabbit.sendPlayerPositionedMessage();
            }
        };

        // callback passati alla classe responsabile della comunicazione con il broker.
        // Invocati all'arrivo di nuovi messaggi
        rabbit.setPageCallbacks({
            onEnemyPositioned: function () {
                scopeService.safeApply($scope, function () {
                    gameData.editAggregated({
                        positionedPlayers: gameData.getAggregated().positionedPlayers + 1
                    });
                });

            }, onPlayerRemoved: function (message) {
                if (message.removedPlayerId === gameData.getUser().playerId) {
                    quitGame();
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'forceExitText', 'ENEMY_LEFT');
                        $scope.forceExitModal = true;
                    });

                } else {
                    scopeService.safeApply($scope, function () {
                        gameData.editAggregated(message.aggregated);
                    });
                }

            }, onGameQuit: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope,'forceExitText', 'ENEMY_LEFT');
                    $scope.forceExitModal = true;
                });

            }, onConnectionLost: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
                    $scope.forceExitModal = true;
                });

            }, onStartAnimation: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.editAggregated(message.aggregated);
                });

                scopeService.safeApply($scope, function () {
                    $scope.startAnimation = true;
                });

                // posiziona tutti gli enemy roby
                for (let i = 0; i < message.startPositions.length; i++) {
                    // non posizionare il nemico nel caso in cui quella posizione si riferisca solo all'utente
                    if (!(message.startPositions[i].playerCount === 1
                          && message.startPositions[i].position.side === gameData.getMatch().startPosition.side
                          && message.startPositions[i].position.distance === gameData.getMatch().startPosition.distance))
                        pathHandler.positionRoby(false, message.startPositions[i].position);
                }

                // avvia le animazioni; al termine, invia il messaggio di endAnimation
                pathHandler.animateActiveRobys(function () {
                    if ($scope.askedForSkip !== true) {
                        rabbit.sendEndAnimationMessage();
                    }
                });

            }, onEndMatch: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.editAggregated(message.aggregated);
                    gameData.editMatchRanking(message.matchRanking);
                    gameData.editGlobalRanking(message.globalRanking);
                    gameData.editMatch({ winnerId: message.winnerId });

                    // aggiorna i risultati globali dell'utente
                    if (message.winnerId === gameData.getUser().playerId) {
                        gameData.editUserGlobalResult(gameData.getMatchRanking()[0]);

                    } else {
                        gameData.editUserGlobalResult({
                            nickname: gameData.getUser().nickname,
                            playerId: gameData.getUser().playerId,
                            points: gameData.getUserGlobalResult().points + gameData.getUserMatchResult().points
                        });
                    }
                });

                pathHandler.quitGame();
                if ($scope.forceExitModal !== true) {
                    scopeService.safeApply($scope, function () {
                        navigationHandler.goToPage($location, '/royale-aftermatch');
                    });
                }
            }
        });

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

        $scope.skip = function () {
            audioHandler.playSound('menu-click');
            rabbit.sendEndAnimationMessage();
            $scope.askedForSkip = true;
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
