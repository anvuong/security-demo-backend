var models  = require('../models');
var { auth } = require('../middlewares/auth');
var express = require('express');
var router  = express.Router();

router.get('/', auth, function(req, res) {
  models.User.findAll({
    include: [ models.Task ]
  }).then(function(users) {
    res.render('index', {
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
