angular.module('codyColor').directive("menuButton", ['navigationHandler', 'sessionHandler', 'authHandler', '$location',
    function (navigationHandler, sessionHandler, authHandler, $location) {
    return {
        restrict : 'E',
        templateUrl: '/directives/menu-button.html',
        scope: {
            buttonTextId: '@buttonTextId',
            goToPage: '@goToPage',
            offlineCheck: '=offlineCheck',
            versionCheck: '=versionCheck'
        },
        controller: function() {

        },
        link: function(scope, element, attrs, controller, transcludeFn) {
            // post link
            scope.buttonClick = function () {
                navigationHandler.goToPage($location, scope.goToPage);
                // todo fn scope to navigate to page, check offline and version
            };
        }
    }
}]);