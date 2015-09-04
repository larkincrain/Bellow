/*
 * Author: Larkin
 * Date: September 4th, 2015
 * Description: This file defines the data module for events in our application.
 * Events are any sort of activity that is held at an establishment.
 *  
 * */

var mongoose = require("mongoose");                         //Accessing our mongo database 

//Let's get some schemas defined
var ObjectId = mongoose.Schema.Types.ObjectId; //Needed so we can use type ObjectId in our schema declarations
var Schema = mongoose.Schema;

//Define some models that the event schema is dependent upon 
var review = require('./review.js');
var reviewSchema = review.ReviewSchema;

var special = require('./special.js');
var specialSchema = special.SpecialSchema;

var eventSchema = new Schema({
    event_name: String,					            //The name of the event
    event_display_name: String,			            //What name will be displayed to the user
    
    event_status: String,				            //If the event is still happening, delayed, canceled
    event_reoccur_frequency: String,	            //Once, daily, weekly, monthly, bi-monthly, etc
    event_days_occur: [{
            string_day: String				        //An array of days that the event will occur on, M, T, W, etc.
        }],
    
    event_time: {
        start: Date,					            //When the event will begin
        end: Date						            //When the event will end
    },			
    
    event_cover: {
        price: Number,					            //The amount it costs to enter
        currency: String				            //The type of currency that is used for cover
    },
    
    event_type: String,					            //Dance, happy hour, karakoe
    event_reviews: [{
            review: [reviewSchema]			        //An array of reviews of the event
        }],				
    
    event_specials: [{
            special: [specialSchema]			    //An array of specials that occur during the event
        }],				
    
    profile_picture: String,			            //The Base 64 encoded string represents an image
    media: [{
            media_id: ObjectId
        }],						                    //The array containing media IDs associated with event
});

module.exports.Event = mongoose.model('Event', eventSchema);
module.exports.EventSchema = eventSchema;
