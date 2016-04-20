/**
 * Name: Wilford Engel
 * SRN: 130190747
 * Date: 19th April 2016
 * Description: Classroom access restriction configuration file
 * redirects unauthorised users to the classroom login page
 */

module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/classroomlogin');
};