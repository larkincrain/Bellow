/*
    The main controller for the Bellow controller
*/

(function () {

    var BellowApp = angular.module('BellowApp');

    BellowApp.controller('mainController', function (authenticationService, $scope, $rootScope, toaster, $timeout) {

        //Submit the form. Send the user's data to be authenticated
        var login = true;

        console.log('In the main controller');
    });

})();