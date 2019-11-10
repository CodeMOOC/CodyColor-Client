/*
 * RobyMoveHandler: servizio che permette di gestire i robot nella scacchiera, calcolando il percorso che
 * ogni robot robot deve compiere, animandoli a comando, e calcolandone il percorso
 */
angular.module('codyColor').factory("pathHandler", ['gameData','scopeService', function(gameData, scopeService) {
    let pathHandler = {};

    // rirerimenti jQuery agli elementi del DOM utilizzati nell'elaborazione delle animaizoni
    let startPositionsTiles;
    let completeGridTiles;
    let playerRoby = {};
    let enemiesRoby = [];


    // permette di uscire dal gioco in modo sicuro, interrompendo tutti i timers e pulendo le variabili
    pathHandler.quitGame = function() {
        for (let side = 0; side < 4; side++) {
            for (let distance = 0; distance < 5; distance++) {
                if (enemiesRoby[side] !== undefined &&
                    enemiesRoby[side][distance] !== undefined &&
                    enemiesRoby[side][distance].walkingTimer !== undefined) {
                    clearInterval(enemiesRoby[side][distance].walkingTimer);
                    enemiesRoby[side][distance].walkingTimer = undefined;
                }
            }
        }

        if (playerRoby.walkingTimer !== undefined) {
            clearInterval(playerRoby.walkingTimer);
            playerRoby.walkingTimer = undefined;
        }

        playerRoby = {};
        enemiesRoby = [];
    };


    pathHandler.getPlayerRoby = function() {
        return playerRoby;
    };


    pathHandler.getEnemiesRoby = function() {
        return enemiesRoby;
    };


    // inizializzazione oggetti utilizzati per tenere traccia di vari dati dei roby,
    // oltre agli altri elementi utili per il calcolo del percorso
    pathHandler.initialize = function ($scope) {
        startPositionsTiles = new Array(4);
        for (let side = 0; side < 4; side++) {
            startPositionsTiles[side] = new Array(5);
            for (let distance = 0; distance < 5; distance++) {
                startPositionsTiles[side][distance] = $('#start-' + side.toString() + distance.toString());
            }
        }

        completeGridTiles = new Array(5);
        for (let x = 0; x < 5; x++) {
            completeGridTiles[x] = new Array(5);
            for (let y = 0; y < 5; y++) {
                completeGridTiles[x][y] = $('#tile-' + x.toString() + y.toString());
            }
        }

        playerRoby = {
            element: $('#player-roby'),
            show: false,
            setShow: function (show) {
                scopeService.safeApply($scope, function () {
                    playerRoby.show = show;
                });
            },
            animationFinished: false,
            brokenPosition: startPositionsTiles[2][2].position(),
            walkingTimer: undefined,
            path: undefined,
            positionedImage: 'roby-positioned',
            walkingImages: ['roby-walking-1', 'roby-walking-2'],
            brokenImage: 'roby-broken',
            image: playerRoby.positionedImage,
            startPosition: {
                side: -1,
                distance: -1
            },
            changeImage: function (image) {
                scopeService.safeApply($scope, function () {
                        playerRoby.image = image;
                });
            }
       };

        enemiesRoby = new Array(4);
        for (let side = 0; side < 4; side++) {
            enemiesRoby[side] = new Array(5);
            for (let distance = 0; distance < 5; distance++) {
                enemiesRoby[side][distance] = {
                    element:  $('#enemy-roby-' + side.toString() + distance.toString()),
                    show: false,
                    setShow: function (show) {
                        scopeService.safeApply($scope, function () {
                            enemiesRoby[side][distance].show = show;
                        });
                    },
                    animationFinished: false,
                    brokenPosition: startPositionsTiles[2][3].position(),
                    walkingTimer: undefined,
                    positionedImage: 'enemy-positioned',
                    walkingImages: ['enemy-walking-1', 'enemy-walking-2'],
                    brokenImage: 'enemy-broken',
                    image:  'enemy-positioned',
                    changeImage: function (image) {
                        scopeService.safeApply($scope, function () {
                            enemiesRoby[side][distance].image = image;
                        });
                    }
                };
            }
        }
    };


    // pone un roby in posizione (senza animazione), sulla casella passata in ingresso dall'utente,
    // quindi calcola e prepara il percorso; ritorna il path del robot
    pathHandler.positionRoby = function (isPlayer, selectedStart) {
        let robotPath = pathHandler.calculatePath(selectedStart);

        if (selectedStart.side !== -1 && selectedStart.distance !== -1) {
            let roby = (isPlayer ? playerRoby : enemiesRoby[selectedStart.side][selectedStart.distance]);

            if (roby === undefined) return robotPath;

            roby.setShow(true);
            let startPosition = startPositionsTiles[selectedStart.side][selectedStart.distance].position();
            let rotationValue = 'rotate(' + getAngle((selectedStart.side + 2).mod(4)).toString() + 'deg)';
            roby.element.css({
                left: startPosition.left,
                top: startPosition.top,
                transform: rotationValue
            });
            roby.changeImage(roby.positionedImage);

            // crea le coordinate percorso del robot
            $.extend(true, roby, robotPath);
        }

        return robotPath;
    };


    // anima tutti i roby che sono stati posizionati nella griglia
    pathHandler.animateActiveRobys = function(endMatchCallback) {
        animateRoby(playerRoby, endMatchCallback, true);

        for (let side = 0; side < 4; side++) {
            for (let distance = 0; distance < 5; distance++) {
                if(enemiesRoby[side][distance].show === true)
                    animateRoby(enemiesRoby[side][distance], endMatchCallback, false);
            }
        }
    };


    // anima il movimento di roby
    let animateRoby = function (roby, endCallback, isPlayer) {
        if (roby.startPosition.distance === -1 && roby.startPosition.side === -1) {
            roby.element.delay(1000);
            roby.element.queue(function (next) {
                roby.animationFinished = true;
                executeIfEnd(endCallback);
                next();
            });
            return;
        }

        roby.element.delay(1000);

        // aggiunge un leggero ritardo al movimento dell'avversario,
        // per non sovrapporre i robottini
        if(!isPlayer)
            roby.element.delay(100);

        roby.element.queue(function (next) {
            let changeValue = 0;
                roby.walkingTimer = setInterval(function() {
                    roby.changeImage(changeValue === 0 ? roby.walkingImages[0] : roby.walkingImages[1]);
                    changeValue = (changeValue + 1).mod(2);
                }, 500);
            next();
        });

        for (let i = 0; i < roby.pathLength; i++) {
            let currentTilePos = completeGridTiles[roby.tilesCoords[i].x][roby.tilesCoords[i].y].position();
            roby.element.animate({
                left: currentTilePos.left,
                top: currentTilePos.top
            }, {
                duration: 800
            });
            roby.element.delay(200);
            roby.element.queue(function(next) {
                // rotation to the next direction
                if ((i + 1) < roby.pathLength) {
                    //roby.rotateRobot(path.direction[i], path.direction[i + 1], next);
                    roby.element.css({
                        transform: 'rotate(' + getAngle(roby.direction[i + 1]).toString() + 'deg)'
                    });

                } else {
                    //roby.rotateRobot(path.direction[i], path.endCoords.distance, next);
                    roby.element.css({
                        transform: 'rotate(' + getAngle(roby.endPosition.side).toString() + 'deg)'
                    });
                }
                next();
            });
        }

        let endPos = startPositionsTiles[roby.endPosition.side][roby.endPosition.distance].position();
        roby.element.animate({left: endPos.left, top: endPos.top}, { duration: 800 });
        roby.element.queue(function (next) {
            if (roby.walkingTimer !== undefined)
                    clearInterval(roby.walkingTimer);
            roby.walkingTimer = undefined;
            roby.changeImage(roby.positionedImage);
            next();
        });
        roby.element.delay(1000);
        roby.element.queue(function (next) {
            // fine animazione; esegui il callback se si è gli ultimi ad eseguire
            roby.animationFinished = true;
            executeIfEnd(endCallback);
            next();
        });
    };


    let executeIfEnd = function(endCallback) {
        let allAnimationFinished = true;

        if (!playerRoby.animationFinished)
            allAnimationFinished = false;

        if (enemiesRoby.length > 0) {
            for (let side = 0; side < 4; side++) {
                for (let distance = 0; distance < 5; distance++) {
                    if (enemiesRoby[side][distance].show && !enemiesRoby[side][distance].animationFinished) {
                        allAnimationFinished = false;
                        break;
                    }
                }
            }
        }

        if (allAnimationFinished)
            endCallback();
    };


    // algoritmo di calcolo del percorso dell'IA, in base al livello di difficolta' selezionato
    // return: il path dell'IA
    pathHandler.calculateBotPath = function(difficulty) {
        let allPaths = [];

        // calcola tutti i possibili percorsi
        for (let sideValue = 0; sideValue < 4; sideValue++) {
            for (let distanceValue = 0; distanceValue < 5; distanceValue++) {
                allPaths.push(pathHandler.calculatePath({
                    side: sideValue,
                    distance: distanceValue
                }));
            }
        }

        // ordina tutti i percorsi in base alla lunghezza
        allPaths.sort(function(a, b){
            return a.pathLength - b.pathLength;
        });

        // scegli il percorso in base al livello di difficolta'
        let selectedPath;
        switch (difficulty) {
            case 1:
                // facile: seleziona un percorso casuale tra i più corti
                selectedPath = allPaths[Math.floor(Math.random() * 10)];
                break;

            case 2:
                // medio: seleziona un percorso casuale tra i più lunghi
                selectedPath = allPaths[Math.floor(Math.random() * 10) + 10];
                break;

            case 3:
                // difficile: seleziona il percorso più lungo
                selectedPath = allPaths[19];
                break;
        }

        return selectedPath;
    };


    // algoritmo per il calcolo del percorso di uno dei roby, salvandone un oggetto che lo descrive
    // return: il path corrispondente
    pathHandler.calculatePath = function (startPosition) {
        // oggetto da memorizzare nel roby per attuare il percorso
        let path = {
            startPosition: startPosition,
            endPosition: { side: -1, distance: -1 },
            tilesCoords: [],
            direction: [],
            pathLength: 0,
        };

        // roby non posizionato entro il tempo limite
        if (path.startPosition.distance === -1 && path.startPosition.side === -1) {
            return path;
        }

        // ottieni primo elemento
        switch (path.startPosition.side) {
            case 0:
                path.tilesCoords.push({ x: 0, y: path.startPosition.distance });
                break;
            case 1:
                path.tilesCoords.push({ x: path.startPosition.distance, y: 4 });
                break;
            case 2:
                path.tilesCoords.push({ x: 4, y: path.startPosition.distance });
                break;
            case 3:
                path.tilesCoords.push({ x: path.startPosition.distance, y: 0 });
                break;
        }
        path.direction.push((path.startPosition.side + 2).mod(4));
        path.pathLength++;

        // ottieni elementi successivi tramite while
        let endOfThePath = false;
        while (!endOfThePath) {
            let lastTileCoords = path.tilesCoords[path.pathLength - 1];
            let lastTileDirection = path.direction[path.pathLength - 1];
            let nextTileCoords = {x: -1, y: -1};
            let nextTileDirection = -1;

            // 1. trova la prossima direction
            switch(gameData.getMatch().tiles[lastTileCoords.x][lastTileCoords.y]) {
                case 'Y':
                    // vai verso sinistra
                    nextTileDirection = (lastTileDirection - 1).mod( 4);
                    break;
                case 'R':
                    // vai verso destra
                    nextTileDirection = (lastTileDirection + 1).mod(4);
                    break;
                case 'G':
                    // vai dritto
                    nextTileDirection = lastTileDirection;
                    break;
            }

            // 2. trova la prossima tile
            switch(nextTileDirection) {
                case 0:
                    // verso l'alto
                    nextTileCoords.x = lastTileCoords.x - 1;
                    nextTileCoords.y = lastTileCoords.y;
                    break;
                case 1:
                    // verso destra
                    nextTileCoords.x = lastTileCoords.x;
                    nextTileCoords.y = lastTileCoords.y + 1;
                    break;
                case 2:
                    // verso il basso
                    nextTileCoords.x = lastTileCoords.x + 1;
                    nextTileCoords.y = lastTileCoords.y;
                    break;
                case 3:
                    // verso sinistra
                    nextTileCoords.x = lastTileCoords.x;
                    nextTileCoords.y = lastTileCoords.y - 1;
                    break;
            }

            // exit checks
            if (nextTileDirection === 0 && nextTileCoords.x < 0) {
                // uscita dal lato in alto
                path.endPosition.side = 0;
                path.endPosition.distance = nextTileCoords.y;
                endOfThePath = true;

            } else if (nextTileDirection === 1 && nextTileCoords.y > 4) {
                // uscita dal lato destro
                path.endPosition.side = 1;
                path.endPosition.distance = nextTileCoords.x;
                endOfThePath = true;

            } else if (nextTileDirection === 2 && nextTileCoords.x > 4) {
                // uscita dal lato in basso
                path.endPosition.side = 2;
                path.endPosition.distance = nextTileCoords.y;
                endOfThePath = true;

            } else if (nextTileDirection === 3 && nextTileCoords.y < 0) {
                // uscita dal lato sinistro
                path.endPosition.side = 3;
                path.endPosition.distance = nextTileCoords.x;
                endOfThePath = true;
            }

            // la prossima tile è valida: aggiungila alla struttura dati
            if (endOfThePath === false) {
                path.pathLength++;
                path.direction.push(nextTileDirection);
                path.tilesCoords.push(nextTileCoords);
            }
        }

        return path;
    };



    /*
     * FUNZIONI HELPER
     */

    // risolve il bug della funzione modulo di JavaScript
    // (https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers)
    Number.prototype.mod = function(n) {
        return ((this % n) + n) % n;
    };


    // jQuery plugin che consente la rotazione del robottino, dando come argomenti le direzioni di partenza e arrivo
    $.fn.rotateRobot = function(startDirection, endDirection, complete) {
        let args = $.speed(200, 'swing', complete);
        let step = args.step;
        return this.each(function(i, e) {
            args.complete = $.proxy(args.complete, e);
            args.step = function(now) {
                $.style(e, 'transform', 'rotate(' + now + 'deg)');
                if (step) return step.apply(e, arguments);
            };
            $({ deg: getAngle(startDirection) }).animate({ deg: getAngle(endDirection) }, args);
        });
    };


    // ricava il valore in gradi dell'angolo descritto da roby in base alla direzione data
    let getAngle = function (direction) {
        switch(direction) {
            case 0:
                // direzione verso l'alto
                return 0;
            case 1:
                // direzione verso destra
                return 90;
            case 2:
                // direzione verso il basso
                return 180;
            case 3:
                // direzione verso sinistra
                return 270;
            default:
                return 0;
        }
    };


    return pathHandler;
}]);