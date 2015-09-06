/*
 * Author: Larkin
 * Date: September 5th, 2015
 * Description: This file defines the data module for groups in our application.
 *  Groups are collections of users. These may be friend groups, organizations, 
 * NGOs, corporations, non profits, what-have you. Groups of related people who
 * want to trust each other with recommendations.

 * */

var mongoose = require("mongoose");                         //Accessing our mongo database 

//Let's get some schemas defined
var ObjectId = mongoose.Schema.Types.ObjectId; //Needed so we can use type ObjectId in our schema declarations
var Schema = mongoose.Schema;

//The definition of a group. A group is a collection of users and contains administrators and has a billing plan.
var groupSchema = new Schema({
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
    group_headquarters: {
        type: [],
        index: '2dsphere'
    },                                  //Where the group resides
    group_offices: [{                   //We could add a few more properties, such as address and so on
        location: {
            type: [],
            index: '2dsphere'
        },
        name: String,                   //The name of the office
    }]
});

module.exports.Group = mongoose.model('Group', groupSchema);
module.exports.GroupSchema = groupSchema;



