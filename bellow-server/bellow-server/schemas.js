var mongoose = require("mongoose");                         //Accessing our mongo database 

//Let's get some schemas defined
var ObjectId = mongoose.Schema.Types.ObjectId; //Needed so we can use type ObjectId in our schema declarations
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name: String, 
    password: String, 
    admin: Boolean
}));

/*
//The definition of a comment. Comments can be left on reviews or other comments
var commentSchema = mongoose.Schema({
    author: String,						//The name of the commentator
    author_id: ObjectId,				//The id of the commentator
    
    comment_title: String,				//The title of the comment
    comment_body: String,				//The body of the comment
    comment_date: Date,					//The time that the comment was posted
    comment_parent: ObjectId,			//The id of the parent, could be a review or another comment
    comment_parent_type: String,		//The type of the parent, either a person, establishment, or another comment
    
    positive: Number,					//The amount of positive feedback
    negative: Number,					//The amount of negative feedback
    
    attachments: [{
            attachment_id: ObjectId			//An array of associated media Ids, such as pictures, videos etc
        }],
    					
});

//The definition of a review. Reviews are left against establishments or against events
var reviewSchema = mongoose.Schema({
    author: String,						//The name of the reviewer
    author_id: ObjectId,				//The reference of the reviewer
    
    review_parent: ObjectId,			//The establishment id that was reviewed
    review_title: String,				//The title of the review
    review_body: String,				//The body of the review
    reviewed_date: Date,				//When the person visited the establishment
    review_date: Date,					//When the review was posted
    
    positive: Number,					//The number of positive feedback on the review
    negative: Number,					//The number of negative feedback on the review
    comments: [{
            comment: commentSchema			//Comments on the review
        }],					
    attachments: [{
            attachment_id: ObjectId			//An array of associated media Ids, such as pictures, videos etc
        }],					
});


//The definition of specials. Specials can be associated with an event or an establishment
var specialsSchema = mongoose.Schema({
    special_name: String,				//The name of the special
    special_display_name: String,		//What the user will see
    
    special_status: String,				//Ongoing, canceled, etc
    special_description: String,		//A longer detailed message about the special
    special_product_targets: [{
            produce_name: String			//A list of strings detailing what products are being targeted
        }],		
    special_price: Number,				//The cost of the products being offered
    special_currency: String,			//Which currency is being used for the transaction
});

//The definition of events. Events are associated with an establishment
var eventsSchema = mongoose.Schema({
    event_name: String,					//The name of the event
    event_display_name: String,			//What name will be displayed to the user
    
    event_status: String,				//If the event is still happening, delayed, canceled
    event_reoccur_frequency: String,	//Once, daily, weekly, monthly, bi-monthly, etc
    event_days_occur: [{
            string_day: String				//An array of days that the event will occur on, M, T, W, etc.
        }],
    
    event_time: {
        start: Date,					//When the event will begin
        end: Date						//When the event will end
    },			
    
    event_cover: {
        price: Number,					//The amount it costs to enter
        currency: String				//The type of currency that is used for cover
    },
    
    event_type: String,					//Dance, happy hour, karakoe
    event_reviews: [{
            review: reviewSchema			//An array of reviews of the event
        }],				
    
    event_specials: [{
            special: specialsSchema			//An array of specials that occur during the event
        }],				
    
    profile_picture: String,			//The Base 64 encoded string represents an image
    media: [{
            media_id: ObjectId
        }],						//The array containing media IDs associated with event
});

//The definition of an establishment. Establishments are collections of data representing real world locations 
//or events
var establishmentSchema = mongoose.Schema({
    types: [{
            establishment_tpye: String		//Bar, restaurant, cafe, supermarket, etc...
        }],						
    name: String,						//Full name of the establishment
    display_name: String,				//The name that will be displayed to the user at first glance
    owners: [{
            owner_name: String				//The names of the owners of the establishment
        }],						
    opened_date: Date,					//When the establishment first opened
    current_statuses: [{
            status: String					//Closed temporarily, under construction, permanently closed, etc
        }],			
    website: String,					//The establishment's website
    APIids: [{
            APIname: String,				//The name of the API that holds information, such as google places, etc
            APIplaceid: String,				//The ID of the establishment that the API gave it.
        }],
    geoLocation: {
        location: [Number], 			//Longitude then latitude
        index: '2dsphere'				//Create a geospatial index
    },
    establishment_address: {
        country: String,				//Which country the establishment is located
        state: String,					//State in which the establishment is located
        city: String,					//City in which the establishment is located
        street: String,					//The street where the location is located
        address: Number					//Where along the street the location is located				
    },
    
    events: [{
            event: eventsSchema				//A list of events that the establishment throws 
        }],						
    
    profile_picture: String,			//The Base 64 string representing an image
    media: [{
            mediaId: ObjectId				//This is a list of media IDs
        }],						
    
    reviews: [{
            review: reviewSchema			//An array of reviews, which should be an object 
        }],						
	
});

//This is the model for all of our establishments in an array
var establishmentsSchema = mongoose.Schema({
    establishments: [{
            establishment: establishmentSchema
        }]
});

//The definition of a group. A group is a collection of users and contains administrators and has a billing plan.
var groupSchema = mongoose.Schema({
    group_name: String,					//The name of the group
    group_display_name: String,			//What will be displayed to the user
    
    group_create_date: Date,			//When the group was formed
    group_type: [{
            type_name: String				//If it's an NGO, a school, a university, a business, etc.
        }],
    group_administrators: [{
            user_name: String,				//Name of the administrator
            user_id: ObjectId				//Id of the administrator account
        }],
    group_billing_plan: String,			//Denotes the billing plan of the group
	
	
});

//The definition of a user. Users can write reviews and comments and belong to groups
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

//A collection of our users
var usersSchema = mongoose.Schema({
    users: [{
            user: userSchema						//The users in the user collection
        }]
});

//Define our models
var users = mongoose.model('users', userSchema);
var establishments = mongoose.model('establishments', establishmentSchema);
var groups = mongooese.model('groups', groupSchema);
var comments = mongoose.model('comments', commentSchema);
var reviews = mongoose.model('reviews', reviewSchema);
var events = mongoose.model('events', eventsSchema);
var specials = mongoose.model('specials', specialsSchema);

//Define our exports
modules.exports.userSchema = users;
modules.exports.establishmentSchema = establishments;
modules.exports.groupSchema = groups;
modules.exports.commentSchema = comments;
modules.exports.reviewSchema = reviews;
modules.exports.eventsSchema = events;
modules.exports.specialsSchema = specials;
 * 
 * */