var express = require('express');
var router = express.Router();
var restrict = require('../auth/classroomRestrict');
var passport = require('passport');
var config = require('../config');
// var nodemailer = require('nodemailer');
// var completedLessonService = require('../services/completed-lesson-service');


// var transporter = nodemailer.createTransport({
//     service: 'Zoho',
//     auth: {
//         user: "info@linguafrancaworld.com",
//         pass: "passwordtest"
//     }
// });


/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
        return res.redirect('/users/profile');
    }
    var vm = {
        title: 'Lingua Franca World',
        page: 'home' 
    }
    res.render('linguafranca', vm);
});

router.get('/classroomlogin', function(req, res, next) {
    if (req.user) {
        return res.redirect('/studentroom'); // TODO redirect teachers to the teacherRoom
    }
    var vm = {
        title: 'Login',
        error: req.flash('error'),
        page: 'login' 
    }
    res.render('users/login', vm);
});

router.post('/classroomlogin', function(req, res, next) {
    if (req.body.rememberMe) {
      req.session.cookie.maxAge = config.cookieMaxAge;
    }
    next();
  },
  passport.authenticate('local', {
    failureRedirect: '/', 
    successRedirect: '/studentroom',
    failureFlash: 'Invalid credentials'
}));

/*Teacher Room*/
router.get('/teacherroom', restrict, function(req, res, next) {
    var vm = {
        title: 'Teacher Room',
        page: 'teacherroom' 
    }
    res.render('classroom', vm); // Both the student and the teacher rooms are served with the same 'classroom.ejs' file
});
/*Student Room*/
router.get('/studentroom', restrict, function(req, res, next) {
    var vm = {
        title: 'Student Room',
        page: 'studentroom' 
    }
    res.render('classroom', vm);
});

router.post('/', function(req, res, next) {
   // Email to student / email to info with student email address
    // var mailOptions = {
    //     from: 'info@linguafrancaworld.com', // sender address 
    //     to: req.body.email, // list of receivers 
    //     subject: 'Free English Trial Class', // Subject line 
    //     text: 'Welcome to Lingua Franca English.', // plaintext body 
    //     html: '<b>New Signup/b>' // html body 
    // };
    // transporter.sendMail(mailOptions, function(error, info){
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log('Message sent: ' + info.response);
    // });
    var vm = {
        title: 'Create an account',
        page: 'signup',
        email: req.body.email
    };
    res.render('./users/create', vm);
});

module.exports = router;
