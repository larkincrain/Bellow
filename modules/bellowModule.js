(function () {
    // create the module and name it scotchApp
    var BellowApp = angular.module('BellowApp', [
        'ui.router',                    //ui routing
        'ngRoute',                      //routing
        'ngCookies',			        //provides read/write access to browser's cookies
        'ui.bootstrap',                 //provides for angular bootstrap UI elements
        'ngMaterial',                   //Building material dependency
        'toaster',                      //Angular toaster
    ]);

})();