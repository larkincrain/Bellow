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
var passport = require('passport');                         //Different methods of authentication
var flash = require('connect-flash');                       //Sending flash messages
var cookieParser = require('cookie-parser');                //For using cookies
var session = require('express-session');                   //Storing session information
var bcrypt = require('bcrypt');                             //Used for cryptograhic functions such as hasing passwords                      
var q = require('q');                                       //Used for promises and the like

//Modules defined in this application
var User = require('./schemas/user.js');                    //Our schemas for the database
var environment = require('./environment.js');              //The environment variables, such as connection strings
var crypt = require('./modules/crypt.js');                  //Our module for hashing passwords and comparing passwords

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

//Routing
//Basic routes
app.get('/', function (req, res) {
    console.log('Accessing home directory');
    res.send('The API will be at: http://localhost:' + port + '/API');
});

//Test route example
app.get('/setup', function (req, res) {
    
    //Create a sample user
    var user = new User({
        name: 'Larkin Crian',
        password: 'testpassword',
        admin: true
    });

    //Save the sample user to our database
    user.save(function (err) {
        if (err)
            throw err;
        
        //if we completed the transaction without an error:
        console.log('User saved Successfully!');
        res.json({ success: true });
    });
});

//Just messing with Hailey
app.get('/messing', function (req, res) {
    res.send('Hailey Shoemanufacturer is a lil batch and all she do is listen ta trap music all day.');
});

//API Routes
var apiRoutes = express.Router();

apiRoutes.post('/signup', function (req, res) {
    
    var password = req.body.password;                       //The password the user submitted
    var email = req.body.email;                             //The email address the user used to sign up
    
    function register_user(hashed_password){
        
        console.log('In register user function: ' + hashed_password);
        
        //Create a user object with the properties passed in
        var user = new User({
            email: email,
            password: hashed_password
        });
            
        //Save the sample user to our database
        user.save(function (err) {
            if (err)
                throw err;
                
            else {
                //if we completed the transaction without an error:
                console.log('User saved Successfully!');
                res.json({ success: true });
            }
        });   
    };      //Instantiates a new user in the database with the user's email and hashed password

    //Need to check to ensure that the email address isn't already signed up
    User.findOne({
        email: email
    }, function (err, user) {
        if (err)
            throw err;

        else
            if (user) {
                //then the email address has already been registered, don't continue
                res.json({ success: false, message: 'Registration failed. Email address already registered.' })
            } else {
                //then the email address hasn't been registered, so we can proceed
                console.log('about to register the user');
                crypt.hash_password(password).then(register_user);    //Get the hashed password
            }
    }); 

});

//Route to authenticate a user
apiRoutes.post('/authenticate', function (req, res) {
    
    var password = req.body.password;
    var email = req.body.email;
    var user_object;

    function send_token(result){
        console.log('In authentication function, after checking, here is the result: ' + result);
        
        if (!result) {
            res.json({ success: false, message: 'Authentication failed. Wrong password' })
        } else {
            
            console.log('no errors!');
            
            //The user is found and the password, so we need to create a jsonwebtoken
            var token = jwt.sign(user_object, 'followyourfolly', {
                expiresInMinutes: 1440
            });
            
            console.log('about to send response~!: ' + token);
            
            res.json({
                success: true,
                token: token
            });
        }
    };
    function check_password(err, user){
         
        //Check to see if we threw an error
        if (err)
            throw err;
        
        //Check to see if our search matches anything
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' })
        } else if (user) {
            
            user_object = user;
                
            //Check to see if the password matches
            crypt.compare_to_hash(password, user.password).then(send_token);
           
        }
    }

    //Find the user
    User.findOne({
        email: email
    }, check_password);
});

//Define the middleware here that will protect the routes beneath this function. This will ensure that a token 
//is provided to access these functions
apiRoutes.use(function (req, res, next) {
    
    //Check the header or url parameters or post parameters for the token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    //if we have the token, then we need to decode it
    if (token) {
        
        //Verifies secret and checks
        jwt.verify(token, 'superSecret', function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate.' });
            } else {
                
                //If everything is alright, then we need to save to request for use in other routes
                req.decoded = decoded;  //Save the decoded token
                next();                 //Go to the next function that matches the route
            }
        });
    } else {
        
        //If there is no token, then we need to return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

//route to show a random message
apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the bellow api' });
});

//Route to return all the users (GET /api/users)
apiRoutes.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

//Appy the routes to our application with the prefix /api
app.use('/api', apiRoutes);

//Start the server
app.listen(port);
console.log('Magic happens at http://localhost:' + port);