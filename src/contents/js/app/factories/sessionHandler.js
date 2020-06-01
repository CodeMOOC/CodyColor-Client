/*
 * SessionHandler: sfrutta una variabile per stabilire se la sessione corrente
 * è valida; eventualmente rimanda alla splash page. Memorizza inoltre alcuni dati di sessione
 */
angular.module('codyColor').factory("sessionHandler", function() {
    let sessionHandler = {};
    let isSessionValid;

    const clientVersion = '3.3.2';

    // informazioni sul sistema, aggiornate automaticamente dal server non appena connessi
    let generalInfo = {
        totalMatches: 0,
        connectedEnemies: 0,
        randomWaitingPlayers: 0,
        requiredClientVersion: undefined
    };

    // numero univoco associato a questa sessione
    const sessionId = (Math.floor(Math.random() * 100000)).toString();

    // oggetto che permette di
    const noSleep = new NoSleep();

    sessionHandler.enableNoSleep = function () {
        noSleep.enable();
    };

    sessionHandler.validateSession = function() {
        isSessionValid = true;
    };

    sessionHandler.isSessionInvalid = function () {
        return isSessionValid === undefined || isSessionValid === false;
    };


    sessionHandler.setGeneralInfo = function (newInfo) {
        generalInfo = newInfo;
    };


    sessionHandler.getTotalMatches = function () {
        return generalInfo.totalMatches;
    };


    sessionHandler.getConnectedPlayers = function () {
        return generalInfo.connectedPlayers;
    };


    sessionHandler.getRandomWaitingPlayers = function () {
        return generalInfo.randomWaitingPlayers;
    };


    sessionHandler.getRequiredClientVersion = function () {
        return generalInfo.requiredClientVersion;
    };


    sessionHandler.isClientVersionValid = function () {
        if (generalInfo.requiredClientVersion === undefined)
            return true;
        else
            return clientVersion === generalInfo.requiredClientVersion;
    };


    sessionHandler.getClientVersion = function () {
        return clientVersion;
    };


    sessionHandler.getSessionId = function () {
        return sessionId;
    };


    return sessionHandler;
});