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
var express = require("express");                                   //For our web API
var morgan = require("morgan");                                     //HTTP request logger
var bodyParser = require("body-parser");                            //To handle POST requests 
var jwt = require("jsonwebtoken");                                  //JSON web tokens, used for authentication
var mongoose = require("mongoose");                                 //Accessing our mongo database 
var passport = require('passport');                                 //Different methods of authentication
var flash = require('connect-flash');                               //Sending flash messages
var cookieParser = require('cookie-parser');                        //For using cookies
var session = require('express-session');                           //Storing session information
var bcrypt = require('bcrypt');                                     //Used for cryptograhic functions such as hasing passwords                      
var q = require('q');                                               //Used for promises and the like
var _ = require('lodash');                                          //Used for easy manipulation of collections

//Modules defined in this application
var environment = require('./environment.js');                      //The environment variables, such as connection strings
var crypt = require('./modules/crypt.js');                          //Our module for hashing passwords and comparing passwords

//Our data models and schemas
var UserModule = require('./schemas/user.js');                      //Our schemas for users
var SpecialModule = require('./schemas/special.js');                //Our schema for specials
var CommentModule = require('./schemas/comment.js');                //Our schema for comments on reviews
var ReviewModule = require('./schemas/review.js');                  //Our schema for reviews on establishments of events
var EventModule = require('./schemas/event.js');                    //Our schema for events that are held at places
var PlaceModule = require('./schemas/place.js');                    //Our schema for places, physical establishments               
var GroupModule = require('./schemas/group.js');                    //Our schema for groups, collections of users

//Obejcts and instantiantions of our models
var User = UserModule.User;                                         //The Mongo data model for a user
var UserSchema = UserModule.UserSchema;                             //The Mongo schema for a user

var Special = SpecialModule.Special;                                //The Mongo data model for a special
var SpecialSchema = SpecialModule.SpecialSchema;                    //The Mongo schema for a special

var Comment = CommentModule.Comment;                                //The Mongo data model for a comment.
var CommentSchema = CommentModule.CommentSchema;                    //The Mongo schema for a comment.

var Review = ReviewModule.Review;                                   //The Mongo data model for a review
var ReviewSchema = ReviewModule.ReviewSchema;                       //The Mongo schema for a review

var Event = EventModule.Event;                                      //The Mongo data model for an event
var EventSchema = EventModule.EventSchema;                          //The Mongo schema for a review

var Place = PlaceModule.Place;                                      //The Mongo data model for a place
var PlaceSchema = PlaceModule.PlaceSchema;                          //The Mongo schema for a place

var Group = GroupModule.Group;                                      //The Mongo data model for a group.
var GroupSchema = GroupModule.GroupSchema;                          //The Mongo schema for a group.

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

//Route to create a new user.
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
                res.json({
                    success: true,
                    message: null
                });
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
                res.json({
                    success: false,
                    message: 'Registration failed. Email address already registered.'
                });
            } else {
                //then the email address hasn't been registered, so we can proceed
                console.log('about to register the user');
                crypt.hash_password(password).then(register_user);    //Get the hashed password
            }
    }); 

});

