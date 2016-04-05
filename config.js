var config = {};

// Was rtr - restaurant to room
config.mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/students';
config.mongoCompletedLessonUri = 'mongodb://localhost:27017/completedLessons';
config.cookieMaxAge = 30 * 24 * 3600 * 1000;

module.exports = config;