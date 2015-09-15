/*
 * Author: Larkin
 * Date: August 27th, 2015
 * Description: This file is responsible for maintaining any environment variables
 * that we have, such as connection strings, data urls, etc.
 *  
 * */

var mongo_connection_string = 'mongodb://webclient:Peregrine19!@ds033133.mongolab.com:33133/bellow';    //Connecting to our mongo database 
var port = 8080;                                                                                        //The port our application will use
var secret = 'followyourfolly';                                                                         //The secret string used to verify web tokens
var token_life = 1440;                                                                                  //How long a json web token will last

module.exports.mongo_connection_string = mongo_connection_string;
module.exports.port = port;
module.exports.secret = secret;
module.exports.token_life = token_life;