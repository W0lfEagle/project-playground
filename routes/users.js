var express = require('express');
var router = express.Router();
var passport = require('passport');
var userService = require('../services/user-service');
var restrict = require('../auth/restrict');
var config = require('../config');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET /users/create */ 
router.get('/create', function(req, res, next) {
  var vm = {
    title: 'Create an account',
    page:  'signup'
  };
  res.render('users/create', vm);
});

/* POST /users/create */
router.post('/create', function(req, res, next) {
  console.log(req.body);

  userService.addUser(req.body, function(err) {
    if (err) {
      console.log(err);
      var vm = {
        title: 'Create an account',
        input: req.body,
        error: err,
        page: 'signup'
      };
      delete vm.input.password;
      return res.render('/users/create', vm);
    }
    req.login(req.body, function(err) {
      res.redirect('/users/profile');
    });
  });
});

router.get('/login', function(req, res, next) {
    if (req.user) {
        return res.redirect('/users/profile');
    }
    var vm = {
        title: 'Login',
        error: req.flash('error'),
        page: 'login' 
    }
    res.render('users/login', vm);
});


router.post('/login', function(req, res, next) {
    if (req.body.rememberMe) {
      req.session.cookie.maxAge = config.cookieMaxAge;
    }
    next();
  },
  passport.authenticate('local', {
    failureRedirect: '/', 
    successRedirect: '/users/profile',
    failureFlash: 'Invalid credentials'
}));

router.get('/profile', restrict, function(req, res, next) {
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
  var vm = {
    title: 'Welcome to the profile',
    firstName: req.user ? req.user.firstName : null,
    email: req.user ? req.user.email : null,
    timezone: req.user ? req.user.timezone : null,
    skype: req.user ? req.user.skype : null,
    credits: req.user ? req.user.credits : null,
    // credits: 'hello',
    page: 'profile'
  }
  res.render('users/profile', vm);
});

router.get('/profile/update', restrict, function(req, res, next) {
  var vm = {
    title: 'Update your profile',
    firstName: req.user ? req.user.firstName : null,
    email: req.user ? req.user.email : null,
    timezone: req.user ? req.user.timezone : null,
    skype: req.user ? req.user.skype : null,
    page: 'update'
  }
  res.render('users/update', vm);
})

router.post('/profile/update', function(req, res, next) {
  console.log('testing the update function');
  userService.updateUser('wilfengel@gmail.com', req.body);
  res.redirect('/users/profile');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
