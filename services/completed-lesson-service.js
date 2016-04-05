// var bcrypt = require('bcrypt');
var Lesson = require('../models/completedLesson').CompletedLesson;

exports.addLesson = function(lesson, next) {
//   bcrypt.hash(user.password, 10, function(err, hash) {
//       if (err) {
//         return next(err);
//       }
      console.log("calling the insert data function");
      console.log(lesson);
  var newLesson = new Lesson({
    lessonId: lesson.lessonId,
    studentId: lesson.studentId,
    studentVocab: lesson.studentVocab,
    lessonVocab: lesson.lessonVocab,
    chat: lesson.chat,
    conversationQuestions: lesson.conversationQuestions,
    articleIds: lesson.articleIds
 
      
//     // firstName: user.firstName,
//     // email: user.email.toLowerCase(),
//     // password: hash,
//     // timezone: user.timezone,
//     // skype: user.skype
    });
    
    newLesson.save(function(err) {
        if (err) {
            return next(err);
        }
        next(null);
    });
};

exports.findLesson = function(lessonId, next) {
  Lesson.findOne({lessonId:lessonId}, function(err, lesson) {
    next(err, lesson);
  });
};

// exports.updateUser = function(email, req) {
//   User.find({email:email.toLowerCase()}, function(err, user) {
//     if (err) {
//       console.log(err);
//     }
//     console.log('before update' + user);
    
//   //   console.log(req.firstName);
//   //   user.firstName = req.firstName;
//   //   user.save(function(err) {
//   //     if (err) {
        
//   //     }
//   //   });
//   //   console.log('after update' + user);
    
//   });
//   bcrypt.hash(req.password, 10, function(err, hash) {
//       if (err) {
//         //do something
//       }
//       User.update({email:email.toLowerCase()}, { $set: { 
//                         firstName: req.firstName,
//                         email: req.email,
//                         password: hash,  //make hash
//                         timezone: req.timezone,
//                         skype: req.skype }}, function(err) {
//         console.log(err);
//       });
//   });
//   User.find({email:email.toLowerCase()}, function(err, user) {
//     if (err) {
//       console.log(err);
//     }
//     console.log('after update' + user);
//   });
// };


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