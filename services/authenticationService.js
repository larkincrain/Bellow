/*
    Authentication Service for the bellow application. Will call our API.
*/

(function () {

    var BellowApp = angular.module('BellowApp');

    BellowApp.factory('authenticationService', ['$http', '$q', '$window', '$cookieStore', 'transformRequestAsFormPostService', 'config', '$location', '$state', AuthenticationService]);

    //The authentication service that will be used to log the user in, out, and will also store informationa about the user
    function AuthenticationService($http, $q, $window, $cookieStore, transformRequestAsFormPostService, config, $location, $state) {

        var userInfo;   //Stores the user's information

        function getUserInfo() {
            return userInfo;
        }                       //return's the user's information
        function authenticate(username, password) {

            var deferred = $q.defer();  //sUsername=string&sPassword=string&sDirectoryList=string&sAppName=string
            var path = config.apiPaths.authenticateUser + "?callback=JSON_CALLBACK&sUsername=" + username + "&sPassword=" + window.encodeURIComponent(password) + "&sDirectoryList=&sAppName=";

            $http.jsonp(config.servicePaths.authenticationUrl + path)
				.success(function (data, status, headers, config) {
				    if (typeof (data) != 'object' && data.indexOf("INVALID USER") > -1) {
				        //alert('Rejected auth');
				        deferred.resolve('Authentication Failed');
				    }
				    else {
				        //alert('Accepted auth');
				        //console.log(data);
				        userInfo = data;
				        $window.sessionStorage["userInfo"] = JSON.stringify(data);
				        $cookieStore.put("dhdAuthCookie", data);
				        deferred.resolve(userInfo);
				        $location.path("/");
				    }
				}).error(function (data, status, headers, config) {
				    deferred.resolve('Authentication Failed');
				});

            return deferred.promise;

        }    //authenticate the user against the credentialing authority
        function logout() {
            console.log('logout');
            userInfo = null;
            $window.sessionStorage["userInfo"] = null;
            $cookieStore.remove("dhdAuthCookie");
            $state.go("login");
        }                            //de-authenticate the user
        function isLoggedIn() {
            if (userInfo == null) {
                return false;
            }
            else {
                return true;
            }
        }                        //returns true if the userInfo variable is not null
        function init() {
            if ($window.sessionStorage["userInfo"]) {
                userInfo = JSON.parse($window.sessionStorage["userInfo"]);
            }
            else {
                userInfo = null;
            }

            //If there is a cookie, then take that as our user info
            var dhdAuthCookie = $cookieStore.get("dhdAuthCookie");
            if (typeof (dhdAuthCookie) != 'undefined')
                userInfo = dhdAuthCookie;
        }                              //Performed when it is initialized
        function getRole() {

        }   //This will access the database for the DH Dashboard and will find the user's role based on user name

        init();

        return {
            authenticate: authenticate,
            logout: logout,
            getUserInfo: getUserInfo,
            isLoggedIn: isLoggedIn,
            profilePicture: profilePicture
        };
    }
})();