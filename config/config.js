/*
Configuration file for the Bellow App 
*/
(function () {

    var BellowApp = angular.module('BellowApp');

    //Routing options
    BellowApp.config(['$httpProvider', '$urlRouterProvider', '$stateProvider', function ($httpProvider, $urlRouterProvider, $stateProvider) {

        console.log('start routing config');

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // $urlRouteProvider.otherwise('/landing');

        $stateProvider

        .state('test', {
            url: "/test",
            views: {
                "main-content": {
                    templateUrl: 'templates/login.html',
                    controller: 'loginController'
                }
            }
        })
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
                    controller: 'loginController'
                }
            }
        })
        .state('login', {
            url: "/login",
            views: {
                "login": {
                    templateUrl: 'templates/authentication.html',
                    controller: 'loginController'
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
                console.log('We are changing the state');

                if (authenticationService.isLoggedIn() == false) {
                    console.log('User is not authenticated, send to login page');
                    $location.path("/login");
                }
            });

        }]);

    var apiPaths = {
        apiUrl: "http://52.88.12.200/api",												        //This needs to be the location of my node server
        test_apiUrl: "http://52.88.12.200/api/test",										//This needs to be the location of my node server test end point
    };

    var config = {
        apiPaths: apiPaths,
        version: '0.0.1'
    };

    BellowApp.value('config', config);

})();