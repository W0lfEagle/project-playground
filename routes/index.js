var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'Zoho',
    auth: {
        user: "info@linguafrancaworld.com",
        pass: "passwordtest"
    }
});
    var mailOptions = {
    from: 'info@linguafrancaworld.com', // sender address 
    to: 'wilfengel@gmail.com', // list of receivers 
    subject: 'Hello ✔', // Subject line 
    text: 'Hello world ✔', // plaintext body 
    html: '<b>Hello world ✔</b>' // html body 
};


/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
        return res.redirect('/users/profile');
    }
    var vm = {
        title: 'Login',
        error: req.flash('error')
    }
    res.render('index', vm);
});

router.get('/linguafranca', function(req, res, next) {
    var vm = {
        title: 'Lingua Franca World',
        home: true
    };
    res.render('linguafranca', vm)
});

router.post('/linguafranca', function(req, res, next) {
    transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
 
});
    var vm = {
        title: 'Create an account',
        home: false,
        email: req.body.email
    };
  res.render('./users/create', vm);
});



module.exports = router;
