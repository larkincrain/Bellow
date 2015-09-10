/*
    Authentication Service for the bellow application. Will call our API.
*/

(function () {

    var BellowApp = angular.module('BellowApp');

    BellowApp.factory('authenticationService', ['$http', '$q', '$window', '$cookieStore', 'transformRequestAsFormPostService', 'config', '$location', '$state', 'apiService', authenticationService]);

    //The authentication service that will be used to log the user in, out, and will also store informationa about the user
    function authenticationService($http, $q, $window, $cookieStore, transformRequestAsFormPostService, config, $location, $state, apiService) {

        var userInfo;   //Stores the user's information
        var token;      //Stores the JWT that we have from the server

        function getUserInfo() {
            return userInfo;
        }                       //return's the user's information
        function authenticate(username, password) {

            var deferred = $q.defer();
            
            var authenticateResult = function (result) {
                console.log(result.message);
            }

            apiService.authenticate(username, password).then(authenticateResult);

        }    //authenticate the user against the credentialing authority

        function logout() {
            console.log('logout');
            userInfo = null;
            token = null;
            $window.sessionStorage["bellowJWT"] = null;
            //$cookieStore.remove("BellowAuthCookie");
            $state.go("login");
        }                            //de-authenticate the user
        function isLoggedIn() {
            if (token == null) {
                return false;
            }
            else {
                return true;
            }
        }                        //returns true if the userInfo variable is not null
        function init() {

            if ($window.sessionStorage["bellowJWT"]) {
                token = $window.sessionStorage["bellowJWT"];
            }
            else {
                console.log('Couldnt find any saved tokens, user is not authenticated');
                userInfo = null;
            }

            //If there is a cookie, then take that as our user info
            //var BellowdAuthCookie = $cookieStore.get("BellowdAuthCookie");
            //if (typeof (BellowdAuthCookie) != 'undefined')
            //    userInfo = BellowdAuthCookie;
        }                              //Performed when it is initialized
        
        init();

        return {
            authenticate: authenticate,
            logout: logout,
            getUserInfo: getUserInfo,
            isLoggedIn: isLoggedIn,
        };
    }
})();