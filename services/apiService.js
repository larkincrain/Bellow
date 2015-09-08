/*
    Data Service for the DH Dashboard. Will talk directly to the service layer on top of the database and will be responsible for take the raw data provided and
    wrapping it up into objects that mean something to the application
*/

(function () {

    var DHDApp = angular.module('DHDApp');

    DHDApp.factory('apiService', ['$http', '$q', '$window', 'transformRequestAsFormPostService', 'config', '$location', apiService]);

    //The authentication service that will be used to log the user in, out, and will also store informationa about the user
    function apiService($http, $q, $window, transformRequestAsFormPostService, config, $location) {

        var path = config.apiPaths.apiUrl;              //The path to the service sitting on top of the database to access the data
        var test_path = config.apiPaths.test_apiUrl;    //The test path so we are able to direct requests to the local instance of the service
        
        //The API Methods. These will call the HTTP Methods

        //This method will attempt to authenticate the user.
        //On Failure: it will return an object with the following properties
        //  success: false
        //  token: null
        //  message: error-message
        //On Success: it will return an object with the following properties
        //  success: true
        //  token: {}
        //  message: null
        var authenticate = function (email, password) {

            //The object whose promise we will return
            var deferred = q.defer();
            
            //The object with all the relavent information to return
            var return_obj = {
                success: false,
                token: null,
                message: null
            };

            if (email && password) {

                //Let's attempt to authenticate
                var method = "post";
                var path = "/authenticate";
                var needToken = false;
                var body = {
                    email: email,
                    password: password
                };

                methodConnector(method, needToken, path, body).then(function (data) {
                    return_obj.success = data.success;
                    return_obj.token = data.token;
                    return_obj.message = data.message;

                    deferred.resolve(return_obj);
                });

            } else {
                return_obj.success = false;

                if (!email && !passoword)
                    return_obj.message = "Email and password cannot be left blank.";
                if(!email)
                    return_obj.message = "Email cannot be left blank.";
                if (!password)
                    return_obj.message = "Password cannot be left blank.";

                deferred.resolve(return_obj);
            }

            return deferred.promise;
        }

        //This method will attempt to authenticate the user.
        //On Failure: it will return an object with the following properties
        //  success: false
        //  message: error-message
        //On Success: it will return an object with the following properti0es
        //  success: true
        //  message: null
        var signup = function (email, password) {
            //The object whose promise we will return
            var deferred = q.defer();

            //The object with all the relavent information to return
            var return_obj = {
                success: false,
                message: null
            };

            if (email && password) {

                //Let's attempt to sign this user up
                var method = "post";
                var needToken = false;
                var path = "/signup";
                var body = {
                    email: email,
                    password: password
                };

                methodConnector(method, needToken, path, body).then(function (data) {
                    return_obj.success = data.success;
                    return_obj.message = data.message;

                    deferred.resolve(return_obj);
                });

            } else {
                return_obj.success = false;

                if (!email && !passoword)
                    return_obj.message = "Email and password cannot be left blank.";
                if (!email)
                    return_obj.message = "Email cannot be left blank.";
                if (!password)
                    return_obj.message = "Password cannot be left blank.";

                deferred.resolve(return_obj);
            }

            return deferred.promise;
        }

        //This method will return a particular user's information given an email address
        //Then token
        var getUserInfo = function (email) {

        }

        //Intermediate functions to facilitate interaction between the API methods and the HTTP Methods
        var methodConnector = function(method, needToken, path, payload){

            //Decide which function to use
            switch (method) {
                case 'get':
                    return getQuery(path, needToken, payload);
                    break;
                case 'put':
                    return putQuery(path, needToken, payload);
                    break;
                case 'post':
                    return postQuery(path, needToken, payload);
                    break;
                case 'delete':
                    return deleteQuery(path, needToken, payload);
                    break;
            }
        }

        //HTTP Methods - These are private, we won't expose them to the application
        var getQuery = function (path, needToken, query) {

            //Execute the query
            return $http({
                url: (test == true ? test_path : path) + queryString,   //Use the test path if the test parameter is set to true
                method: "GET",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function (response) {
                return response.data;
            });
        }
        var putQuery = function (path, needToken, body) {

            return $http({
                url: config.dataPaths.dataUrl + config.dataPaths.updateValueUrl + '?wfId=' + data.wfId + '&wfDataMetaId=' + data.wfDataMetaId + '&value=' + data.value + '&userId=' + data.userId,
                method: "GET",
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                //data: data
            });
        }
        var postQuery = function (path, needToken, body) {

        }
        var deleteQuery = function (path, needToken, body) {

        }

        function init() {

        }

        init();

        return {

        };
    }
})();