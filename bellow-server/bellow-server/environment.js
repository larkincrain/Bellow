/*
 * Author: Larkin
 * Date: August 27th, 2015
 * Description: This file is responsible for maintaining any environment variables
 * that we have, such as connection strings, data urls, etc.
 *  
 * */

var mongo_connection_string = 'mongodb://webclient:Peregrine19!@ds033133.mongolab.com:33133/bellow';    //Connecting to our mongo database 
var port = 3001;                                                                                        //The port our application will use

modules.exports.mongo_connection_string = mongo_connection_string;
modules.exports.port = port;