//Route to authenticate a user.
apiRoutes.post('/authenticate', function (req, res) {
    
    var password = req.body.password;
    var email = req.body.email;
    var user_object;

    function send_token(result){
        console.log('In authentication function, after checking, here is the result: ' + result);
        
        if (!result) {

            res.json({
                success: false,
                token: null,
                message: 'Authentication failed. Wrong password'
            })
        } else {
          
            //The user is found and the password, so we need to create a jsonwebtoken
            var token = jwt.sign(user_object, 'followyourfolly', {
                expiresInMinutes: 1440
            });
            
            console.log('about to send response~!: ' + token);
            
            res.json({
                success: true,
                token: token,
                message: null
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

//---- Every function defined after this function will require a token, otherwise the call will fail. --------------
//Define the middleware here that will protect the routes beneath this function. This will ensure that a token 
//is provided to access these functions
apiRoutes.use(function (req, res, next) {
    
    //Check the header or url parameters or post parameters for the token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    //if we have the token, then we need to decode it
    if (token) {
        
        //Verifies secret and checks
        jwt.verify(token, 'followyourfolly', function (err, decoded) {
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

//Region: Users

//Route to return all the users (GET /api/users
apiRoutes.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

//Route to return a single user based on the email address of the user
apiRoutes.get('/user', function (req, res) {
    
    var email = req.query.email;

    if (!email) {
        res.json({ success: false, message: 'No email address provided' });
    }

    User.findOne({
        email: email
    }, function(err, user){
        res.json(user)
    });
});

//Route to edit a profile, the profile information will be passed in the body of the POST, including which profile
//is going to be edited. In this method, we will pass certain keys that can be used to update the user's profile.
//The only required parameter is the one to identify the user, which is the email address
apiRoutes.post('/user/edit', function (req, res) {
    //Since we don't require that the application submits all of the properties of a user's profile, only the ones
    //that were altered, we will have to loop through each element in the request body, find the key name, and see
    //if it matches a parameter in the user schema (to be safe) and then update that property with the passed in value.
    var email = req.body.email;
    console.log('Email address of: ' + email);

    function gotUser(err, user){
        console.log('User is: ' + user);

        if (err)
            throw err;

        if (!user) {
            res.json({ success: false, message: 'Email address not found.' });
        } else {
            console.log(UserSchema);

            _.forEach(req.body, function (n, key) {
                if (UserSchema.path(key)) {
                    //Then we can save the request body parameter to the user's profile
                    user.set(key, n);
                    //user.path[key] = n;
                    console.log('We have this property: ' + key);
                }
                else
                    console.log('We dont have this property: ' + key);
            });

            //After updating the user's document with the changes, we need to save the changes
            user.save(function (err, user) { 
                res.json({ success: true });
            });
        }
    }

    //Check to see if we have the user in the database
    User.findOne({
        email: email 
    }, gotUser);
});

//Region: places

//Route to get all of the places. Not practical for production, but if the user passes in a point and a radius,
//then the function will return all the places within that area. The user can also pass in a type of place to
//search for.
apiRoutes.get('/places', function (req, res) {
    
    //See if the user passed in any geolocation parameters in the query string
    var latitude = req.query.lat;
    var longitude = req.query.lon;
    var maxDistance = req.query.distance;
    var type = req.query.type;
    
    if (latitude && longitude && maxDistance) {
        
        console.log("Distance: " + maxDistance);
        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);

        Place.find({
            geoLocation:
            {
                $near: [latitude, longitude],
                $maxDistance: maxDistance
            }
        }, function (err, places) {
            if (err) {
                throw err;
            } else {
                res.json(places);
            }
        });
    } else {
        //Return all of the places in the collection
        Place.find({}, function (err, places) {
            res.json(places);
        });
    }
});

//Route to add a new place to the places table. We will need to provide a few pieces of information that are
//required, but apart from those elements, the rest are optional.
//Required:
//Name, geoLocation, types
//Note: types should be a comma delimited list of strings
apiRoutes.post('/places/add', function (req, res) {

    var name = req.body.name;
    var lat = req.body.lat;
    var lon = req.body.lon;
    var types = req.body.types.split(',');     //This should be comma delimited list of strings

    //When we save a new place, we need to come up with a way to give a unique identifier. 
    //OR: and I like this better, is that we just use Mongo's built in identifier.
    if (name && lat && lon && (types.size > 0)) {
        var place = new Place({
            name: name,
            geoLocation: [lat, lon],
            type: types
        });
    } else {
        var message = 'Missing: ';

        if (!name)
            message += 'name, ';
        if (!lat)
            message += 'lat, ';
        if (!lon)
            message += 'lon, ';
        if (types.size == 0)
            message += 'types, ';

        res.json({ success: false, message: message });
    }

    //Now we need to loop through each of the properties that are passed in and save them to the object
    _.forEach(req.body, function (n, key) {
        if (PlaceSchema.path(key)) {
            //Then we can save the request body parameter to the user's profile
            place.set(key, n);
            //user.path[key] = n;
            console.log('We have this property: ' + key);
        }
        else
            console.log('We dont have this property: ' + key);
    });

    place.save(function (err) {
        if (err)
            throw err;

        res.json({ success: true });
    });
});

//Route to edit an existing place. Just like the user's edit route, this will accept any number of parameters,
//compare them to the place schema, and will save any valid properties against the place in the database.
apiRoutes.post('/places/edit', function (req, res) {
    //To edit a place, we must pass in the place ID. This is the unique identifier that our system uses to 
    //identify different places

    var placeId = req.body.placeId;

    //After we get our place from the database, we call this function
    function gotPlace(err, place) {
        if (err)
            throw err;

        if (!place) {
            res.json({ success: false, message: 'Place Id not found.' });
        } else {
            console.log(PlaceSchema);

            _.forEach(req.body, function (n, key) {
                if (PlaceSchema.path(key)) {
                    //Then we can save the request body parameter to the user's profile
                    place.set(key, n);
                    //user.path[key] = n;
                    console.log('We have this property: ' + key);
                }
                else
                    console.log('We dont have this property: ' + key);
            });

            //After updating the user's document with the changes, we need to save the changes
            place.save(function (err, user) {
                res.json({ success: true });
            });
        }
    };

    Place.findOne({
        placeId: placeId
    }, gotPlace);
});

//Region: Groups

//Route to get all the groups. A few limited use cases in production, but most of the time we will have the user
//pass in some selection criteria, such as type, or geoLocation so that we can narrow down the search.
apiRoutes.get('/groups', function (req, res) {
    
    //See if the user passed in any geolocation parameters in the query string
    var latitude = req.query.lat;
    var longitude = req.query.lon;
    var maxDistance = req.query.distance;

    if (latitude && longitude && maxDistance) {

        console.log("Distance: " + maxDistance);
        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);

        //Find any place that has a group office near the user
        Place.find({
            group_offices: {
                location: {
                    $near: [latitude, longitude],
                    $maxDistance: maxDistance
                }
            }
        }, function (err, places) {
            if (err) {
                throw err;
            } else {
                res.json(places);
            }
        });
    } else {
        //return all of the groups in the collection
        Group.find({}, function (err, groups) {
            res.json(groups);
        });
    }
})

//Route to create a new group
apiRoutes.post('/groups/add', function (req, res) {

    var name = req.body.name;
    var types = req.body.types.split(',');     //This should be comma delimited list of strings

    //When we save a new place, we need to come up with a way to give a unique identifier. 
    //OR: and I like this better, is that we just use Mongo's built in identifier.
    if (name && lat && lon && (types.size > 0)) {
        var place = new Place({
            name: name,
            geoLocation: [lat, lon],
            type: types
        });
    } else {
        var message = 'Missing: ';

        if (!name)
            message += 'name, ';
        if (types.size == 0)
            message += 'types, ';

        res.json({ success: false, message: message });
    }

    //Now we need to loop through each of the properties that are passed in and save them to the object
    _.forEach(req.body, function (n, key) {
        if (PlaceSchema.path(key)) {
            //Then we can save the request body parameter to the user's profile
            place.set(key, n);
            //user.path[key] = n;
            console.log('We have this property: ' + key);
        }
        else
            console.log('We dont have this property: ' + key);
    });

    place.save(function (err) {
        if (err)
            throw err;

        res.json({ success: true });
    });
});

//Route to edit a group
apiRoutes.post('/groups/edit', function (req, res) {

    //To edit a place, we must pass in the place ID. This is the unique identifier that our system uses to 
    //identify different places

    var groupId = req.body.groupId;

    //After we get our place from the database, we call this function
    function gotGroup(err, group) {
        if (err)
            throw err;

        if (!group) {
            res.json({ success: false, message: 'Group Id not found.' });
        } else {
            console.log(GroupSchema);

            _.forEach(req.body, function (n, key) {
                if (GroupSchema.path(key)) {
                    //Then we can save the request body parameter to the user's profile
                    group.set(key, n);
                    //user.path[key] = n;
                    console.log('We have this property: ' + key);
                }
                else
                    console.log('We dont have this property: ' + key);
            });

            //After updating the user's document with the changes, we need to save the changes
            group.save(function (err, user) {
                res.json({ success: true });
            });
        }
    };

    Group.findOne({
        groupId: groupId
    }, gotGroup);
});

//Appy the routes to our application with the prefix /api
app.use('/api', apiRoutes);

//Start the server
app.listen(port);
console.log('Magic happens at http://localhost:' + port);