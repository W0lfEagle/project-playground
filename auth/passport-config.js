/**
 * Name: Wilford Engel
 * SRN: 130190747
 * Date: 19th April 2016
 * Description: Passport user authentication configuration file
 * uses bcrypt to encrypt the user password 
 * finds the user in the user database and compares the password for a match
 */

module.exports = function() {
    var passport = require("passport");
    var passportLocal = require('passport-local');
    var bcrypt = require('bcrypt');
    var userService = require('../services/user-service');
    
    passport.use(new passportLocal.Strategy({usernameField: 'email'},function(email, password, next) {
        userService.findUser(email, function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(null, null);
            }
            bcrypt.compare(password, user.password, function(err, same) {
                if (err) {
                    return next(err);
                }
                if (!same) {
                    return (null, null);
                }
                next(null, user);
            });
        });
    }));

    passport.serializeUser(function(user, next) {
        next(null, user.email);
    });
    
    passport.deserializeUser(function(email, next) {
        userService.findUser(email, function(err, user) {
            next(err, user);
        });
    });
};