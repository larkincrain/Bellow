/*
 * Author: Larkin
 * Date: September 2nd, 2015
 * Description: This module will contain the crytogrpahic functions that our application will use. Such as 
 * password hasing and comparing. This module essentially wraps the bcryptJS library.
 *  
 * */

var bcrypt = require('bcrypt');                      //Used for cryptograhic functions such as hasing passwords
var q = require('q');                                       //Used for promises

//This function will take a user's password and will hash it, returning the hashed value to be saved into
//the database.
module.exports.hash_password = function (password) {
    
    var salt;                                               //Information to append onto our password when hashing
    var rounds = 100;                                       //The number of rounds to compute the salt
    var deferred = q.defer();                               //Create a deferred object
    
    function generateHash(err, salt){
        
        if (err) {
            console.log('error after salt generation: ' + err);
        }
        else{

            console.log('Salt is: ' + salt);

            bcrypt.hash(password, salt, null, finished_hashing); 
        }
    };                  //This function will generate the has from the password and the salt

    function finished_hashing (err, hashed) {
        
        console.log('hashing now');
        
        //Check if there was an error and if there was, return it
        if (err) {
            console.log('err in hash generation: ' + err);
            deferred.reject(err);
        } else {
            console.log('resolve that promise');
            deferred.resolve(hashed);
        }
    };

    //create the salt
    bcrypt.genSalt(rounds, generateHash);

    return deferred.promise;                //Return a promise that will be fulfilled once the operation completes
};

//This function will take a user's password that was passed into the authentication form and will compare
//it against the hashed function that is stored against them in the database
module.exports.compare_to_hash = function (password, hash){
    var deferred = q.defer();                               //Object that will be returned and will be resolved or rejected
    
    bcrypt.compare(password, hash, function (err, res) {
        if (err)
            deferred.reject(err);

        else {
            console.log('Authentication result: ' + res);
            deferred.resolve(res);
        }
    });

    return deferred.promise;                                //Return the promise object
}
