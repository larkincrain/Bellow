/*
 * Author: Larkin
 * Date: September 4th, 2015
 * Description: This file defines the data module for places in our application.
 * Places are any physical places that are open to the public. 
 *  
 * */

var mongoose = require("mongoose");                         //Accessing our mongo database 

//Let's get some schemas defined
var ObjectId = mongoose.Schema.Types.ObjectId; //Needed so we can use type ObjectId in our schema declarations
var Schema = mongoose.Schema;

//Define some models that this model is dependent upon
var event = require('./event.js');
var eventSchema = event.EventSchema;

var review = require('./review.js');
var reviewSchema = review.ReviewSchema

var placeSchema = new Schema({
    types: [{
            place_tpye: String		                        //Bar, restaurant, cafe, supermarket, etc...
        }],						
    name: String,						                    //Full name of the place
    display_name: String,				                    //The name that will be displayed to the user at first glance
    owners: [{
            owner_name: String				                //The names of the owners of the place
        }],						
    opened_date: Date,					                    //When the place first opened
    current_statuses: [{
            status: String					                //Closed temporarily, under construction, permanently closed, etc
        }],			
    website: String,					                    //The place's website
    APIids: [{
            APIname: String,				                //The name of the API that holds information, such as google places, etc
            APIplaceid: String,				                //The ID of the place that the API gave it.
        }],
    geoLocation: {
        type: [], 			                                //Longitude then latitude
        index: ['2dsphere'],				                    //Create a geospatial index
    },
    place_address: {
        country: String,				                    //Which country the place is located
        state: String,					                    //State in which the place is located
        city: String,					                    //City in which the place is located
        street: String,					                    //The street where the location is located
        address: Number					                    //Where along the street the location is located				
    },
    
    events: [{
            event: [eventSchema]				            //A list of events that the place throws 
        }],						
    
    profile_picture: String,			                    //The Base 64 string representing an image
    media: [{
            mediaId: ObjectId				                //This is a list of media IDs
        }],						
    
    reviews: [{
            review: [reviewSchema]			                //An array of reviews, which should be an object 
        }],
});

module.exports.Place = mongoose.model('Place', placeSchema);
module.exports.PlaceSchema = placeSchema;
