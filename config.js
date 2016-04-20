/**
 * Name: Wilford Engel
 * SRN: 130190747
 * Date: 19th April 2016
 * Description: Mongo database config file
 * needs to be set up to connect to both collections
 */

var config = {};

// Was rtr - restaurant to room
config.mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/students';
// config.mongoCompletedLessonUri = 'mongodb://localhost:27017/completedLessons';
config.cookieMaxAge = 30 * 24 * 3600 * 1000;

module.exports = config;