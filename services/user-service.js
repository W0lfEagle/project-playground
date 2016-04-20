/**
 * Name: Wilford Engel
 * SRN: 130190747
 * Date: 19th April 2016
 * Description: Service to add user data to the students database
 */

var bcrypt = require('bcrypt');
var User = require('../models/user').User;

exports.addUser = function(user, next) {
  bcrypt.hash(user.password, 10, function(err, hash) {
      if (err) {
        return next(err);
      }
      var newUser = new User({
        firstName: user.firstName,
        email: user.email.toLowerCase(),
        password: hash,
        timezone: user.timezone,
        skype: user.skype
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

exports.updateUser = function(email, req) {
  User.find({email:email.toLowerCase()}, function(err, user) {
    if (err) {
      console.log(err);
    }
    console.log('before update' + user);
    
  //   console.log(req.firstName);
  //   user.firstName = req.firstName;
  //   user.save(function(err) {
  //     if (err) {
        
  //     }
  //   });
  //   console.log('after update' + user);
    
  });
  bcrypt.hash(req.password, 10, function(err, hash) {
      if (err) {
        //do something
      }
      User.update({email:email.toLowerCase()}, { $set: { 
                        firstName: req.firstName,
                        email: req.email,
                        password: hash,  //make hash
                        timezone: req.timezone,
                        skype: req.skype }}, function(err) {
        console.log(err);
      });
  });
  User.find({email:email.toLowerCase()}, function(err, user) {
    if (err) {
      console.log(err);
    }
    console.log('after update' + user);
  });
};


// exports.findEmail = function(email) {
//  var found = 'hello';
//   User.findOne({email:email.toLowerCase()}, function(err, result) {
//       if (err) { /* handle err */ }
  
//       if (result) {
//           console.log('email found');
//           found = 'email found';
//       } else {
//           console.log('email NOT found');
//           found = 'email not found';
//       }
//   });
//   console.log('the value of found is: ' + found);
// };