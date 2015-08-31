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
