var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var vm = {
        title: 'Beta Team Welcome',
        page: 'betaWelcome'
    }
  res.render('beta/welcome', vm);
});


module.exports = router;