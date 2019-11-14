/*
 * ShareHandler: factory ausiliario responsabile della condivisione o copia di testi
 */
angular.module('codyColor').factory("shareHandler", [function() {
    let shareHandler = {};

    shareHandler.copyTextToClipboard = function(text) {
        // Create new element
        let el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = text;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = {position: 'absolute', left: '-9999px'};
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    };

    shareHandler.shareText = function (title, text, url) {
        let legacy = false;

        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: url
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch(console.error);
        } else {
            // fallback
            legacy = true;
            shareHandler.copyTextToClipboard(text + ' Play with me in ' + url);
        }

        return legacy;
    };

    return shareHandler;
}]);