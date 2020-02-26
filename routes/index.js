var models  = require('../models');
var { auth } = require('../middlewares/auth');
var express = require('express');
var router  = express.Router();

router.get('/', auth, function(req, res) {
  models.User.findAll({
    include: [ models.Task ]
  }).then(function(users) {
    res
    .set('Content-Security-Policy', 'script-src \'self\'')
    .set('Content-Security-Policy', 'script-src code.jquery.com')
    .render('index', {
      title: 'Security Example',
      users: users
    });
  });
}, function(error, req, res, next) {
  if (error && error.isUnauthorized) {
    res.redirect('/users/login');
  } else {
    next(error);
  }
});

module.exports = router;
