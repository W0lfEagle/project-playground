var bcrypt = require('bcrypt');
var User = require('../models/user').User;

exports.addUser = function(user, next) {
  bcrypt.hash(user.password, 10, function(err, hash) {
      if (err) {
        return next(err);
      }
      var newUser = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        credits: user.credits,
        email: user.email.toLowerCase(),
        password: hash
    });
    
    newUser.save(function(err) {
        if (err) {
            return next(err);
        }
        next(null);
    });
  });
};

exports.findUser = function(email, next) {
  User.findOne({email:email.toLowerCase()}, function(err, user) {
    next(err, user);
  });
};

// var found = false;

// exports.findEmail = function(email) {
//   User.findOne({email:email.toLowerCase()}, function(err, result) {
//       if (err) { /* handle err */ }
  
//       if (result) {
//           console.log('email found');
//           return true;
//       } else {
//           console.log('email NOT found');
//           return false;
//       }
//   });
//   if (true) return true;
//   else return false;
// };