var express = require('express');
var router = express.Router();
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

/*Classroom*/
router.get('/classroom', function(req, res, next) {
    var vm = {
        title: 'The Classroom',
        page: 'classroom' 
    }
    res.render('classroom', vm);
});
/*Student classroom*/
router.get('/classroom-student', function(req, res, next) {
    var vm = {
        title: 'Student Classroom',
        page: 'student classroom' 
    }
    res.render('classroom-student', vm);
});
/*Test Room*/
router.get('/testroom', function(req, res, next) {
    var vm = {
        title: 'Testing Room',
        page: 'testroom' 
    }
    res.render('testRoom', vm);
});

/*Teacher Room*/
router.get('/teacherroom', function(req, res, next) {
    var vm = {
        title: 'Teacher Room',
        page: 'teacherroom' 
    }
    res.render('teacherRoom', vm);
});
/*Student Room*/
router.get('/studentroom', function(req, res, next) {
    var vm = {
        title: 'Student Room',
        page: 'studentroom' 
    }
    res.render('studentRoom', vm);
});



// router.get('/linguafranca', function(req, res, next) {
//     var vm = {
//         title: 'Lingua Franca World',
//         home: true
//     };
//     res.render('linguafranca', vm)
// });

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
