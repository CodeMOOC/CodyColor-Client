/*
 * GameData: factory utilizzato come struttura per memorizzare variabili della partita corrente,
 * oltre a restituire funzioni utili alla formattazione di tali dati
 */
angular.module('codyColor').factory('gameData', function () {

    let gameData = {};

    let data = {};

    const gameTypes = {
        bootmp: 'bootmp',
        random: 'random',
        custom: 'custom',
        royale: 'royale'
    };


    let generateEmptyGameData = function() {
        return {
            general: generateEmptyGeneral(),                // Configurazione iniziale dal server
            user: generateEmptyUser(),                      // Dati identita' utente, util. per validazione e matchmaking
            enemy: generateEmptyUser(),                     // avversario 1vs1, se necessario
            aggregated: generateEmptyAggregated(),          // Dati aggregati in agg. continuo dal server
            match: generateEmptyMatch(),                    // Dati di lavoro per il match
            matchRanking: [],                               // podio match - passato dal server a fine part.
            globalRanking: [],                              // podio global - passato dal server a fine part.
            userMatchResult: generatePlayerMatchResult(),   // risultati utente: calcolato in locale a fine partita
            userGlobalResult: generatePlayerGlobalResult(), // risultati utente: calcolato in locale a fine partita
            enemyMatchResult: generatePlayerMatchResult(),  // risultati avversario: calcolato in locale a fine partita
            enemyGlobalResult: generatePlayerGlobalResult() // risultati avversario: calcolato in locale a fine partita
        }
    };


    let generateEmptyGeneral = function() {
        return {
            // dati generali: settati a inizio partita
            gameName:          undefined,
            startDate:         undefined,
            scheduledStart:    false,
            gameRoomId:       -1,
            timerSetting:      30000,
            maxPlayersSetting: 20,
            code:             '0000',
            gameType:         undefined,
            botSetting:      -1
        }
    };


    let generateEmptyUser = function() {
        return {
            nickname:  "Anonymous",
            validated:  false,
            organizer:  false,
            playerId:  -1
        }
    };


    let generateEmptyAggregated = function() {
        return {
            connectedPlayers: 0,
            positionedPlayers: 0,
            readyPlayers: 0,
            matchCount: 0
        }
    };


    let generateEmptyMatch = function() {
        return {
            tiles:      undefined,
            enemyTime: -1,
            enemyPositioned: false,
            time:      -1,
            positioned: false,
            winnerId:  -1,
            startPosition: {
                side:     -1,
                distance: -1
            }
        };
    };


    let generatePlayerMatchResult = function() {
        return {
            nickname: "Anonymous",
            playerId: -1,
            time: -1,
            points: 0,
            pathLength: 0,
            startPosition: {
                side: -1,
                distance: -1
            }
        };
    };


    let generatePlayerGlobalResult = function() {
        return {
            nickname: "Anonymous",
            playerId: -1,
            wonMatches: 0,
            points: 0
        };
    };


    /* -------------------------------------------------------------------- *
     * Initializators: metodi per 'pulire' la struttura dati, nel momento
     * in cui vada resettata
     * -------------------------------------------------------------------- */

    // pone i dati di gioco al loro valore di default
    gameData.initializeMatchData = function () {
        data.match = generateEmptyMatch();
        data.matchRanking = [];
        data.globalRanking = [];
    };


    gameData.initializeGameData = function () {
        data = generateEmptyGameData();
    };

    gameData.initializeGameData();

    /* -------------------------------------------------------------------- *
     * Getter-setter:funzioni ausiliarie per accedere ai dati
     * -------------------------------------------------------------------- */

    gameData.edit = function(modifiedProperties) {
        $.extend(true, data, modifiedProperties);
    };

    gameData.getData = function () {
        return data;
    };

    gameData.getUser = function () {
        return data.user;
    };

    gameData.editUser = function(modifiedProperties) {
        $.extend(true, data.user, modifiedProperties);
    };

    gameData.getEnemy = function () {
        return data.enemy;
    };

    gameData.editEnemy = function(modifiedProperties) {
        $.extend(true, data.enemy, modifiedProperties);
    };

    gameData.getGeneral = function () {
        return data.general;
    };

    gameData.editGeneral = function(modifiedProperties) {
        $.extend(true, data.general, modifiedProperties);
    };

    gameData.getAggregated = function () {
        return data.aggregated;
    };

    gameData.editAggregated = function(modifiedProperties) {
        $.extend(true, data.aggregated, modifiedProperties);
    };

    gameData.getMatch = function () {
        return data.match;
    };

    gameData.editMatch = function(modifiedProperties) {
        $.extend(true, data.match, modifiedProperties);
    };

    gameData.getGlobalRanking = function () {
        return data.globalRanking;
    };

    gameData.editGlobalRanking = function(modifiedProperties) {
        $.extend(true, data.globalRanking, modifiedProperties);

        // nei match 1vs1 online, imposta anche le strutture userMatchResult e enemyMatchResult specularmente
        if (data.general.gameType === gameTypes.random || data.general.gameType === gameTypes.custom) {
            let userGlobalIndex = data.globalRanking[0].playerId === data.user.playerId ? 0 : 1;
            let enemyGlobalIndex = userGlobalIndex === 0 ? 1 : 0;
            $.extend(true, data.userGlobalResult, data.globalRanking[userGlobalIndex]);
            $.extend(true, data.enemyGlobalResult, data.globalRanking[enemyGlobalIndex]);
        }
    };

    gameData.getMatchRanking = function () {
        return data.matchRanking;
    };

    gameData.editMatchRanking = function(modifiedProperties) {
        $.extend(true, data.matchRanking, modifiedProperties);

        // nei match 1vs1 online, imposta anche le strutture userMatchGlobal e enemyMatchGlobal specularmente
        if (data.general.gameType === gameTypes.random || data.general.gameType === gameTypes.custom) {
            let userMatchIndex = data.matchRanking[0].playerId === data.user.playerId ? 0 : 1;
            let enemyMatchIndex = userMatchIndex === 0 ? 1 : 0;
            $.extend(true, data.userMatchResult, data.matchRanking[userMatchIndex]);
            $.extend(true, data.enemyMatchResult, data.matchRanking[enemyMatchIndex]);
        }
    };


    gameData.getUserGlobalResult = function () {
        return data.userGlobalResult;
    };

    gameData.editUserGlobalResult = function(modifiedProperties) {
        $.extend(true, data.userGlobalResult, modifiedProperties);
    };


    gameData.getUserMatchResult = function () {
        return data.userMatchResult;
    };

    gameData.editUserMatchResult = function(modifiedProperties) {
        $.extend(true, data.userMatchResult, modifiedProperties);
    };


    gameData.getEnemyGlobalResult = function () {
        return data.enemyGlobalResult;
    };

    gameData.editEnemyGlobalResult = function(modifiedProperties) {
        $.extend(true, data.enemyGlobalResult, modifiedProperties);
    };


    gameData.getEnemyMatchResult = function () {
        return data.enemyMatchResult;
    };

    gameData.editEnemyMatchResult = function(modifiedProperties) {
        $.extend(true, data.enemyMatchResult, modifiedProperties);
    };


    /* -------------------------------------------------------------------- *
     * Helpers: metodi ausiliari alla formattazione dei dati e alla verifica
     * di determinate proprieta'
     * -------------------------------------------------------------------- */

    gameData.calculateMatchPoints = function(pathLength) {
        let points = 0;

        // ogni passo vale 2 punti
        points += pathLength * 2;

        return points;
    };


    gameData.calculateWinnerBonusPoints = function(time) {
        // il tempo viene scalato su un massimo di 15 punti
        return Math.floor(15 * time / data.general.timerSetting);
    };


    // funzione per la generazione locale di nuove tiles; utilizzata nel boot camp
    gameData.generateNewMatchTiles = function() {
        let bootTiles = '';
        for (let i = 0; i < 25; i++) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    bootTiles += 'R';
                    break;
                case 1:
                    bootTiles += 'Y';
                    break;
                case 2:
                    bootTiles += 'G';
                    break;
            }
        }
        return gameData.formatMatchTiles(bootTiles);
    };


    // converte la stringa 'GRY' in una matrice 5x5
    gameData.formatMatchTiles = function (tilesString) {
        let tiles = new Array(5);
        let positionIndex = 0;

        for (let i = 0; i < 5; i++) {
            tiles[i] = new Array(5);
            for (let j = 0; j < 5; j++) {
                tiles[i][j] = tilesString.charAt(positionIndex);
                positionIndex++;
            }
        }

        return tiles;
    };


    // ottiene la notazione 'secondi' : 'centesimi'
    gameData.formatTimeDecimals = function(timerValue) {
        let decimals = Math.floor((timerValue / 10) % 100).toString();
        let seconds = Math.floor((timerValue / 1000) % 60).toString();
        let minutes = Math.floor((timerValue / (1000 * 60)) % 60).toString();

        decimals = (decimals.length < 2) ? "0" + decimals : decimals;

        if (minutes !== '0') {
            return minutes + ':' + seconds + ':' + decimals;
        } else {
            return seconds + ':' + decimals;
        }
    };

    // formattazione utilizzata durante il match
    gameData.formatTimeMatchClock = function(timerValue) {
        let decimals = Math.floor((timerValue / 100) % 10).toString();
        let seconds = Math.floor((timerValue / 1000) % 60).toString();
        let minutes = Math.floor((timerValue / (1000 * 60)) % 60).toString();

        seconds = (seconds.length < 2) ? "0" + seconds : seconds;

        if (minutes !== '0') {
            return minutes + '\' ' + seconds + '';
        } else {
            return seconds + ':' + decimals;
        }
    };


    // ottiene la notazione 'minuti' : 'secondi'; utilizzata in mmaking
    gameData.formatTimeSeconds = function(timerValue) {
        let seconds = Math.floor((timerValue % (1000 * 60)) / 1000).toString();
        let minutes = Math.floor((timerValue % (1000 * 60 * 60)) / (1000 * 60)).toString();
        let hours   = Math.floor((timerValue % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();

        hours = (hours === '0') ? '' : hours + ':';
        seconds = (seconds.length < 2) ? "0" + seconds : seconds;
        return  hours + minutes + ':' + seconds;
    };


    // funzione che restituisce una stringa leggibile dato il valore di un timer
    gameData.formatTimeStatic = function(timerValue) {
        switch(timerValue) {
            case 15000:
                return '15_SECONDS';
            case 30000:
                return '30_SECONDS';
            case 60000:
                return '1_MINUTE';
            case 120000:
                return '2_MINUTES';
        }
    };


    gameData.formatChatDate = function(millis) {
        let date = new Date(millis);

        let hours = date.getHours();
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes;
    };


    // restituisce il vincitore della partita corrente in base
    // nell'ordine a: passi effettuati e tempo impiegato
    gameData.getMatchWinner = function () {
        if (data.general.gameType === gameTypes.royale) {
            return data.matchRanking[0];

        } else if (data.general.botSetting === 0) {
            return data.userMatchResult;

        } else if (data.userMatchResult.pathLength > data.enemyMatchResult.pathLength) {
            return data.userMatchResult;

        } else if (data.userMatchResult.pathLength < data.enemyMatchResult.pathLength) {
            return data.enemyMatchResult;

        } else if (data.userMatchResult.time > data.enemyMatchResult.time) {
            return data.userMatchResult;

        } else if (data.userMatchResult.time < data.enemyMatchResult.time) {
            return data.enemyMatchResult;

        } else {
            return { playerId: -1, nickname: 'Draw!' };
        }
    };

    gameData.getGameTypes = function() {
        return gameTypes;
    };


    return gameData;
});
