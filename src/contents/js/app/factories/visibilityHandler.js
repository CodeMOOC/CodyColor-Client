/*
 * VisibilityHandler: gestisce il comportamento del programma nel momento in cui il giocatore abbandoni la partita
 * chiudendo il tab, lasciandola quindi attiva in background
 */
angular.module('codyColor').factory("visibilityHandler", ['$pageVisibility', 'audioHandler',
    function($pageVisibility, audioHandler) {
    let visibilityHandler = {};

    let backgroundTimer = undefined;
    let deadlineCallback = undefined;

    visibilityHandler.setDeadlineCallback = function(deadlineCallbackValue) {
        deadlineCallback = deadlineCallbackValue;
    };


    // gestisce i tab in background, imponendone il playerQuit dopo 15 secondi
    $pageVisibility.$on('pageFocused', function(){
        if (backgroundTimer !== undefined) {
            // si è ritornati prima della scadenza del timer; ripristina partita
            clearTimeout(backgroundTimer);
            backgroundTimer = undefined;
            audioHandler.playAudioForeground();

        } else {
            // si è ritornati dopo la scadenza del timer
            audioHandler.playAudioForeground();
        }
    });

    $pageVisibility.$on('pageBlurred', function() {
        audioHandler.stopAudioBackground();
        backgroundTimer = setTimeout(function () {
            // non si è ritornati nella pagina entro la scadenza: agisci di conseguenza
            if(deadlineCallback !== undefined) {
                deadlineCallback();
            }
        }, 15000);
    });

    return visibilityHandler;
}]);