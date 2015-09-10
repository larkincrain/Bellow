/*
    Data Service for the DH Dashboard. Will talk directly to the service layer on top of the database and will be responsible for take the raw data provided and
    wrapping it up into objects that mean something to the application
*/

(function () {

    var BellowApp = angular.module('BellowApp');

    BellowApp.factory('apiService', ['$http', '$q', '$window', 'transformRequestAsFormPostService', 'config', '$location', apiService]);

    //The authentication service that will be used to log the user in, out, and will also store informationa about the user
    function apiService($http, $q, $window, transformRequestAsFormPostService, config, $location) {

        var path = config.apiPaths.apiUrl;              //The path to the service sitting on top of the database to access the data
        var test_path = config.apiPaths.test_apiUrl;    //The test path so we are able to direct requests to the local instance of the service
        
        var token;                                      //The API access token that was returned from the authenticate method

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
        var authenticate = function (email, password, test) {

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

                methodConnector(method, needToken, path, test, body).then(function (data) {
                    return_obj.success = data.success;
                    return_obj.token = data.token;
                    return_obj.message = data.message;

                    token = data.token;                     //Save our token for future use

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
        var signup = function (email, password, test) {

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

                methodConnector(method, needToken, path, test, body).then(function (data) {
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
        var getUserInfo = function (email, test) {

            //The object whose promise we will return
            var deferred = q.defer();

            //The object with all the relavent information to return
            var return_obj = {
                success: false,
                message: null,
                userInfo: null
            };

            if (email) {

                //Let's attempt to sign this user up
                var method = "get";
                var needToken = true;
                var path = "/user";
                var query = {
                    email: email
                };

                methodConnector(method, needToken, path, test, body).then(function (data) {
                    return_obj.success = data.success;
                    return_obj.message = data.message;
                    return_obj.userInfo = data.userInfo;

                    deferred.resolve(return_obj);
                });

            } else {
                return_obj.success = false;
                return_obj.message = "Email cannot be left blank.";

                deferred.resolve(return_obj);
            }

            return deferred.promise;
        }

        //This method will update a user's profile given an email address and parameters
        //of the user's profile that should be updated. 
        //The only required field is the email address of the user.
        //On Failure:
        //  success: false
        //  message: error-message
        //On Success:
        //  success: true
        //  message: null
        var editUuser = function (email, parameters, test) {

            //The object whose promise we will return
            var deferred = q.defer();

            //The object with all the relavent information to return
            var return_obj = {
                success: false,
                message: null,
            };

            if (email) {

                //Let's attempt to sign this user up
                var method = "post";
                var needToken = true;
                var path = "/user/edit";
                var body = parameters;

                //Add the email to the body of the POST parameters
                body.email = email;

                methodConnector(method, needToken, path, test, body).then(function (data) {
                    return_obj.success = data.success;
                    return_obj.message = data.message;
                    return_obj.userInfo = data.userInfo;

                    deferred.resolve(return_obj);
                });

            } else {
                return_obj.success = false;
                return_obj.message = "Email cannot be left blank.";

                deferred.resolve(return_obj);
            }

            return deferred.promise;
        }

        //This method will create a new place with the parameters that are passed in.
        //On Failure:
        //  success: false
        //  message: error-message
        //  place-id: null
        //On Success:
        //  success: true
        //  message: null
        //  place_id: place-id
        var addPlace = function (placeParameters, test) {

            //The object whose promise we will return
            var deferred = q.defer();

            //The object with all the relavent information to return
            var return_obj = {
                success: false,
                message: null,
                place_id: null
            };

            if (placeParameters) {

                //Let's attempt to sign this user up
                var method = "post";
                var needToken = false;
                var path = "/place/add";
                var body = placeParameters;

                methodConnector(method, needToken, path, test, body).then(function (data) {
                    return_obj.success = data.success;
                    return_obj.message = data.message;
                    return_obj.place_id = data.place_id;

                    deferred.resolve(return_obj);
                });

            } else {
                return_obj.success = false;
                return_obj.place_id = null;
                return_obj.message = "Place parameters cannot be null";

                deferred.resolve(return_obj);
            }

            return deferred.promise;
        }

        //Intermediate functions to facilitate interaction between the API methods and the HTTP Methods
        var methodConnector = function(method, needToken, path, test, payload){

            //Check out the security requirements of the API call
            if (needToken)
                payload.token = token;

            //Determine if we are using the test API or not
            if (test)
                path = "/test" + path;

            //Decide which function to use
            switch (method) {
                case 'get':
                    return getQuery(path, payload);
                    break;
                case 'put':
                    return putQuery(path, payload);
                    break;
                case 'post':
                    return postQuery(path, payload);
                    break;
                case 'delete':
                    return deleteQuery(path, payload);
                    break;
            }
        }

        //HTTP Methods - These are private, we won't expose them to the application
        var getQuery = function (path, query) {

            //Execute the query
            return $http({
                url: path,
                method: "GET",
                params: query,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function (response) {
                return response.data;
            });
        }
        var putQuery = function (path, body) {
            //TODO: flesh out the put HTTP verb
        }
        var postQuery = function (path, body) {

            //Execute the query
            return $http({
                url: path,
                method: "POST",
                data: body,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function (response) {
                return response.data;
            });
        }
        var deleteQuery = function (path, body) {
            //TODO: flesh out the delete HTTP verb
        }

        function init() {

        }

        init();

        return {

        };
    }
})();