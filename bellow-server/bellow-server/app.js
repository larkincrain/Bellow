/*
* Author: Larkin
* Date: August 21st, 2015
* Location: Bungoma, Kenya
* Description: This is the backend that will connect the mobile app with wherever the 
* database happens to be stored. 
* Initially, we will be using a mongodb that will be hosted through Amazon and will be
* accessed through mongolab, but we could easily change this
*/

/*
 * NOTES: Current progress
 * Author: Larkin
 * Date: August 27th, 2015
 * Description: Attempting to get authentication with a MongoDB in place using
 * this tutorial: https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
 * 
 * */

// Required Modules
var express = require("express");                           //For our web API
var morgan = require("morgan");                             //HTTP request logger
var bodyParser = require("body-parser");                    //To handle POST requests 
var jwt = require("jsonwebtoken");                          //JSON web tokens, used for authentication
var mongoose = require("mongoose");                         //Accessing our mongo database 

//Modules defined in this application
var schemas = require('./schemas.js');                      //Our schemas for the database
var environment = require('./environment.js');              //The environment variables, such as connection strings

var app = express();
var port = environment.port || 8080;
console.log('The application is using port number: ' + port);

// Connect to DB
mongoose.connect(environment.mongo_connection_string);

//Set up our application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

//Basic routes
app.get('/', function (req, res) {
    console.log('Accessing home directory');
    res.send('The API will be at: http://localhost:' + port + '/API');
});

//Basic routes
app.get('/api', function (req, res) {
    console.log('Welcome to the API');
    res.send('Welcome to the API');
});

//Start the server
app.listen(port);
console.log('Magic happens at http://localhost:' + port);