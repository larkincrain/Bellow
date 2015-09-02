var mongoose = require("mongoose");                         //Accessing our mongo database 

//Let's get some schemas defined
var ObjectId = mongoose.Schema.Types.ObjectId; //Needed so we can use type ObjectId in our schema declarations
var Schema = mongoose.Schema;
/*
// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name: String, 
    password: String, 
    admin: Boolean
}));
*/
module.exports = mongoose.model('User', new Schema({
    name: {
        first: String,							//First name of the user
        middle: String,							//Middle name of the user
        last: String,							//Last name of the user
        },
    user_id: String,							//The unique identifier of the user
    date_of_birth: Date,						//When the user was born
    gender: String,								//Male or female
    email: String,								//The email address associated with the user
    groups: [{
        group_name: String,						//Group name that the user belongs to
        group_id: ObjectId						//Group Id that the user belongs to
    }],
    friends: [{
        confirmed: [{
            friend_name: String,				//Name of the friend
            friend_id: ObjectId					//User Id of the friend
        }],
        pending_requests: [{
            request: {
                user_name: String,				//Name of the other user
                user_id: ObjectId,				//Id of the other user
                date: Date,						//Date that the request was created
                request_type: String,			//If the user sent or received this request
            }
        }]
    }]
}));

/*
var userSchema = mongoose.Schema({
    name: {
        first: String,							//First name of the user
        middle: String,							//Middle name of the user
        last: String,							//Last name of the user
    },
    user_id: String,							//The unique identifier of the user
    date_of_birth: Date,						//When the user was born
    gender: String,								//Male or female
    email: String,								//The email address associated with the user
    groups: [{
        group_name: String,						//Group name that the user belongs to
        group_id: ObjectId						//Group Id that the user belongs to
    }],
    friends: [{
        confirmed: [{
            friend_name: String,				//Name of the friend
            friend_id: ObjectId					//User Id of the friend
        }],
        pending_requests: [{
            request: {
                user_name: String,				//Name of the other user
                user_id: ObjectId,				//Id of the other user
                date: Date,						//Date that the request was created
                request_type: String,			//If the user sent or received this request
            }
        }]
    }]
});
*/