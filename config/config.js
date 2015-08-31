/*
Configuration file for the Bellow App 
*/
(function () {

    var BellowApp = angular.module('BellowApp');

    //Routing options
    BellowApp.config(['$httpProvider', '$urlRouterProvider', '$stateProvider', function ($httpProvider, $urlRouterProvider, $stateProvider) {

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // $urlRouteProvider.otherwise('/landing');

        $stateProvider

        .state('home', {
            url: "/",
            views: {
                "nav": {
                    templateUrl: 'templates/nav/main-nav.html',
                    controller: 'mainController'
                },
                "side-nav": {
                    templateUrl: 'templates/nav/side-nav.html',
                    controller: 'mainController'
                },
                "main-content": {
                    templateUrl: 'templates/home.html',
                    controller: 'homeController'
                }
            }
        })
        .state('login', {
            url: "/login",
            views: {
                "login": {
                    templateUrl: 'templates/authentication.html',
                    controller: 'authController'
                }
            }
        })

    }]);

    //Check if the user is authenticated, if not, send to login screen
    BellowApp.run(['$route', '$rootScope', "$location", 'authenticationService',
        function ($route, $rootScope, $location, authenticationService, $state) {

            $rootScope.$on('login', function (event, data) {
                $location.path("/");
            });

            $rootScope.$on('logout', function (event, data) {
                $location.path("/login");
            });

            $rootScope.$on("$stateChangeStart", function (event, next, curent) {
                if (authenticationService.isLoggedIn() == false) {
                    $location.path("/login");
                }
            });

        }]);

    var apiPaths = {
        apiUrl: "",												    //This needs to be the location of my node server
        test_apiUrl: "",											//This needs to be the location of my node server test end point
    };

    var config = {
        apiPaths: apiPaths,
        version: '0.0.1'
    };

    BellowApp.value('config', config);

})();