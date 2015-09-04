/*
 * Author: Larkin
 * Date: September 4th, 2015
 * Description: This file defines the data module for reviews in our application.
 * Reviews are opinions and media created by users on the site and are saved against
 * either locations or events. 
 *  
 * */

var mongoose = require("mongoose");                         //Accessing our mongo database 

//Let's get some schemas defined
var ObjectId = mongoose.Schema.Types.ObjectId; //Needed so we can use type ObjectId in our schema declarations
var Schema = mongoose.Schema;

//Define some models that this model is dependent upon
var comment = require('./comment.js');
var commentSchema = comment.CommentSchema;

var reviewSchema = new Schema({
    author: String,						            //The name of the reviewer
    author_id: ObjectId,				            //The reference of the reviewer
    
    review_parent: ObjectId,			            //The establishment id that was reviewed
    review_title: String,				            //The title of the review
    review_body: String,				            //The body of the review
    reviewed_date: Date,				            //When the person visited the establishment
    review_date: Date,					            //When the review was posted
    
    positive: Number,					            //The number of positive feedback on the review
    negative: Number,					            //The number of negative feedback on the review
    comments: [{
            comment_name: [commentSchema]			//Comments on the review
        }],					
    attachments: [{
            attachment_id: ObjectId			        //An array of associated media Ids, such as pictures, videos etc
        }],
});

module.exports.Review = mongoose.model('Review', reviewSchema);
module.exports.ReviewSchema = reviewSchema;
