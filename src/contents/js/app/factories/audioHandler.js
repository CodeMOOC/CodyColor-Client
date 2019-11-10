/*
 * AudioHandler: factory ausiliario responsabile della gestione dell'audio, dalla base
 * musicale ai vari suoni
 */
angular.module('codyColor').factory("audioHandler", ['$cookies', function($cookies) {
    let audioHandler = {};

    let musicBase = new Audio();
    musicBase.src = 'audio/music.mp3';
    musicBase.loop = true;

    let isAudioEnabled;

    audioHandler.isAudioEnabled = function() {
        if (isAudioEnabled === undefined) {
            let cookiesAudioEnabled = $cookies.get('audioEnabled');
            if (cookiesAudioEnabled === undefined) {
                $cookies.put('audioEnabled', 'true');
                isAudioEnabled = true;
            } else {
                isAudioEnabled = (cookiesAudioEnabled === 'true');
            }
        }
        return isAudioEnabled;
    };

    audioHandler.toggleBase = function () {
        if (!audioHandler.isAudioEnabled()) {
            isAudioEnabled = true;
            $cookies.put('audioEnabled', 'true');
            musicBase.play();
        } else {
            isAudioEnabled = false;
            $cookies.put('audioEnabled', 'false');
            musicBase.pause();
        }
    };

    audioHandler.stopAudioBackground = function () {
        if (audioHandler.isAudioEnabled()) {
            isAudioEnabled = false;
            musicBase.pause();
        }
    };

    audioHandler.playAudioForeground = function () {
        if (!audioHandler.isAudioEnabled() && $cookies.get('audioEnabled') === 'true') {
            isAudioEnabled = true;
            musicBase.play();
        }
    };

    audioHandler.splashStartBase = function () {
        if (audioHandler.isAudioEnabled() && musicBase.paused) {
            musicBase.play();
        }
    };

    audioHandler.playSound = function(soundName) {
        if (audioHandler.isAudioEnabled()) {
            let sound = new Audio();
            sound.src = 'audio/' + soundName + '.mp3';
            sound.play();
        }
    };

    return audioHandler;
}]);