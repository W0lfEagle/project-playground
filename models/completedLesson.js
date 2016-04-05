var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var userService = require('../services/user-service');
var completedLessonService = require('../services/completed-lesson-service');

var completedLessonSchema = new Schema({
    lessonId: { type: Number }, // for searching, displaying etc
    studentId: { type: Number }, // associate with student
    studentVocab: { type : Array , "default" : [] },// "word": "String(word)", "sentence": sentence locator/sentence
    lessonVocab: { type : Array , "default" : [] }, // "word": "String(word)", "sentence": sentence locator/sentence
    chat: { type : Array , "default" : [] }, // "tutor0": "String(Line of chat)", "student0": "Line of chat", "tutor1": "Line of chat", "student1": "Line of chat" 
    conversationQuestions: { type : Array , "default" : [] },
    articleIds: { type : Array , "default" : [] },
    created: {type: Date, default: Date.now}
});



completedLessonSchema.path('lessonId').validate(function(value, next) {
    completedLessonService.findLesson(value, function(err, lesson) {
        if (err) {
            console.log(err);
            return next(false);
        }
        next(!lesson);
    });
}, 'That Lesson already exists.'); // Lesson Found??


var CompletedLesson = mongoose.model('CompletedLesson', completedLessonSchema);

module.exports = {
    CompletedLesson: CompletedLesson
};
