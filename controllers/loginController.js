/*
    The authentication controller for the Bellow controller
*/

(function () {

    var BellowApp = angular.module('BellowApp');

    BellowApp.controller('loginController', function (authenticationService, $scope, $rootScope, toaster, $timeout) {

        console.log('in login controller');

        //Submit the form. Send the user's data to be authenticated
        $scope.submit = function () { };

        $scope.invalidAuthAlert = function () {
            toaster.pop('toaster-green', 'Authentication failure', 'Login Failed');
        }
    });

})();