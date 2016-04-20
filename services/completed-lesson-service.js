/**
 * Name: Wilford Engel
 * SRN: 130190747
 * Date: 19th April 2016
 * Description: Service to add data from a lesson to the completed lesson 
 * database
 */

// var bcrypt = require('bcrypt');
var Lesson = require('../models/completedLesson').CompletedLesson;

exports.addLesson = function(lesson, next) {
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
