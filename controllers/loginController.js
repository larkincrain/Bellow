/*
    The authentication controller for the Bellow controller
*/

(function () {

    var BellowApp = angular.module('BellowApp');

    BellowApp.controller('authController', function (authenticationService, $scope, $rootScope, toaster, $timeout) {
        //Determine Welcome message based on wether the user is logged in
        $scope.status = '';

        if (authenticationService.isLoggedIn() == false) {
            $scope.welcomeMessage = 'Logged Out';
            $scope.password;
            $scope.username;
            $scope.buttonText = 'Login';
            $scope.status = 'loggedOut';
        }
        else {
            $scope.welcomeMessage = 'Logged In';
            console.log(authenticationService.getUserInfo().Username);
            $scope.username = authenticationService.getUserInfo().Username;
            $scope.password = authenticationService.getUserInfo().Password;
            $scope.givenname = authenticationService.getUserInfo().GivenName;
            $scope.surname = authenticationService.getUserInfo().SurName;

            $scope.password = "";
            $scope.buttonText = 'Log Out';
            $scope.status = 'loggedIn';
        }

        //Submit the form. Send the user's data to be authenticated
        $scope.submit = function () {
            console.log('Username: ' + $scope.username);
            console.log('Password: ' + $scope.password);

            authenticationService.authenticate($scope.username, $scope.password).then(
                function (data) {
                    if (data.indexOf('Authentication Failed') > -1) {
                        console.log('failure');
                        $scope.invalidAuthAlert();
                    }
                });
        };
        $scope.logout = function () {
            authenticationService.logout();
            $scope.emit('logout');
            $scope.welcomeMessage = 'Logged Out';
            $scope.buttonText = 'Login';
            $scope.status = 'loggedOut';

            $timeout(function () {
                // anything you want can go here and will safely be run on the next digest.
                $scope.$apply();
            });
        }

        $scope.login = true;

        $scope.invalidAuthAlert = function () {
            toaster.pop('toaster-green', 'Authentication failure', 'Login Failed');
        }
    });

})();