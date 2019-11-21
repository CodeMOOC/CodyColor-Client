angular.module('codyColor').directive("menuButton", ['navigationHandler', 'sessionHandler', 'authHandler', '$location',
    function (navigationHandler, sessionHandler, authHandler, $location) {
    return {
        restrict : 'E',
        templateUrl: '/directives/menu-button.html',
        scope: {
            buttonTextId: '@buttonTextId',
            goToPage: '@goToPage',
            onlineCheck: '=onlineCheck',
            modal: '=modal'
        },
        controller: function() {

        },
        link: function(scope, element, attrs, controller, transcludeFn) {
            // post link
            scope.connected = rabbit.getServerConnectionState();
            scope.buttonClick = function () {
                audioHandler.playSound('menu-click');

                if (scope.connected) {
                    if(scope.modal) {
                        scope.modal.visible = true;
                        scope.modal.text = 'NO_CONNECT_DESC';
                        scope.modal.force = true;
                    }

                } else if (!sessionHandler.isClientVersionValid()) {
                    if (scope.modal) {
                        scope.modal.visible = true;
                        scope.modal.text = 'OUTDATED_VERSION_DESC';
                        scope.modal.force = true;
                    }

                } else {
                    navigationHandler.goToPage($location, scope.goToPage);
                }
            };
        }
    }
}]);