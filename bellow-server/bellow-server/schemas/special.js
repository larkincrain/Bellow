/*
 * Author: Larkin
 * Date: September 4th, 2015
 * Description: This file defines the data module for specials in our application.
 * Specials are promotions that establishments can hold, and include a description
 * of the item (or a name of a collection of items) and the price that they are on
 * sale for. 
 *  
 * */

var mongoose = require("mongoose");                         //Accessing our mongo database 

//Let's get some schemas defined
var ObjectId = mongoose.Schema.Types.ObjectId; //Needed so we can use type ObjectId in our schema declarations
var Schema = mongoose.Schema;

var specialSchema = new Schema({
    special_name: String,				//The name of the special
    special_display_name: String,		//What the user will see
    
    special_status: String,				//Ongoing, canceled, etc
    special_description: String,		//A longer detailed message about the special
    special_product_targets: [{
            product_name: String			//A list of strings detailing what products are being targeted
        }],		
    special_price: Number,				//The cost of the products being offered
    special_currency: String,			//Which currency is being used for the transaction
});

module.exports.Special = mongoose.model('Special', specialSchema);
module.exports.SpecialSchema = specialSchema;
