/*
 * Author: Larkin
 * Date: September 4th, 2015
 * Description: This file defines the data module for comments in our application.
 * Comments are opinions and media created by users that can be associated against
 * reviews.
 *  
 * */

var mongoose = require("mongoose");                         //Accessing our mongo database 

//Let's get some schemas defined
var ObjectId = mongoose.Schema.Types.ObjectId; //Needed so we can use type ObjectId in our schema declarations
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    author: String,						                    //The name of the commentator
    author_id: ObjectId,				                    //The id of the commentator
    
    comment_title: String,				                    //The title of the comment
    comment_body: String,				                    //The body of the comment
    comment_date: Date,					                    //The time that the comment was posted
    comment_parent: ObjectId,			                    //The id of the parent, could be a review or another comment
    comment_parent_type: String,		                    //The type of the parent, either a person, establishment, or another comment
    
    positive: Number,					                    //The amount of positive feedback
    negative: Number,					                    //The amount of negative feedback
    
    attachments: [{
            attachment_id: ObjectId			                //An array of associated media Ids, such as pictures, videos etc
        }],
});

module.exports.Comment = mongoose.model('Comment', commentSchema);
module.exports.CommentSchema = commentSchema;
